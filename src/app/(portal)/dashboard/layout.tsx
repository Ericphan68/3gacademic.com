import { PortalShell } from '@/components/dashboard/portal-shell';
import { DASHBOARD_NAV } from '@/constants/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell nav={DASHBOARD_NAV} title="Tài khoản của tôi">
      {children}
    </PortalShell>
  );
}
