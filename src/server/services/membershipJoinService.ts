import 'server-only';

import { addMonths } from 'date-fns';
import type { Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

/**
 * Đăng ký hội viên với 2 phương án:
 *  - Chuyển khoản: tạo yêu cầu PENDING -> Admin xác nhận -> kích hoạt hạng + ví += giá + bonus.
 *  - Trừ ví: ví -= giá rồi += bonus (thực nhận = bonus - giá), kích hoạt ngay.
 */

export class MembershipError extends Error {
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

interface PlanInfo {
  id: string;
  key: string;
  name: string;
  price: number;
  bonusPercent: number;
  durationMonths: number;
}

async function getPlan(key: string, tx?: Prisma.TransactionClient): Promise<PlanInfo> {
  const client = tx ?? prisma;
  const plan = await client.membershipPlan.findFirst({
    where: { key, deletedAt: null, isActive: true },
    select: { id: true, key: true, name: true, price: true, bonusPercent: true, durationMonths: true },
  });
  if (!plan) throw new MembershipError('Không tìm thấy gói hội viên.', 404);
  return plan;
}

/** Vô hiệu hoá hạng cũ rồi tạo hạng mới cho khách. */
async function activate(tx: Prisma.TransactionClient, customerId: string, plan: PlanInfo, bonus: number) {
  await tx.customerMembership.updateMany({
    where: { customerId, isActive: true },
    data: { isActive: false },
  });
  await tx.customerMembership.create({
    data: {
      customerId,
      planId: plan.id,
      expiresAt: addMonths(new Date(), plan.durationMonths),
      topUpAmount: plan.price,
      bonusAmount: bonus,
      isActive: true,
    },
  });
}

export interface MembershipRequestView {
  id: string;
  planName: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  transferNote: string;
  createdAt: string;
}

/** Phương án CHUYỂN KHOẢN: tạo yêu cầu chờ Admin duyệt (chưa kích hoạt). */
export async function createMembershipRequest(customerId: string, planKey: string): Promise<MembershipRequestView> {
  const plan = await getPlan(planKey);
  const customer = await prisma.customer.findUnique({ where: { id: customerId }, select: { phone: true } });
  if (!customer) throw new MembershipError('Không tìm thấy khách hàng.', 404);

  const transferNote = `HV ${plan.key.toUpperCase()} ${customer.phone} ${randomCode()}`;
  const created = await prisma.membershipRequest.create({
    data: {
      customerId,
      planKey: plan.key,
      planName: plan.name,
      amount: plan.price,
      bonusPercent: plan.bonusPercent,
      durationMonths: plan.durationMonths,
      transferNote,
    },
    select: { id: true, planName: true, amount: true, status: true, transferNote: true, createdAt: true },
  });
  return {
    id: created.id,
    planName: created.planName,
    amount: created.amount,
    status: created.status as MembershipRequestView['status'],
    transferNote: created.transferNote,
    createdAt: created.createdAt.toISOString(),
  };
}

/** Phương án TRỪ VÍ: trừ giá gói rồi cộng bonus, kích hoạt ngay. Trả số dư mới. */
export async function payMembershipFromWallet(customerId: string, planKey: string): Promise<number> {
  return prisma.$transaction(async (tx) => {
    const plan = await getPlan(planKey, tx);
    const bonus = Math.round((plan.price * plan.bonusPercent) / 100);

    const customer = await tx.customer.findUnique({ where: { id: customerId }, select: { walletBalance: true } });
    if (!customer) throw new MembershipError('Không tìm thấy khách hàng.', 404);
    if (customer.walletBalance < plan.price) {
      throw new MembershipError('Số dư ví không đủ để đăng ký gói này.', 400);
    }

    const afterPay = customer.walletBalance - plan.price;
    const afterBonus = afterPay + bonus;

    await activate(tx, customerId, plan, bonus);
    await tx.customer.update({ where: { id: customerId }, data: { walletBalance: afterBonus } });
    await tx.transaction.create({
      data: {
        customerId,
        type: 'PAYMENT',
        label: `Thanh toán hội viên ${plan.name}`,
        amount: -plan.price,
        balanceAfter: afterPay,
      },
    });
    if (bonus > 0) {
      await tx.transaction.create({
        data: {
          customerId,
          type: 'BONUS',
          label: `Bonus hội viên ${plan.name}`,
          amount: bonus,
          balanceAfter: afterBonus,
        },
      });
    }
    return afterBonus;
  });
}

export interface AdminMembershipRequestRow extends MembershipRequestView {
  customerId: string;
  customerName: string;
  customerPhone: string;
  bonusPercent: number;
  reviewedAt: string | null;
}

export async function listMembershipRequestsForAdmin(limit = 100): Promise<AdminMembershipRequestRow[]> {
  try {
    const rows = await prisma.membershipRequest.findMany({
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      take: limit,
      include: { customer: { select: { fullName: true, phone: true } } },
    });
    return rows.map((r) => ({
      id: r.id,
      planName: r.planName,
      amount: r.amount,
      status: r.status as MembershipRequestView['status'],
      transferNote: r.transferNote,
      createdAt: r.createdAt.toISOString(),
      customerId: r.customerId,
      customerName: r.customer.fullName,
      customerPhone: r.customer.phone,
      bonusPercent: r.bonusPercent,
      reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
    }));
  } catch {
    return [];
  }
}

/** Admin xác nhận yêu cầu chuyển khoản -> kích hoạt hạng + ví += giá + bonus. */
export async function confirmMembershipRequest(id: string, adminEmail: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const req = await tx.membershipRequest.findUnique({ where: { id } });
    if (!req) throw new MembershipError('Không tìm thấy yêu cầu.', 404);
    if (req.status !== 'PENDING') throw new MembershipError('Yêu cầu đã được xử lý.', 409);

    const plan = await getPlan(req.planKey, tx);
    const bonus = Math.round((req.amount * req.bonusPercent) / 100);

    const customer = await tx.customer.findUnique({ where: { id: req.customerId }, select: { walletBalance: true } });
    const base = customer?.walletBalance ?? 0;
    const afterTopup = base + req.amount;
    const afterBonus = afterTopup + bonus;

    await activate(tx, req.customerId, plan, bonus);
    await tx.customer.update({ where: { id: req.customerId }, data: { walletBalance: afterBonus } });
    await tx.transaction.create({
      data: {
        customerId: req.customerId,
        type: 'TOPUP',
        label: `Kích hoạt hội viên ${req.planName}`,
        amount: req.amount,
        balanceAfter: afterTopup,
        reference: req.transferNote,
      },
    });
    if (bonus > 0) {
      await tx.transaction.create({
        data: {
          customerId: req.customerId,
          type: 'BONUS',
          label: `Bonus hội viên ${req.planName}`,
          amount: bonus,
          balanceAfter: afterBonus,
        },
      });
    }
    await tx.membershipRequest.update({
      where: { id },
      data: { status: 'CONFIRMED', reviewedBy: adminEmail, reviewedAt: new Date() },
    });
  });
}

export async function rejectMembershipRequest(id: string, adminEmail: string): Promise<void> {
  const req = await prisma.membershipRequest.findUnique({ where: { id }, select: { status: true } });
  if (!req) throw new MembershipError('Không tìm thấy yêu cầu.', 404);
  if (req.status !== 'PENDING') throw new MembershipError('Yêu cầu đã được xử lý.', 409);
  await prisma.membershipRequest.update({
    where: { id },
    data: { status: 'REJECTED', reviewedBy: adminEmail, reviewedAt: new Date() },
  });
}
