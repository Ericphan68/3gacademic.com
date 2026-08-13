import { PortalHeader } from '@/components/dashboard/portal-shell';
import { LeadsTable } from '@/features/admin/leads-table';
import { listLeads } from '@/server/services/leadService';

export const dynamic = 'force-dynamic';

export default async function AdminRegistrationsPage() {
  const leads = await listLeads();

  return (
    <div>
      <PortalHeader
        title="Đăng ký & yêu cầu"
        description="Yêu cầu gửi từ form Liên hệ, Doanh nghiệp, Tour đoàn và Đại lý trên website."
      />
      <LeadsTable leads={leads} />
    </div>
  );
}
