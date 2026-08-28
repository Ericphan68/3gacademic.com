import { NextResponse } from 'next/server';

import { SITE_URL } from '@/constants/site';
import { verifyEmailToken } from '@/server/services/emailVerificationService';

export const dynamic = 'force-dynamic';

/** Khách bấm link trong email -> xác nhận -> chuyển về trang đăng nhập. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  // Dùng địa chỉ site cố định (server bind 0.0.0.0 nên không lấy từ req.url được).
  const origin = SITE_URL;

  let result: 'ok' | 'invalid' | 'expired' = 'invalid';
  if (token) {
    try {
      result = await verifyEmailToken(token);
    } catch {
      result = 'invalid';
    }
  }
  return NextResponse.redirect(`${origin}/login?verified=${result}`);
}
