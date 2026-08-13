import { CalendarCheck, Clock, UsersRound, Wallet } from 'lucide-react';
import Link from 'next/link';

import { StatTile } from '@/components/common/stat-tile';
import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { formatCurrency } from '@/lib/format';
import { getDashboardStats, listBookings } from '@/server/services/bookingService';

export const dynamic = 'force-dynamic';

const PAY_LABEL: Record<string, string> = {
  UNPAID: 'Chưa thu',
  PAID: 'Đã thu',
  PAID_AT_COUNTER: 'Thu tại quầy',
  REFUNDED: 'Đã hoàn',
};

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('vi-VN');

export default async function AdminOverviewPage() {
  const [stats, recent] = await Promise.all([getDashboardStats(), listBookings(6)]);

  return (
    <div>
      <PortalHeader
        title="Tổng quan quản trị"
        description="Số liệu thật tổng hợp từ đơn đặt lịch khách gửi qua website."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          value={stats.totalBookings}
          label="Tổng lượt đặt lịch"
          icon={<CalendarCheck className="size-5" aria-hidden />}
        />
        <StatTile
          value={formatCurrency(stats.paidRevenue)}
          label="Doanh thu đã thu"
          tone="accent"
          icon={<Wallet className="size-5" aria-hidden />}
        />
        <StatTile
          value={formatCurrency(stats.outstanding)}
          label="Còn phải thu"
          hint={`${stats.pendingCount} đơn chưa thanh toán`}
          icon={<Clock className="size-5" aria-hidden />}
        />
        <StatTile
          value={stats.customers}
          label="Khách hàng"
          icon={<UsersRound className="size-5" aria-hidden />}
        />
      </div>

      <div className="mt-10 flex items-center justify-between gap-3">
        <h2 className="text-xl">Lượt đặt lịch gần đây</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/bookings">Xem tất cả</Link>
        </Button>
      </div>

      {recent.length === 0 ? (
        <EmptyState
          className="mt-4"
          title="Chưa có lượt đặt lịch nào"
          description="Đơn khách đặt trên website sẽ hiển thị tại đây."
          icon={CalendarCheck}
        />
      ) : (
        <div className="mt-4 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
                <th className="px-4 py-3 font-medium">Mã</th>
                <th className="px-4 py-3 font-medium">Khách</th>
                <th className="px-4 py-3 font-medium">Trải nghiệm</th>
                <th className="px-4 py-3 font-medium">Thời gian</th>
                <th className="px-4 py-3 text-right font-medium">Số tiền</th>
                <th className="px-4 py-3 font-medium">Thanh toán</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr key={b.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{b.code}</td>
                  <td className="px-4 py-3">{b.contactName || '—'}</td>
                  <td className="px-4 py-3">{b.experienceLabel}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">
                    {fmtDate(b.date)} · {b.time}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatCurrency(b.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={b.paymentStatus === 'UNPAID' ? 'warning' : 'success'} size="sm">
                      {PAY_LABEL[b.paymentStatus] ?? b.paymentStatus}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
