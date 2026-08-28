import 'server-only';

import { prisma } from '@/server/db';

/**
 * Đơn F&B lưu THẬT vào DB để bếp/quầy nhận. Nếu trả bằng ví: trừ ví THẬT + ghi
 * giao dịch (nguyên tử). Không đủ số dư -> báo lỗi.
 */

export class FoodOrderError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

function code(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `FB${out}`;
}

export interface FoodOrderInput {
  items: { name: string; quantity: number; price: number }[];
  total: number;
  deliveryTarget?: string | null;
  bayNumber?: string | null;
  scheduledTime?: string | null;
  note?: string | null;
  payByWallet: boolean;
}

export async function createFoodOrder(
  customerId: string | null,
  input: FoodOrderInput,
): Promise<{ code: string; balance: number | null }> {
  if (!input.items.length) throw new FoodOrderError('Giỏ hàng trống.');
  const total = Math.max(0, Math.round(input.total));
  const orderCode = code();

  return prisma.$transaction(async (tx) => {
    let balance: number | null = null;
    if (input.payByWallet && total > 0) {
      if (!customerId) throw new FoodOrderError('Bạn cần đăng nhập để thanh toán bằng ví.', 401);
      const c = await tx.customer.findUnique({ where: { id: customerId }, select: { walletBalance: true } });
      if (!c || c.walletBalance < total) throw new FoodOrderError('Số dư ví không đủ.', 400);
      balance = c.walletBalance - total;
      await tx.customer.update({ where: { id: customerId }, data: { walletBalance: balance } });
      await tx.transaction.create({
        data: {
          customerId,
          type: 'PAYMENT',
          label: `Đơn F&B · ${orderCode}`,
          amount: -total,
          balanceAfter: balance,
          reference: orderCode,
        },
      });
    }

    await tx.foodOrder.create({
      data: {
        code: orderCode,
        customerId,
        total,
        deliveryTarget: input.deliveryTarget || null,
        bayNumber: input.bayNumber || null,
        scheduledTime: input.scheduledTime || null,
        note: input.note || null,
        status: 'PREPARING',
        items: {
          create: input.items.map((it) => ({
            name: it.name,
            quantity: Math.max(1, Math.round(it.quantity)),
            price: Math.max(0, Math.round(it.price)),
          })),
        },
      },
    });
    return { code: orderCode, balance };
  });
}

export interface AdminFoodOrderRow {
  id: string;
  code: string;
  customerName: string;
  total: number;
  deliveryTarget: string;
  bayNumber: string;
  scheduledTime: string;
  status: string;
  itemsSummary: string;
  createdAt: string;
}

export async function listFoodOrdersForAdmin(limit = 200): Promise<AdminFoodOrderRow[]> {
  try {
    const rows = await prisma.foodOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { items: true, customer: { select: { fullName: true } } },
    });
    return rows.map((o) => ({
      id: o.id,
      code: o.code,
      customerName: o.customer?.fullName ?? 'Khách tại quầy',
      total: o.total,
      deliveryTarget: o.deliveryTarget ?? '',
      bayNumber: o.bayNumber ?? '',
      scheduledTime: o.scheduledTime ?? '',
      status: o.status,
      itemsSummary: o.items.map((it) => `${it.name} x${it.quantity}`).join(', '),
      createdAt: o.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}
