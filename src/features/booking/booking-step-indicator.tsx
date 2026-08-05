'use client';

import { Check } from 'lucide-react';

import { ProgressBar } from '@/components/ui/misc';
import { cn } from '@/lib/utils';
import { BOOKING_STEPS, TOTAL_BOOKING_STEPS } from '@/store/useBookingStore';

/**
 * Thanh tiến trình 3 bước: Chọn lịch · Thông tin · Xác nhận.
 * - Desktop: 3 mốc có nhãn, bước đã qua bấm được để quay lại.
 * - Mobile: nhãn gọn + thanh phần trăm.
 */
export function BookingStepIndicator({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (step: number) => void;
}) {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
      <div className="container-lotus py-4">
        {/* Mobile */}
        <div className="md:hidden">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">
              Bước {current}/{TOTAL_BOOKING_STEPS} · {BOOKING_STEPS[current - 1]?.label}
            </span>
            <span className="text-[var(--color-muted)]">
              {Math.round((current / TOTAL_BOOKING_STEPS) * 100)}%
            </span>
          </div>
          <ProgressBar
            value={current}
            max={TOTAL_BOOKING_STEPS}
            label={`Tiến trình đặt lịch: bước ${current} trên ${TOTAL_BOOKING_STEPS}`}
          />
        </div>

        {/* Desktop */}
        <ol className="hidden items-center md:flex" aria-label="Các bước đặt lịch">
          {BOOKING_STEPS.map((step, index) => {
            const done = step.id < current;
            const active = step.id === current;
            const reachable = step.id < current;
            const isLast = index === BOOKING_STEPS.length - 1;

            return (
              <li key={step.id} className={cn('flex items-center', !isLast && 'flex-1')}>
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => reachable && onSelect(step.id)}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-[var(--radius-md)] px-2 py-2 transition-colors',
                    reachable && 'cursor-pointer hover:bg-[var(--color-muted-surface)]',
                    !reachable && 'cursor-default',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      done && 'bg-[var(--color-accent)] text-white',
                      active && 'bg-[var(--color-navy-700)] text-white',
                      !done && !active && 'bg-[var(--color-muted-surface)] text-[var(--color-muted)]',
                    )}
                  >
                    {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : step.id}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-medium whitespace-nowrap',
                      active ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted)]',
                    )}
                  >
                    {step.label}
                  </span>
                </button>

                {!isLast ? (
                  <span
                    className={cn(
                      'mx-2 h-0.5 flex-1 rounded-full transition-colors',
                      done ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]',
                    )}
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
