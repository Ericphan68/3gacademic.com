'use client';

import { CalendarCheck, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/disclosure';
import { EmptyState } from '@/components/ui/states';
import { formatCurrency } from '@/lib/format';
import type { BadgeProps } from '@/components/ui/badge';

export interface BookingRow {
  id: string;
  code: string;
  contactName: string;
  contactPhone: string;
  experienceLabel: string;
  zoneName: string | null;
  date: string;
  time: string;
  guests: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
}

const STATUS_META: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
  PENDING: { label: 'Chờ xử lý', variant: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'info' },
  CHECKED_IN: { label: 'Đã check-in', variant: 'success' },
  IN_PROGRESS: { label: 'Đang diễn ra', variant: 'info' },
  COMPLETED: { label: 'Hoàn tất', variant: 'success' },
  CANCELLED: { label: 'Đã huỷ', variant: 'danger' },
  NO_SHOW: { label: 'Không đến', variant: 'neutral' },
};

const PAY_META: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
  UNPAID: { label: 'Chưa thu', variant: 'warning' },
  PAID: { label: 'Đã thu', variant: 'success' },
  PAID_AT_COUNTER: { label: 'Thu tại quầy', variant: 'success' },
  REFUNDED: { label: 'Đã hoàn', variant: 'neutral' },
};

const FILTERS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'UNPAID', label: 'Chưa thu' },
  { value: 'PAID', label: 'Đã thu' },
] as const;

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('vi-VN');

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const markPaid = async (booking: BookingRow) => {
    setBusy(booking.id);
    const res = await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: booking.id, action: 'mark-paid' }),
    });
    setBusy(null);
    if (!res.ok) {
      toast.error('Cập nhật chưa thành công');
      return;
    }
    toast.success('Đã xác nhận thanh toán', { description: `${booking.code} chuyển sang Đã thu.` });
    router.refresh();
  };

  return (
    <Tabs defaultValue="all">
      <TabsList className="self-start">
        {FILTERS.map((f) => {
          const count =
            f.value === 'all'
              ? bookings.length
              : bookings.filter((b) => b.paymentStatus === f.value).length;
          return (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label} ({count})
            </TabsTrigger>
          );
        })}
      </TabsList>

      {FILTERS.map((f) => {
        const rows =
          f.value === 'all' ? bookings : bookings.filter((b) => b.paymentStatus === f.value);
        return (
          <TabsContent key={f.value} value={f.value}>
            {rows.length === 0 ? (
              <EmptyState
                title="Chưa có đơn đặt lịch"
                description="Đơn khách đặt trên website sẽ hiển thị tại đây."
                icon={CalendarCheck}
              />
            ) : (
              <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                <table className="w-full min-w-[52rem] text-sm">
                  <thead>
                    <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
                      <th className="px-4 py-3 font-medium">Mã</th>
                      <th className="px-4 py-3 font-medium">Khách</th>
                      <th className="px-4 py-3 font-medium">Trải nghiệm</th>
                      <th className="px-4 py-3 font-medium">Thời gian</th>
                      <th className="px-4 py-3 text-right font-medium">Số tiền</th>
                      <th className="px-4 py-3 font-medium">Trạng thái</th>
                      <th className="px-4 py-3 font-medium">Thanh toán</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((b) => {
                      const sm = STATUS_META[b.status] ?? { label: b.status, variant: 'neutral' };
                      const pm = PAY_META[b.paymentStatus] ?? { label: b.paymentStatus, variant: 'neutral' };
                      return (
                        <tr key={b.id} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{b.code}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{b.contactName || '—'}</p>
                            <p className="text-xs text-[var(--color-muted)]">{b.contactPhone}</p>
                          </td>
                          <td className="px-4 py-3">
                            {b.experienceLabel}
                            {b.zoneName ? (
                              <span className="block text-xs text-[var(--color-muted)]">{b.zoneName}</span>
                            ) : null}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">
                            {fmtDate(b.date)} · {b.time}
                          </td>
                          <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                            {formatCurrency(b.totalAmount)}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={sm.variant} size="sm">
                              {sm.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={pm.variant} size="sm">
                              {pm.label}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {b.paymentStatus === 'UNPAID' && b.status !== 'CANCELLED' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                loading={busy === b.id}
                                onClick={() => markPaid(b)}
                              >
                                <Check aria-hidden />
                                Đã thu
                              </Button>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
