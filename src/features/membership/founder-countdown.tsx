'use client';

import { differenceInSeconds, parseISO } from 'date-fns';
import { Crown, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/misc';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency } from '@/lib/format';
import type { MembershipTier } from '@/types';

/** Khối Founder Membership: đếm ngược và số suất còn lại. */
export function FounderCountdown({ tier }: { tier: MembershipTier }) {
  const hydrated = useHydrated();
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!tier.limited) return;
    const end = parseISO(tier.limited.endsAt);

    const tick = () => setRemaining(Math.max(0, differenceInSeconds(end, new Date())));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tier.limited]);

  if (!tier.limited) return null;

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  const sold = tier.limited.total - tier.limited.remaining;

  const units = [
    { value: days, label: 'ngày' },
    { value: hours, label: 'giờ' },
    { value: minutes, label: 'phút' },
    { value: seconds, label: 'giây' },
  ];

  return (
    <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-champagne-300)] bg-[var(--color-navy-800)] p-6 text-[var(--color-champagne-50)] md:p-10">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-14">
        <div>
          <Badge variant="gold" size="md" className="mb-4">
            <Crown className="size-3.5" aria-hidden />
            Giới hạn {tier.limited.total} suất
          </Badge>

          <h2 className="text-3xl text-white md:text-4xl">Founder Membership</h2>
          <p className="mt-3 leading-relaxed text-[var(--color-navy-100)]">
            Hạng cao nhất trong giai đoạn khai trương: bonus {tier.bonusPercent}% khi nạp ví, ưu đãi{' '}
            {tier.courtDiscountPercent}% giá sân, quyền giữ chỗ khung giờ cố định hằng tuần và concierge riêng.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-[var(--color-navy-100)]">
            <li>
              • Bonus nạp ví: <span className="font-medium text-white">+{tier.bonusPercent}%</span> — tương
              đương {formatCurrency((tier.topUpAmount * tier.bonusPercent) / 100, { compact: true })}
            </li>
            <li>
              • Đặt lịch trước: <span className="font-medium text-white">{tier.advanceBookingDays} ngày</span>
            </li>
            <li>
              • Quà sinh nhật: <span className="font-medium text-white">{tier.birthdayGift}</span>
            </li>
            <li>
              • Thời hạn: <span className="font-medium text-white">{tier.validityMonths} tháng</span>
            </li>
          </ul>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-6">
          <p className="flex items-center gap-2 text-sm text-[var(--color-champagne-300)]">
            <Timer className="size-4" aria-hidden />
            Ưu đãi khai trương kết thúc sau
          </p>

          <div className="mt-4 grid grid-cols-4 gap-2" aria-live="off">
            {units.map((unit) => (
              <div key={unit.label} className="rounded-[var(--radius-md)] bg-[var(--color-navy-900)] p-3 text-center">
                <p className="font-[family-name:var(--font-display)] text-2xl text-white tabular-nums">
                  {hydrated ? String(unit.value).padStart(2, '0') : '--'}
                </p>
                <p className="mt-0.5 text-[10px] tracking-widest text-[var(--color-navy-200)] uppercase">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-[var(--color-navy-200)]">Đã có người đăng ký</span>
              <span className="font-medium text-white">
                {sold}/{tier.limited.total} suất
              </span>
            </div>
            <ProgressBar
              value={sold}
              max={tier.limited.total}
              tone="gold"
              label={`Đã bán ${sold} trên ${tier.limited.total} suất Founder Membership`}
            />
            <p className="mt-2 text-sm text-[var(--color-champagne-300)]">
              Còn lại {tier.limited.remaining} suất
            </p>
          </div>

          <p className="mt-5 text-xs leading-relaxed text-[var(--color-navy-200)]">
            Số liệu hiển thị là dữ liệu demo dùng để trình diễn giao diện.
          </p>
        </div>
      </div>
    </div>
  );
}
