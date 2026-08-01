import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-medium leading-none transition-colors [&_svg]:size-3.5',
  {
    variants: {
      variant: {
        neutral: 'bg-[var(--color-muted-surface)] text-[var(--color-muted)]',
        navy: 'bg-[var(--color-navy-700)] text-white',
        accent: 'bg-[var(--color-golf-100)] text-[var(--color-golf-700)]',
        gold: 'bg-[var(--color-champagne-100)] text-[var(--color-champagne-800)]',
        outline: 'border border-[var(--color-border-strong)] text-[var(--color-muted)]',
        success: 'bg-[var(--color-golf-100)] text-[var(--color-golf-700)]',
        warning: 'bg-[#fdf3dc] text-[var(--color-warning)]',
        danger: 'bg-[#fdeceb] text-[var(--color-danger)]',
        info: 'bg-[var(--color-navy-50)] text-[var(--color-navy-600)]',
        glass: 'border border-white/25 bg-white/10 text-white backdrop-blur-sm',
      },
      size: {
        sm: 'px-2 py-1 text-[11px]',
        md: 'px-2.5 py-1.5 text-xs',
        lg: 'px-3 py-2 text-sm',
      },
    },
    defaultVariants: { variant: 'neutral', size: 'md' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}
