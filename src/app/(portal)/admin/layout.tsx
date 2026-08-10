import { PortalShell } from '@/components/dashboard/portal-shell';
import { ADMIN_NAV } from '@/constants/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell nav={ADMIN_NAV} title="Khu quản trị" requiredRole="admin">
      {children}
    </PortalShell>
  );
}
