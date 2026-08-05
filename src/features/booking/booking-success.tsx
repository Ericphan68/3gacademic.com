'use client';

import { format } from 'date-fns';
import { ArrowRight, CalendarPlus, Check, Home, Landmark, Store, UserPlus } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DemoQrCode, Separator, SpecList } from '@/components/ui/misc';
import { CONTACT } from '@/constants/site';
import { BANK_TRANSFER_INFO, PAYMENT_METHODS } from '@/data/booking-options';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/format';
import type { Booking, PaymentStatus } from '@/types';

const PAYMENT_LABELS: Record<string, string> = Object.fromEntries(
  PAYMENT_METHODS.map((method) => [method.id, method.name]),
);

export const PAYMENT_STATUS_BADGE: Record<
  PaymentStatus,
  { label: string; variant: 'success' | 'warning' | 'neutral' }
> = {
  paid: { label: 'Đã thanh toán', variant: 'success' },
  pending: { label: 'Chờ thanh toán', variant: 'warning' },
  'pay-later': { label: 'Thanh toán tại quầy', variant: 'neutral' },
};

export function BookingSuccess({
  booking,
  isAuthenticated,
  onMarkTransferPaid,
}: {
  booking: Booking;
  isAuthenticated: boolean;
  onMarkTransferPaid: () => void;
}) {
  const calendarUrl = buildCalendarUrl(booking);
  const status = PAYMENT_STATUS_BADGE[booking.paymentStatus];
  // Số tiền đã/được tính cho đơn (ví trừ walletApplied, còn lại trả qua total).
  const charged = booking.paymentMethod === 'wallet' ? booking.price.walletApplied : booking.price.total;
  const amountLabel =
    booking.paymentStatus === 'paid'
      ? 'Đã thanh toán'
      : booking.paymentStatus === 'pending'
        ? 'Cần chuyển khoản'
        : 'Thanh toán tại quầy';

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
          <Check className="size-8" strokeWidth={3} aria-hidden />
        </span>
        <h1 className="text-3xl">Đặt lịch thành công</h1>
        <div className="mt-4 flex justify-center">
          <Badge variant={status.variant}>
            {booking.paymentStatus === 'paid' ? <Check className="size-3.5" aria-hidden /> : null}
            {status.label}
          </Badge>
        </div>
        <p className="mt-3 text-[var(--color-muted)]">
          {booking.paymentStatus === 'paid'
            ? 'Lotus đã nhận thanh toán và ghi nhận lịch của bạn.'
            : booking.paymentStatus === 'pending'
              ? 'Lotus đã giữ chỗ. Hoàn tất chuyển khoản bên dưới để xác nhận thanh toán.'
              : 'Lotus đã giữ chỗ. Bạn thanh toán tại quầy khi đến check-in.'}
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
        <div className="flex flex-col items-center gap-6 border-b border-dashed border-[var(--color-border)] p-6 sm:flex-row">
          <DemoQrCode
            payload={booking.qrPayload}
            size={140}
            className="shrink-0 border border-[var(--color-border)]"
          />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-xs tracking-widest text-[var(--color-muted)] uppercase">Mã đặt lịch</p>
            <p className="mt-1 font-mono text-2xl font-semibold">{booking.code}</p>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Xuất trình mã QR này tại quầy lễ tân để check-in. Không cần khai lại thông tin.
            </p>
            <Badge variant="neutral" size="sm" className="mt-3">
              Mã QR minh hoạ cho bản demo
            </Badge>
          </div>
        </div>

        <div className="p-6">
          <SpecList
            items={[
              { label: 'Trải nghiệm', value: booking.experienceLabel },
              { label: 'Thời gian', value: `${formatDateLong(booking.date)} · ${booking.time}` },
              { label: 'Thời lượng', value: formatDuration(booking.durationMinutes) },
              { label: 'Địa điểm', value: `Lotus Golf Center — ${booking.zoneName}` },
              { label: 'Huấn luyện viên', value: booking.coachName ?? 'Không có' },
              { label: 'Số khách', value: `${booking.guests} khách` },
              {
                label: 'Dịch vụ bổ sung',
                value:
                  booking.addOns.length > 0
                    ? booking.addOns.map((item) => `${item.name} ×${item.quantity}`).join(', ')
                    : 'Không có',
              },
              { label: 'Phương thức thanh toán', value: PAYMENT_LABELS[booking.paymentMethod] ?? booking.paymentMethod },
              { label: 'Trạng thái', value: status.label },
              {
                label: amountLabel,
                value: formatCurrency(booking.paymentStatus === 'paid' ? charged : booking.price.total),
              },
            ]}
          />
        </div>
      </div>

      {/* Hướng dẫn thanh toán theo phương thức đã chọn */}
      {booking.paymentMethod === 'transfer' && booking.price.total > 0 ? (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-champagne-300)] bg-[var(--color-champagne-50)] p-6">
          <p className="flex items-center gap-2 font-medium text-[var(--color-champagne-800)]">
            <Landmark className="size-4" aria-hidden />
            Hoàn tất thanh toán bằng chuyển khoản
          </p>
          <p className="mt-1 text-sm text-[var(--color-champagne-800)]">
            Chuyển <span className="font-medium">{formatCurrency(booking.price.total)}</span> tới tài khoản
            dưới đây, ghi đúng nội dung để Lotus xác nhận nhanh.
          </p>
          <SpecList
            className="mt-4"
            items={[
              { label: 'Ngân hàng', value: BANK_TRANSFER_INFO.bankName },
              { label: 'Số tài khoản', value: BANK_TRANSFER_INFO.accountNumber },
              { label: 'Chủ tài khoản', value: BANK_TRANSFER_INFO.accountName },
              { label: 'Số tiền', value: formatCurrency(booking.price.total) },
              {
                label: 'Nội dung chuyển khoản',
                value: <span className="font-mono font-semibold text-[var(--color-accent)]">{booking.code}</span>,
              },
            ]}
          />

          {booking.paymentStatus === 'paid' ? (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-[var(--color-golf-800)]">
              <Check className="size-4" strokeWidth={3} aria-hidden />
              Đã ghi nhận thanh toán chuyển khoản.
            </p>
          ) : (
            <div className="mt-4">
              <Button variant="accent" onClick={onMarkTransferPaid}>
                <Check aria-hidden />
                Tôi đã chuyển khoản
              </Button>
              <p className="mt-2 text-xs text-[var(--color-champagne-800)]">
                Bấm sau khi chuyển khoản xong để xác nhận. (Bản demo: xác nhận ngay lập tức, không kiểm tra
                giao dịch thật.)
              </p>
            </div>
          )}
        </div>
      ) : null}

      {booking.paymentMethod === 'at-center' && booking.price.total > 0 ? (
        <p className="mt-6 flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-muted)]">
          <Store className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          <span>
            Vui lòng thanh toán{' '}
            <span className="font-medium text-[var(--color-foreground)]">
              {formatCurrency(booking.price.total)}
            </span>{' '}
            tại quầy lễ tân khi check-in. Hotline hỗ trợ: {CONTACT.hotline}.
          </span>
        </p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Button asChild variant="accent">
          <Link href="/dashboard/bookings">
            Xem lịch đặt
            <ArrowRight aria-hidden />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
            <CalendarPlus aria-hidden />
            Thêm vào lịch
          </a>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">
            <Home aria-hidden />
            Về trang chủ
          </Link>
        </Button>
      </div>

      {/* Gợi ý tạo tài khoản cho khách chưa đăng nhập */}
      {!isAuthenticated ? (
        <>
          <Separator className="my-8" />
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-6">
            <p className="flex items-center gap-2 text-base font-medium text-[var(--color-golf-800)]">
              <UserPlus className="size-4" aria-hidden />
              Tạo tài khoản để quản lý lịch dễ dàng hơn
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-golf-700)]">
              Với tài khoản Lotus, bạn xem lại lịch đặt, đổi hoặc huỷ lịch, tích điểm và nhận ưu đãi hội viên.
              Không bắt buộc — lịch vừa đặt vẫn được lưu trên thiết bị này.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="sm">
                <Link href="/register">
                  Tạo tài khoản
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Đã có tài khoản? Đăng nhập</Link>
              </Button>
            </div>
          </div>
        </>
      ) : (
        <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
          Cần thay đổi? Bạn có thể đổi lịch hoặc huỷ trong mục{' '}
          <Link
            href="/dashboard/bookings"
            className="font-medium text-[var(--color-accent)] hover:underline"
          >
            Lịch đặt
          </Link>{' '}
          của tài khoản.
        </p>
      )}
    </div>
  );
}

/** Tạo link thêm sự kiện vào Google Calendar. */
function buildCalendarUrl(booking: Booking): string {
  const start = new Date(`${booking.date}T${booking.time}:00`);
  const end = new Date(start.getTime() + booking.durationMinutes * 60000);
  const stamp = (date: Date) => format(date, "yyyyMMdd'T'HHmmss");

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Lotus Golf Center — ${booking.experienceLabel}`,
    dates: `${stamp(start)}/${stamp(end)}`,
    details: `Mã đặt lịch: ${booking.code}\nKhu vực: ${booking.zoneName}${
      booking.coachName ? `\nHuấn luyện viên: ${booking.coachName}` : ''
    }`,
    location: 'Lotus Golf Center',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
