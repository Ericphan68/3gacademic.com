import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCustomerSession } from '@/server/auth/current-customer';
import { buyVoucher, VoucherError } from '@/server/services/voucherPurchaseService';

const schema = z.object({ code: z.string().trim().min(1).max(60) });

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu chưa hợp lệ.' }, { status: 400 });

  try {
    const { balance } = await buyVoucher(session.sub, parsed.data.code);
    return NextResponse.json({ ok: true, balance });
  } catch (e) {
    if (e instanceof VoucherError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi mua voucher.' }, { status: 500 });
  }
}
