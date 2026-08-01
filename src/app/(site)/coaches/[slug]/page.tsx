import { Award, BadgeCheck, Languages, PlayCircle, Target, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { CoachCard } from '@/components/cards/coach-card';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { FaqAccordion, FaqJsonLd } from '@/components/common/faq-accordion';
import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { InitialsAvatar, Rating, SpecList } from '@/components/ui/misc';
import { BLUR_DATA_URL } from '@/constants/media';
import { LANGUAGE_LABELS, SPECIALTY_LABELS } from '@/data/coaches';
import { CoachBookingPanel } from '@/features/coaches/coach-booking-panel';
import { formatCurrency, formatDate } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';
import { coachService } from '@/services/catalogService';

export function generateStaticParams() {
  return coachService.getAll().map((coach) => ({ slug: coach.slug }));
}

export async function generateMetadata(props: PageProps<'/coaches/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params;
  const coach = coachService.getBySlug(slug);
  if (!coach) {
    return buildMetadata({
      title: 'Không tìm thấy huấn luyện viên',
      description: 'Hồ sơ huấn luyện viên không tồn tại hoặc đã được cập nhật.',
      path: '/coaches',
      noIndex: true,
    });
  }

  return buildMetadata({
    title: `${coach.name} — ${coach.title}`,
    description: coach.bio.slice(0, 160),
    path: `/coaches/${coach.slug}`,
    image: coach.avatar,
    keywords: ['huấn luyện viên golf', coach.name, ...coach.specialties.map((s) => SPECIALTY_LABELS[s])],
  });
}

export default async function CoachDetailPage(props: PageProps<'/coaches/[slug]'>) {
  const { slug } = await props.params;
  const coach = coachService.getBySlug(slug);
  if (!coach) notFound();

  const related = coachService
    .getAll()
    .filter(
      (item) => item.slug !== coach.slug && item.specialties.some((s) => coach.specialties.includes(s)),
    )
    .slice(0, 3);

  return (
    <>
      {/* Hero hồ sơ */}
      <section className="relative isolate overflow-hidden bg-[var(--color-navy-900)] text-white">
        <div className="container-lotus py-10 md:py-14">
          <Breadcrumbs
            items={[{ label: 'Huấn luyện viên', href: '/coaches' }, { label: coach.name }]}
            inverse
            className="mb-8"
          />

          <div className="grid gap-8 md:grid-cols-[16rem_1fr] md:gap-12">
            <div className="relative aspect-[4/5] w-full max-w-64 overflow-hidden rounded-[var(--radius-lg)] border border-white/15">
              <Image
                src={coach.avatar}
                alt={`Ảnh huấn luyện viên ${coach.name}`}
                fill
                priority
                sizes="16rem"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>

            <div>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {coach.specialties.map((specialty) => (
                  <Badge key={specialty} variant="glass" size="sm">
                    {SPECIALTY_LABELS[specialty]}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl">{coach.name}</h1>
              <p className="mt-2 text-lg text-[var(--color-champagne-300)]">{coach.title}</p>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <Rating value={coach.rating} count={coach.reviewCount} className="text-white" />
                <span className="inline-flex items-center gap-2 text-white/85">
                  <Users className="size-4" aria-hidden />
                  {coach.studentCount} học viên
                </span>
                <span className="inline-flex items-center gap-2 text-white/85">
                  <Award className="size-4" aria-hidden />
                  {coach.yearsExperience} năm kinh nghiệm
                </span>
                <span className="inline-flex items-center gap-2 text-white/85">
                  <Languages className="size-4" aria-hidden />
                  {coach.languages.map((lang) => LANGUAGE_LABELS[lang]).join(' · ')}
                </span>
              </div>

              <p className="mt-6 max-w-2xl leading-relaxed text-[var(--color-navy-100)]">{coach.bio}</p>
            </div>
          </div>
        </div>
      </section>

      <Section className="!pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div className="space-y-12">
            {/* Triết lý */}
            <div>
              <h2 className="rule-gold text-2xl">Phương pháp huấn luyện</h2>
              <blockquote className="mt-6 border-l-2 border-[var(--color-champagne-400)] pl-5 text-lg leading-relaxed italic">
                “{coach.philosophy}”
              </blockquote>
            </div>

            {/* Video giới thiệu */}
            <div>
              <h2 className="rule-gold text-2xl">Video giới thiệu</h2>
              <div className="mt-6 flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-14 text-center">
                <PlayCircle className="mb-4 size-12 text-[var(--color-stone-400)]" aria-hidden />
                <p className="text-sm font-medium">Video đang được chuẩn bị</p>
                <p className="mt-1.5 max-w-md text-sm text-[var(--color-muted)]">{coach.introVideoNote}</p>
              </div>
            </div>

            {/* Phù hợp với ai */}
            <div>
              <h2 className="rule-gold text-2xl">Phù hợp với ai</h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {coach.suitableFor.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4 text-sm"
                  >
                    <Target className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Chứng chỉ & kinh nghiệm */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="rule-gold text-2xl">Chứng chỉ</h2>
                <ul className="mt-6 space-y-3">
                  {coach.certifications.map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="rule-gold text-2xl">Kinh nghiệm nổi bật</h2>
                <ul className="mt-6 space-y-3">
                  {coach.careerHighlights.map((item) => (
                    <li key={item} className="flex gap-3 text-sm">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-champagne-400)]"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Chương trình */}
            <div>
              <h2 className="rule-gold text-2xl">Chương trình học</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {coach.programs.map((program, index) => (
                  <div
                    key={program.id}
                    className={`flex flex-col rounded-[var(--radius-lg)] border p-5 ${
                      index === 1
                        ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                        : 'border-[var(--color-border)]'
                    }`}
                  >
                    {index === 1 ? (
                      <Badge variant="accent" size="sm" className="mb-3 self-start">
                        Được chọn nhiều nhất
                      </Badge>
                    ) : null}
                    <h3 className="text-base">{program.name}</h3>
                    <p className="mt-2 flex-1 text-sm text-[var(--color-muted)]">{program.description}</p>
                    <p className="mt-4 font-[family-name:var(--font-display)] text-xl">
                      {formatCurrency(program.price)}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">
                      ≈ {formatCurrency(Math.round(program.price / program.sessions))} / buổi
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Thông số */}
            <div>
              <h2 className="rule-gold text-2xl">Thông tin nhanh</h2>
              <SpecList
                className="mt-6"
                items={[
                  { label: 'Chức danh', value: coach.title },
                  { label: 'Kinh nghiệm', value: `${coach.yearsExperience} năm` },
                  {
                    label: 'Chuyên môn',
                    value: coach.specialties.map((s) => SPECIALTY_LABELS[s]).join(', '),
                  },
                  {
                    label: 'Ngôn ngữ',
                    value: coach.languages.map((lang) => LANGUAGE_LABELS[lang]).join(', '),
                  },
                  { label: 'Học phí mỗi buổi', value: formatCurrency(coach.pricePerSession) },
                  { label: 'Số học viên đã đồng hành', value: `${coach.studentCount} học viên` },
                ]}
              />
            </div>

            {/* Đánh giá */}
            <div>
              <h2 className="rule-gold text-2xl">Học viên nói gì</h2>
              <div className="mt-6 space-y-4">
                {coach.reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5"
                  >
                    <div className="flex items-start gap-4">
                      <InitialsAvatar initials={review.author.slice(0, 2).toUpperCase()} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium">{review.author}</p>
                          <p className="text-xs text-[var(--color-muted)]">{formatDate(review.date)}</p>
                        </div>
                        <Rating value={review.rating} size="sm" className="mt-1" />
                        <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="rule-gold text-2xl">Câu hỏi thường gặp</h2>
              <FaqAccordion items={coach.faqs} className="mt-4" />
              <FaqJsonLd items={coach.faqs} />
            </div>
          </div>

          <CoachBookingPanel coach={coach} />
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="surface">
          <SectionHeader
            eyebrow="Gợi ý thêm"
            title="Huấn luyện viên có chuyên môn tương tự"
            description="Nếu lịch của huấn luyện viên bạn chọn chưa phù hợp, đây là những người có thế mạnh gần nhất."
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <CoachCard key={item.id} coach={item} />
            ))}
          </div>
        </Section>
      ) : null}
    </>
  );
}
