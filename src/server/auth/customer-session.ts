import { SignJWT, jwtVerify } from 'jose';

/**
 * Phiên đăng nhập KHÁCH HÀNG = JWT (HS256) trong HttpOnly cookie.
 * Tách riêng khỏi phiên admin (cookie khác tên). Ký bằng ADMIN_SESSION_SECRET
 * để không phải thêm biến môi trường mới.
 */

export const CUSTOMER_SESSION_COOKIE = 'lotus_customer_session';

export interface CustomerSessionPayload {
  /** Customer.id */
  sub: string;
  email: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.CUSTOMER_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('Thiếu ADMIN_SESSION_SECRET/CUSTOMER_SESSION_SECRET (tối thiểu 16 ký tự).');
  }
  return new TextEncoder().encode(secret);
}

export function customerSessionTtlSeconds(): number {
  const raw = Number(process.env.CUSTOMER_SESSION_TTL);
  return Number.isFinite(raw) && raw > 0 ? raw : 2_592_000; // mặc định 30 ngày
}

export async function createCustomerSessionToken(payload: CustomerSessionPayload): Promise<string> {
  const ttl = customerSessionTtlSeconds();
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(getSecret());
}

export async function verifyCustomerSessionToken(token: string): Promise<CustomerSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (!payload.sub || typeof payload.email !== 'string') return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}
