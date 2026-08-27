'use client';

import { CalendarCheck, CalendarClock, MapPin, QrCode, Users, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/disclosure';
import { Field, Select } from '@/components/ui/form-fields';
import { DemoQrCode, SpecList } from '@/components/ui/misc';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays';
import { EmptyState } from '@/components/ui/states';
import { PAYMENT_METHODS } from '@/data/booking-options';
import { useHydrated } from '@/hooks/useHydrated';
import { dateKey, getTimeSlots, isPastDate } from '@/lib/availability';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/format';
import { useAccountStore } from '@/store/useAccountStore';
import type { Booking, BookingStatus } from '@/types';

const TABS: { value: BookingStatus; label: string }[] = [
  { value: 'upcoming', label: 'Sắp tới' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'cancelled', label: 'Đã huỷ' },
];

const PAY_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  paid: { label: 'Đã thanh toán', variant: 'success' },
  pending: { label: 'Chờ thanh toán', variant: 'warning' },
  'pay-later': { label: 'Thanh toán tại quầy', variant: 'neutral' },
};

const PAY_METHOD_LABELS: Record<string, string> = Object.fromEntries(
  PAYMENT_METHODS.map((method) => [method.id, method.name]),
);

export function BookingsManager() {
  const hydrated = useHydrated();
  const bookings = useAccountStore((state) => state.bookings);
  const cancelBooking = useAccountStore((state) => state.cancelBooking);
  const rescheduleBooking = useAccountStore((state) => state.rescheduleBooking);

  const [detail, setDetail] = useState<Booking | null>(null);
  const [rescheduling, setRescheduling] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState<Booking | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  if (!hydrated) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const openReschedule = (booking: Booking) => {
    setRescheduling(booking);
    setNewDate(booking.date);
    setNewTime(booking.time);
  };

  const confirmReschedule = async () => {
    if (!rescheduling) return;
    if (isPastDate(newDate)) {
      toast.error('Ngày không hợp lệ', { description: 'Không thể chọn ngày đã qua.' });
      return;
    }
    const res = await fetch('/api/bookings/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reschedule', code: rescheduling.code, date: newDate, time: newTime }),
    });
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      toast.error('Chưa đổi được lịch', { description: body?.error });
      return;
    }
    rescheduleBooking(rescheduling.id, newDate, newTime);
    toast.success('Đã đổi lịch', {
      description: `${rescheduling.code} chuyển sang ${formatDateLong(newDate)} lúc ${newTime}.`,
    });
    setRescheduling(null);
  };

  const confirmCancel = async () => {
    if (!cancelling) return;
    const res = await fetch('/api/bookings/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'cancel', code: cancelling.code }),
    });
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      toast.error('Chưa huỷ được đơn', { description: body?.error });
      return;
    }
    cancelBooking(cancelling.id);
    toast.success('Đã huỷ lịch đặt', {
      description: `${cancelling.code} đã được huỷ. Nếu đã thanh toán, Lotus sẽ hỗ trợ hoàn tiền.`,
    });
    setCancelling(null);
  };

  return (
    <div>
      <PortalHeader
        title="Lịch đặt của tôi"
        description="Xem, đổi lịch hoặc huỷ các lượt đặt. Mã QR check-in nằm trong phần chi tiết từng lịch."
        action={
          <Button asChild variant="accent">
            <Link href="/booking">Đặt lịch mới</Link>
          </Button>
        }
      />

      <Tabs defaultValue="upcoming">
        <TabsList className="self-start">
          {TABS.map((tab) => {
            const count = bookings.filter((booking) => booking.status === tab.value).length;
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((tab) => {
          const items = bookings
            .filter((booking) => booking.status === tab.value)
            .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

          return (
            <TabsContent key={tab.value} value={tab.value}>
              {items.length === 0 ? (
                <EmptyState
                  title={`Không có lịch ${tab.label.toLowerCase()}`}
                  description={
                    tab.value === 'upcoming'
                      ? 'Đặt một buổi tập để bắt đầu. Bạn nhận mã QR check-in ngay sau khi xác nhận.'
                      : 'Các lịch thuộc trạng thái này sẽ hiển thị ở đây.'
                  }
                  icon={CalendarCheck}
                  action={
                    tab.value === 'upcoming' ? (
                      <Button asChild variant="accent">
                        <Link href="/booking">Đặt lịch ngay</Link>
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <ul className="space-y-4">
                  {items.map((booking) => (
                    <li
                      key={booking.id}
                      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg">{booking.experienceLabel}</h3>
                            <Badge
                              variant={
                                booking.status === 'upcoming'
                                  ? 'success'
                                  : booking.status === 'completed'
                                    ? 'neutral'
                                    : 'danger'
                              }
                              size="sm"
                            >
                              {booking.status === 'upcoming'
                                ? 'Sắp tới'
                                : booking.status === 'completed'
                                  ? 'Đã hoàn thành'
                                  : 'Đã huỷ'}
                            </Badge>
                            {booking.paymentStatus && PAY_BADGE[booking.paymentStatus] ? (
                              <Badge variant={PAY_BADGE[booking.paymentStatus].variant} size="sm">
                                {PAY_BADGE[booking.paymentStatus].label}
                              </Badge>
                            ) : null}
                          </div>

                          <p className="mt-1 font-mono text-sm text-[var(--color-muted)]">{booking.code}</p>

                          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--color-muted)]">
                            <li className="inline-flex items-center gap-1.5">
                              <CalendarClock className="size-4" aria-hidden />
                              {formatDateLong(booking.date)} · {booking.time}
                            </li>
                            <li className="inline-flex items-center gap-1.5">
                              <MapPin className="size-4" aria-hidden />
                              {booking.zoneName}
                            </li>
                            <li className="inline-flex items-center gap-1.5">
                              <Users className="size-4" aria-hidden />
                              {booking.guests} khách
                            </li>
                          </ul>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" size="sm" onClick={() => setDetail(booking)}>
                            <QrCode aria-hidden />
                            Chi tiết & QR
                          </Button>
                          {booking.status === 'upcoming' ? (
                            <>
                              <Button variant="subtle" size="sm" onClick={() => openReschedule(booking)}>
                                Đổi lịch
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => setCancelling(booking)}>
                                <X aria-hidden />
                                Huỷ
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Modal chi tiết + QR */}
      <Dialog open={detail !== null} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent>
          {detail ? (
            <>
              <DialogHeader>
                <DialogTitle>Chi tiết lịch đặt</DialogTitle>
                <DialogDescription>
                  Xuất trình mã QR tại quầy lễ tân để check-in nhanh.
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 sm:flex-row">
                <DemoQrCode payload={detail.qrPayload} size={128} className="shrink-0 border border-[var(--color-border)]" />
                <div className="text-center sm:text-left">
                  <p className="text-xs tracking-widest text-[var(--color-muted)] uppercase">Mã đặt lịch</p>
                  <p className="mt-1 font-mono text-xl font-semibold">{detail.code}</p>
                  <Badge variant="neutral" size="sm" className="mt-2">
                    Mã QR minh hoạ cho bản demo
                  </Badge>
                </div>
              </div>

              <SpecList
                className="mt-5"
                items={[
                  { label: 'Trải nghiệm', value: detail.experienceLabel },
                  { label: 'Thời gian', value: `${formatDateLong(detail.date)} · ${detail.time}` },
                  { label: 'Thời lượng', value: formatDuration(detail.durationMinutes) },
                  { label: 'Khu vực', value: detail.zoneName },
                  { label: 'Huấn luyện viên', value: detail.coachName ?? 'Không có' },
                  { label: 'Số khách', value: `${detail.guests} khách` },
                  {
                    label: 'Dịch vụ bổ sung',
                    value:
                      detail.addOns.length > 0
                        ? detail.addOns.map((item) => `${item.name} ×${item.quantity}`).join(', ')
                        : 'Không có',
                  },
                  { label: 'Voucher', value: detail.voucherCode ?? 'Không dùng' },
                  { label: 'Phương thức', value: PAY_METHOD_LABELS[detail.paymentMethod] ?? detail.paymentMethod },
                  {
                    label: 'Trạng thái thanh toán',
                    value: detail.paymentStatus ? PAY_BADGE[detail.paymentStatus].label : '—',
                  },
                  {
                    label: detail.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Cần thanh toán',
                    value: formatCurrency(
                      detail.paymentStatus === 'paid' && detail.paymentMethod === 'wallet'
                        ? detail.price.walletApplied
                        : detail.price.total,
                    ),
                  },
                ]}
              />

              {detail.contact.note ? (
                <p className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]">
                  <span className="font-medium text-[var(--color-foreground)]">Ghi chú của bạn: </span>
                  {detail.contact.note}
                </p>
              ) : null}
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Modal đổi lịch */}
      <Dialog open={rescheduling !== null} onOpenChange={(open) => !open && setRescheduling(null)}>
        <DialogContent size="sm">
          {rescheduling ? (
            <>
              <DialogHeader>
                <DialogTitle>Đổi lịch {rescheduling.code}</DialogTitle>
                <DialogDescription>
                  Chọn ngày và khung giờ mới. Đổi lịch miễn phí trước 4 giờ so với giờ đã đặt.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <Field label="Ngày mới" htmlFor="reschedule-date" required>
                  <input
                    id="reschedule-date"
                    type="date"
                    value={newDate}
                    min={dateKey(new Date())}
                    onChange={(event) => setNewDate(event.target.value)}
                    className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface-raised)] px-3.5 text-sm"
                  />
                </Field>

                <Field label="Khung giờ mới" htmlFor="reschedule-time" required>
                  <Select
                    id="reschedule-time"
                    value={newTime}
                    onChange={(event) => setNewTime(event.target.value)}
                  >
                    {(newDate ? getTimeSlots(newDate) : []).map((slot) => (
                      <option key={slot.time} value={slot.time} disabled={slot.status === 'full'}>
                        {slot.time}
                        {slot.status === 'full' ? ' — hết chỗ' : slot.status === 'filling' ? ' — sắp đầy' : ''}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setRescheduling(null)}>
                  Giữ lịch cũ
                </Button>
                <Button variant="accent" onClick={() => void confirmReschedule()}>
                  Xác nhận đổi lịch
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Modal huỷ */}
      <Dialog open={cancelling !== null} onOpenChange={(open) => !open && setCancelling(null)}>
        <DialogContent size="sm">
          {cancelling ? (
            <>
              <DialogHeader>
                <DialogTitle>Huỷ lịch {cancelling.code}?</DialogTitle>
                <DialogDescription>
                  Lịch {formatDateLong(cancelling.date)} lúc {cancelling.time} sẽ bị huỷ. Giá trị đã thanh
                  toán được hoàn vào ví Lotus theo chính sách của gói.
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setCancelling(null)}>
                  Giữ lịch
                </Button>
                <Button variant="danger" onClick={() => void confirmCancel()}>
                  Xác nhận huỷ
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
