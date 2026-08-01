import * as React from 'react';

import { cn } from '@/lib/utils';

export function StatTile({
  value,
  label,
  hint,
  icon,
  tone = 'default',
  className,
}: {
  value: React.ReactNode;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  tone?: 'default' | 'accent' | 'gold' | 'navy';
  className?: string;
}) {
  const toneClass = {
    default: 'border-[var(--color-border)] bg-[var(--color-surface-raised)]',
    accent: 'border-[var(--color-golf-200)] bg-[var(--color-golf-50)]',
    gold: 'border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)]',
    navy: 'border-white/10 bg-white/5 text-[var(--color-champagne-50)]',
  }[tone];

  return (
    <div className={cn('rounded-[var(--radius-lg)] border p-5', toneClass, className)}>
      {icon ? <div className="mb-3 text-[var(--color-accent)]">{icon}</div> : null}
      <p className="font-[family-name:var(--font-display)] text-2xl leading-tight md:text-3xl">{value}</p>
      <p className={cn('mt-1 text-sm', tone === 'navy' ? 'text-[var(--color-navy-100)]' : 'text-[var(--color-muted)]')}>
        {label}
      </p>
      {hint ? (
        <p className={cn('mt-2 text-xs', tone === 'navy' ? 'text-[var(--color-navy-200)]' : 'text-[var(--color-muted)]')}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
