import { Utensils } from 'lucide-react';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/states';
import { listFoodOrdersForAdmin } from '@/server/services/foodOrderService';
import { formatCurrency, formatDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  PREPARING: 'Đang chuẩn bị',
  DELIVERED: 'Đã phục vụ',
  CANCELLED: 'Đã huỷ',
};

const TARGET_LABEL: Record<string, string> = {
  bay: 'Mang ra bay',
  table: 'Tại bàn',
  pickup: 'Tự lấy tại quầy',
};

export default async function AdminFoodOrdersPage() {
  const rows = await listFoodOrdersForAdmin();

  return (
    <div>
      <PortalHeader title="Đơn F&B" description="Đơn đặt món của khách (mới nhất trước) để bếp/quầy chuẩn bị." />
      {rows.length === 0 ? (
        <EmptyState
          title="Chưa có đơn F&B"
          description="Khi khách đặt món trên website, đơn sẽ hiển thị tại đây."
          icon={Utensils}
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
                <th className="px-4 py-3 font-medium">Mã đơn</th>
                <th className="px-4 py-3 font-medium">Khách</th>
                <th className="px-4 py-3 font-medium">Món</th>
                <th className="px-4 py-3 font-medium">Giao tới</th>
                <th className="px-4 py-3 font-medium">Tổng</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-b border-[var(--color-border)] align-top last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{o.code}</td>
                  <td className="px-4 py-3">{o.customerName}</td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{o.itemsSummary}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {TARGET_LABEL[o.deliveryTarget] ?? (o.deliveryTarget || '—')}
                    {o.bayNumber ? ` (${o.bayNumber})` : ''}
                    {o.scheduledTime ? ` · ${o.scheduledTime}` : ''}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{formatCurrency(o.total)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={o.status === 'CANCELLED' ? 'danger' : o.status === 'DELIVERED' ? 'success' : 'warning'} size="sm">
                      {STATUS_LABEL[o.status] ?? o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">{formatDateTime(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
