import { NextResponse } from 'next/server';

import { clearCustomerSessionCookie } from '@/server/auth/customer-cookie';

export async function POST() {
  await clearCustomerSessionCookie();
  return NextResponse.json({ ok: true });
}
