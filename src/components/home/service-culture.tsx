import {
  BookmarkCheck,
  Ear,
  Handshake,
  Lightbulb,
  Sparkles,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import Image from 'next/image';

import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import { SERVICE_CULTURE } from '@/data/testimonials';

const ICONS: Record<string, LucideIcon> = {
  Handshake,
  BookmarkCheck,
  Lightbulb,
  Sparkles,
  Wind,
  Ear,
};

export function ServiceCulture() {
  return (
    <Section tone="ivory">
      <SectionHeader
        align="center"
        eyebrow="Dịch vụ từ trái tim"
        title="Sự chu đáo nằm ở những chi tiết bạn không phải yêu cầu"
        description="Công nghệ lo phần việc lặp lại. Nhờ vậy đội ngũ có thời gian dành cho điều mà máy móc không làm được — quan tâm đến từng người một cách thật lòng."
      />

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        {/* Ảnh không gian phục vụ */}
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-muted-surface)] lg:aspect-[3/4]">
            <Image
              src={MEDIA.section.serviceCulture}
              alt="Không gian phục vụ tại Lotus Golf Center"
              fill
              sizes="(min-width: 1024px) 38vw, 92vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/80 via-transparent to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-6 bottom-6">
              <p className="font-[family-name:var(--font-display)] text-xl leading-snug text-white">
                “Phục vụ tốt là biết khi nào nên lùi lại.”
              </p>
              <p className="mt-2 text-sm text-white/70">Nguyên tắc phục vụ tại Lotus</p>
            </div>
          </div>
        </Reveal>

        {/* Sáu nguyên tắc */}
        <div className="grid gap-5 sm:grid-cols-2">
          {SERVICE_CULTURE.map((item, index) => {
            const Icon = ICONS[item.icon] ?? Sparkles;
            return (
              <Reveal key={item.title} delay={Math.min(index * 0.06, 0.3)}>
                <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-surface-raised)]/70 p-6">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-[var(--color-champagne-100)] text-[var(--color-champagne-700)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-base font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
