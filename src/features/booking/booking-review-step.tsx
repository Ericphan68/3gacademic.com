'use client';

import {
  AlertCircle,
  CalendarClock,
  Check,
  CreditCard,
  Info,
  Landmark,
  MapPin,
  PackagePlus,
  Pencil,
  Sparkles,
  Store,
  User,
  Users,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { type ReactNode } from 'react';

import { getIcon } from '@/components/common/icon-registry';
import { Separator } from '@/components/ui/misc';
import { CONTACT } from '@/constants/site';
import { BANK_TRANSFER_INFO, PAYMENT_METHODS } from '@/data/booking-options';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/format';
import { cn } from '@/lib/utils';
import { bookingOptionService, coachService } from '@/services/catalogService';
import { resolveAddOns } from '@/services/pricingService';
import { EDIT_STEP } from '@/store/useBookingStore';
import type { BookingDraft, BookingPriceBreakdown, PaymentMethod } from '@/types';

export function BookingReviewStep({
  draft,
  price,
  paymentMethod,
  walletBalance,
  isAuthenticated,
  onEdit,
  onPaymentMethodChange,
}: {
  draft: BookingDraft;
  price: BookingPriceBreakdown;
  paymentMethod: PaymentMethod;
  walletBalance: number;
  isAuthenticated: boolean;
  onEdit: (step: number) => void;
  onPaymentMethodChange: (method: PaymentMethod) => void;
}) {
  const experience = draft.experienceType
    ? bookingOptionService.getExperienceType(draft.experienceType)
    : undefined;
  const zone = draft.zoneId ? bookingOptionService.getZone(draft.zoneId) : undefined;
  const coach = draft.coachId ? coachService.getById(draft.coachId) : undefined;
  const addOns = resolveAddOns(draft.addOns);
  const totalDiscount = price.membershipDiscount + price.voucherDiscount;

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--color-muted)]">
        Kiểm tra lại thông tin bên dưới. Bạn có thể chỉnh sửa từng phần trước khi xác nhận.
      </p>

      <ReviewCard
        icon={<Sparkles className="size-4" aria-hidden />}
        title="Trải nghiệm"
        onEdit={() => onEdit(EDIT_STEP.experience)}
      >
        <Row label="Gói" value={experience?.name ?? '—'} />
        <Row label="Thời lượng" value={experience ? formatDuration(experience.durationMinutes) : '—'} />
        <Row label="Giá cơ bản" value={experience ? `Từ ${formatCurrency(experience.basePrice)}` : '—'} />
      </ReviewCard>

      <ReviewCard
        icon={<User className="size-4" aria-hidden />}
        title="Huấn luyện viên"
        onEdit={() => onEdit(EDIT_STEP.coach)}
      >
        <Row label="HLV" value={coach?.name ?? 'Không cần huấn luyện viên'} />
        {coach ? <Row label="Học phí" value={`${formatCurrency(coach.pricePerSession)} / buổi`} /> : null}
      </ReviewCard>

      <ReviewCard
        icon={<CalendarClock className="size-4" aria-hidden />}
        title="Ngày & giờ"
        onEdit={() => onEdit(EDIT_STEP.date)}
      >
        <Row label="Ngày" value={draft.date ? formatDateLong(draft.date) : '—'} />
        <Row label="Giờ" value={draft.time ?? '—'} />
      </ReviewCard>

      <ReviewCard
        icon={<MapPin className="size-4" aria-hidden />}
        title="Khu vực"
        onEdit={() => onEdit(EDIT_STEP.zone)}
      >
        <Row label="Khu vực" value={zone?.name ?? '—'} />
        <Row
          label="Phụ thu"
          value={zone && zone.surcharge > 0 ? `+${formatCurrency(zone.surcharge)}` : 'Không phụ thu'}
        />
      </ReviewCard>

      <ReviewCard
        icon={<Users className="size-4" aria-hidden />}
        title="Số người"
        onEdit={() => onEdit(EDIT_STEP.guests)}
      >
        <Row label="Số khách" value={`${draft.guests} khách`} />
      </ReviewCard>

      <ReviewCard
        icon={<PackagePlus className="size-4" aria-hidden />}
        title="Dịch vụ bổ sung"
        onEdit={() => onEdit(EDIT_STEP.addOns)}
      >
        {addOns.length > 0 ? (
          addOns.map((addOn) => (
            <Row
              key={addOn.id}
              label={`${addOn.name} × ${addOn.quantity}`}
              value={formatCurrency(addOn.unitPrice * addOn.quantity)}
            />
          ))
        ) : (
          <Row label="Dịch vụ" value="Không có" />
        )}
      </ReviewCard>

      <ReviewCard
        icon={<User className="size-4" aria-hidden />}
        title="Thông tin khách hàng"
        onEdit={() => onEdit(EDIT_STEP.contact)}
      >
        <Row label="Họ và tên" value={draft.contact.fullName || '—'} />
        <Row label="Số điện thoại" value={draft.contact.phone || '—'} />
        <Row label="Email" value={draft.contact.email || '—'} />
        {draft.contact.note ? <Row label="Ghi chú" value={draft.contact.note} /> : null}
      </ReviewCard>

      {/* Phương thức thanh toán */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
        <p className="mb-4 flex items-center gap-2 font-medium">
          <CreditCard className="size-4 text-[var(--color-accent)]" aria-hidden />
          Phương thức thanh toán
        </p>
        <fieldset>
          <legend className="sr-only">Chọn phương thức thanh toán</legend>
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

        <div className="mt-4">
          <PaymentDetails
            method={paymentMethod}
            amount={price.total}
            walletApplied={price.walletApplied}
            walletBalance={walletBalance}
            isAuthenticated={isAuthenticated}
          />
        </div>
      </div>

      {/* Tổng tiền — luôn hiển thị cả trên mobile */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--color-muted)]">Giá gốc (tạm tính)</dt>
            <dd className="tabular-nums">{formatCurrency(price.subtotal)}</dd>
          </div>
          {totalDiscount > 0 ? (
            <div className="flex justify-between gap-3 text-[var(--color-accent)]">
              <dt>Giảm giá</dt>
              <dd className="tabular-nums">−{formatCurrency(totalDiscount)}</dd>
            </div>
          ) : null}
          {price.walletApplied > 0 ? (
            <div className="flex justify-between gap-3 text-[var(--color-accent)]">
              <dt>Dùng số dư ví</dt>
              <dd className="tabular-nums">−{formatCurrency(price.walletApplied)}</dd>
            </div>
          ) : null}
        </dl>
        <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-[var(--color-border)] pt-3">
          <span className="font-medium">Tổng thanh toán</span>
          <span className="font-[family-name:var(--font-display)] text-2xl">{formatCurrency(price.total)}</span>
        </div>
      </div>

      <Separator className="my-2" />

      <p className="text-xs leading-relaxed text-[var(--color-muted)]">
        Bằng việc bấm <span className="font-medium text-[var(--color-foreground)]">Xác nhận đặt lịch</span>, bạn
        đồng ý với điều khoản sử dụng và chính sách đổi lịch của Lotus. Đổi lịch miễn phí trước 4 giờ. Đây là
        bản demo — không có giao dịch thật nào được thực hiện.
      </p>
    </div>
  );
}

