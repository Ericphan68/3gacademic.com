'use client';

import { CalendarCheck, Clock, Info, ReceiptText, Ticket, Users, Wallet } from 'lucide-react';
import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatTile } from '@/components/common/stat-tile';
import { EmptyState } from '@/components/ui/states';
import { LEAD_TYPE_LABELS, PAYMENT_STATUS_META, bookingCharged } from '@/features/admin/shared';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDateLong } from '@/lib/format';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function AdminOverviewPage() {
  const hydrated = useHydrated();
  const bookings = useAccountStore((state) => state.bookings);
  const leads = useAccountStore((state) => state.leads);
  const eventRegistrations = useAccountStore((state) => state.eventRegistrations);
  const registeredUsers = useAuthStore((state) => state.registeredUsers);

  if (!hydrated) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const paidRevenue = bookings
    .filter((booking) => booking.paymentStatus === 'paid')
    .reduce((sum, booking) => sum + bookingCharged(booking), 0);

  const outstanding = bookings
    .filter((booking) => booking.paymentStatus !== 'paid' && booking.status !== 'cancelled')
    .reduce((sum, booking) => sum + booking.price.total, 0);

  const pendingCount = bookings.filter((booking) => booking.paymentStatus === 'pending').length;
  const payLaterCount = bookings.filter((booking) => booking.paymentStatus === 'pay-later').length;

  const recentBookings = [...bookings]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const recentLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div>
      <PortalHeader
        title="Tổng quan quản trị"
        description="Số liệu tổng hợp từ dữ liệu trên thiết bị này (bản demo). Kết nối backend để xem dữ liệu tập trung của toàn hệ thống."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatTile
          value={bookings.length}
          label="Tổng lượt đặt lịch"
          icon={<CalendarCheck className="size-5" aria-hidden />}
        />
        <StatTile
          value={formatCurrency(paidRevenue)}
          label="Doanh thu đã thu"
          tone="accent"
          icon={<Wallet className="size-5" aria-hidden />}
        />
        <StatTile
          value={formatCurrency(outstanding)}
          label="Còn phải thu"
          hint={`${pendingCount} chờ chuyển khoản · ${payLaterCount} trả tại quầy`}
          icon={<Clock className="size-5" aria-hidden />}
        />
        <StatTile
          value={eventRegistrations.length}
          label="Đăng ký sự kiện"
          icon={<Ticket className="size-5" aria-hidden />}
        />
        <StatTile
          value={leads.length}
          label="Yêu cầu & liên hệ"
          icon={<ReceiptText className="size-5" aria-hidden />}
        />
        <StatTile
          value={registeredUsers.length}
          label="Khách tự đăng ký"
          icon={<Users className="size-5" aria-hidden />}
        />
      </div>

      {/* Booking gần đây */}
      <div className="mt-10 flex items-center justify-between gap-3">
        <h2 className="text-xl">Lượt đặt lịch gần đây</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/bookings">Xem tất cả</Link>
        </Button>
      </div>

      {recentBookings.length === 0 ? (
        <EmptyState
          className="mt-4"
          title="Chưa có lượt đặt lịch nào"
          description="Các lượt đặt lịch tạo trên thiết bị này sẽ hiển thị tại đây."
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
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">{booking.code}</td>
                  <td className="px-4 py-3">{booking.contact.fullName || '—'}</td>
                  <td className="px-4 py-3">{booking.experienceLabel}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">
                    {formatDateLong(booking.date)} · {booking.time}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {formatCurrency(bookingCharged(booking))}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={PAYMENT_STATUS_META[booking.paymentStatus].variant} size="sm">
                      {PAYMENT_STATUS_META[booking.paymentStatus].label}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Yêu cầu gần đây */}
      <div className="mt-10 flex items-center justify-between gap-3">
        <h2 className="text-xl">Yêu cầu & liên hệ gần đây</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/registrations">Xem tất cả</Link>
        </Button>
      </div>

      {recentLeads.length === 0 ? (
        <EmptyState
          className="mt-4"
          title="Chưa có yêu cầu nào"
          description="Yêu cầu từ form liên hệ, doanh nghiệp và tour sẽ hiển thị tại đây."
          icon={ReceiptText}
        />
      ) : (
        <ul className="mt-4 space-y-3">
          {recentLeads.map((lead) => (
            <li
              key={lead.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{lead.summary}</p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">{formatDateLong(lead.createdAt)}</p>
              </div>
              <Badge variant="neutral" size="sm">
                {LEAD_TYPE_LABELS[lead.type]}
              </Badge>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-8 flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs leading-relaxed text-[var(--color-muted)]">
        <Info className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
        Bản demo lưu dữ liệu trong trình duyệt. Số liệu phản ánh dữ liệu trên thiết bị này — khi tích hợp
        backend, khu quản trị sẽ hiển thị dữ liệu tập trung của toàn bộ khách hàng.
      </p>
    </div>
  );
}
