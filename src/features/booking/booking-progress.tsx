'use client';

import { Check } from 'lucide-react';

import { BOOKING_STEPS, TOTAL_BOOKING_STEPS } from '@/store/useBookingStore';

import { ProgressBar } from '@/components/ui/misc';
import { cn } from '@/lib/utils';

export function BookingProgress({
  current,
  onSelect,
}: {
  current: number;
  onSelect: (step: number) => void;
}) {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-surface-raised)]">
      <div className="container-lotus py-4">
        {/* Mobile: thanh tiến trình gọn */}
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

        {/* Desktop: danh sách bước */}
        <ol className="hidden items-center gap-1 md:flex" aria-label="Các bước đặt lịch">
          {BOOKING_STEPS.map((step) => {
            const done = step.id < current;
            const active = step.id === current;
            const reachable = step.id < current;

            return (
              <li key={step.id} className="flex flex-1 items-center gap-1">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => reachable && onSelect(step.id)}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'flex flex-1 flex-col items-start gap-1.5 rounded-[var(--radius-sm)] px-1 py-1.5 text-left transition-colors',
                    reachable && 'cursor-pointer hover:bg-[var(--color-muted-surface)]',
                    !reachable && 'cursor-default',
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold transition-colors',
                        done && 'bg-[var(--color-accent)] text-white',
                        active && 'bg-[var(--color-navy-700)] text-white',
                        !done && !active && 'bg-[var(--color-muted-surface)] text-[var(--color-muted)]',
                      )}
                    >
                      {done ? <Check className="size-3" strokeWidth={3} aria-hidden /> : step.id}
                    </span>
                    <span
                      className={cn(
                        'hidden text-[11px] font-medium whitespace-nowrap lg:inline',
                        active ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted)]',
                      )}
                    >
                      {step.label}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'h-0.5 w-full rounded-full transition-colors',
                      done || active ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-border)]',
                    )}
                    aria-hidden
                  />
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
