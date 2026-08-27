import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCustomerSession } from '@/server/auth/current-customer';
import { AuthError, updateCustomerProfile } from '@/server/services/customerAuthService';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Vui lòng nhập họ tên').max(120),
  email: z.string().trim().email('Email chưa đúng').max(160),
  phone: z.string().trim().regex(/^0\d{9}$/, 'SĐT gồm 10 số, bắt đầu bằng 0'),
  drink: z.string().trim().max(120).nullish(),
});

export async function PUT(req: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu chưa hợp lệ.' }, { status: 400 });
  }

  try {
    const user = await updateCustomerProfile(session.sub, {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      drink: parsed.data.drink ?? undefined,
    });
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi cập nhật hồ sơ.' }, { status: 500 });
  }
}
