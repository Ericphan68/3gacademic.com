'use client';

import { AlertCircle, ArrowRight, Check, Crown, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { validateVoucher } from '@/services/pricingService';
import type { MembershipTierId, OwnedVoucher } from '@/types';

/* ============================================================
   Voucher và ưu đãi hội viên
   ============================================================ */

export function StepVoucher({
  voucherCode,
  subtotal,
  membershipTier,
  membershipName,
  membershipDiscount,
  ownedVouchers,
  onVoucherChange,
}: {
  voucherCode: string | null;
  subtotal: number;
  membershipTier: MembershipTierId | null;
  membershipName: string | null;
  membershipDiscount: number;
  ownedVouchers: OwnedVoucher[];
  onVoucherChange: (code: string | null) => void;
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
