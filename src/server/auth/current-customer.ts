import 'server-only';

import { cookies } from 'next/headers';

import { CUSTOMER_SESSION_COOKIE, verifyCustomerSessionToken, type CustomerSessionPayload } from './customer-session';

/** Đọc phiên khách hàng từ HttpOnly cookie (server). Trả null nếu chưa đăng nhập. */
export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  const store = await cookies();
  const token = store.get(CUSTOMER_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyCustomerSessionToken(token);
}
