import { ArrowRight, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { getIcon } from '@/components/common/icon-registry';
import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { StatTile } from '@/components/common/stat-tile';
import { Button } from '@/components/ui/button';
import { SpecList } from '@/components/ui/misc';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import { BRAND_VALUES, SITE } from '@/constants/site';
import {
  ABOUT_STATS,
  BRAND_STORY,
  COURSE_STANDARDS,
  MILESTONES,
  SERVICE_PHILOSOPHY,
  TEAM_STRUCTURE,
  TECHNOLOGY_PILLARS,
  VISION_MISSION,
} from '@/data/about';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Về Lotus Golf Center',
  description:
    'Câu chuyện, tầm nhìn và triết lý dịch vụ của Lotus Golf Center — hệ sinh thái golf đô thị kết hợp sân tập, học viện, hội viên, sự kiện và không gian thư giãn.',
  path: '/about',
  image: MEDIA.hero.about,
  keywords: ['Lotus Golf Center', 'giới thiệu sân tập golf', 'học viện golf'],
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Về Lotus"
        title="Golf thông minh. Dịch vụ từ trái tim. Kết nối bền vững."
        description={SITE.description}
        image={MEDIA.hero.about}
        breadcrumbs={[{ label: 'Về Lotus' }]}
        size="lg"
      />

      {/* Câu chuyện thương hiệu */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-3">Câu chuyện thương hiệu</p>
            <h2 className="text-3xl md:text-4xl">Vì sao Lotus ra đời</h2>

            <div className="mt-8 space-y-8">
              {BRAND_STORY.map((block, index) => (
                <Reveal key={block.heading} delay={index * 0.06}>
                  <div>
                    <h3 className="text-xl">{block.heading}</h3>
                    <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{block.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="lg:pt-16">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-muted-surface)]">
              <Image
                src={MEDIA.facility.academy}
                alt="Không gian Lotus Golf Center"
                fill
                sizes="(min-width: 1024px) 35vw, 92vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {ABOUT_STATS.map((stat) => (
                <StatTile key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Tầm nhìn & sứ mệnh */}
      <Section tone="navy">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="h-full rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-8">
              <Quote className="mb-5 size-8 text-[var(--color-champagne-300)]" aria-hidden />
              <h2 className="text-2xl text-white">Tầm nhìn</h2>
              <p className="mt-4 leading-relaxed text-[var(--color-navy-100)]">{VISION_MISSION.vision}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="h-full rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-8">
              <Quote className="mb-5 size-8 text-[var(--color-champagne-300)]" aria-hidden />
              <h2 className="text-2xl text-white">Sứ mệnh</h2>
              <p className="mt-4 leading-relaxed text-[var(--color-navy-100)]">{VISION_MISSION.mission}</p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Giá trị cốt lõi */}
      <Section>
        <SectionHeader
          eyebrow="Giá trị cốt lõi"
          title="Sáu điều Lotus giữ trong mọi quyết định"
          description="Không phải khẩu hiệu treo tường — đây là tiêu chí để đội ngũ tự đánh giá công việc mỗi ngày."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BRAND_VALUES.map((value, index) => (
            <Reveal key={value.title} delay={Math.min(index * 0.05, 0.25)}>
              <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
                <span className="mb-4 flex size-10 items-center justify-center rounded-full bg-[var(--color-champagne-100)] font-[family-name:var(--font-display)] text-base text-[var(--color-champagne-800)]">
                  {index + 1}
                </span>
                <h3 className="text-lg">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{value.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Triết lý dịch vụ */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Triết lý dịch vụ"
          title="Ba nguồn cảm hứng cho cách Lotus phục vụ"
          description="Chúng tôi học từ những chuẩn mực đã được kiểm chứng, rồi điều chỉnh cho phù hợp với người Việt."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {SERVICE_PHILOSOPHY.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.07}>
              <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Công nghệ */}
      <Section>
        <SectionHeader
          eyebrow="Công nghệ"
          title="Hệ thống lo phần lặp lại, con người lo phần quan tâm"
          description="Công nghệ ở Lotus không nhằm thay thế con người — nó giải phóng thời gian để đội ngũ dành cho khách hàng."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TECHNOLOGY_PILLARS.map((pillar, index) => {
            const Icon = getIcon(pillar.icon);
            return (
              <Reveal key={pillar.title} delay={Math.min(index * 0.05, 0.25)}>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-[var(--color-golf-50)] text-[var(--color-accent)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-base">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{pillar.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Đội ngũ */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Đội ngũ"
          title="Bốn nhóm cùng vận hành một trải nghiệm"
          description="Mỗi nhóm có tiêu chuẩn riêng, nhưng cùng chung một cách nhìn về dịch vụ."
        />

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {TEAM_STRUCTURE.map((team, index) => {
            const Icon = getIcon(team.icon);
            return (
              <Reveal key={team.name} delay={index * 0.06}>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-[var(--color-navy-700)] text-[var(--color-champagne-200)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-base">{team.name}</h3>
                  <p className="mt-1 text-xs font-medium text-[var(--color-accent)]">{team.count}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{team.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Tiêu chuẩn sân */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="eyebrow mb-3">Tiêu chuẩn sân</p>
            <h2 className="text-3xl md:text-4xl">Những gì được kiểm tra mỗi ngày</h2>
            <p className="mt-4 leading-relaxed text-[var(--color-muted)]">
              Chất lượng không đến từ lời hứa mà từ quy trình kiểm tra đều đặn. Đây là các hạng mục đội vận
              hành rà soát trước giờ mở cửa mỗi ngày.
            </p>
            <SpecList className="mt-8" items={COURSE_STANDARDS.map((item) => ({ label: item.label, value: item.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              MEDIA.facility['driving-range'],
              MEDIA.facility['putting-green'],
              MEDIA.facility['short-game'],
              MEDIA.facility['private-bay'],
            ].map((src) => (
              <div
                key={src}
                className="relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-muted-surface)]"
              >
                <Image
                  src={src}
                  alt="Khu vực tập luyện tại Lotus Golf Center"
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Hành trình */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Hành trình phát triển"
          title="Từ ý tưởng đến hệ sinh thái"
          description="Mỗi giai đoạn giải quyết một bài toán khác nhau, nhưng đều hướng về cùng một đích."
        />

        <ol className="relative space-y-8 border-l border-[var(--color-border)] pl-8">
          {MILESTONES.map((milestone, index) => (
            <Reveal key={milestone.title} as="li" delay={Math.min(index * 0.05, 0.25)}>
              <div className="relative">
                <span
                  className="absolute top-1.5 -left-[2.3rem] size-3 rounded-full border-2 border-[var(--color-background)] bg-[var(--color-champagne-400)]"
                  aria-hidden
                />
                <p className="text-xs font-semibold tracking-widest text-[var(--color-gold)] uppercase">
                  {milestone.period}
                </p>
                <h3 className="mt-2 text-xl">{milestone.title}</h3>
                <p className="mt-2 max-w-2xl leading-relaxed text-[var(--color-muted)]">
                  {milestone.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <Section tone="navy" className="!py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl text-white md:text-4xl">Cách tốt nhất để hiểu Lotus là đến thử một buổi</h2>
          <p className="mt-4 text-[var(--color-navy-100)]">
            Không cần biết chơi golf, không cần mang gì theo. Chỉ cần đặt lịch và đến.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href="/booking">
                Đặt lịch trải nghiệm
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="inverse-outline" size="lg">
              <Link href="/contact">Liên hệ với Lotus</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
