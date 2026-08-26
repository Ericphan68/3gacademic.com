import { redirect } from 'next/navigation';

import { PortalShell } from '@/components/dashboard/portal-shell';
import { DASHBOARD_NAV } from '@/constants/navigation';
import { getCustomerSession } from '@/server/auth/current-customer';
import { getCustomerAccount } from '@/server/services/customerAuthService';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getCustomerSession();
  if (!session) redirect('/login');

  const user = await getCustomerAccount(session.sub);
  if (!user) redirect('/login');

  return (
    <PortalShell nav={DASHBOARD_NAV} title="Tài khoản của tôi" initialUser={user}>
      {children}
    </PortalShell>
  );
}
