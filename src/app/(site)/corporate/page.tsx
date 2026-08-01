import { ArrowRight, Check, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { FaqAccordion, FaqJsonLd } from '@/components/common/faq-accordion';
import { getIcon } from '@/components/common/icon-registry';
import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import { CORPORATE_BENEFITS, CORPORATE_CASE_STUDIES, CORPORATE_PROCESS } from '@/data/corporate';
import { getFaqsByGroup } from '@/data/faqs';
import { CorporateQuoteForm } from '@/features/corporate/corporate-quote-form';
import { formatCurrency } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';
import { corporateService } from '@/services/catalogService';

export const metadata = buildMetadata({
  title: 'Golf cho doanh nghiệp',
  description:
    'Tổ chức Corporate Golf Day, team-building, tiếp khách hàng và chương trình phúc lợi bằng golf ngay trong nội thành. Lotus lo toàn bộ khâu tổ chức, có huấn luyện viên hỗ trợ nhóm chưa biết chơi.',
  path: '/corporate',
  image: MEDIA.hero.corporate,
  keywords: ['golf doanh nghiệp', 'corporate golf day', 'team building golf', 'tiếp khách hàng'],
});

export default function CorporatePage() {
  const packages = corporateService.getPackages();
  const faqs = getFaqsByGroup('corporate');
  const gallery = [
    MEDIA.facility['driving-range'],
    MEDIA.facility.networking,
    MEDIA.facility.lounge,
    MEDIA.facility['vip-area'],
    MEDIA.facility['putting-green'],
    MEDIA.facility.academy,
  ];

  return (
    <>
      <PageHero
        eyebrow="Golf cho doanh nghiệp"
        title="Một buổi golf, nhiều mục tiêu cùng đạt được"
        description="Gắn kết nội bộ, tiếp khách hàng hay chăm sóc nhân viên — tất cả trong một buổi, ngay trong nội thành, không mất nửa ngày di chuyển."
        image={MEDIA.hero.corporate}
        breadcrumbs={[{ label: 'Doanh nghiệp' }]}
        actions={
          <>
            <Button asChild variant="gold" size="lg">
              <Link href="#bao-gia">
                Nhận báo giá
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="inverse-outline" size="lg">
              <Link href="#goi-dich-vu">Xem gói dịch vụ</Link>
            </Button>
          </>
        }
      />

      {/* Lợi ích */}
      <Section>
        <SectionHeader
          eyebrow="Vì sao chọn Lotus"
          title="Khác biệt so với tổ chức tại sân golf 18 hố"
          description="Sân golf ngoại ô đòi hỏi người chơi phải biết chơi và mất trọn một ngày. Ở Lotus, mọi nhân viên đều tham gia được."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CORPORATE_BENEFITS.map((benefit, index) => {
            const Icon = getIcon(benefit.icon);
            return (
              <Reveal key={benefit.title} delay={Math.min(index * 0.05, 0.25)}>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-[var(--color-golf-50)] text-[var(--color-accent)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-base">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Gói dịch vụ */}
      <Section tone="surface" id="goi-dich-vu">
        <SectionHeader
          eyebrow="Gói dịch vụ"
          title="Tám hình thức tổ chức khác nhau"
          description="Mỗi gói có quy mô và mục tiêu riêng. Lotus tuỳ chỉnh chi tiết theo yêu cầu của từng doanh nghiệp."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {packages.map((pkg, index) => (
            <Reveal key={pkg.id} delay={Math.min(index * 0.05, 0.28)}>
              <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-muted-surface)]">
                  <Image
                    src={pkg.image}
                    alt={`Gói ${pkg.name}`}
                    fill
                    sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 92vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg leading-snug">{pkg.name}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{pkg.summary}</p>

                  <dl className="mt-4 space-y-1.5 text-xs text-[var(--color-muted)]">
                    <div className="flex items-center gap-2">
                      <Users className="size-3.5 shrink-0" aria-hidden />
                      <dt className="sr-only">Quy mô</dt>
                      <dd>{pkg.idealGroupSize}</dd>
                    </div>
                    <div>
                      <dt className="sr-only">Thời lượng</dt>
                      <dd>{pkg.durationNote}</dd>
                    </div>
                  </dl>

                  <ul className="mt-4 space-y-1.5 text-sm text-[var(--color-muted)]">
                    {pkg.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                        {outcome}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5">
                    <p className="text-xs text-[var(--color-muted)]">Từ</p>
                    <p className="font-[family-name:var(--font-display)] text-xl">
                      {formatCurrency(pkg.priceFrom, { compact: true })}
                    </p>
                    <Button asChild variant="outline" size="sm" block className="mt-4">
                      <Link href="#bao-gia">Nhận báo giá</Link>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Quy trình */}
      <Section>
        <SectionHeader
          eyebrow="Quy trình tổ chức"
          title="Sáu bước, một đầu mối duy nhất"
          description="Bạn làm việc với một người phụ trách xuyên suốt từ khảo sát đến báo cáo sau sự kiện."
        />

        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CORPORATE_PROCESS.map((step, index) => (
            <Reveal key={step.step} as="li" delay={Math.min(index * 0.05, 0.25)}>
              <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] p-6">
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

      {/* Case study */}
      <Section tone="navy">
        <SectionHeader
          eyebrow="Case study"
          title="Doanh nghiệp đã tổ chức tại Lotus"
          description="Các tình huống thực tế được mô tả ẩn danh theo yêu cầu bảo mật của doanh nghiệp."
          inverse
        />

        <div className="grid gap-6 md:grid-cols-2">
          {CORPORATE_CASE_STUDIES.map((study, index) => (
            <Reveal key={study.id} delay={Math.min(index * 0.06, 0.24)}>
              <article className="h-full rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <Badge variant="glass" size="sm">
                    {study.industry}
                  </Badge>
                  <span className="text-sm text-[var(--color-navy-200)]">{study.participants} người tham dự</span>
                </div>

                <h3 className="text-lg text-white">{study.headline}</h3>

                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-[var(--color-champagne-300)]">Thách thức</dt>
                    <dd className="mt-1 text-[var(--color-navy-100)]">{study.challenge}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-champagne-300)]">Giải pháp</dt>
                    <dd className="mt-1 text-[var(--color-navy-100)]">{study.solution}</dd>
                  </div>
                  <div>
                    <dt className="text-[var(--color-champagne-300)]">Kết quả</dt>
                    <dd className="mt-1 text-white">{study.result}</dd>
                  </div>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Gallery */}
      <Section>
        <SectionHeader
          eyebrow="Không gian"
          title="Các khu vực dùng cho sự kiện doanh nghiệp"
          align="center"
        />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {gallery.map((src, index) => (
            <div
              key={src}
              className={`relative overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-muted-surface)] ${
                index === 0 ? 'col-span-2 aspect-[16/9] md:col-span-2 md:row-span-2 md:aspect-auto' : 'aspect-[4/3]'
              }`}
            >
              <Image
                src={src}
                alt="Không gian tổ chức sự kiện tại Lotus Golf Center"
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover transition-transform duration-500 hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Form + FAQ */}
      <Section tone="surface" id="bao-gia">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-3">Bắt đầu</p>
            <h2 className="text-3xl md:text-4xl">Nhận báo giá cho sự kiện của bạn</h2>
            <p className="mt-4 text-[var(--color-muted)]">
              Điền thông tin cơ bản, Lotus sẽ liên hệ trong 24 giờ làm việc để làm rõ yêu cầu và gửi báo giá
              chi tiết kèm 2–3 phương án để bạn lựa chọn.
            </p>

            <div className="mt-8">
              <h3 className="text-lg">Câu hỏi thường gặp</h3>
              <FaqAccordion items={faqs} className="mt-3" />
              <FaqJsonLd items={faqs} />
            </div>
          </div>

          <CorporateQuoteForm />
        </div>
      </Section>
    </>
  );
}
