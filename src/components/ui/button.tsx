import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-all duration-200 ease-[var(--ease-out-soft)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary:
          'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-navy-600)] active:scale-[0.98]',
        accent:
          'bg-[var(--color-accent)] text-[var(--color-on-accent)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-golf-600)] active:scale-[0.98]',
        gold: 'bg-[var(--color-champagne-300)] text-[var(--color-navy-800)] shadow-[var(--shadow-subtle)] hover:bg-[var(--color-champagne-400)] active:scale-[0.98]',
        outline:
          'border border-[var(--color-border-strong)] bg-transparent text-[var(--color-foreground)] hover:border-[var(--color-accent)] hover:bg-[var(--color-golf-50)] active:scale-[0.98]',
        ghost: 'bg-transparent text-[var(--color-foreground)] hover:bg-[var(--color-muted-surface)]',
        subtle:
          'bg-[var(--color-muted-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-stone-200)]',
        link: 'bg-transparent text-[var(--color-accent)] underline-offset-4 hover:underline',
        danger: 'bg-[var(--color-danger)] text-white hover:opacity-90 active:scale-[0.98]',
        inverse:
          'bg-white/95 text-[var(--color-navy-800)] backdrop-blur-sm hover:bg-white active:scale-[0.98]',
        'inverse-outline':
          'border border-white/50 bg-white/5 text-white backdrop-blur-sm hover:border-white hover:bg-white/15 active:scale-[0.98]',
      },
      size: {
        sm: 'h-9 px-3.5 text-[13px] [&_svg]:size-4',
        md: 'h-11 px-5 [&_svg]:size-4',
        lg: 'h-12 px-6 text-[15px] [&_svg]:size-5',
        xl: 'h-14 px-8 text-base [&_svg]:size-5',
        icon: 'size-11 [&_svg]:size-5',
        'icon-sm': 'size-9 [&_svg]:size-4',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, block, asChild = false, loading = false, children, disabled, ...props },
  ref,
) {
  const Comp = asChild ? Slot : 'button';

  if (asChild) {
    return (
      <Comp ref={ref} className={cn(buttonVariants({ variant, size, block, className }))} {...props}>
        {children}
      </Comp>
    );
  }

  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, block, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" aria-hidden /> : null}
      {children}
    </Comp>
  );
});

export { buttonVariants };
