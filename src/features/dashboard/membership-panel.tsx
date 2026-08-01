'use client';

import { ArrowRight, Check, Crown, Minus, Sparkles } from 'lucide-react';
import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar, SpecList } from '@/components/ui/misc';
import { EmptyState } from '@/components/ui/states';
import { MEMBERSHIP_BY_ID, MEMBERSHIP_ORDER, MEMBERSHIP_TIERS } from '@/data/memberships';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDate, formatRelative } from '@/lib/format';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';

export function MembershipPanel() {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const membership = useAccountStore((state) => state.membership);
  const transactions = useAccountStore((state) => state.transactions);

  if (!hydrated || !user) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const tier = user.membershipTier ? MEMBERSHIP_BY_ID[user.membershipTier] : null;
  const currentIndex = user.membershipTier ? MEMBERSHIP_ORDER.indexOf(user.membershipTier) : -1;
  const nextTier = currentIndex >= 0 && currentIndex < MEMBERSHIP_ORDER.length - 1
    ? MEMBERSHIP_BY_ID[MEMBERSHIP_ORDER[currentIndex + 1]]
    : null;

  /* Tiến độ lên hạng tính theo tổng chi tiêu tích luỹ trong ví. */
  const totalSpent = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const upgradeTarget = nextTier?.topUpAmount ?? 0;
  const upgradeProgress = upgradeTarget > 0 ? Math.min(100, (totalSpent / upgradeTarget) * 100) : 100;

  if (!tier) {
    return (
      <div>
        <PortalHeader
          title="Hội viên"
          description="Bạn chưa đăng ký hạng hội viên nào."
        />
        <EmptyState
          title="Chưa có hạng hội viên"
          description="Hội viên Lotus được giảm tới 25% giá sân, 20% học phí huấn luyện viên và nhận bonus khi nạp ví."
          icon={Crown}
          action={
            <Button asChild variant="accent">
              <Link href="/membership">
                Xem các hạng hội viên
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PortalHeader
        title="Hội viên"
        description="Quyền lợi, thời hạn và tiến độ lên hạng của bạn."
        action={
          nextTier ? (
            <Button asChild variant="accent">
              <Link href="/membership">
                Nâng lên {nextTier.name}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          ) : undefined
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          {/* Thẻ hội viên */}
          <div className="overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-navy-800)] p-6 text-[var(--color-champagne-50)] md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-widest text-[var(--color-navy-200)] uppercase">
                  Thẻ hội viên Lotus
                </p>
                <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white">{tier.name}</p>
                <p className="mt-1 text-sm text-[var(--color-navy-100)]">{tier.tagline}</p>
              </div>
              <Crown className="size-8 shrink-0 text-[var(--color-champagne-300)]" aria-hidden />
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-xs text-[var(--color-navy-200)]">Chủ thẻ</dt>
                <dd className="mt-1 truncate font-medium text-white">{user.fullName}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-navy-200)]">Ưu đãi sân</dt>
                <dd className="mt-1 font-medium text-white">{tier.courtDiscountPercent}%</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-navy-200)]">Bonus nạp ví</dt>
                <dd className="mt-1 font-medium text-[var(--color-champagne-300)]">+{tier.bonusPercent}%</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-navy-200)]">Hiệu lực đến</dt>
                <dd className="mt-1 font-medium text-white">
                  {user.membershipExpiresAt ? formatDate(user.membershipExpiresAt) : '—'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Quyền lợi */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <h2 className="mb-4 text-lg">Quyền lợi của bạn</h2>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {tier.benefits.map((benefit) => (
                <li key={benefit.label} className="flex items-start gap-2.5 text-sm">
                  {benefit.included ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                  ) : (
                    <Minus className="mt-0.5 size-4 shrink-0 text-[var(--color-stone-400)]" aria-hidden />
                  )}
                  <span className={benefit.included ? '' : 'text-[var(--color-stone-400)]'}>
                    <span className="text-[var(--color-muted)]">{benefit.label}: </span>
                    <span className="font-medium">{benefit.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Chi tiết gói đã mua */}
          {membership ? (
            <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
              <h2 className="mb-4 text-lg">Thông tin gói đã kích hoạt</h2>
              <SpecList
                items={[
                  { label: 'Hạng hội viên', value: MEMBERSHIP_BY_ID[membership.tierId].name },
                  { label: 'Ngày kích hoạt', value: formatDate(membership.purchasedAt) },
                  { label: 'Hết hạn', value: `${formatDate(membership.expiresAt)} (${formatRelative(membership.expiresAt)})` },
                  { label: 'Mức nạp', value: formatCurrency(membership.topUpAmount) },
                  {
                    label: 'Bonus đã nhận',
                    value: <span className="text-[var(--color-accent)]">+{formatCurrency(membership.bonusAmount)}</span>,
                  },
                  { label: 'Chính sách huỷ', value: MEMBERSHIP_BY_ID[membership.tierId].cancellationPolicy },
                ]}
              />
            </section>
          ) : null}
        </div>

        <div className="space-y-6">
          {/* Tiến độ lên hạng */}
          {nextTier ? (
            <section className="rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="size-4 text-[var(--color-gold)]" aria-hidden />
                <h2 className="text-lg">Tiến độ lên {nextTier.name}</h2>
              </div>

              <ProgressBar
                value={upgradeProgress}
                tone="gold"
                label={`Tiến độ lên hạng ${nextTier.name}`}
              />

              <p className="mt-3 text-sm text-[var(--color-champagne-800)]">
                Bạn đã chi tiêu {formatCurrency(totalSpent, { compact: true })} tại Lotus. Nâng lên{' '}
                {nextTier.name} để nhận bonus +{nextTier.bonusPercent}% và ưu đãi giá sân{' '}
                {nextTier.courtDiscountPercent}%.
              </p>

              <Button asChild variant="primary" block className="mt-5">
                <Link href="/membership">
                  Nâng hạng ngay
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </section>
          ) : (
            <section className="rounded-[var(--radius-lg)] border border-[var(--color-champagne-300)] bg-[var(--color-champagne-50)] p-6 text-center">
              <Crown className="mx-auto mb-3 size-8 text-[var(--color-gold)]" aria-hidden />
              <h2 className="text-lg">Bạn đang ở hạng cao nhất</h2>
              <p className="mt-2 text-sm text-[var(--color-champagne-800)]">
                Founder Membership là hạng cao nhất tại Lotus. Cảm ơn bạn đã đồng hành từ giai đoạn đầu.
              </p>
            </section>
          )}

          {/* So sánh nhanh các hạng */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <h2 className="mb-4 text-lg">Các hạng khác</h2>
            <ul className="space-y-3">
              {MEMBERSHIP_TIERS.map((item) => {
                const isCurrent = item.id === tier.id;
                return (
                  <li
                    key={item.id}
                    className={`rounded-[var(--radius-md)] border p-4 ${
                      isCurrent
                        ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{item.name}</p>
                      {isCurrent ? (
                        <Badge variant="success" size="sm">
                          Hạng hiện tại
                        </Badge>
                      ) : null}
                    </div>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">
                      Nạp {formatCurrency(item.topUpAmount, { compact: true })} · Bonus +{item.bonusPercent}% ·
                      Ưu đãi sân {item.courtDiscountPercent}%
                    </p>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
