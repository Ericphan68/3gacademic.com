import { Star } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

/* ============================================================
   Separator
   ============================================================ */

export function Separator({
  className,
  orientation = 'horizontal',
}: {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'bg-[var(--color-border)]',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}

/* ============================================================
   Avatar chữ cái
   ============================================================ */

export function InitialsAvatar({
  initials,
  size = 'md',
  className,
}: {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClass = {
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-14 text-base',
  }[size];

  return (
    <span
      aria-hidden
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-[var(--color-navy-700)] font-medium text-[var(--color-champagne-200)]',
        sizeClass,
        className,
      )}
    >
      {initials}
    </span>
  );
}

/* ============================================================
   Rating sao
   ============================================================ */

export function Rating({
  value,
  count,
  size = 'md',
  className,
}: {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}) {
  const starSize = size === 'sm' ? 'size-3.5' : 'size-4';
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="flex" aria-hidden>
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={cn(
              starSize,
              index < Math.round(value)
                ? 'fill-[var(--color-champagne-400)] text-[var(--color-champagne-400)]'
                : 'text-[var(--color-stone-300)]',
            )}
          />
        ))}
      </span>
      <span className={cn('font-medium tabular-nums', size === 'sm' ? 'text-xs' : 'text-sm')}>
        {value.toFixed(1)}
      </span>
      {count !== undefined ? (
        <span className={cn('text-[var(--color-muted)]', size === 'sm' ? 'text-xs' : 'text-sm')}>
          ({count})
        </span>
      ) : null}
      <span className="sr-only">
        Đánh giá {value.toFixed(1)} trên 5{count !== undefined ? `, ${count} lượt đánh giá` : ''}
      </span>
    </span>
  );
}

/* ============================================================
   Thanh tiến trình
   ============================================================ */

export function ProgressBar({
  value,
  max = 100,
  label,
  className,
  tone = 'accent',
}: {
  value: number;
  max?: number;
  label?: string;
  className?: string;
  tone?: 'accent' | 'gold' | 'navy';
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const toneClass = {
    accent: 'bg-[var(--color-accent)]',
    gold: 'bg-[var(--color-champagne-400)]',
    navy: 'bg-[var(--color-navy-600)]',
  }[tone];

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(percent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-muted-surface)]"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-500', toneClass)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ============================================================
   Danh sách thông số (dùng ở trang chi tiết)
   ============================================================ */

export function SpecList({
  items,
  className,
}: {
  items: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl className={cn('divide-y divide-[var(--color-border)]', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-start justify-between gap-6 py-3">
          <dt className="text-sm text-[var(--color-muted)]">{item.label}</dt>
          <dd className="text-right text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* ============================================================
   Mã QR giả lập
   ============================================================ */

/**
 * Vẽ một ma trận điểm xác định từ `payload`.
 * Đây là hình minh hoạ cho luồng check-in, KHÔNG phải mã QR quét được.
 */
export function DemoQrCode({
  payload,
  size = 160,
  className,
}: {
  payload: string;
  size?: number;
  className?: string;
}) {
  const grid = 21;
  const cells: boolean[] = [];
  let h = 2166136261;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let i = 0; i < grid * grid; i++) {
    h ^= i + 0x9e3779b9;
    h = Math.imul(h, 16777619);
    cells.push(((h >>> 8) & 1) === 1);
  }

  const isFinder = (row: number, col: number) => {
    const inBox = (r0: number, c0: number) =>
      row >= r0 && row < r0 + 7 && col >= c0 && col < c0 + 7;
    return inBox(0, 0) || inBox(0, grid - 7) || inBox(grid - 7, 0);
  };

  const finderFilled = (row: number, col: number) => {
    const local = (r0: number, c0: number) => {
      const r = row - r0;
      const c = col - c0;
      const ring = Math.max(Math.abs(r - 3), Math.abs(c - 3));
      return ring === 3 || ring <= 1;
    };
    if (row < 7 && col < 7) return local(0, 0);
    if (row < 7 && col >= grid - 7) return local(0, grid - 7);
    if (row >= grid - 7 && col < 7) return local(grid - 7, 0);
    return false;
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${grid} ${grid}`}
      className={cn('rounded-[var(--radius-sm)] bg-white p-1', className)}
      role="img"
      aria-label="Mã QR check-in (hình minh hoạ demo)"
    >
      <rect width={grid} height={grid} fill="#ffffff" />
      {cells.map((filled, index) => {
        const row = Math.floor(index / grid);
        const col = index % grid;
        const on = isFinder(row, col) ? finderFilled(row, col) : filled;
        if (!on) return null;
        return <rect key={index} x={col} y={row} width={1} height={1} fill="#0e2a3e" />;
      })}
    </svg>
  );
}
