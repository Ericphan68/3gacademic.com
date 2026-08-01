import { ArrowRight, CalendarClock, Check, Clock, Users, X } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { FaqAccordion, FaqJsonLd } from '@/components/common/faq-accordion';
import { Section, SectionHeader } from '@/components/common/section';
import { ExperienceCard } from '@/components/cards/experience-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SpecList } from '@/components/ui/misc';
import { AUDIENCE_LABELS } from '@/data/experiences';
import { ExperienceGallery } from '@/features/experience/experience-gallery';
import { ShareActions } from '@/features/experience/share-actions';
import { formatCurrency, formatDuration } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';
import { experienceService } from '@/services/catalogService';

export function generateStaticParams() {
  return experienceService.getAll().map((item) => ({ slug: item.slug }));
}

export async function generateMetadata(props: PageProps<'/experience/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const item = experienceService.getBySlug(slug);
  if (!item) return buildMetadata({ title: 'Không tìm thấy gói', description: '', path: '/experience', noIndex: true });

  return buildMetadata({
    title: `${item.name} — ${item.tagline}`,
    description: item.description,
    path: `/experience/${item.slug}`,
    image: item.gallery[0],
  });
}

export default async function ExperienceDetailPage(props: PageProps<'/experience/[slug]'>) {
  const { slug } = await props.params;
  const item = experienceService.getBySlug(slug);
  if (!item) notFound();

  const related = experienceService
    .getAll()
    .filter((entry) => entry.slug !== item.slug && entry.audiences.some((tag) => item.audiences.includes(tag)))
    .slice(0, 3);

  return (
    <>
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container-lotus py-5">
          <Breadcrumbs items={[{ label: 'Trải nghiệm', href: '/experience' }, { label: item.name }]} />
        </div>
      </div>

      <Section className="!pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <div>
            <ExperienceGallery images={item.gallery} name={item.name} />

            <div className="mt-10">
              <div className="mb-4 flex flex-wrap gap-2">
                {item.audiences.map((tag) => (
                  <Badge key={tag} variant="accent" size="sm">
                    {AUDIENCE_LABELS[tag]}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl">{item.name}</h1>
              <p className="mt-2 text-lg text-[var(--color-muted)]">{item.tagline}</p>
              <p className="mt-6 leading-relaxed">{item.longDescription}</p>

              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-lg">Gói bao gồm</h2>
                  <ul className="space-y-2.5 text-sm">
                    {item.includes.map((line) => (
                      <li key={line} className="flex gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="mb-4 text-lg">Không bao gồm</h2>
                  <ul className="space-y-2.5 text-sm text-[var(--color-muted)]">
                    {item.excludes.map((line) => (
                      <li key={line} className="flex gap-2.5">
                        <X className="mt-0.5 size-4 shrink-0 text-[var(--color-stone-400)]" aria-hidden />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-5">
                <h2 className="mb-2 flex items-center gap-2 text-base">
                  <CalendarClock className="size-4 text-[var(--color-champagne-700)]" aria-hidden />
                  Chính sách đổi lịch
                </h2>
                <p className="text-sm leading-relaxed text-[var(--color-champagne-800)]">
                  {item.reschedulePolicy}
                </p>
              </div>

              {item.faqs.length > 0 ? (
                <div className="mt-12">
                  <h2 className="mb-4 text-2xl">Câu hỏi thường gặp về gói này</h2>
                  <FaqAccordion items={item.faqs} />
                  <FaqJsonLd items={item.faqs} />
                </div>
              ) : null}
            </div>
          </div>

          {/* Sidebar đặt lịch */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-[var(--color-muted)]">Từ</span>
                <span className="font-[family-name:var(--font-display)] text-3xl">
                  {formatCurrency(item.price)}
                </span>
              </div>
              {item.compareAtPrice ? (
                <p className="mt-1 text-sm">
                  <span className="text-[var(--color-stone-400)] line-through">
                    {formatCurrency(item.compareAtPrice)}
                  </span>{' '}
                  <span className="font-medium text-[var(--color-accent)]">
                    tiết kiệm {formatCurrency(item.compareAtPrice - item.price)}
                  </span>
                </p>
              ) : null}

              <SpecList
                className="mt-5"
                items={[
                  {
                    label: 'Thời lượng',
                    value: (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5 text-[var(--color-muted)]" aria-hidden />
                        {formatDuration(item.durationMinutes)}
                      </span>
                    ),
                  },
                  {
                    label: 'Số khách',
                    value: (
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5 text-[var(--color-muted)]" aria-hidden />
                        {item.minGuests === item.maxGuests
                          ? `${item.minGuests} khách`
                          : `${item.minGuests}–${item.maxGuests} khách`}
                      </span>
                    ),
                  },
                  { label: 'Phù hợp với', value: item.audiences.map((tag) => AUDIENCE_LABELS[tag]).join(', ') },
                ]}
              />

              <ul className="mt-5 space-y-2 text-sm">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2.5">
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-champagne-400)]"
                      aria-hidden
                    />
                    {highlight}
                  </li>
                ))}
              </ul>

              <Button asChild variant="accent" size="lg" block className="mt-6">
                <Link href={{ pathname: '/booking', query: { experience: item.slug } }}>
                  Đặt lịch gói này
                  <ArrowRight aria-hidden />
                </Link>
              </Button>

              <div className="mt-4">
                <ShareActions title={item.name} path={`/experience/${item.slug}`} />
              </div>

              <p className="mt-5 border-t border-[var(--color-border)] pt-4 text-xs leading-relaxed text-[var(--color-muted)]">
                Giá hiển thị là giá demo cho một khách. Giá cuối cùng phụ thuộc khung giờ, khu vực và dịch
                vụ bổ sung — hệ thống tính đầy đủ ở bước xác nhận.
              </p>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="surface">
          <SectionHeader
            eyebrow="Gợi ý thêm"
            title="Các gói tương tự"
            description="Những gói khác cũng phù hợp với nhóm khách của bạn."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry) => (
              <ExperienceCard key={entry.id} item={entry} className="h-full" />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
