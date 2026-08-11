import { NextResponse, type NextRequest } from 'next/server';

import { ADMIN_SESSION_COOKIE, verifySessionToken } from '@/server/auth/session';

/**
 * Bảo vệ khu quản trị ở SERVER: mọi /admin/* yêu cầu phiên hợp lệ,
 * trừ trang đăng nhập. Không tin quyền từ client.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Trang đăng nhập không cần phiên.
  if (pathname === '/admin/login') return NextResponse.next();

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token).catch(() => null) : null;

  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
