'use client';

import { Calculator, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Field, Select } from '@/components/ui/form-fields';
import { formatCurrency } from '@/lib/format';
import { estimateMembershipSaving } from '@/services/pricingService';
import { MEMBERSHIP_TIERS } from '@/data/memberships';
import type { MembershipTierId } from '@/types';

/** Công cụ ước tính tiết kiệm khi trở thành hội viên. */
export function MembershipCalculator() {
  const [sessions, setSessions] = useState(4);
  const [lessons, setLessons] = useState(2);
  const [fnb, setFnb] = useState(400000);
  const [tierId, setTierId] = useState<MembershipTierId>('member');

  const result = useMemo(
    () =>
      estimateMembershipSaving({
        sessionsPerMonth: sessions,
        avgSessionPrice: 400000,
        lessonsPerMonth: lessons,
        avgLessonPrice: 850000,
        fnbPerMonth: fnb,
        tierId,
      }),
    [sessions, lessons, fnb, tierId],
  );

  const tier = MEMBERSHIP_TIERS.find((item) => item.id === tierId);

  return (
    <div className="grid gap-8 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 md:p-8 lg:grid-cols-2 lg:gap-12">
      <div>
        <Badge variant="accent" size="sm" className="mb-4">
          <Calculator className="size-3.5" aria-hidden />
          Công cụ ước tính
        </Badge>
        <h3 className="text-2xl">Hạng nào hợp với bạn?</h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Nhập thói quen sử dụng hằng tháng để xem mức tiết kiệm ước tính. Đây là con số tham khảo dựa trên giá
          demo.
        </p>

        <div className="mt-6 space-y-5">
          <Field label={`Số buổi tập mỗi tháng: ${sessions} buổi`} htmlFor="calc-sessions">
            <input
              id="calc-sessions"
              type="range"
              min={1}
              max={20}
              value={sessions}
              onChange={(event) => setSessions(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-muted-surface)] accent-[var(--color-accent)]"
            />
          </Field>

          <Field label={`Số buổi học với HLV mỗi tháng: ${lessons} buổi`} htmlFor="calc-lessons">
            <input
              id="calc-lessons"
              type="range"
              min={0}
              max={12}
              value={lessons}
              onChange={(event) => setLessons(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-muted-surface)] accent-[var(--color-accent)]"
            />
          </Field>

          <Field label={`Chi tiêu F&B mỗi tháng: ${formatCurrency(fnb)}`} htmlFor="calc-fnb">
            <input
              id="calc-fnb"
              type="range"
              min={0}
              max={3000000}
              step={100000}
              value={fnb}
              onChange={(event) => setFnb(Number(event.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--color-muted-surface)] accent-[var(--color-accent)]"
            />
          </Field>

          <Field label="Hạng hội viên muốn so sánh" htmlFor="calc-tier">
            <Select
              id="calc-tier"
              value={tierId}
              onChange={(event) => setTierId(event.target.value as MembershipTierId)}
            >
              {MEMBERSHIP_TIERS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="flex flex-col justify-center rounded-[var(--radius-lg)] bg-[var(--color-navy-800)] p-6 text-[var(--color-champagne-50)] md:p-8">
        <p className="text-sm text-[var(--color-navy-200)]">Nếu không phải hội viên, mỗi tháng bạn chi</p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-2xl text-white">
          {formatCurrency(result.monthlySpend)}
        </p>

        <div className="my-6 h-px bg-white/10" />

        <p className="text-sm text-[var(--color-navy-200)]">Với {tier?.name}, bạn tiết kiệm mỗi tháng</p>
        <p className="mt-1 flex items-baseline gap-2 font-[family-name:var(--font-display)] text-4xl text-[var(--color-champagne-300)]">
          {formatCurrency(result.monthlySaving)}
        </p>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--color-navy-200)]">Tiết kiệm mỗi năm</dt>
            <dd className="font-medium text-white">{formatCurrency(result.yearlySaving)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--color-navy-200)]">Bonus nhận ngay khi nạp</dt>
            <dd className="font-medium text-white">{formatCurrency(result.bonusValue)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
            <dt className="text-[var(--color-navy-200)]">Tổng lợi ích năm đầu</dt>
            <dd className="font-medium text-[var(--color-champagne-300)]">
              {formatCurrency(result.yearlySaving + result.bonusValue)}
            </dd>
          </div>
        </dl>

        <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-[var(--color-navy-200)]">
          <TrendingUp className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          Ước tính dựa trên giá demo: 400.000đ/buổi tập, 850.000đ/buổi học với huấn luyện viên. Con số thực tế
          thay đổi theo khung giờ và dịch vụ bạn chọn.
        </p>
      </div>
    </div>
  );
}
