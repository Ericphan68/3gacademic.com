import { NextResponse } from 'next/server';

import { getCustomerSession } from '@/server/auth/current-customer';
import { getCustomerAccount } from '@/server/services/customerAuthService';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ user: null });
  const user = await getCustomerAccount(session.sub);
  return NextResponse.json({ user });
}
