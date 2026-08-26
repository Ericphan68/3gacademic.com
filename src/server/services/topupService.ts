import 'server-only';

import { prisma } from '@/server/db';

/**
 * Nạp ví có DUYỆT:
 * 1) Khách tạo yêu cầu nạp (PENDING) sau khi chuyển khoản.
 * 2) Admin đối soát, xác nhận -> ví mới được cộng tiền + ghi giao dịch.
 * Ví (Customer.walletBalance) KHÔNG bao giờ tự cộng khi chưa xác nhận.
 */

export const MIN_TOPUP = 100_000;
export const MAX_TOPUP = 500_000_000;

export class TopupError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

function randomCode(len = 4): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export interface TopupView {
  id: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  transferNote: string;
  createdAt: string;
  reviewedAt: string | null;
}

export interface TxView {
  id: string;
  type: string;
  label: string;
  amount: number;
  balanceAfter: number | null;
  createdAt: string;
}

export interface WalletData {
  balance: number;
  topups: TopupView[];
  transactions: TxView[];
}

/** Tạo yêu cầu nạp tiền (chưa cộng ví). Trả về yêu cầu + nội dung chuyển khoản. */
export async function createTopupRequest(
  customerId: string,
  amount: number,
  customerNote?: string,
): Promise<TopupView> {
  if (!Number.isFinite(amount) || amount < MIN_TOPUP) {
    throw new TopupError(`Số tiền tối thiểu là ${MIN_TOPUP.toLocaleString('vi-VN')}đ.`);
  }
  if (amount > MAX_TOPUP) throw new TopupError('Số tiền quá lớn.');

  const customer = await prisma.customer.findUnique({ where: { id: customerId }, select: { phone: true } });
  if (!customer) throw new TopupError('Không tìm thấy khách hàng.', 404);

  const transferNote = `NAP ${customer.phone} ${randomCode()}`;
  const created = await prisma.topupRequest.create({
    data: { customerId, amount: Math.round(amount), transferNote, customerNote: customerNote?.trim() || null },
    select: { id: true, amount: true, status: true, transferNote: true, createdAt: true, reviewedAt: true },
  });
  return serializeTopup(created);
}

function serializeTopup(t: {
  id: string;
  amount: number;
  status: string;
  transferNote: string;
  createdAt: Date;
  reviewedAt: Date | null;
}): TopupView {
  return {
    id: t.id,
    amount: t.amount,
    status: t.status as TopupView['status'],
    transferNote: t.transferNote,
    createdAt: t.createdAt.toISOString(),
    reviewedAt: t.reviewedAt ? t.reviewedAt.toISOString() : null,
  };
}

/** Dữ liệu ví của khách: số dư + yêu cầu nạp + lịch sử giao dịch. */
export async function getWalletData(customerId: string): Promise<WalletData> {
  try {
    const [customer, topups, txns] = await Promise.all([
      prisma.customer.findUnique({ where: { id: customerId }, select: { walletBalance: true } }),
      prisma.topupRequest.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        take: 20,
        select: { id: true, amount: true, status: true, transferNote: true, createdAt: true, reviewedAt: true },
      }),
      prisma.transaction.findMany({
        where: { customerId },
        orderBy: { createdAt: 'desc' },
        take: 30,
      }),
    ]);
    return {
      balance: customer?.walletBalance ?? 0,
      topups: topups.map(serializeTopup),
      transactions: txns.map((t) => ({
        id: t.id,
        type: t.type,
        label: t.label,
        amount: t.amount,
        balanceAfter: t.balanceAfter,
        createdAt: t.createdAt.toISOString(),
      })),
    };
  } catch {
    return { balance: 0, topups: [], transactions: [] };
  }
}

export interface AdminTopupRow extends TopupView {
  customerId: string;
  customerName: string;
  customerPhone: string;
}

/** Danh sách yêu cầu nạp cho Admin (mặc định: chờ xác nhận trước). */
export async function listTopupsForAdmin(limit = 100): Promise<AdminTopupRow[]> {
  try {
    const rows = await prisma.topupRequest.findMany({
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      take: limit,
      include: { customer: { select: { fullName: true, phone: true } } },
    });
    return rows.map((r) => ({
      ...serializeTopup(r),
      customerId: r.customerId,
      customerName: r.customer.fullName,
      customerPhone: r.customer.phone,
    }));
  } catch {
    return [];
  }
}

/** Admin xác nhận đã nhận tiền -> cộng ví + ghi giao dịch (idempotent). */
export async function confirmTopup(id: string, adminEmail: string): Promise<number> {
  return prisma.$transaction(async (tx) => {
    const req = await tx.topupRequest.findUnique({ where: { id } });
    if (!req) throw new TopupError('Không tìm thấy yêu cầu nạp.', 404);
    if (req.status !== 'PENDING') throw new TopupError('Yêu cầu này đã được xử lý.', 409);

    const customer = await tx.customer.update({
      where: { id: req.customerId },
      data: { walletBalance: { increment: req.amount } },
      select: { walletBalance: true },
    });
    await tx.topupRequest.update({
      where: { id },
      data: { status: 'CONFIRMED', reviewedBy: adminEmail, reviewedAt: new Date() },
    });
    await tx.transaction.create({
      data: {
        customerId: req.customerId,
        type: 'TOPUP',
        label: 'Nạp ví Lotus',
        amount: req.amount,
        balanceAfter: customer.walletBalance,
        reference: req.transferNote,
      },
    });
    return customer.walletBalance;
  });
}

/**
 * Trừ tiền THẬT khỏi ví (dùng cho đặt sân, voucher, sự kiện, F&B...).
 * Kiểm tra số dư trong DB, trừ nguyên tử + ghi giao dịch. Trả số dư mới.
 */
export async function spendWallet(
  customerId: string,
  amount: number,
  label: string,
  reference?: string,
): Promise<number> {
  if (!Number.isFinite(amount) || amount <= 0) throw new TopupError('Số tiền không hợp lệ.');
  const value = Math.round(amount);
  return prisma.$transaction(async (tx) => {
    const c = await tx.customer.findUnique({ where: { id: customerId }, select: { walletBalance: true } });
    if (!c) throw new TopupError('Không tìm thấy khách hàng.', 404);
    if (c.walletBalance < value) throw new TopupError('Số dư ví không đủ.', 400);
    const after = c.walletBalance - value;
    await tx.customer.update({ where: { id: customerId }, data: { walletBalance: after } });
    await tx.transaction.create({
      data: { customerId, type: 'PAYMENT', label, amount: -value, balanceAfter: after, reference: reference ?? null },
    });
    return after;
  });
}

/** Admin từ chối yêu cầu nạp (không cộng ví). */
export async function rejectTopup(id: string, adminEmail: string): Promise<void> {
  const req = await prisma.topupRequest.findUnique({ where: { id }, select: { status: true } });
  if (!req) throw new TopupError('Không tìm thấy yêu cầu nạp.', 404);
  if (req.status !== 'PENDING') throw new TopupError('Yêu cầu này đã được xử lý.', 409);
  await prisma.topupRequest.update({
    where: { id },
    data: { status: 'REJECTED', reviewedBy: adminEmail, reviewedAt: new Date() },
  });
}