function ReviewCard({
  icon,
  title,
  onEdit,
  children,
}: {
  icon: ReactNode;
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-medium">
          <span className="text-[var(--color-accent)]">{icon}</span>
          {title}
        </p>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-sm font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-golf-50)]"
        >
          <Pencil className="size-3.5" aria-hidden />
          Chỉnh sửa
        </button>
      </div>
      <dl className="space-y-1.5">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 text-sm">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

/* ============================================================
   Chi tiết theo từng phương thức thanh toán
   ============================================================ */

function PaymentDetails({
  method,
  amount,
  walletApplied,
  walletBalance,
  isAuthenticated,
}: {
  method: PaymentMethod;
  amount: number;
  walletApplied: number;
  walletBalance: number;
  isAuthenticated: boolean;
}) {
  if (method === 'wallet') {
    if (!isAuthenticated) {
      return (
        <PayNote tone="warning" icon={<AlertCircle className="size-4" aria-hidden />}>
          Bạn cần{' '}
          <Link href="/login" className="font-medium underline">
            đăng nhập
          </Link>{' '}
          và có số dư ví Lotus để thanh toán bằng ví. Hoặc chọn phương thức khác.
        </PayNote>
      );
    }
    if (amount > 0) {
      return (
        <PayNote tone="danger" icon={<AlertCircle className="size-4" aria-hidden />}>
          Số dư ví {formatCurrency(walletBalance)} chưa đủ — còn thiếu{' '}
          <span className="font-medium">{formatCurrency(amount)}</span>.{' '}
          <Link href="/dashboard/wallet" className="font-medium underline">
            Nạp thêm vào ví
          </Link>{' '}
          hoặc chọn phương thức khác.
        </PayNote>
      );
    }
    return (
      <PayNote tone="success" icon={<Wallet className="size-4" aria-hidden />}>
        Sẽ trừ <span className="font-medium">{formatCurrency(walletApplied)}</span> từ ví Lotus. Số dư còn
        lại sau thanh toán: <span className="font-medium">{formatCurrency(walletBalance - walletApplied)}</span>
        .
      </PayNote>
    );
  }

  if (method === 'transfer') {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <p className="flex items-center gap-2 text-sm font-medium">
          <Landmark className="size-4 text-[var(--color-accent)]" aria-hidden />
          Thông tin chuyển khoản
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          <InfoRow label="Ngân hàng" value={BANK_TRANSFER_INFO.bankName} />
          <InfoRow label="Số tài khoản" value={BANK_TRANSFER_INFO.accountNumber} mono />
          <InfoRow label="Chủ tài khoản" value={BANK_TRANSFER_INFO.accountName} />
          <InfoRow label="Chi nhánh" value={BANK_TRANSFER_INFO.branch} />
          <InfoRow label="Số tiền" value={formatCurrency(amount)} />
          <InfoRow label="Nội dung CK" value="Mã đặt lịch (hiện sau khi xác nhận)" />
        </dl>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-[var(--color-muted)]">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Sau khi xác nhận, Lotus tạo mã đặt lịch và mã QR chuyển khoản để bạn hoàn tất. Đây là bản demo —
          không có giao dịch thật.
        </p>
      </div>
    );
  }

  if (method === 'card' || method === 'momo' || method === 'vnpay') {
    const gatewayLabel =
      method === 'momo' ? 'Ví MoMo' : method === 'vnpay' ? 'VNPay QR' : 'thẻ ngân hàng (cổng bảo mật)';
    return (
      <PayNote tone="info" icon={<CreditCard className="size-4" aria-hidden />}>
        Khi bấm “Xác nhận đặt lịch”, cổng thanh toán <span className="font-medium">{gatewayLabel}</span> sẽ mở
        để bạn hoàn tất và Lotus xác nhận trạng thái ngay. (Bản demo — không có giao dịch thật.)
      </PayNote>
    );
  }

  // at-center
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <p className="flex items-center gap-2 text-sm font-medium">
        <Store className="size-4 text-[var(--color-accent)]" aria-hidden />
        Thanh toán tại trung tâm
      </p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Giữ chỗ miễn phí. Vui lòng thanh toán{' '}
        <span className="font-medium text-[var(--color-foreground)]">{formatCurrency(amount)}</span> tại quầy
        lễ tân khi check-in.
      </p>
      <dl className="mt-3 space-y-2 text-sm">
        <InfoRow label="Địa chỉ" value={CONTACT.addressLine} />
        <InfoRow label="Hotline" value={CONTACT.hotline} />
        <InfoRow label="Giờ mở cửa" value={CONTACT.openHours} />
      </dl>
    </div>
  );
}

function PayNote({
  tone,
  icon,
  children,
}: {
  tone: 'success' | 'danger' | 'warning' | 'info';
  icon: ReactNode;
  children: ReactNode;
}) {
  const toneClass = {
    success: 'border-[var(--color-golf-200)] bg-[var(--color-golf-50)] text-[var(--color-golf-800)]',
    danger: 'border-[var(--color-danger)] bg-[var(--color-surface)] text-[var(--color-danger)]',
    warning: 'border-[var(--color-champagne-300)] bg-[var(--color-champagne-50)] text-[var(--color-champagne-800)]',
    info: 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]',
  }[tone];

  return (
    <p className={cn('flex items-start gap-2 rounded-[var(--radius-md)] border p-4 text-sm leading-relaxed', toneClass)}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>{children}</span>
    </p>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className={cn('text-right font-medium', mono && 'font-mono')}>{value}</dd>
    </div>
  );
}
