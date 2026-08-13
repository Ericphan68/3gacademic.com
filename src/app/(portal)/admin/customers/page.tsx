import { UsersRound } from 'lucide-react';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/states';
import { listCustomers } from '@/server/services/bookingService';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  NEW: 'Mới',
  ACTIVE: 'Đang hoạt động',
  VIP: 'VIP',
  INACTIVE: 'Ngưng',
  AT_RISK: 'Nguy cơ rời',
};

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '—');

export default async function AdminCustomersPage() {
  const customers = await listCustomers();

  return (
    <div>
      <PortalHeader
        title="Khách hàng"
        description="Danh sách khách được tạo tự động khi có đơn đặt lịch từ website."
      />

      {customers.length === 0 ? (
        <EmptyState
          title="Chưa có khách hàng"
          description="Khi khách đặt lịch trên website, hồ sơ khách sẽ tự động xuất hiện tại đây."
          icon={UsersRound}
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
                <th className="px-4 py-3 font-medium">Khách</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 text-center font-medium">Số đơn</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Lần cuối</th>
                <th className="px-4 py-3 font-medium">Tạo lúc</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.fullName}</p>
                    <p className="text-xs text-[var(--color-muted)]">{c.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{c.email || '—'}</td>
                  <td className="px-4 py-3 text-center tabular-nums">{c.bookingCount}</td>
                  <td className="px-4 py-3">
                    <Badge variant="neutral" size="sm">
                      {STATUS_LABEL[c.status] ?? c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">{fmt(c.lastVisitAt)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">{fmt(c.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
