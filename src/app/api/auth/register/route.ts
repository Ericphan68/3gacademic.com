import { NextResponse } from 'next/server';
import { z } from 'zod';

import { setCustomerSessionCookie } from '@/server/auth/customer-cookie';
import { AuthError, registerCustomer } from '@/server/services/customerAuthService';
import { sendVerificationEmail } from '@/server/services/emailVerificationService';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Vui lòng nhập họ tên').max(120),
  email: z.string().trim().email('Email chưa đúng').max(160),
  phone: z.string().trim().regex(/^0\d{9}$/, 'SĐT gồm 10 số, bắt đầu bằng 0'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').max(100),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu chưa hợp lệ.' }, { status: 400 });
  }
  try {
    const { user, verifyToken } = await registerCustomer(parsed.data);

    // Nếu bật xác nhận email: gửi email, KHÔNG đăng nhập ngay -> chờ khách xác nhận.
    if (verifyToken) {
      await sendVerificationEmail(user.id);
      return NextResponse.json({ ok: true, pendingVerification: true, email: user.email });
    }

    // Chưa bật xác nhận email: đăng nhập ngay như cũ.
    await setCustomerSessionCookie(user.id, user.email);
    return NextResponse.json({ ok: true, user });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi tạo tài khoản.' }, { status: 500 });
  }
}
