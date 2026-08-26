import { Wallet } from 'lucide-react';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { EmptyState } from '@/components/ui/states';
import { TopupManager } from '@/features/admin/topup-manager';
import { listTopupsForAdmin } from '@/server/services/topupService';

export const dynamic = 'force-dynamic';

export default async function AdminTopupsPage() {
  const rows = await listTopupsForAdmin();

  return (
    <div>
      <PortalHeader
        title="Nạp ví — Duyệt yêu cầu"
        description="Kiểm tra tiền đã về tài khoản công ty, sau đó bấm Xác nhận để cộng tiền vào ví khách."
      />
      {rows.length === 0 ? (
        <EmptyState
          title="Chưa có yêu cầu nạp"
          description="Khi khách bấm nạp tiền và báo đã chuyển khoản, yêu cầu sẽ xuất hiện tại đây."
          icon={Wallet}
        />
      ) : (
        <TopupManager rows={rows} />
      )}
    </div>
  );
}
