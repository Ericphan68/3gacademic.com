import * as React from 'react';

import { cn } from '@/lib/utils';

export function Section({
  className,
  tone = 'default',
  children,
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: 'default' | 'surface' | 'navy' | 'ivory' }) {
  const toneClass = {
    default: 'bg-[var(--color-background)]',
    surface: 'bg-[var(--color-surface)]',
    ivory: 'bg-[var(--color-champagne-50)]',
    navy: 'bg-[var(--color-navy-800)] text-[var(--color-champagne-50)]',
  }[tone];

  return (
    <section className={cn('section-y', toneClass, className)} {...props}>
      <div className="container-lotus">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  inverse = false,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-5 md:mb-14',
        align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow ? (
          <p className={cn('eyebrow mb-3', inverse && 'text-[var(--color-champagne-300)]')}>{eyebrow}</p>
        ) : null}
        <h2 className={cn('text-3xl md:text-4xl lg:text-[2.75rem]', inverse && 'text-[var(--color-champagne-50)]')}>
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              'mt-4 text-[15px] leading-relaxed md:text-base',
              inverse ? 'text-[var(--color-navy-100)]' : 'text-[var(--color-muted)]',
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
