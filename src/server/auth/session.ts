import { SignJWT, jwtVerify } from 'jose';

import type { AdminRoleKey } from '../rbac';

/**
 * Session admin = JWT (HS256) đặt trong HttpOnly cookie.
 * Token được ký bằng ADMIN_SESSION_SECRET (chỉ có ở server).
 */

export const ADMIN_SESSION_COOKIE = 'lotus_admin_session';

export interface AdminSessionPayload {
  /** AdminUser.id */
  sub: string;
  email: string;
  role: AdminRoleKey;
}

function getSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SESSION_SECRET chưa được cấu hình (tối thiểu 16 ký tự).');
  }
  return new TextEncoder().encode(secret);
}

export function sessionTtlSeconds(): number {
  const raw = Number(process.env.ADMIN_SESSION_TTL);
  return Number.isFinite(raw) && raw > 0 ? raw : 28_800; // mặc định 8 giờ
}

/** Ký session token với hạn dùng. */
export async function createSessionToken(payload: AdminSessionPayload): Promise<string> {
  const ttl = sessionTtlSeconds();
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(getSecret());
}

/** Xác thực token; trả null nếu không hợp lệ / hết hạn. */
export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== 'string' || typeof payload.role !== 'string') {
      return null;
    }
    return { sub: payload.sub, email: payload.email, role: payload.role as AdminRoleKey };
  } catch {
    return null;
  }
}
