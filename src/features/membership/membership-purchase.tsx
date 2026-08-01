'use client';

import { addMonths } from 'date-fns';
import { Check, Crown, Minus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays';
import { SpecList } from '@/components/ui/misc';
import { BLUR_DATA_URL } from '@/constants/media';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { MembershipTier } from '@/types';

/** Thẻ giá hội viên kèm luồng mua demo. */
export function MembershipPricing({ tiers }: { tiers: MembershipTier[] }) {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const setMembershipOnUser = useAuthStore((state) => state.setMembership);
  const setWalletBalance = useAuthStore((state) => state.setWalletBalance);
  const setMembershipRecord = useAccountStore((state) => state.setMembership);
  const addTransaction = useAccountStore((state) => state.addTransaction);

  const [selected, setSelected] = useState<MembershipTier | null>(null);
  const [processing, setProcessing] = useState(false);

  const currentTier = hydrated ? user?.membershipTier : null;

  const confirm = async () => {
    if (!selected) return;

    if (!user) {
      toast.error('Bạn cần đăng nhập', {
        description: 'Đăng nhập bằng tài khoản demo để lưu trạng thái hội viên vào tài khoản.',
      });
      setSelected(null);
      return;
    }

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const bonus = Math.round((selected.topUpAmount * selected.bonusPercent) / 100);
    const credited = selected.topUpAmount + bonus;
    const nextBalance = user.walletBalance + credited;
    const expiresAt = addMonths(new Date(), selected.validityMonths).toISOString();

    setMembershipOnUser(selected.id, expiresAt);
    setMembershipRecord({
      tierId: selected.id,
      purchasedAt: new Date().toISOString(),
      expiresAt,
      topUpAmount: selected.topUpAmount,
      bonusAmount: bonus,
    });

    addTransaction({
      type: 'top-up',
      label: `Kích hoạt ${selected.name}`,
      amount: selected.topUpAmount,
      balanceAfter: user.walletBalance + selected.topUpAmount,
    });
    addTransaction({
      type: 'bonus',
      label: `Bonus hội viên ${selected.name} (+${selected.bonusPercent}%)`,
      amount: bonus,
      balanceAfter: nextBalance,
    });
    setWalletBalance(nextBalance);

    setProcessing(false);
    setSelected(null);

    toast.success(`Đã kích hoạt ${selected.name}`, {
      description: `Ví Lotus được cộng ${formatCurrency(credited)} (đã gồm bonus ${formatCurrency(bonus)}).`,
    });
  };

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier) => {
          const isFounder = tier.id === 'founder';
          const isCurrent = currentTier === tier.id;

          return (
            <article
              key={tier.id}
              className={cn(
                'flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border transition-all duration-300',
                isFounder
                  ? 'border-[var(--color-champagne-300)] bg-[var(--color-navy-800)] text-[var(--color-champagne-50)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]',
                isCurrent && !isFounder && 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]',
              )}
            >
              <div className="relative aspect-[16/7] overflow-hidden bg-[var(--color-muted-surface)]">
                <Image
                  src={tier.image}
                  alt={`Hạng hội viên ${tier.name}`}
                  fill
                  sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 92vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
                <div
                  className={cn(
                    'absolute inset-0',
                    isFounder
                      ? 'bg-gradient-to-t from-[var(--color-navy-800)] via-[var(--color-navy-800)]/45 to-transparent'
                      : 'bg-gradient-to-t from-[var(--color-surface-raised)] via-[var(--color-surface-raised)]/35 to-transparent',
                  )}
                  aria-hidden
                />
              </div>

              <div className="flex flex-1 flex-col p-6 pt-4">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className={cn('font-[family-name:var(--font-display)] text-xl', isFounder && 'text-white')}>
                    {tier.name}
                  </h3>
                  <p className={cn('mt-1 text-sm', isFounder ? 'text-[var(--color-navy-100)]' : 'text-[var(--color-muted)]')}>
                    {tier.tagline}
                  </p>
                </div>
                {isFounder ? <Crown className="size-5 shrink-0 text-[var(--color-champagne-300)]" aria-hidden /> : null}
              </div>

              {tier.highlight ? (
                <Badge variant={isFounder ? 'gold' : 'accent'} size="sm" className="mb-4 self-start">
                  {tier.highlight}
                </Badge>
              ) : null}
              {isCurrent ? (
                <Badge variant="success" size="sm" className="mb-4 self-start">
                  Hạng hiện tại của bạn
                </Badge>
              ) : null}

              <div className="mb-5">
                <p className={cn('text-xs', isFounder ? 'text-[var(--color-navy-200)]' : 'text-[var(--color-muted)]')}>
                  Mức nạp ví
                </p>
                <p className="font-[family-name:var(--font-display)] text-3xl">
                  {formatCurrency(tier.topUpAmount, { compact: true })}
                </p>
                <p className={cn('mt-1 text-sm', isFounder ? 'text-[var(--color-champagne-300)]' : 'text-[var(--color-accent)]')}>
                  Nhận thêm {formatCurrency((tier.topUpAmount * tier.bonusPercent) / 100, { compact: true })} bonus
                  (+{tier.bonusPercent}%)
                </p>
              </div>

              <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                {tier.benefits.map((benefit) => (
                  <li key={benefit.label} className="flex items-start gap-2.5">
                    {benefit.included ? (
                      <Check
                        className={cn(
                          'mt-0.5 size-4 shrink-0',
                          isFounder ? 'text-[var(--color-champagne-300)]' : 'text-[var(--color-accent)]',
                        )}
                        aria-hidden
                      />
                    ) : (
                      <Minus className="mt-0.5 size-4 shrink-0 text-[var(--color-stone-400)]" aria-hidden />
                    )}
                    <span className={cn(!benefit.included && 'text-[var(--color-stone-400)]')}>
                      <span className={cn(isFounder ? 'text-[var(--color-navy-100)]' : 'text-[var(--color-muted)]')}>
                        {benefit.label}:{' '}
                      </span>
                      <span className={cn('font-medium', isFounder && benefit.included && 'text-white')}>
                        {benefit.value}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={isFounder ? 'gold' : isCurrent ? 'outline' : 'accent'}
                block
                disabled={isCurrent}
                onClick={() => setSelected(tier)}
              >
                {isCurrent ? 'Đang sử dụng' : `Chọn ${tier.name}`}
              </Button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal xác nhận */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>Xác nhận đăng ký {selected.name}</DialogTitle>
                <DialogDescription>
                  Đây là luồng demo — không có giao dịch thật. Số dư và trạng thái hội viên sẽ được cập nhật
                  ngay trong tài khoản của bạn.
                </DialogDescription>
              </DialogHeader>

              <SpecList
                items={[
                  { label: 'Hạng hội viên', value: selected.name },
                  { label: 'Mức nạp ví', value: formatCurrency(selected.topUpAmount) },
                  {
                    label: `Bonus (+${selected.bonusPercent}%)`,
                    value: (
                      <span className="text-[var(--color-accent)]">
                        +{formatCurrency((selected.topUpAmount * selected.bonusPercent) / 100)}
                      </span>
                    ),
                  },
                  {
                    label: 'Tổng vào ví',
                    value: formatCurrency(
                      selected.topUpAmount + (selected.topUpAmount * selected.bonusPercent) / 100,
                    ),
                  },
                  { label: 'Ưu đãi giá sân', value: `${selected.courtDiscountPercent}%` },
                  { label: 'Ưu đãi huấn luyện viên', value: `${selected.coachDiscountPercent}%` },
                  { label: 'Thời hạn', value: `${selected.validityMonths} tháng` },
                  {
                    label: 'Hiệu lực đến',
                    value: formatDate(addMonths(new Date(), selected.validityMonths)),
                  },
                ]}
              />

              <p className="mt-4 flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-4 text-sm text-[var(--color-golf-800)]">
                <Sparkles className="mt-0.5 size-4 shrink-0" aria-hidden />
                Sau khi kích hoạt, mọi lần đặt lịch sẽ tự động áp dụng ưu đãi hạng hội viên này.
              </p>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setSelected(null)}>
                  Để sau
                </Button>
                <Button variant="accent" loading={processing} onClick={confirm}>
                  Xác nhận đăng ký
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
