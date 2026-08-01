'use client';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { X } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

/* ============================================================
   Dialog (modal)
   ============================================================ */

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

function Overlay({ className }: { className?: string }) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        'fixed inset-0 z-50 bg-[var(--color-navy-950)]/55 backdrop-blur-[2px] data-[state=closed]:animate-[fade-in_150ms_ease-out_reverse] data-[state=open]:animate-[fade-in_200ms_ease-out]',
        className,
      )}
    />
  );
}

export const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { size?: 'sm' | 'md' | 'lg' }
>(function DialogContent({ className, children, size = 'md', ...props }, ref) {
  const width = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-3xl' }[size];
  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-overlay)] data-[state=open]:animate-[fade-up_250ms_var(--ease-out-soft)]',
          width,
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Đóng"
          className="absolute top-4 right-4 flex size-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)] hover:text-[var(--color-foreground)]"
        >
          <X className="size-4" aria-hidden />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-4 flex flex-col gap-1.5 pr-10', className)} {...props} />;
}

export const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(function DialogTitle({ className, ...props }, ref) {
  return <DialogPrimitive.Title ref={ref} className={cn('text-xl', className)} {...props} />;
});

export const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(function DialogDescription({ className, ...props }, ref) {
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn('text-sm text-[var(--color-muted)]', className)}
      {...props}
    />
  );
});

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)} {...props} />;
}

/* ============================================================
   Sheet (drawer) — dùng cho menu mobile, bộ lọc, giỏ hàng
   ============================================================ */

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export const SheetContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: 'left' | 'right' | 'bottom';
  }
>(function SheetContent({ className, children, side = 'right', ...props }, ref) {
  const sideClass = {
    left: 'inset-y-0 left-0 h-dvh w-[min(22rem,88vw)] border-r',
    right: 'inset-y-0 right-0 h-dvh w-[min(24rem,90vw)] border-l',
    bottom: 'inset-x-0 bottom-0 max-h-[85dvh] w-full rounded-t-[var(--radius-xl)] border-t',
  }[side];

  return (
    <DialogPrimitive.Portal>
      <Overlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed z-50 flex flex-col overflow-y-auto border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-overlay)] data-[state=open]:animate-[fade-in_200ms_ease-out]',
          sideClass,
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Đóng"
          className="absolute top-4 right-4 flex size-10 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)] hover:text-[var(--color-foreground)]"
        >
          <X className="size-5" aria-hidden />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
});

export const SheetTitle = DialogTitle;
export const SheetDescription = DialogDescription;

/* ============================================================
   Tooltip
   ============================================================ */

export const TooltipProvider = TooltipPrimitive.Provider;

export function Tooltip({ content, children }: { content: React.ReactNode; children: React.ReactNode }) {
  return (
    <TooltipPrimitive.Root delayDuration={200}>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          sideOffset={6}
          className="z-50 max-w-64 rounded-[var(--radius-sm)] bg-[var(--color-navy-800)] px-3 py-2 text-xs leading-relaxed text-white shadow-[var(--shadow-card)]"
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-[var(--color-navy-800)]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
