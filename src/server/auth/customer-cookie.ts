import { cookies } from 'next/headers';

import { CUSTOMER_SESSION_COOKIE, createCustomerSessionToken, customerSessionTtlSeconds } from './customer-session';

const baseOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

export async function setCustomerSessionCookie(sub: string, email: string): Promise<void> {
  const token = await createCustomerSessionToken({ sub, email });
  const store = await cookies();
  store.set(CUSTOMER_SESSION_COOKIE, token, { ...baseOptions, maxAge: customerSessionTtlSeconds() });
}

export async function clearCustomerSessionCookie(): Promise<void> {
  const store = await cookies();
  store.set(CUSTOMER_SESSION_COOKIE, '', { ...baseOptions, maxAge: 0 });
}
