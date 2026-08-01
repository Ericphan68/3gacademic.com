import { PortalShell } from '@/components/dashboard/portal-shell';
import { COACH_NAV } from '@/constants/navigation';

export default function CoachPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalShell nav={COACH_NAV} title="Coach Portal" requiredRole="coach">
      {children}
    </PortalShell>
  );
}
