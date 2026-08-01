import { AlertTriangle, Inbox, RotateCw } from 'lucide-react';
import * as React from 'react';

import { Button } from './button';

import { cn } from '@/lib/utils';

/* ============================================================
   Skeleton
   ============================================================ */

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn('animate-shimmer rounded-[var(--radius-sm)]', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4"
        >
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   Empty state
   ============================================================ */

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] px-6 py-14 text-center',
        className,
      )}
    >
      <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-muted-surface)] text-[var(--color-muted)]">
        <Icon className="size-6" aria-hidden />
      </span>
      <p className="text-base font-medium">{title}</p>
      {description ? (
        <p className="mt-1.5 max-w-md text-sm text-[var(--color-muted)]">{description}</p>
      ) : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

/* ============================================================
   Error state
   ============================================================ */

export function ErrorState({
  title = 'Đã có lỗi xảy ra',
  description = 'Vui lòng thử lại. Nếu vấn đề tiếp diễn, bạn có thể liên hệ hotline để được hỗ trợ.',
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[#fdeceb]/40 px-6 py-12 text-center',
        className,
      )}
    >
      <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#fdeceb] text-[var(--color-danger)]">
        <AlertTriangle className="size-6" aria-hidden />
      </span>
      <p className="text-base font-medium">{title}</p>
      <p className="mt-1.5 max-w-md text-sm text-[var(--color-muted)]">{description}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          <RotateCw aria-hidden />
          Thử lại
        </Button>
      ) : null}
    </div>
  );
}
