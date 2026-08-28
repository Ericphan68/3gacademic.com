import { Award, CalendarDays, Clock, Gift, MapPin, ScrollText, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { EventCard } from '@/components/cards/event-card';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { FaqAccordion, FaqJsonLd } from '@/components/common/faq-accordion';
import { JsonLd } from '@/components/common/json-ld';
import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { SpecList } from '@/components/ui/misc';
import { BLUR_DATA_URL } from '@/constants/media';
import { EVENT_TYPE_LABELS } from '@/data/events';
import { EventRegistrationForm } from '@/features/events/event-registration';
import { formatCurrency, formatDateLong, formatTime } from '@/lib/format';
import { buildMetadata, eventJsonLd } from '@/lib/seo';
import { eventService } from '@/services/catalogService';
import { getManagedEvent } from '@/server/services/eventService';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return eventService.getAll().map((event) => ({ slug: event.slug }));
}

export async function generateMetadata(props: PageProps<'/events/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getManagedEvent(slug);
  if (!event) {
    return buildMetadata({
      title: 'Không tìm thấy sự kiện',
      description: 'Sự kiện không tồn tại hoặc đã kết thúc.',
      path: '/events',
      noIndex: true,
    });
  }

  return buildMetadata({
    title: event.title,
    description: event.summary,
    path: `/events/${event.slug}`,
    image: event.banner,
    keywords: ['sự kiện golf', 'giải đấu golf', event.title, EVENT_TYPE_LABELS[event.type]],
  });
}

