import { AdminShell } from '@/components/admin/admin-shell';
import { getAdminSession } from '@/server/auth/current-admin';
import { ROLE_LABELS } from '@/server/rbac';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  // Chưa đăng nhập → chỉ render children (trang /admin/login). Middleware đã chặn
  // các trang khác của /admin và chuyển hướng về /admin/login.
  if (!session) {
    return <>{children}</>;
  }

  return (
    <AdminShell email={session.email} roleLabel={ROLE_LABELS[session.role]}>
      {children}
    </AdminShell>
  );
}
