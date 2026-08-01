'use client';

import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { useState } from 'react';

import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { InitialsAvatar, Rating } from '@/components/ui/misc';
import { TESTIMONIALS } from '@/data/testimonials';
import { cn } from '@/lib/utils';

const SEGMENT_LABELS: Record<string, string> = {
  newcomer: 'Khách mới',
  member: 'Hội viên',
  coach: 'Huấn luyện viên',
  corporate: 'Doanh nghiệp',
  vip: 'Khách VIP',
};

const PAGE_SIZE = 3;

export function TestimonialsSection() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(TESTIMONIALS.length / PAGE_SIZE);
  const visible = TESTIMONIALS.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <Section tone="ivory">
      <SectionHeader
        eyebrow="Khách hàng nói gì"
        title="Điều khiến mọi người quay lại"
        description="Nhận xét từ khách mới, hội viên, huấn luyện viên và đối tác doanh nghiệp."
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Nhóm nhận xét trước"
              onClick={() => setPage((prev) => (prev - 1 + totalPages) % totalPages)}
            >
              <ChevronLeft aria-hidden />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label="Nhóm nhận xét tiếp theo"
              onClick={() => setPage((prev) => (prev + 1) % totalPages)}
            >
              <ChevronRight aria-hidden />
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3" aria-live="polite">
        {visible.map((item) => (
          <figure
            key={item.id}
            className="animate-fade-in flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-surface-raised)] p-6"
          >
            <Quote className="mb-4 size-7 text-[var(--color-champagne-300)]" aria-hidden />
            <blockquote className="flex-1 text-[15px] leading-relaxed">“{item.quote}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
              <InitialsAvatar initials={item.initials} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="truncate text-xs text-[var(--color-muted)]">{item.role}</p>
              </div>
              <Badge variant="neutral" size="sm">
                {SEGMENT_LABELS[item.segment]}
              </Badge>
            </figcaption>
            <Rating value={item.rating} size="sm" className="mt-3" />
          </figure>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setPage(index)}
            aria-label={`Xem nhóm nhận xét ${index + 1}`}
            aria-current={page === index ? 'true' : undefined}
            className={cn(
              'h-1.5 cursor-pointer rounded-full transition-all duration-300',
              page === index ? 'w-8 bg-[var(--color-accent)]' : 'w-4 bg-[var(--color-stone-300)]',
            )}
          />
        ))}
      </div>
    </Section>
  );
}
