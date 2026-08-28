import 'server-only';

import { VOUCHERS } from '@/data/vouchers';
import { prisma } from '@/server/db';
import type { OwnedVoucher, Voucher } from '@/types';

/**
 * Mua/nhận voucher lưu THẬT: trừ kho (đếm qua VoucherRedemption), chống mua trùng,
 * trừ ví nếu có phí. Voucher được lazy-upsert vào DB từ dữ liệu tĩnh khi cần.
 * Một bản ghi VoucherRedemption (bookingCode = null) = 1 voucher khách đang sở hữu.
 */

export class VoucherError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

/** Đảm bảo voucher có trong DB (tạo từ dữ liệu tĩnh nếu chưa có). */
async function ensureVoucher(base: Voucher): Promise<{ id: string; totalQuantity: number }> {
  const existing = await prisma.voucher.findUnique({
    where: { code: base.code },
    select: { id: true, totalQuantity: true },
  });
  if (existing) return existing;

  const created = await prisma.voucher.create({
    data: {
      code: base.code,
      name: base.name,
      description: base.description,
      category: base.category,
      discountType: base.discountType === 'amount' ? 'AMOUNT' : 'PERCENT',
      discountValue: base.discountValue,
      maxDiscount: base.maxDiscount ?? null,
      minOrder: base.minOrder,
      endAt: base.expiresAt ? new Date(base.expiresAt) : null,
      totalQuantity: base.totalQuantity,
      memberOnly: base.memberOnly,
      isFeatured: base.hot,
      status: 'ACTIVE',
    },
    select: { id: true, totalQuantity: true },
  });
  return created;
}

async function isMember(customerId: string): Promise<boolean> {
  const m = await prisma.customerMembership.findFirst({
    where: { customerId, isActive: true, expiresAt: { gt: new Date() }, plan: { key: { in: ['premium', 'founder'] } } },
    select: { id: true },
  });
  return Boolean(m);
}

/** Mua/nhận 1 voucher. Trả về số dư ví mới (nếu có trừ phí). */
export async function buyVoucher(customerId: string, code: string): Promise<{ balance: number | null }> {
  const base = VOUCHERS.find((v) => v.code === code);
  if (!base) throw new VoucherError('Không tìm thấy voucher.', 404);

  if (base.memberOnly && !(await isMember(customerId))) {
    throw new VoucherError('Voucher này chỉ dành cho hội viên Premium và Founder.', 403);
  }

  const voucher = await ensureVoucher(base);

  return prisma.$transaction(async (tx) => {
    const sold = await tx.voucherRedemption.count({ where: { voucherId: voucher.id } });
    if (voucher.totalQuantity > 0 && sold >= voucher.totalQuantity) {
      throw new VoucherError('Voucher đã hết lượt.', 409);
    }
    const owned = await tx.voucherRedemption.count({ where: { voucherId: voucher.id, customerId } });
    if (owned >= 1) throw new VoucherError('Bạn đã có voucher này trong tài khoản.', 409);

    let balance: number | null = null;
    if (base.price > 0) {
      const c = await tx.customer.findUnique({ where: { id: customerId }, select: { walletBalance: true } });
      if (!c || c.walletBalance < base.price) throw new VoucherError('Số dư ví không đủ.', 400);
      balance = c.walletBalance - base.price;
      await tx.customer.update({ where: { id: customerId }, data: { walletBalance: balance } });
      await tx.transaction.create({
        data: {
          customerId,
          type: 'VOUCHER_PURCHASE',
          label: `Mua voucher ${base.name}`,
          amount: -base.price,
          balanceAfter: balance,
          reference: base.code,
        },
      });
    }

    await tx.voucherRedemption.create({
      data: { voucherId: voucher.id, customerId, discountAmount: 0 },
    });
    return { balance };
  });
}

/** Danh sách voucher khách đang sở hữu (từ DB) — dạng OwnedVoucher cho dashboard. */
export async function listCustomerVouchers(customerId: string): Promise<OwnedVoucher[]> {
  try {
    const rows = await prisma.voucherRedemption.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: { voucher: { select: { code: true } } },
    });
    return rows
      .map((r): OwnedVoucher | null => {
        const base = VOUCHERS.find((v) => v.code === r.voucher.code);
        if (!base) return null;
        return {
          id: r.id,
          voucherId: base.id,
          code: base.code,
          name: base.name,
          category: base.category,
          faceValue: base.faceValue,
          discountLabel:
            base.discountType === 'percent'
              ? `Giảm ${base.discountValue}%`
              : `Giảm ${new Intl.NumberFormat('vi-VN').format(base.discountValue)}đ`,
          expiresAt: base.expiresAt,
          status: r.bookingCode ? 'used' : 'active',
          acquiredAt: r.createdAt.toISOString(),
        };
      })
      .filter((x): x is OwnedVoucher => x !== null);
  } catch {
    return [];
  }
}
