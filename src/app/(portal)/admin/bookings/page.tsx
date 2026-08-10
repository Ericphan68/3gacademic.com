'use client';

import { CalendarCheck, Check } from 'lucide-react';
import { toast } from 'sonner';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/disclosure';
import { EmptyState } from '@/components/ui/states';
import {
  BOOKING_STATUS_META,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_META,
  bookingCharged,
} from '@/features/admin/shared';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDateLong } from '@/lib/format';
import { useAccountStore } from '@/store/useAccountStore';
import type { Booking, PaymentStatus } from '@/types';

const FILTERS: { value: 'all' | PaymentStatus; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'pending', label: 'Chờ thanh toán' },
  { value: 'pay-later', label: 'Tại quầy' },
];

export default function AdminBookingsPage() {
  const hydrated = useHydrated();
  const bookings = useAccountStore((state) => state.bookings);
  const markBookingPaid = useAccountStore((state) => state.markBookingPaid);

  if (!hydrated) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const confirmPaid = (booking: Booking) => {
    markBookingPaid(booking.id);
    toast.success('Đã xác nhận thanh toán', {
      description: `${booking.code} chuyển sang trạng thái Đã thanh toán.`,
    });
  };

  const sorted = [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <PortalHeader
        title="Quản lý đặt lịch"
        description="Toàn bộ lượt đặt lịch trên thiết bị này. Xác nhận thanh toán cho các đơn chuyển khoản hoặc trả tại quầy."
      />

      <Tabs defaultValue="all">
        <TabsList className="self-start">
          {FILTERS.map((filter) => {
            const count =
              filter.value === 'all'
                ? bookings.length
                : bookings.filter((booking) => booking.paymentStatus === filter.value).length;
            return (
              <TabsTrigger key={filter.value} value={filter.value}>
                {filter.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {FILTERS.map((filter) => {
          const rows =
            filter.value === 'all'
              ? sorted
              : sorted.filter((booking) => booking.paymentStatus === filter.value);

          return (
            <TabsContent key={filter.value} value={filter.value}>
              {rows.length === 0 ? (
                <EmptyState
                  title="Không có lượt đặt lịch"
                  description="Các lượt đặt lịch phù hợp bộ lọc này sẽ hiển thị tại đây."
                  icon={CalendarCheck}
                />
              ) : (
                <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                  <table className="w-full min-w-[56rem] text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
                        <th className="px-4 py-3 font-medium">Mã</th>
                        <th className="px-4 py-3 font-medium">Khách</th>
                        <th className="px-4 py-3 font-medium">Trải nghiệm</th>
                        <th className="px-4 py-3 font-medium">Thời gian</th>
                        <th className="px-4 py-3 font-medium">Phương thức</th>
                        <th className="px-4 py-3 text-right font-medium">Số tiền</th>
                        <th className="px-4 py-3 font-medium">Trạng thái</th>
                        <th className="px-4 py-3 font-medium">Thanh toán</th>
                        <th className="px-4 py-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((booking) => (
                        <tr key={booking.id} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{booking.code}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{booking.contact.fullName || '—'}</p>
                            <p className="text-xs text-[var(--color-muted)]">{booking.contact.phone}</p>
                          </td>
                          <td className="px-4 py-3">{booking.experienceLabel}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">
                            {formatDateLong(booking.date)} · {booking.time}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {PAYMENT_METHOD_LABELS[booking.paymentMethod] ?? booking.paymentMethod}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                            {formatCurrency(bookingCharged(booking))}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={BOOKING_STATUS_META[booking.status].variant} size="sm">
                              {BOOKING_STATUS_META[booking.status].label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={PAYMENT_STATUS_META[booking.paymentStatus].variant} size="sm">
                              {PAYMENT_STATUS_META[booking.paymentStatus].label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' ? (
                              <Button variant="outline" size="sm" onClick={() => confirmPaid(booking)}>
                                <Check aria-hidden />
                                Đã thu
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
