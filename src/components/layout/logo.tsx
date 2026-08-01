import Link from 'next/link';

import { cn } from '@/lib/utils';

export function LotusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn('size-8', className)} aria-hidden>
      <path
        d="M24 6c3.6 4.4 5.4 8.8 5.4 13.2 0 4.4-1.8 8.8-5.4 13.2-3.6-4.4-5.4-8.8-5.4-13.2C18.6 14.8 20.4 10.4 24 6Z"
        fill="currentColor"
        opacity=".95"
      />
      <path
        d="M10.2 14.4c5 1.4 8.6 3.9 10.8 7.4 2.2 3.5 2.9 7.9 2 13.1-5-1.4-8.6-3.9-10.8-7.4-2.2-3.5-2.9-7.9-2-13.1Z"
        fill="currentColor"
        opacity=".6"
      />
      <path
        d="M37.8 14.4c.9 5.2.2 9.6-2 13.1-2.2 3.5-5.8 6-10.8 7.4-.9-5.2-.2-9.6 2-13.1 2.2-3.5 5.8-6 10.8-7.4Z"
        fill="currentColor"
        opacity=".6"
      />
      <path d="M8 33.6h32c-2.4 5.4-7.9 8.4-16 8.4S10.4 39 8 33.6Z" fill="currentColor" opacity=".3" />
    </svg>
  );
}

export function Logo({
  inverse = false,
  compact = false,
  className,
}: {
  inverse?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Lotus Golf Center — về trang chủ"
      className={cn('group flex shrink-0 items-center gap-2.5', className)}
    >
      <LotusMark
        className={cn(
          'transition-colors',
          inverse ? 'text-[var(--color-champagne-300)]' : 'text-[var(--color-accent)]',
        )}
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-tight',
            inverse ? 'text-white' : 'text-[var(--color-foreground)]',
          )}
        >
          LOTUS GOLF
        </span>
        {!compact ? (
          <span
            className={cn(
              'mt-0.5 text-[9px] font-medium tracking-[0.24em] uppercase',
              inverse ? 'text-white/60' : 'text-[var(--color-muted)]',
            )}
          >
            Center
          </span>
        ) : null}
      </span>
    </Link>
  );
}
