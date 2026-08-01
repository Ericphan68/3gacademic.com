import {
  ArrowUpRight,
  CircleDot,
  GraduationCap,
  Sofa,
  Target,
  Trophy,
  UserRound,
  Users,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import { EXPERIENCE_HIGHLIGHTS } from '@/data/testimonials';

const ICONS: Record<string, LucideIcon> = {
  Target,
  CircleDot,
  GraduationCap,
  UserRound,
  Trophy,
  Utensils,
  Sofa,
  Users,
};

/** Ảnh minh hoạ cho từng khu vực, theo đúng thứ tự EXPERIENCE_HIGHLIGHTS. */
const IMAGES = [
  MEDIA.facility['driving-range'],
  MEDIA.facility['putting-green'],
  MEDIA.facility.academy,
  MEDIA.facility['short-game'],
  MEDIA.hero.events,
  MEDIA.hero.lounge,
  MEDIA.facility.lounge,
  MEDIA.facility.networking,
];

export function ExperienceHighlights() {
  return (
    <Section tone="navy">
      <SectionHeader
        inverse
        eyebrow="Trải nghiệm tại Lotus"
        title="Tám không gian trong một hệ sinh thái"
        description="Lotus không chỉ là nơi để đánh bóng. Đây là nơi bạn học, gặp gỡ, làm việc và nghỉ ngơi — tất cả trong cùng một khuôn viên."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {EXPERIENCE_HIGHLIGHTS.map((item, index) => {
          const Icon = ICONS[item.icon] ?? Target;
          return (
            <Reveal key={item.name} delay={Math.min(index * 0.05, 0.3)}>
              <Link
                href={item.href as Route}
                className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-champagne-300)]/40 hover:bg-white/[0.08]"
              >
                <span className="relative block aspect-[16/10] overflow-hidden">
                  <Image
                    src={IMAGES[index] ?? MEDIA.facility['driving-range']}
                    alt={`Khu vực ${item.name} tại Lotus Golf Center`}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 92vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
                  />
                  <span
                    className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/85 via-[var(--color-navy-950)]/25 to-transparent"
                    aria-hidden
                  />
                  <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full bg-[var(--color-navy-900)]/80 text-[var(--color-champagne-300)] backdrop-blur-sm">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                </span>

                <span className="flex flex-1 flex-col p-5">
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-[family-name:var(--font-display)] text-lg text-white">
                      {item.name}
                    </span>
                    <ArrowUpRight
                      className="mt-1 size-4 shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--color-champagne-300)]"
                      aria-hidden
                    />
                  </span>
                  <span className="mt-2 text-sm leading-relaxed text-[var(--color-navy-200)]">
                    {item.description}
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
