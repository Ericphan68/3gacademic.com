'use client';

import { addMonths, format, isSameMonth, parseISO, startOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Flame, Info, Tag } from 'lucide-react';
import { useMemo, useState } from 'react';

import { getIcon } from '@/components/common/icon-registry';
import { Badge } from '@/components/ui/badge';
import { buildCalendarGrid, dateKey, getDayMeta, getTimeSlots, isPastDate } from '@/lib/availability';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/format';
import { cn } from '@/lib/utils';
import { bookingOptionService } from '@/services/catalogService';
import type { BookingExperienceType, SlotPricing, ZoneId } from '@/types';

/* ============================================================
   Bước 1 — Chọn trải nghiệm
   ============================================================ */

export function StepExperience({
  value,
  onChange,
}: {
  value: BookingExperienceType | null;
  onChange: (type: BookingExperienceType, suggestedZone: ZoneId) => void;
}) {
  const options = bookingOptionService.getExperienceTypes();

  return (
    <fieldset>
      <legend className="sr-only">Chọn loại trải nghiệm</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {options.map((option) => {
          const Icon = getIcon(option.icon);
          const active = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id, option.suggestedZone)}
              aria-pressed={active}
              className={cn(
                'flex cursor-pointer flex-col rounded-[var(--radius-lg)] border p-5 text-left transition-all duration-200',
                active
                  ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)] shadow-[var(--shadow-subtle)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]',
              )}
            >
              <span
                className={cn(
                  'mb-3 flex size-11 items-center justify-center rounded-full transition-colors',
                  active
                    ? 'bg-[var(--color-accent)] text-white'
                    : 'bg-[var(--color-muted-surface)] text-[var(--color-accent)]',
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="text-base font-medium">{option.name}</span>
              <span className="mt-1.5 flex-1 text-sm text-[var(--color-muted)]">{option.description}</span>
              <span className="mt-4 flex items-center justify-between gap-3 text-sm">
                <span className="text-[var(--color-muted)]">{formatDuration(option.durationMinutes)}</span>
                <span className="font-medium">Từ {formatCurrency(option.basePrice)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ============================================================
   Bước 2 — Chọn ngày
   ============================================================ */

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function StepDate({ value, onChange }: { value: string | null; onChange: (date: string) => void }) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const today = dateKey(new Date());

  const cells = useMemo(
    () => buildCalendarGrid(cursor.getFullYear(), cursor.getMonth()),
    [cursor],
  );

  const canGoBack = !isSameMonth(cursor, new Date());

  return (
    <div>
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => canGoBack && setCursor(addMonths(cursor, -1))}
            disabled={!canGoBack}
            aria-label="Tháng trước"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[var(--color-muted-surface)] disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>

          <p className="text-base font-medium" aria-live="polite">
            {format(cursor, 'MMMM yyyy', { locale: vi })}
          </p>

          <button
            type="button"
            onClick={() => setCursor(addMonths(cursor, 1))}
            aria-label="Tháng sau"
            className="flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[var(--color-muted-surface)]"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1" role="grid" aria-label="Lịch chọn ngày">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="pb-2 text-center text-[11px] font-semibold tracking-wide text-[var(--color-muted)] uppercase"
            >
              {day}
            </div>
          ))}

          {cells.map((cell, index) => {
            if (!cell) return <div key={`empty-${index}`} aria-hidden />;

            const past = isPastDate(cell);
            const meta = getDayMeta(cell);
            const selected = value === cell;
            const isToday = cell === today;
            const dayNumber = parseISO(cell).getDate();

            return (
              <button
                key={cell}
                type="button"
                disabled={past}
                onClick={() => onChange(cell)}
                aria-pressed={selected}
                aria-label={`${formatDateLong(cell)}${meta.isPeak ? ', ngày cao điểm' : ''}${
                  meta.hasPromotion ? ', có ưu đãi' : ''
                }`}
                className={cn(
                  'relative flex aspect-square min-h-11 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-md)] text-sm transition-all duration-150',
                  past && 'cursor-not-allowed text-[var(--color-stone-300)]',
                  !past && !selected && 'hover:bg-[var(--color-muted-surface)]',
                  selected && 'bg-[var(--color-accent)] font-semibold text-white',
                  isToday && !selected && 'ring-1 ring-[var(--color-border-strong)] ring-inset',
                )}
              >
                <span>{dayNumber}</span>
                {!past ? (
                  <span className="mt-0.5 flex gap-0.5" aria-hidden>
                    {meta.isPeak ? (
                      <span
                        className={cn(
                          'size-1 rounded-full',
                          selected ? 'bg-white' : 'bg-[var(--color-warning)]',
                        )}
                      />
                    ) : null}
                    {meta.hasPromotion ? (
                      <span
                        className={cn(
                          'size-1 rounded-full',
                          selected ? 'bg-white' : 'bg-[var(--color-accent)]',
                        )}
                      />
                    ) : null}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[var(--color-warning)]" aria-hidden />
            Ngày cao điểm
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
            Ngày có ưu đãi
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm ring-1 ring-[var(--color-border-strong)]" aria-hidden />
            Hôm nay
          </span>
        </div>
      </div>

      {value ? (
        <p className="mt-4 flex items-center gap-2 text-sm text-[var(--color-muted)]">
          <Info className="size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          Bạn đã chọn <span className="font-medium text-[var(--color-foreground)]">{formatDateLong(value)}</span>
          {getDayMeta(value).hasPromotion ? ' — ngày này đang có ưu đãi giờ thấp điểm.' : '.'}
        </p>
      ) : null}
    </div>
  );
}

/* ============================================================
   Bước 3 — Chọn giờ
   ============================================================ */

const PRICING_LABEL: Record<SlotPricing, { label: string; variant: 'accent' | 'neutral' | 'warning' }> = {
  'off-peak': { label: 'Thấp điểm −20%', variant: 'accent' },
  standard: { label: 'Giá tiêu chuẩn', variant: 'neutral' },
  peak: { label: 'Cao điểm +25%', variant: 'warning' },
};

export function StepTime({
  date,
  value,
  basePrice,
  onChange,
}: {
  date: string;
  value: string | null;
  basePrice: number;
  onChange: (time: string) => void;
}) {
  const slots = useMemo(() => getTimeSlots(date), [date]);

  return (
    <div>
      <p className="mb-5 text-sm text-[var(--color-muted)]">
        Khung giờ hoạt động 06:00 – 22:00 ngày {formatDateLong(date)}. Giá hiển thị đã tính hệ số theo khung
        giờ.
      </p>

      <fieldset>
        <legend className="sr-only">Chọn khung giờ</legend>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => {
            const disabled = slot.status === 'full';
            const active = value === slot.time;
            const pricing = PRICING_LABEL[slot.pricing];

            return (
              <button
                key={slot.time}
                type="button"
                disabled={disabled}
                onClick={() => onChange(slot.time)}
                aria-pressed={active}
                className={cn(
                  'flex cursor-pointer flex-col gap-2 rounded-[var(--radius-md)] border p-4 text-left transition-all duration-150',
                  disabled && 'cursor-not-allowed border-[var(--color-border)] opacity-50',
                  !disabled && !active && 'border-[var(--color-border)] hover:border-[var(--color-accent)]',
                  active && 'border-[var(--color-accent)] bg-[var(--color-golf-50)]',
                )}
              >
                <span className="flex items-center justify-between gap-2">
                  <span className="text-base font-medium tabular-nums">{slot.time}</span>
                  {slot.pricing === 'peak' ? (
                    <Flame className="size-4 text-[var(--color-warning)]" aria-hidden />
                  ) : slot.pricing === 'off-peak' ? (
                    <Tag className="size-4 text-[var(--color-accent)]" aria-hidden />
                  ) : null}
                </span>

                <span className="text-sm font-medium tabular-nums">
                  {formatCurrency(Math.round((basePrice * slot.priceMultiplier) / 1000) * 1000)}
                </span>

                <span className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={pricing.variant} size="sm">
                    {pricing.label}
                  </Badge>
                  <Badge
                    variant={
                      slot.status === 'available' ? 'success' : slot.status === 'filling' ? 'warning' : 'danger'
                    }
                    size="sm"
                  >
                    {slot.status === 'available'
                      ? `Còn ${slot.seatsLeft} chỗ`
                      : slot.status === 'filling'
                        ? `Sắp đầy · còn ${slot.seatsLeft}`
                        : 'Hết chỗ'}
                  </Badge>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
