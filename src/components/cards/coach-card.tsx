'use client';

import { CalendarClock, Heart, Languages, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Rating } from '@/components/ui/misc';
import { BLUR_DATA_URL } from '@/constants/media';
import { LANGUAGE_LABELS, SPECIALTY_LABELS } from '@/data/coaches';
import { useHydrated } from '@/hooks/useHydrated';
import { getNextAvailability } from '@/lib/availability';
import { formatCurrency, formatDateShort } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAccountStore } from '@/store/useAccountStore';
import type { Coach } from '@/types';

export function CoachCard({ coach, className }: { coach: Coach; className?: string }) {
  const hydrated = useHydrated();
  const favorites = useAccountStore((state) => state.favoriteCoaches);
  const toggleFavorite = useAccountStore((state) => state.toggleFavoriteCoach);
  const isFavorite = hydrated && favorites.includes(coach.id);

  const next = getNextAvailability(coach.id);

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-all duration-300 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-navy-800)]">
        <Image
          src={coach.avatar}
          alt={`Ảnh hồ sơ huấn luyện viên ${coach.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 92vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[var(--color-navy-950)]/85 to-transparent"
          aria-hidden
        />
        <button
          type="button"
          onClick={() => {
            toggleFavorite(coach.id);
            toast.success(isFavorite ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào yêu thích', {
              description: coach.name,
            });
          }}
          aria-label={isFavorite ? `Bỏ yêu thích ${coach.name}` : `Yêu thích ${coach.name}`}
          aria-pressed={isFavorite}
          className="absolute top-3 right-3 flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45"
        >
          <Heart className={cn('size-4', isFavorite && 'fill-[var(--color-danger)] text-[var(--color-danger)]')} aria-hidden />
        </button>

        <div className="absolute inset-x-4 bottom-4 text-white">
          <h3 className="text-lg leading-tight">{coach.name}</h3>
          <p className="mt-0.5 text-xs text-white/80">{coach.title}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {coach.specialties.slice(0, 3).map((specialty) => (
            <Badge key={specialty} variant="accent" size="sm">
              {SPECIALTY_LABELS[specialty]}
            </Badge>
          ))}
        </div>

        <Rating value={coach.rating} count={coach.reviewCount} size="sm" className="mb-3" />

        <ul className="space-y-1.5 text-xs text-[var(--color-muted)]">
          <li className="flex items-center gap-2">
            <Users className="size-3.5 shrink-0" aria-hidden />
            {coach.yearsExperience} năm kinh nghiệm · {coach.studentCount} học viên
          </li>
          <li className="flex items-center gap-2">
            <Languages className="size-3.5 shrink-0" aria-hidden />
            {coach.languages.map((lang) => LANGUAGE_LABELS[lang]).join(' · ')}
          </li>
          <li className="flex items-center gap-2">
            <CalendarClock className="size-3.5 shrink-0" aria-hidden />
            {next ? `Trống gần nhất: ${formatDateShort(next.date)} lúc ${next.time}` : 'Liên hệ để xếp lịch'}
          </li>
        </ul>

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-xs text-[var(--color-muted)]">Từ</span>
            <span className="font-[family-name:var(--font-display)] text-xl">
              {formatCurrency(coach.pricePerSession)}
            </span>
            <span className="text-xs text-[var(--color-muted)]">/ buổi</span>
          </div>

          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link href={`/coaches/${coach.slug}`}>Xem hồ sơ</Link>
            </Button>
            <Button asChild variant="accent" size="sm" className="flex-1">
              <Link href={{ pathname: '/booking', query: { coach: coach.slug, experience: 'coaching' } }}>
                Đặt lịch
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
