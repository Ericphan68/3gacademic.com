'use client';

import { format } from 'date-fns';
import { AlertCircle, ArrowRight, CalendarPlus, Check, Crown, Printer, Ticket, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { getIcon } from '@/components/common/icon-registry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Switch } from '@/components/ui/form-fields';
import { DemoQrCode, Separator, SpecList } from '@/components/ui/misc';
import { PAYMENT_METHODS } from '@/data/booking-options';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/format';
import { cn } from '@/lib/utils';
import { validateVoucher } from '@/services/pricingService';
import type { Booking, MembershipTierId, OwnedVoucher, PaymentMethod } from '@/types';

/* ============================================================
   Bước 7 — Voucher, ví và ưu đãi hội viên
   ============================================================ */

export function StepVoucher({
  voucherCode,
  useWallet,
  walletBalance,
  subtotal,
  membershipTier,
  membershipName,
  membershipDiscount,
  ownedVouchers,
  onVoucherChange,
  onWalletChange,
}: {
  voucherCode: string | null;
  useWallet: boolean;
  walletBalance: number;
  subtotal: number;
  membershipTier: MembershipTierId | null;
  membershipName: string | null;
  membershipDiscount: number;
  ownedVouchers: OwnedVoucher[];
  onVoucherChange: (code: string | null) => void;
  onWalletChange: (use: boolean) => void;
}) {
  const [input, setInput] = useState(voucherCode ?? '');
  const isPremiumMember = membershipTier === 'premium' || membershipTier === 'founder';

  const check = voucherCode ? validateVoucher(voucherCode, subtotal, isPremiumMember) : null;

  const apply = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    setInput(trimmed);
    onVoucherChange(trimmed || null);
  };

  return (
    <div className="space-y-6">
      {/* Nhập mã */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
        <p className="mb-4 flex items-center gap-2 text-base font-medium">
          <Ticket className="size-4 text-[var(--color-accent)]" aria-hidden />
          Mã voucher
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="Nhập mã" htmlFor="voucher-code" className="flex-1">
            <Input
              id="voucher-code"
              value={input}
              onChange={(event) => setInput(event.target.value.toUpperCase())}
              placeholder="Ví dụ: OFFPEAK25"
              autoComplete="off"
              invalid={Boolean(check && !check.valid)}
            />
          </Field>
          <Button variant="outline" onClick={() => apply(input)} className="sm:w-auto">
            Áp dụng
          </Button>
          {voucherCode ? (
            <Button
              variant="ghost"
              onClick={() => {
                setInput('');
                onVoucherChange(null);
              }}
              className="sm:w-auto"
            >
              Bỏ mã
            </Button>
          ) : null}
        </div>

        {check ? (
          <p
            className={cn(
              'mt-3 flex items-center gap-2 text-sm',
              check.valid ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]',
            )}
            role="status"
          >
            {check.valid ? (
              <Check className="size-4 shrink-0" aria-hidden />
            ) : (
              <AlertCircle className="size-4 shrink-0" aria-hidden />
            )}
            {check.message}
          </p>
        ) : null}
      </div>

      {/* Voucher đang có */}
      {ownedVouchers.length > 0 ? (
        <div>
          <p className="mb-3 text-base font-medium">Voucher trong tài khoản của bạn</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {ownedVouchers.map((voucher) => {
              const active = voucherCode === voucher.code;
              return (
                <li key={voucher.id}>
                  <button
                    type="button"
                    onClick={() => apply(active ? '' : voucher.code)}
                    aria-pressed={active}
                    className={cn(
                      'flex w-full cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border p-4 text-left transition-colors',
                      active
                        ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                    )}
                  >
                    <Ticket className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{voucher.name}</span>
                      <span className="mt-0.5 block font-mono text-xs text-[var(--color-muted)]">
                        {voucher.code} · {voucher.discountLabel}
                      </span>
                    </span>
                    {active ? (
                      <Check className="size-4 shrink-0 text-[var(--color-accent)]" strokeWidth={3} aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* Ví Lotus */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted-surface)] text-[var(--color-accent)]">
            <Wallet className="size-4" aria-hidden />
          </span>
          <div>
            <p className="text-base font-medium">Dùng số dư ví Lotus</p>
            <p className="mt-0.5 text-sm text-[var(--color-muted)]">
              Số dư hiện có: <span className="font-medium">{formatCurrency(walletBalance)}</span>
            </p>
          </div>
        </div>
        <Switch
          checked={useWallet}
          onCheckedChange={onWalletChange}
          disabled={walletBalance <= 0}
          aria-label="Dùng số dư ví Lotus để thanh toán"
        />
      </div>

      {/* Ưu đãi hội viên */}
      <div
        className={cn(
          'rounded-[var(--radius-lg)] border p-5',
          membershipName
            ? 'border-[var(--color-champagne-300)] bg-[var(--color-champagne-50)]'
            : 'border-dashed border-[var(--color-border-strong)]',
        )}
      >
        <p className="flex items-center gap-2 text-base font-medium">
          <Crown className="size-4 text-[var(--color-gold)]" aria-hidden />
          Ưu đãi hội viên
        </p>

        {membershipName ? (
          <p className="mt-2 text-sm text-[var(--color-champagne-800)]">
            Bạn đang là <span className="font-medium">{membershipName}</span>. Đơn này được giảm{' '}
            <span className="font-medium">{formatCurrency(membershipDiscount)}</span> theo quyền lợi hạng hội
            viên.
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Bạn chưa có hạng hội viên. Hội viên được giảm tới 25% giá sân, 20% học phí huấn luyện viên và
              nhận bonus khi nạp ví.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link href="/membership">
                Xem các hạng hội viên
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Bước 9 — Xác nhận và chọn phương thức thanh toán
   ============================================================ */

export function StepReview({
  paymentMethod,
  total,
  onPaymentMethodChange,
}: {
  paymentMethod: PaymentMethod;
  total: number;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-5">
        <p className="text-sm text-[var(--color-golf-800)]">
          Toàn bộ thông tin đặt lịch nằm ở khung tóm tắt bên cạnh. Kiểm tra lại một lượt, chọn phương thức
          thanh toán rồi xác nhận.
        </p>
      </div>

      <fieldset>
        <legend className="mb-4 text-base font-medium">Phương thức thanh toán</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {PAYMENT_METHODS.map((method) => {
            const Icon = getIcon(method.icon);
            const active = paymentMethod === method.id;

            return (
              <button
                key={method.id}
                type="button"
                onClick={() => onPaymentMethodChange(method.id)}
                aria-pressed={active}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border p-4 text-left transition-colors',
                  active
                    ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted-surface)] text-[var(--color-accent)]">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{method.name}</span>
                  <span className="mt-0.5 block text-xs text-[var(--color-muted)]">{method.description}</span>
                </span>
                {active ? (
                  <Check className="size-4 shrink-0 text-[var(--color-accent)]" strokeWidth={3} aria-hidden />
                ) : null}
              </button>
            );
          })}
        </div>
      </fieldset>

      <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] p-4 text-xs leading-relaxed text-[var(--color-muted)]">
        Đây là bản demo giao diện: không có giao dịch thật nào được thực hiện. Số tiền cần thanh toán hiển thị
        là <span className="font-medium text-[var(--color-foreground)]">{formatCurrency(total)}</span>.
      </p>
    </div>
  );
}

/* ============================================================
   Bước 10 — Đặt lịch thành công
   ============================================================ */

export function StepSuccess({ booking, onReset }: { booking: Booking; onReset: () => void }) {
  const calendarUrl = buildCalendarUrl(booking);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
          <Check className="size-8" strokeWidth={3} aria-hidden />
        </span>
        <h2 className="text-3xl">Đặt lịch thành công</h2>
        <p className="mt-3 text-[var(--color-muted)]">
          Lotus đã ghi nhận lịch của bạn. Thông tin cũng đã được lưu trong tài khoản để bạn xem lại bất cứ lúc
          nào.
        </p>
      </div>

      <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
        <div className="flex flex-col items-center gap-6 border-b border-dashed border-[var(--color-border)] p-6 sm:flex-row">
          <DemoQrCode payload={booking.qrPayload} size={140} className="shrink-0 border border-[var(--color-border)]" />
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
              { label: 'Đã thanh toán bằng ví', value: formatCurrency(booking.price.walletApplied) },
              { label: 'Còn phải thanh toán', value: formatCurrency(booking.price.total) },
            ]}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button asChild variant="outline">
          <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
            <CalendarPlus aria-hidden />
            Thêm vào lịch
          </a>
        </Button>
        <Button variant="outline" onClick={() => window.print()}>
          <Printer aria-hidden />
          In vé đặt lịch
        </Button>
        <Button asChild variant="accent">
          <Link href="/dashboard/bookings">
            Xem trong tài khoản
            <ArrowRight aria-hidden />
          </Link>
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Đặt thêm một lịch khác
        </Button>
      </div>

      <Separator className="my-8" />

      <p className="text-center text-sm text-[var(--color-muted)]">
        Cần thay đổi? Bạn có thể đổi lịch hoặc huỷ trong mục{' '}
        <Link href="/dashboard/bookings" className="font-medium text-[var(--color-accent)] hover:underline">
          Lịch đặt
        </Link>{' '}
        của tài khoản.
      </p>
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
