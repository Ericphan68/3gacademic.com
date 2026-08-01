import { ArrowRight, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BLUR_DATA_URL } from '@/constants/media';
import { AUDIENCE_LABELS } from '@/data/experiences';
import { formatCurrency, formatDuration } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { ExperiencePackage } from '@/types';

export function ExperienceCard({
  item,
  className,
  priority = false,
}: {
  item: ExperiencePackage;
  className?: string;
  priority?: boolean;
}) {
  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-muted-surface)]">
        <Image
          src={item.gallery[0]}
          alt={`Hình ảnh gói ${item.name}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        {item.badge ? (
          <Badge variant="glass" size="sm" className="absolute top-3 left-3">
            {item.badge}
          </Badge>
        ) : null}
        {item.compareAtPrice ? (
          <Badge variant="gold" size="sm" className="absolute top-3 right-3">
            Tiết kiệm {formatCurrency(item.compareAtPrice - item.price, { compact: true })}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {item.audiences.slice(0, 3).map((audience) => (
            <Badge key={audience} variant="neutral" size="sm">
              {AUDIENCE_LABELS[audience]}
            </Badge>
          ))}
        </div>

        <h3 className="text-lg leading-snug">
          <Link
            href={`/experience/${item.slug}`}
            className="transition-colors hover:text-[var(--color-accent)]"
          >
            {item.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-[var(--color-muted)]">{item.tagline}</p>

        <ul className="mt-4 space-y-1.5 text-sm text-[var(--color-muted)]">
          {item.highlights.slice(0, 2).map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--color-champagne-400)]" aria-hidden />
              {highlight}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-muted)]">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />
            {formatDuration(item.durationMinutes)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" aria-hidden />
            {item.minGuests === item.maxGuests
              ? `${item.minGuests} khách`
              : `${item.minGuests}–${item.maxGuests} khách`}
          </span>
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-xs text-[var(--color-muted)]">Từ</span>
            <span className="font-[family-name:var(--font-display)] text-xl">
              {formatCurrency(item.price)}
            </span>
            {item.compareAtPrice ? (
              <span className="text-sm text-[var(--color-stone-400)] line-through">
                {formatCurrency(item.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/experience/${item.slug}`}>Xem chi tiết</Link>
            </Button>
            <Button asChild variant="accent" size="sm" className="flex-1">
              <Link href={{ pathname: '/booking', query: { experience: item.slug } }}>
                Đặt ngay
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
