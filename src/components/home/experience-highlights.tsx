import {
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
import Link from 'next/link';

import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
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
                className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-champagne-300)]/40 hover:bg-white/[0.08]"
              >
                <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-[var(--color-champagne-300)]/15 text-[var(--color-champagne-300)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="font-[family-name:var(--font-display)] text-lg text-white">
                  {item.name}
                </span>
                <span className="mt-2 text-sm leading-relaxed text-[var(--color-navy-200)]">
                  {item.description}
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
