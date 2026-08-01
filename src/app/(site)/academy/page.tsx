import { ArrowRight, Check, Clock, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { CoachCard } from '@/components/cards/coach-card';
import { FaqAccordion, FaqJsonLd } from '@/components/common/faq-accordion';
import { getIcon } from '@/components/common/icon-registry';
import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { StatTile } from '@/components/common/stat-tile';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import {
  ACADEMY_ACHIEVEMENTS,
  ACADEMY_JOURNEY,
  ACADEMY_STUDENT_RESULTS,
  ACADEMY_TECHNOLOGY,
} from '@/data/academy';
import { getFaqsByGroup } from '@/data/faqs';
import { formatCurrency, formatDuration } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';
import { academyService, coachService } from '@/services/catalogService';

export const metadata = buildMetadata({
  title: 'Lotus Golf Academy — Học golf bài bản',
  description:
    '12 chương trình đào tạo golf từ căn bản đến chuẩn bị thi đấu: golf cho người mới, trẻ em, doanh nhân, putting, short game, swing và phân tích 3D. Lộ trình cá nhân hoá theo mục tiêu của bạn.',
  path: '/academy',
  image: MEDIA.hero.academy,
  keywords: ['golf academy', 'học golf', 'khoá học golf', 'golf cho người mới', 'lớp golf trẻ em'],
});

const LEVEL_LABELS: Record<string, string> = {
  foundation: 'Nền tảng',
  improver: 'Nâng cao dần',
  advanced: 'Chuyên sâu',
  competition: 'Thi đấu',
};

export default function AcademyPage() {
  const programs = academyService.getPrograms();
  const coaches = coachService.getFeatured(4);
  const faqs = getFaqsByGroup('coach');

  return (
    <>
      <PageHero
        eyebrow="Lotus Golf Academy"
        title="Học golf theo lộ trình, không theo cảm tính"
        description="Mỗi học viên bắt đầu bằng một buổi đánh giá đầu vào để biết chính xác mình đang ở đâu. Từ đó, huấn luyện viên xây lộ trình có mục tiêu đo được cho từng giai đoạn."
        image={MEDIA.hero.academy}
        breadcrumbs={[{ label: 'Academy' }]}
        actions={
          <>
            <Button asChild variant="gold" size="lg">
              <Link href={{ pathname: '/booking', query: { experience: 'first-swing' } }}>
                Đặt buổi đánh giá đầu vào
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="inverse-outline" size="lg">
              <Link href="/coaches">Xem huấn luyện viên</Link>
            </Button>
          </>
        }
      />

      {/* Thành tích */}
      <Section className="!pb-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACADEMY_ACHIEVEMENTS.map((item, index) => (
            <Reveal key={item.label} delay={index * 0.06}>
              <StatTile value={item.value} label={item.label} tone={index === 1 ? 'accent' : 'default'} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Chương trình */}
      <Section>
        <SectionHeader
          eyebrow="Chương trình đào tạo"
          title="12 chương trình cho mọi trình độ và mục tiêu"
          description="Từ người chưa từng cầm gậy đến người chuẩn bị thi đấu. Mỗi chương trình có mục tiêu đầu ra rõ ràng."
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {programs.map((program, index) => {
            const Icon = getIcon(program.icon);
            return (
              <Reveal key={program.id} delay={Math.min(index * 0.04, 0.24)}>
                <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                  <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-muted-surface)]">
                    <Image
                      src={program.image}
                      alt={`Chương trình ${program.name}`}
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 92vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute top-3 right-3">
                      <Badge variant="glass" size="sm">
                        {LEVEL_LABELS[program.level]}
                      </Badge>
                    </span>
                    <span className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-full bg-[var(--color-surface-raised)]/90 text-[var(--color-accent)] backdrop-blur-sm">
                      <Icon className="size-4.5" aria-hidden />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg">{program.name}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{program.summary}</p>

                  <ul className="mt-4 space-y-1.5 text-sm text-[var(--color-muted)]">
                    {program.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                        {outcome}
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-4 text-xs">
                    <div>
                      <dt className="text-[var(--color-muted)]">Đối tượng</dt>
                      <dd className="mt-0.5 font-medium">{program.audience}</dd>
                    </div>
                    <div>
                      <dt className="text-[var(--color-muted)]">Quy mô lớp</dt>
                      <dd className="mt-0.5 font-medium">{program.groupSize}</dd>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[var(--color-muted)]">
                      <Users className="size-3.5" aria-hidden />
                      {program.sessions} buổi
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-[var(--color-muted)]">
                      <Clock className="size-3.5" aria-hidden />
                      {formatDuration(program.durationMinutes)}/buổi
                    </div>
                  </dl>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div>
                      <p className="text-xs text-[var(--color-muted)]">Học phí từ</p>
                      <p className="font-[family-name:var(--font-display)] text-xl">
                        {formatCurrency(program.priceFrom)}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={{ pathname: '/booking', query: { experience: 'first-swing' } }}>
                        Đăng ký
                      </Link>
                    </Button>
                  </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Lộ trình học viên */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Hành trình học viên"
          title="Tám bước từ buổi đầu tiên đến khi hoàn thành"
          description="Bạn luôn biết mình đang ở đâu trong lộ trình và bước tiếp theo là gì."
        />

        <ol className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {ACADEMY_JOURNEY.map((step, index) => (
            <Reveal key={step.step} as="li" delay={Math.min(index * 0.05, 0.3)}>
              <div className="relative h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
                <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-[var(--color-navy-700)] font-[family-name:var(--font-display)] text-base text-[var(--color-champagne-200)]">
                  {step.step}
                </span>
                <h3 className="text-base">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Công nghệ đào tạo */}
      <Section>
        <SectionHeader
          eyebrow="Công nghệ đào tạo"
          title="Sửa dựa trên số liệu, không dựa trên cảm giác"
          description="Cảm giác có thể sai. Thiết bị đo giúp bạn và huấn luyện viên nhìn thấy chính xác điều gì đang xảy ra trong cú đánh."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ACADEMY_TECHNOLOGY.map((item, index) => {
            const Icon = getIcon(item.icon);
            return (
              <Reveal key={item.name} delay={index * 0.06}>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-[var(--color-champagne-50)] text-[var(--color-gold)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-base">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Thành tích học viên */}
      <Section tone="navy">
        <SectionHeader
          eyebrow="Kết quả học viên"
          title="Trước và sau khi theo lộ trình"
          description="Những thay đổi cụ thể mà học viên Lotus đạt được sau khi hoàn thành chương trình."
          inverse
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {ACADEMY_STUDENT_RESULTS.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.06}>
              <div className="h-full rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-6">
                <p className="text-sm font-medium text-[var(--color-champagne-300)]">{item.program}</p>
                <p className="mt-3 text-sm text-[var(--color-navy-100)]">
                  <span className="font-medium text-white">Trước:</span> {item.before}
                </p>
                <p className="mt-2 text-sm text-[var(--color-navy-100)]">
                  <span className="font-medium text-white">Sau:</span> {item.after}
                </p>
                <p className="mt-4 text-xs text-[var(--color-navy-200)]">{item.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Huấn luyện viên */}
      <Section>
        <SectionHeader
          eyebrow="Đội ngũ"
          title="Huấn luyện viên phụ trách các chương trình"
          action={
            <Button asChild variant="outline">
              <Link href="/coaches">
                Xem tất cả huấn luyện viên
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      </Section>

      {/* FAQ + CTA */}
      <Section tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-3">Câu hỏi thường gặp</p>
            <h2 className="text-3xl md:text-4xl">Trước khi bắt đầu học</h2>
            <p className="mt-4 text-[var(--color-muted)]">
              Những điều học viên hay hỏi nhất trước buổi học đầu tiên.
            </p>

            <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-6">
              <h3 className="text-lg">Bắt đầu bằng buổi đánh giá đầu vào</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-champagne-800)]">
                45 phút đo hiện trạng và xây lộ trình. Không ràng buộc phải mua gói học sau đó.
              </p>
              <Button asChild variant="primary" className="mt-5">
                <Link href={{ pathname: '/booking', query: { experience: 'first-swing' } }}>
                  Đặt buổi đánh giá
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          <div>
            <FaqAccordion items={faqs} />
            <FaqJsonLd items={faqs} />
          </div>
        </div>
      </Section>
    </>
  );
}
