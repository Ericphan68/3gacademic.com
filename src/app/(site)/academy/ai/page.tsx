import { ArrowRight, Award, Check, Cpu, LineChart, Sparkles, Target, UserRound } from 'lucide-react';
import Link from 'next/link';

import { PageHero } from '@/components/common/page-hero';
import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MEDIA } from '@/constants/media';
import { AI_ACADEMY as A } from '@/data/ai-academy';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Lotus AI Golf Academy — Học Golf ứng dụng AI',
  description:
    'Lotus AI Golf Academy: chương trình đào tạo Golf ứng dụng AI theo lộ trình 6 cấp độ (Level 0–5), phân tích swing bằng AI, hồ sơ AI Golf ID, chương trình Lotus 90 ngày và AI Golf Camp. Học bằng công nghệ, luyện bằng dữ liệu.',
  path: '/academy/ai',
  image: MEDIA.hero.academy,
  keywords: ['học golf AI', 'AI golf academy', 'phân tích swing AI', 'học golf công nghệ', 'Lotus AI Golf'],
});

export default function AiAcademyPage() {
  return (
    <>
      <PageHero
        eyebrow={A.slogan}
        title={A.brand}
        description={A.tagline}
        image={MEDIA.hero.academy}
        breadcrumbs={[{ label: 'Học golf', href: '/academy' }, { label: 'Học viện Golf AI' }]}
        actions={
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/booking">
                Đăng ký trải nghiệm
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="inverse-outline" size="lg">
              <Link href="/contact">Tư vấn lộ trình</Link>
            </Button>
          </div>
        }
      />

      {/* Giới thiệu + triết lý 3G */}
      <Section>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-[var(--color-muted)]">{A.intro}</p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {A.philosophy3G.map((p) => (
            <div
              key={p.key}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 text-center"
            >
              <p className="font-[family-name:var(--font-display)] text-xl text-[var(--color-accent)]">{p.key}</p>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5 tầng công nghệ AI */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Công nghệ"
          title="5 tầng công nghệ AI"
          description="Mỗi cú swing được ghi nhận, phân tích và chuyển thành bài tập cá nhân hoá."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {A.aiTiers.map((t, i) => (
            <div
              key={t.name}
              className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5"
            >
              <span className="mb-3 flex size-9 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-sm font-medium text-[var(--color-accent)]">
                {i + 1}
              </span>
              <p className="font-medium">{t.name}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]">{t.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm">
          {A.flow.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-2">
              <span className="rounded-full border border-[var(--color-border-strong)] px-3 py-1 text-[var(--color-muted)]">
                {step}
              </span>
              {i < A.flow.length - 1 ? (
                <ArrowRight className="size-3.5 text-[var(--color-accent)]" aria-hidden />
              ) : null}
            </span>
          ))}
        </div>
      </Section>

      {/* Lộ trình 6 cấp độ */}
      <Section>
        <SectionHeader
          eyebrow="Lộ trình"
          title="6 cấp độ từ người mới đến chuyên nghiệp"
          description="Mỗi cấp độ có mục tiêu, thời lượng và ứng dụng AI rõ ràng."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          {A.levels.map((lv, i) => (
            <div
              key={lv.level}
              className={`flex flex-col rounded-[var(--radius-xl)] border p-6 ${
                i === 0
                  ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-raised)]'
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <Badge variant={i === 0 ? 'gold' : 'neutral'} size="sm">
                  {lv.level}
                </Badge>
                {lv.duration ? (
                  <span className="text-xs text-[var(--color-muted)]">{lv.duration}</span>
                ) : null}
              </div>
              <h3 className="text-xl">{lv.name}</h3>
              <p className="mt-1 text-sm text-[var(--color-accent)]">{lv.tagline}</p>
              {lv.forWho ? (
                <p className="mt-2 text-xs text-[var(--color-muted)]">Dành cho: {lv.forWho}</p>
              ) : null}

              <ul className="mt-4 flex-1 space-y-2 text-sm text-[var(--color-muted)]">
                {lv.highlights.map((h) => (
                  <li key={h} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {lv.output ? (
                <p className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-foreground)]">
                  🎯 {lv.output}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {/* Tính năng AI */}
      <Section tone="surface">
        <SectionHeader eyebrow="Cá nhân hoá" title="Công nghệ đồng hành cùng bạn" />
        <div className="grid gap-5 md:grid-cols-3">
          {A.features.map((f, i) => {
            const Icon = [UserRound, Cpu, LineChart][i] ?? Sparkles;
            return (
              <div
                key={f.name}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6"
              >
                <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-base">{f.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Sản phẩm nổi bật */}
      <Section>
        <SectionHeader eyebrow="Chương trình nổi bật" title="Chọn hành trình của bạn" />
        <div className="grid gap-6 md:grid-cols-2">
          {A.products.map((p, i) => (
            <div
              key={p.name}
              className="flex flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-7"
            >
              <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
                {i === 0 ? <Target className="size-5" aria-hidden /> : <Award className="size-5" aria-hidden />}
              </span>
              <h3 className="text-xl">{p.name}</h3>
              <ol className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                {p.steps.map((s, si) => (
                  <li key={s} className="flex gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[11px] font-medium text-[var(--color-accent)]">
                      {si + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-sm leading-relaxed text-[var(--color-muted)]">{p.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Thông điệp thương hiệu + CTA */}
      <Section tone="navy" className="text-center">
        <p className="font-[family-name:var(--font-display)] text-2xl text-white md:text-3xl">
          {A.brandMessageEn}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-white/80">{A.brandMessageVi}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href="/booking">
              Đăng ký trải nghiệm
              <ArrowRight aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="inverse-outline" size="lg">
            <Link href="/coaches">Gặp huấn luyện viên</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
