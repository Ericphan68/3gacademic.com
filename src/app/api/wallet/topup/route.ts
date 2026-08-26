import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCustomerSession } from '@/server/auth/current-customer';
import { createTopupRequest, TopupError } from '@/server/services/topupService';

const schema = z.object({
  amount: z.number().int().positive(),
  note: z.string().trim().max(300).optional(),
});

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu chưa hợp lệ.' }, { status: 400 });

  try {
    const topup = await createTopupRequest(session.sub, parsed.data.amount, parsed.data.note);
    return NextResponse.json({ ok: true, topup });
  } catch (e) {
    if (e instanceof TopupError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi tạo yêu cầu nạp.' }, { status: 500 });
  }
}
