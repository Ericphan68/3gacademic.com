import { UsersRound } from 'lucide-react';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { EmptyState } from '@/components/ui/states';
import { CustomerManager } from '@/features/admin/customer-manager';
import { listCustomers } from '@/server/services/bookingService';

export const dynamic = 'force-dynamic';

export default async function AdminCustomersPage() {
  const customers = await listCustomers();

  return (
    <div>
      <PortalHeader
        title="Khách hàng"
        description="Khách tự đăng ký tài khoản hoặc được tạo khi đặt lịch. Bấm “Đặt lại mật khẩu” để hỗ trợ khách quên mật khẩu."
      />

      {customers.length === 0 ? (
        <EmptyState
          title="Chưa có khách hàng"
          description="Khi khách đăng ký hoặc đặt lịch trên website, hồ sơ khách sẽ xuất hiện tại đây."
          icon={UsersRound}
        />
      ) : (
        <CustomerManager customers={customers} />
      )}
    </div>
  );
}
