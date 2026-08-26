import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCustomerSession } from '@/server/auth/current-customer';
import { spendWallet, TopupError } from '@/server/services/topupService';

const schema = z.object({
  amount: z.number().int().positive(),
  label: z.string().trim().min(1).max(160),
  reference: z.string().trim().max(120).optional(),
});

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: 'Bạn cần đăng nhập để thanh toán bằng ví.' }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu chưa hợp lệ.' }, { status: 400 });

  try {
    const balance = await spendWallet(session.sub, parsed.data.amount, parsed.data.label, parsed.data.reference);
    return NextResponse.json({ ok: true, balance });
  } catch (e) {
    if (e instanceof TopupError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi thanh toán ví.' }, { status: 500 });
  }
}
