import { CalendarDays, Clock, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/misc';
import { BLUR_DATA_URL } from '@/constants/media';
import { EVENT_TYPE_LABELS } from '@/data/events';
import { formatCurrency, formatDate, formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { GolfEvent } from '@/types';

export function EventCard({
  event,
  className,
  compact = false,
}: {
  event: GolfEvent;
  className?: string;
  compact?: boolean;
}) {
  const remaining = event.capacity - event.registered;
  const fillPercent = (event.registered / event.capacity) * 100;
  const almostFull = fillPercent >= 80;

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className={cn('relative overflow-hidden bg-[var(--color-muted-surface)]', compact ? 'aspect-[16/8]' : 'aspect-[16/9]')}>
        <Image
          src={event.banner}
          alt={`Banner sự kiện ${event.title}`}
          fill
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 92vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/70 to-transparent" aria-hidden />
        <Badge variant="glass" size="sm" className="absolute top-3 left-3">
          {EVENT_TYPE_LABELS[event.type]}
        </Badge>
        {event.fee === 0 ? (
          <Badge variant="gold" size="sm" className="absolute top-3 right-3">
            Miễn phí
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug">
          <Link href={`/events/${event.slug}`} className="transition-colors hover:text-[var(--color-accent)]">
            {event.title}
          </Link>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-[var(--color-muted)]">{event.summary}</p>

        <ul className="mt-4 space-y-1.5 text-xs text-[var(--color-muted)]">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-3.5 shrink-0" aria-hidden />
            {formatDate(event.startsAt)}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="size-3.5 shrink-0" aria-hidden />
            {formatTime(event.startsAt)} – {formatTime(event.endsAt)}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            {event.location}
          </li>
        </ul>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-[var(--color-muted)]">
              <Users className="size-3.5" aria-hidden />
              {event.registered}/{event.capacity} đã đăng ký
            </span>
            <span className={cn('font-medium', almostFull ? 'text-[var(--color-warning)]' : 'text-[var(--color-accent)]')}>
              {remaining > 0 ? `Còn ${remaining} chỗ` : 'Hết chỗ'}
            </span>
          </div>
          <ProgressBar
            value={fillPercent}
            tone={almostFull ? 'gold' : 'accent'}
            label={`Đã đăng ký ${event.registered} trên ${event.capacity} chỗ`}
          />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div>
            <span className="block text-xs text-[var(--color-muted)]">Phí tham dự</span>
            <span className="font-[family-name:var(--font-display)] text-lg">
              {event.fee === 0 ? 'Miễn phí' : formatCurrency(event.fee)}
            </span>
          </div>
          <Button asChild variant={remaining > 0 ? 'accent' : 'outline'} size="sm">
            <Link href={`/events/${event.slug}`}>{remaining > 0 ? 'Đăng ký' : 'Xem chi tiết'}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
