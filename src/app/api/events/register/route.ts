import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCustomerSession } from '@/server/auth/current-customer';
import { EventError, registerForEvent } from '@/server/services/eventRegistrationService';

const schema = z.object({
  slug: z.string().trim().min(1).max(120),
  attendees: z.number().int().min(1).max(20),
  paymentMethod: z.string().trim().max(20),
  contact: z.object({
    fullName: z.string().trim().min(1).max(120),
    phone: z.string().trim().max(30).nullish(),
    email: z.string().trim().max(160).nullish(),
  }),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu chưa hợp lệ.' }, { status: 400 });

  const session = await getCustomerSession();
  try {
    const { balance } = await registerForEvent(session?.sub ?? null, parsed.data);
    return NextResponse.json({ ok: true, balance });
  } catch (e) {
    if (e instanceof EventError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi đăng ký sự kiện.' }, { status: 500 });
  }
}