export default async function EventDetailPage(props: PageProps<'/events/[slug]'>) {
  const { slug } = await props.params;
  const event = await getManagedEvent(slug);
  if (!event) notFound();

  const related = eventService
    .getAll()
    .filter((item) => item.slug !== event.slug)
    .slice(0, 3);

  return (
    <>
      <JsonLd data={eventJsonLd(event)} />

      {/* Hero */}
      <section className="relative isolate flex min-h-[22rem] items-end overflow-hidden py-14 md:min-h-[28rem] md:py-20">
        <Image
          src={event.banner}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/94 via-[var(--color-navy-900)]/75 to-[var(--color-navy-900)]/40"
          aria-hidden
        />

        <div className="container-lotus relative">
          <Breadcrumbs
            items={[{ label: 'Sự kiện', href: '/events' }, { label: event.title }]}
            inverse
            className="mb-6"
          />

          <Badge variant="glass" size="md" className="mb-4">
            {EVENT_TYPE_LABELS[event.type]}
          </Badge>

          <h1 className="max-w-3xl text-4xl text-white md:text-5xl">{event.title}</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-navy-100)] md:text-lg">
            {event.summary}
          </p>

          <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/90">
            <li className="inline-flex items-center gap-2">
              <CalendarDays className="size-4 text-[var(--color-champagne-300)]" aria-hidden />
              {formatDateLong(event.startsAt)}
            </li>
            <li className="inline-flex items-center gap-2">
              <Clock className="size-4 text-[var(--color-champagne-300)]" aria-hidden />
              {formatTime(event.startsAt)} – {formatTime(event.endsAt)}
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin className="size-4 text-[var(--color-champagne-300)]" aria-hidden />
              {event.location}
            </li>
            <li className="inline-flex items-center gap-2">
              <Users className="size-4 text-[var(--color-champagne-300)]" aria-hidden />
              {event.registered}/{event.capacity} đã đăng ký
            </li>
          </ul>
        </div>
      </section>

      <Section className="!pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="space-y-12">
            <div>
              <h2 className="rule-gold text-2xl">Giới thiệu</h2>
              <p className="mt-6 leading-relaxed text-[var(--color-muted)]">{event.description}</p>
            </div>

            {/* Lịch trình */}
            {event.schedule.length > 0 ? (
            <div>
              <h2 className="rule-gold text-2xl">Lịch trình</h2>
              <ol className="mt-6 space-y-4">
                {event.schedule.map((item) => (
                  <li key={`${item.time}-${item.title}`} className="flex gap-5">
                    <span className="w-20 shrink-0 pt-0.5 font-mono text-sm font-medium text-[var(--color-accent)]">
                      {item.time}
                    </span>
                    <span className="relative flex-1 border-l border-[var(--color-border)] pb-5 pl-5 last:pb-0">
                      <span
                        className="absolute top-1.5 -left-[4.5px] size-2 rounded-full bg-[var(--color-champagne-400)]"
                        aria-hidden
                      />
                      <span className="block font-medium">{item.title}</span>
                      <span className="mt-1 block text-sm text-[var(--color-muted)]">{item.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            ) : null}

            {/* Điều lệ và đối tượng */}
            {event.rules.length > 0 || event.benefits.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="rule-gold text-2xl">Điều lệ</h2>
                <ul className="mt-6 space-y-3">
                  {event.rules.map((rule) => (
                    <li key={rule} className="flex gap-3 text-sm">
                      <ScrollText className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="rule-gold text-2xl">Quyền lợi</h2>
                <ul className="mt-6 space-y-3">
                  {event.benefits.map((benefit) => (
                    <li key={benefit} className="flex gap-3 text-sm">
                      <Gift className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            ) : null}

            {/* Giải thưởng */}
            {event.prizes.length > 0 ? (
            <div>
              <h2 className="rule-gold text-2xl">Giải thưởng</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {event.prizes.map((prize) => (
                  <li
                    key={prize}
                    className="flex gap-3 rounded-[var(--radius-md)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-4 text-sm text-[var(--color-champagne-800)]"
                  >
                    <Award className="mt-0.5 size-4 shrink-0" aria-hidden />
                    {prize}
                  </li>
                ))}
              </ul>
            </div>
            ) : null}

            {/* Thông tin nhanh */}
            <div>
              <h2 className="rule-gold text-2xl">Thông tin sự kiện</h2>
              <SpecList
                className="mt-6"
                items={[
                  { label: 'Loại sự kiện', value: EVENT_TYPE_LABELS[event.type] },
                  { label: 'Thời gian', value: `${formatDateLong(event.startsAt)}` },
                  { label: 'Giờ', value: `${formatTime(event.startsAt)} – ${formatTime(event.endsAt)}` },
                  { label: 'Địa điểm', value: event.location },
                  { label: 'Đối tượng', value: event.audience },
                  { label: 'Phí tham dự', value: event.fee === 0 ? 'Miễn phí' : formatCurrency(event.fee) },
                  { label: 'Sức chứa', value: `${event.capacity} người` },
                  { label: 'Đã đăng ký', value: `${event.registered} người` },
                ]}
              />
            </div>

            {/* Danh sách đăng ký */}
            {event.participants.length > 0 ? (
            <div>
              <h2 className="rule-gold text-2xl">Danh sách đăng ký</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {event.participants.map((participant) => (
                  <li
                    key={participant.name}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4"
                  >
                    <p className="text-sm font-medium">{participant.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">{participant.note}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-[var(--color-muted)]">
                Danh sách hiển thị dạng rút gọn để bảo vệ thông tin cá nhân của người tham dự.
              </p>
            </div>
            ) : null}

            {/* Nhà tài trợ */}
            {event.sponsors.length > 0 ? (
            <div>
              <h2 className="rule-gold text-2xl">Nhà tài trợ và đối tác</h2>
              <ul className="mt-6 flex flex-wrap gap-3">
                {event.sponsors.map((sponsor) => (
                  <li
                    key={sponsor}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 text-sm font-medium"
                  >
                    {sponsor}
                  </li>
                ))}
              </ul>
            </div>
            ) : null}

            {/* FAQ */}
            {event.faqs.length > 0 ? (
            <div>
              <h2 className="rule-gold text-2xl">Câu hỏi thường gặp</h2>
              <FaqAccordion items={event.faqs} className="mt-4" />
              <FaqJsonLd items={event.faqs} />
            </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <EventRegistrationForm event={event} />
          </aside>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeader eyebrow="Sự kiện khác" title="Có thể bạn cũng quan tâm" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <EventCard key={item.id} event={item} />
          ))}
        </div>
      </Section>
    </>
  );
}
