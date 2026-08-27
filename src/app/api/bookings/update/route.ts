import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCustomerSession } from '@/server/auth/current-customer';
import { BookingError, cancelCustomerBooking, rescheduleCustomerBooking } from '@/server/services/bookingService';

const schema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('cancel'), code: z.string().trim().min(1).max(40) }),
  z.object({
    action: z.literal('reschedule'),
    code: z.string().trim().min(1).max(40),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().trim().max(10),
  }),
]);

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu chưa hợp lệ.' }, { status: 400 });

  try {
    if (parsed.data.action === 'cancel') {
      await cancelCustomerBooking(session.sub, parsed.data.code);
    } else {
      await rescheduleCustomerBooking(session.sub, parsed.data.code, parsed.data.date, parsed.data.time);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof BookingError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi xử lý đơn.' }, { status: 500 });
  }
}
