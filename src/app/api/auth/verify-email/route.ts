import { NextResponse } from 'next/server';

import { verifyEmailToken } from '@/server/services/emailVerificationService';

export const dynamic = 'force-dynamic';

/** Khách bấm link trong email -> xác nhận -> chuyển về trang đăng nhập. */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  const origin = new URL(req.url).origin;

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
