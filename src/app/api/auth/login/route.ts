import { NextResponse } from 'next/server';
import { z } from 'zod';

import { setCustomerSessionCookie } from '@/server/auth/customer-cookie';
import { AuthError, loginCustomer } from '@/server/services/customerAuthService';

const schema = z.object({
  identifier: z.string().trim().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu chưa hợp lệ.' }, { status: 400 });
  }
  try {
    const user = await loginCustomer(parsed.data.identifier, parsed.data.password);
    await setCustomerSessionCookie(user.id, user.email);
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi đăng nhập.' }, { status: 500 });
  }
}
