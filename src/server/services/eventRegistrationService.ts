import 'server-only';

import { EVENTS } from '@/data/events';
import { prisma } from '@/server/db';

/**
 * Đăng ký sự kiện lưu THẬT vào DB + đếm chỗ + chống trùng + trừ ví (nếu trả ví).
 * Sự kiện được lazy-upsert vào DB từ dữ liệu tĩnh khi có đăng ký đầu tiên.
 */

export class EventError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

/** Đảm bảo sự kiện có trong DB (tạo từ dữ liệu tĩnh nếu chưa có). */
async function ensureEvent(slug: string): Promise<{ id: string; fee: number; capacity: number; title: string }> {
  const existing = await prisma.event.findFirst({
    where: { slug },
    select: { id: true, fee: true, capacity: true, title: true },
  });
  if (existing) return existing;

  const base = EVENTS.find((e) => e.slug === slug);
  if (!base) throw new EventError('Không tìm thấy sự kiện.', 404);

  const created = await prisma.event.create({
    data: {
      slug: base.slug,
      title: base.title,
      type: base.type,
      summary: base.summary,
      description: base.description,
      banner: base.banner,
      startsAt: new Date(base.startsAt),
      endsAt: base.endsAt ? new Date(base.endsAt) : null,
      location: base.location,
      fee: base.fee,
      capacity: base.capacity,
      isPublished: true,
    },
    select: { id: true, fee: true, capacity: true, title: true },
  });
  return created;
}

export interface RegisterEventInput {
  slug: string;
  attendees: number;
  contact: { fullName: string; phone?: string | null; email?: string | null };
  paymentMethod: string;
}

/** Đăng ký sự kiện. Trả về số dư ví mới (nếu trả bằng ví). */
export async function registerForEvent(
  customerId: string | null,
  input: RegisterEventInput,
): Promise<{ balance: number | null }> {
  const attendees = Math.max(1, Math.round(input.attendees));
  const event = await ensureEvent(input.slug);
  const totalFee = event.fee * attendees;
  const payByWallet = input.paymentMethod === 'wallet' && totalFee > 0;

  return prisma.$transaction(async (tx) => {
    // Đếm chỗ đã đăng ký (thật).
    const agg = await tx.eventRegistration.aggregate({
      where: { eventId: event.id, status: 'REGISTERED' },
      _sum: { attendees: true },
    });
    const registered = agg._sum.attendees ?? 0;
    if (event.capacity > 0 && registered + attendees > event.capacity) {
      throw new EventError('Sự kiện đã đủ chỗ. Vui lòng chọn sự kiện khác.', 409);
    }

    // Chống đăng ký trùng.
    if (customerId) {
      const dup = await tx.eventRegistration.findFirst({
        where: { eventId: event.id, customerId, status: 'REGISTERED' },
        select: { id: true },
      });
      if (dup) throw new EventError('Bạn đã đăng ký sự kiện này rồi.', 409);
    }

    // Trừ ví THẬT nếu thanh toán bằng ví.
    let balance: number | null = null;
    if (payByWallet) {
      if (!customerId) throw new EventError('Bạn cần đăng nhập để thanh toán bằng ví.', 401);
      const c = await tx.customer.findUnique({ where: { id: customerId }, select: { walletBalance: true } });
      if (!c || c.walletBalance < totalFee) throw new EventError('Số dư ví không đủ.', 400);
      balance = c.walletBalance - totalFee;
      await tx.customer.update({ where: { id: customerId }, data: { walletBalance: balance } });
      await tx.transaction.create({
        data: {
          customerId,
          type: 'PAYMENT',
          label: `Phí sự kiện · ${event.title}`,
          amount: -totalFee,
          balanceAfter: balance,
        },
      });
    }

    await tx.eventRegistration.create({
      data: {
        eventId: event.id,
        customerId,
        contactName: input.contact.fullName,
        contactPhone: input.contact.phone || null,
        contactEmail: input.contact.email || null,
        attendees,
        fee: totalFee,
        status: 'REGISTERED',
        qrPayload: `LOTUS|EVENT|${input.slug}|${Date.now()}`,
      },
    });
    return { balance };
  });
}
