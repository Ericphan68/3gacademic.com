import { UserCheck } from 'lucide-react';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/states';
import { listAllEventRegistrations } from '@/server/services/eventRegistrationService';
import { formatCurrency, formatDateTime } from '@/lib/format';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  REGISTERED: 'Đã đăng ký',
  CHECKED_IN: 'Đã check-in',
  CANCELLED: 'Đã huỷ',
};

export default async function AdminEventRegistrationsPage() {
  const rows = await listAllEventRegistrations();

  return (
    <div>
      <PortalHeader
        title="Đăng ký sự kiện"
        description="Danh sách khách đã đăng ký các sự kiện của Lotus (mới nhất trước)."
      />
      {rows.length === 0 ? (
        <EmptyState
          title="Chưa có đăng ký"
          description="Khi khách đăng ký sự kiện trên website, danh sách sẽ hiển thị tại đây."
          icon={UserCheck}
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <table className="w-full min-w-[48rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
                <th className="px-4 py-3 font-medium">Sự kiện</th>
                <th className="px-4 py-3 font-medium">Khách</th>
                <th className="px-4 py-3 text-center font-medium">Số người</th>
                <th className="px-4 py-3 font-medium">Phí</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{r.eventTitle}</td>
                  <td className="px-4 py-3">
                    <p>{r.customerName}</p>
                    <p className="text-xs text-[var(--color-muted)]">{r.customerPhone || '—'}</p>
                  </td>
                  <td className="px-4 py-3 text-center tabular-nums">{r.attendees}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.fee === 0 ? 'Miễn phí' : formatCurrency(r.fee)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === 'CANCELLED' ? 'danger' : 'success'} size="sm">
                      {STATUS_LABEL[r.status] ?? r.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">{formatDateTime(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
