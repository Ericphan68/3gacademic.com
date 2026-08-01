'use client';

import { CalendarDays, Clock, MapPin, Sparkles, Tag, User, Wallet } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/misc';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/format';
import { bookingOptionService, coachService, membershipService } from '@/services/catalogService';
import { resolveAddOns } from '@/services/pricingService';
import type { BookingDraft, BookingPriceBreakdown, MembershipTierId } from '@/types';

export function BookingSummary({
  draft,
  price,
  membershipTier,
  walletBalance,
}: {
  draft: BookingDraft;
  price: BookingPriceBreakdown;
  membershipTier: MembershipTierId | null;
  walletBalance: number;
}) {
  const experience = draft.experienceType
    ? bookingOptionService.getExperienceType(draft.experienceType)
    : undefined;
  const zone = draft.zoneId ? bookingOptionService.getZone(draft.zoneId) : undefined;
  const coach = draft.coachId ? coachService.getById(draft.coachId) : undefined;
  const tier = membershipTier ? membershipService.getById(membershipTier) : undefined;
  const addOns = resolveAddOns(draft.addOns);

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-subtle)]">
        <h2 className="text-lg">Tóm tắt đặt lịch</h2>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex gap-3">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div>
              <dt className="text-xs text-[var(--color-muted)]">Trải nghiệm</dt>
              <dd className="font-medium">{experience?.name ?? 'Chưa chọn'}</dd>
              {experience ? (
                <dd className="text-xs text-[var(--color-muted)]">
                  {formatDuration(experience.durationMinutes)}
                </dd>
              ) : null}
            </div>
          </div>

          <div className="flex gap-3">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div>
              <dt className="text-xs text-[var(--color-muted)]">Ngày</dt>
              <dd className="font-medium">{draft.date ? formatDateLong(draft.date) : 'Chưa chọn'}</dd>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div>
              <dt className="text-xs text-[var(--color-muted)]">Giờ</dt>
              <dd className="font-medium">{draft.time ?? 'Chưa chọn'}</dd>
            </div>
          </div>

          <div className="flex gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div>
              <dt className="text-xs text-[var(--color-muted)]">Khu vực</dt>
              <dd className="font-medium">{zone?.name ?? 'Chưa chọn'}</dd>
            </div>
          </div>

          <div className="flex gap-3">
            <User className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div>
              <dt className="text-xs text-[var(--color-muted)]">Huấn luyện viên</dt>
              <dd className="font-medium">{coach?.name ?? 'Không cần huấn luyện viên'}</dd>
            </div>
          </div>

          <div className="flex gap-3">
            <User className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div>
              <dt className="text-xs text-[var(--color-muted)]">Số khách</dt>
              <dd className="font-medium">{draft.guests} khách</dd>
            </div>
          </div>
        </dl>

        {addOns.length > 0 ? (
          <>
            <Separator className="my-5" />
            <p className="mb-2.5 text-xs font-medium text-[var(--color-muted)]">Dịch vụ bổ sung</p>
            <ul className="space-y-1.5 text-sm">
              {addOns.map((addOn) => (
                <li key={addOn.id} className="flex justify-between gap-3">
                  <span className="text-[var(--color-muted)]">
                    {addOn.name} × {addOn.quantity}
                  </span>
                  <span className="tabular-nums">{formatCurrency(addOn.unitPrice * addOn.quantity)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        <Separator className="my-5" />

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--color-muted)]">Giá trải nghiệm</dt>
            <dd className="tabular-nums">{formatCurrency(price.base)}</dd>
          </div>
          {price.zoneSurcharge > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--color-muted)]">Phụ thu khu vực</dt>
              <dd className="tabular-nums">{formatCurrency(price.zoneSurcharge)}</dd>
            </div>
          ) : null}
          {price.coachFee > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--color-muted)]">Phí huấn luyện viên</dt>
              <dd className="tabular-nums">{formatCurrency(price.coachFee)}</dd>
            </div>
          ) : null}
          {price.addOns > 0 ? (
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--color-muted)]">Dịch vụ bổ sung</dt>
              <dd className="tabular-nums">{formatCurrency(price.addOns)}</dd>
            </div>
          ) : null}

          <div className="flex justify-between gap-3 border-t border-[var(--color-border)] pt-2">
            <dt className="font-medium">Tạm tính</dt>
            <dd className="font-medium tabular-nums">{formatCurrency(price.subtotal)}</dd>
          </div>

          {price.membershipDiscount > 0 ? (
            <div className="flex justify-between gap-3 text-[var(--color-accent)]">
              <dt className="inline-flex items-center gap-1.5">
                <Tag className="size-3.5" aria-hidden />
                Ưu đãi {tier?.name}
              </dt>
              <dd className="tabular-nums">−{formatCurrency(price.membershipDiscount)}</dd>
            </div>
          ) : null}

          {price.voucherDiscount > 0 ? (
            <div className="flex justify-between gap-3 text-[var(--color-accent)]">
              <dt className="inline-flex items-center gap-1.5">
                <Tag className="size-3.5" aria-hidden />
                Voucher {draft.voucherCode}
              </dt>
              <dd className="tabular-nums">−{formatCurrency(price.voucherDiscount)}</dd>
            </div>
          ) : null}

          {price.walletApplied > 0 ? (
            <div className="flex justify-between gap-3 text-[var(--color-accent)]">
              <dt className="inline-flex items-center gap-1.5">
                <Wallet className="size-3.5" aria-hidden />
                Dùng số dư ví
              </dt>
              <dd className="tabular-nums">−{formatCurrency(price.walletApplied)}</dd>
            </div>
          ) : null}
        </dl>

        <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          <span className="font-medium">Cần thanh toán</span>
          <span className="font-[family-name:var(--font-display)] text-2xl">
            {formatCurrency(price.total)}
          </span>
        </div>

        {tier ? (
          <Badge variant="accent" size="sm" className="mt-4">
            Đang áp dụng quyền lợi {tier.name}
          </Badge>
        ) : (
          <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted)]">
            Trở thành hội viên để được giảm tới 25% giá sân và nhận bonus khi nạp ví.
          </p>
        )}

        {walletBalance > 0 ? (
          <p className="mt-2 text-xs text-[var(--color-muted)]">
            Số dư ví hiện có: {formatCurrency(walletBalance)}
          </p>
        ) : null}
      </div>
    </aside>
  );
}
