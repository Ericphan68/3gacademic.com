import {
  BookmarkCheck,
  Ear,
  Handshake,
  Lightbulb,
  Sparkles,
  Wind,
  type LucideIcon,
} from 'lucide-react';

import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
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

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </Section>
  );
}
