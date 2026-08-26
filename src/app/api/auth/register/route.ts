import { NextResponse } from 'next/server';
import { z } from 'zod';

import { setCustomerSessionCookie } from '@/server/auth/customer-cookie';
import { AuthError, registerCustomer } from '@/server/services/customerAuthService';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Vui lòng nhập họ tên').max(120),
  email: z.string().trim().email('Email chưa đúng').max(160),
  phone: z.string().trim().regex(/^0\d{9}$/, 'SĐT gồm 10 số, bắt đầu bằng 0'),
  password: z
    .string()
    .min(8, 'Mật khẩu tối thiểu 8 ký tự')
    .max(100)
    .regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa')
    .regex(/[0-9]/, 'Cần ít nhất 1 chữ số'),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu chưa hợp lệ.' }, { status: 400 });
  }
  try {
    const user = await registerCustomer(parsed.data);
    await setCustomerSessionCookie(user.id, user.email);
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi tạo tài khoản.' }, { status: 500 });
  }
}
