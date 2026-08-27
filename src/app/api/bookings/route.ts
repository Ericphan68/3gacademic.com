import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCustomerSession } from '@/server/auth/current-customer';
import { BookingError, createBooking } from '@/server/services/bookingService';

/**
 * Ghi đơn đặt lịch của khách vào database (public — khách tự đặt).
 * Nếu trả bằng ví: trừ ví thật + chống đặt trùng HLV (nguyên tử ở server).
 */

const schema = z.object({
  code: z.string().trim().min(1).max(40),
  experienceLabel: z.string().trim().min(1).max(160),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().max(10),
  durationMinutes: z.number().int().min(0).max(1440),
  zoneName: z.string().trim().max(120).nullish(),
  coachName: z.string().trim().max(120).nullish(),
  coachId: z.string().trim().max(60).nullish(),
  zoneId: z.string().trim().max(60).nullish(),
  guests: z.number().int().min(1).max(100),
  voucherCode: z.string().trim().max(60).nullish(),
  contact: z.object({
    fullName: z.string().trim().min(1).max(120),
    phone: z.string().trim().min(1).max(30),
    email: z.string().trim().max(160).nullish(),
    note: z.string().trim().max(1000).nullish(),
  }),
  paymentMethod: z.string().trim().max(20),
  paymentStatus: z.string().trim().max(20),
  status: z.string().trim().max(20).optional(),
  qrPayload: z.string().trim().max(200).nullish(),
  addOns: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(160),
        quantity: z.number().int().min(1).max(99).optional(),
        unitPrice: z.number().int().min(0),
      }),
    )
    .max(50)
    .optional(),
  price: z.object({
    base: z.number().optional(),
    zoneSurcharge: z.number().optional(),
    coachFee: z.number().optional(),
    addOns: z.number().optional(),
    subtotal: z.number().optional(),
    membershipDiscount: z.number().optional(),
    voucherDiscount: z.number().optional(),
    walletApplied: z.number().optional(),
    total: z.number(),
  }),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }
  const session = await getCustomerSession();
  try {
    const { id, balance } = await createBooking(parsed.data, session?.sub ?? null);
    return NextResponse.json({ ok: true, id, balance });
  } catch (e) {
    if (e instanceof BookingError) {
      return NextResponse.json({ error: e.message }, { status: e.status });
    }
    return NextResponse.json({ error: 'Không lưu được đơn. Vui lòng thử lại hoặc liên hệ Lotus.' }, { status: 500 });
  }
}
