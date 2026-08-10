import bcrypt from 'bcryptjs';

const ROUNDS = 12;

/** Băm mật khẩu để lưu vào DB (không bao giờ lưu plaintext). */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

/** So khớp mật khẩu khi đăng nhập. */
export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
