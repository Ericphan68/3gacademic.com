import { ArrowRight, Check, Crown, Minus } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MEMBERSHIP_TIERS } from '@/data/memberships';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

const COMPARE_ROWS = [
  { label: 'Bonus khi nạp ví', key: 'bonusPercent', suffix: '%' },
  { label: 'Ưu đãi giá sân', key: 'courtDiscountPercent', suffix: '%' },
  { label: 'Ưu đãi huấn luyện viên', key: 'coachDiscountPercent', suffix: '%' },
  { label: 'Đặt lịch trước', key: 'advanceBookingDays', suffix: ' ngày' },
] as const;

export function MembershipPreview() {
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Hội viên & Top-up"
        title="Bốn hạng, một nguyên tắc: chơi càng đều, ưu đãi càng nhiều"
        description="Số dư Top-up dùng được cho toàn bộ dịch vụ tại Lotus — giờ tập, buổi học, F&B, sự kiện và voucher."
        action={
          <Button asChild variant="outline">
            <Link href="/membership">
              So sánh chi tiết
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {MEMBERSHIP_TIERS.map((tier, index) => {
          const isFounder = tier.id === 'founder';
          return (
            <Reveal key={tier.id} delay={Math.min(index * 0.06, 0.24)}>
              <div
                className={cn(
                  'flex h-full flex-col rounded-[var(--radius-lg)] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]',
                  isFounder
                    ? 'border-[var(--color-champagne-300)] bg-[var(--color-navy-800)] text-[var(--color-champagne-50)]'
                    : 'border-[var(--color-border)] bg-[var(--color-surface-raised)]',
                )}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3
                      className={cn(
                        'font-[family-name:var(--font-display)] text-xl',
                        isFounder && 'text-white',
                      )}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className={cn(
                        'mt-1 text-xs',
                        isFounder ? 'text-[var(--color-navy-200)]' : 'text-[var(--color-muted)]',
                      )}
                    >
                      {tier.tagline}
                    </p>
                  </div>
                  {tier.highlight ? (
                    <Badge variant={isFounder ? 'gold' : 'accent'} size="sm">
                      {isFounder ? <Crown className="size-3" aria-hidden /> : null}
                      {tier.highlight}
                    </Badge>
                  ) : null}
                </div>

                <div className="mb-5">
                  <p
                    className={cn(
                      'text-xs',
                      isFounder ? 'text-[var(--color-navy-200)]' : 'text-[var(--color-muted)]',
                    )}
                  >
                    Mức Top-up
                  </p>
                  <p className={cn('font-[family-name:var(--font-display)] text-2xl', isFounder && 'text-white')}>
                    {formatCurrency(tier.topUpAmount, { compact: true })}
                  </p>
                  <p
                    className={cn(
                      'mt-1 text-sm font-medium',
                      isFounder ? 'text-[var(--color-champagne-300)]' : 'text-[var(--color-accent)]',
                    )}
                  >
                    Tặng thêm {formatCurrency((tier.topUpAmount * tier.bonusPercent) / 100, { compact: true })}
                  </p>
                </div>

                <ul className="mb-6 space-y-2.5 text-sm">
                  {tier.benefits.slice(0, 5).map((benefit) => (
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
                      <span
                        className={cn(
                          !benefit.included && 'text-[var(--color-stone-400)]',
                          isFounder && benefit.included && 'text-[var(--color-navy-100)]',
                        )}
                      >
                        {benefit.label}: <strong className="font-medium">{benefit.value}</strong>
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  variant={isFounder ? 'gold' : 'outline'}
                  size="md"
                  block
                  className="mt-auto"
                >
                  <Link href={{ pathname: '/membership', query: { tier: tier.id } }}>Xem quyền lợi</Link>
                </Button>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Bảng so sánh nhanh */}
      <div className="mt-10 overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
        <table className="w-full min-w-[40rem] text-sm">
          <caption className="sr-only">So sánh nhanh bốn hạng hội viên Lotus</caption>
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th scope="col" className="p-4 text-left font-medium text-[var(--color-muted)]">
                Quyền lợi
              </th>
              {MEMBERSHIP_TIERS.map((tier) => (
                <th key={tier.id} scope="col" className="p-4 text-center font-medium">
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COMPARE_ROWS.map((row) => (
              <tr key={row.key} className="border-b border-[var(--color-border)] last:border-0">
                <th scope="row" className="p-4 text-left font-normal text-[var(--color-muted)]">
                  {row.label}
                </th>
                {MEMBERSHIP_TIERS.map((tier) => (
                  <td key={tier.id} className="p-4 text-center font-medium tabular-nums">
                    {tier[row.key]}
                    {row.suffix}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
