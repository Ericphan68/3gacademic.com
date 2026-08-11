import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { verifyPassword } from '@/server/auth/password';
import { ADMIN_SESSION_COOKIE, createSessionToken, sessionTtlSeconds } from '@/server/auth/session';
import { prisma } from '@/server/db';
import type { AdminRoleKey } from '@/server/rbac';

const schema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

// Rate limit đơn giản theo IP (best-effort, mỗi instance).
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Quá nhiều lần thử. Vui lòng chờ 1 phút.' }, { status: 429 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu không hợp lệ.' }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = await prisma.adminUser.findUnique({ where: { email }, include: { role: true } });

  const ok = admin && admin.isActive && !admin.deletedAt && (await verifyPassword(password, admin.passwordHash));
  if (!ok || !admin) {
    return NextResponse.json({ error: 'Email hoặc mật khẩu chưa đúng.' }, { status: 401 });
  }

  const token = await createSessionToken({
    sub: admin.id,
    email: admin.email,
    role: admin.role.key as AdminRoleKey,
  });

  const store = await cookies();
  store.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: sessionTtlSeconds(),
  });

  await prisma.adminUser.update({ where: { id: admin.id }, data: { lastLoginAt: new Date() } });

  return NextResponse.json({ ok: true, role: admin.role.key });
}
