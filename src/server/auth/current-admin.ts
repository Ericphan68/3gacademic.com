import 'server-only';

import { cookies } from 'next/headers';

import { roleHasPermission } from '../rbac';
import { ADMIN_SESSION_COOKIE, verifySessionToken, type AdminSessionPayload } from './session';

/** Đọc phiên admin từ HttpOnly cookie (server). Trả null nếu chưa đăng nhập. */
export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

/** Phiên hiện tại có quyền `permission` không (dựa trên role). */
export async function adminCan(permission: string): Promise<boolean> {
  const session = await getAdminSession();
  if (!session) return false;
  return roleHasPermission(session.role, permission);
}
