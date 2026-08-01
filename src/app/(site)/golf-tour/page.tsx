import { Check, Clock, Users } from 'lucide-react';
import Image from 'next/image';

import { getIcon } from '@/components/common/icon-registry';
import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import { AGENCY_BENEFITS, TOUR_PARTNERS } from '@/data/tours';
import { TourForms } from '@/features/tours/tour-forms';
import { formatCurrency } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';
import { tourService } from '@/services/catalogService';

export const metadata = buildMetadata({
  title: 'Golf Tour và cổng đối tác du lịch',
  description:
    'Bảy gói Golf Tour cho khách đoàn và khách quốc tế: Golf Experience Tour, Weekend Golf, Golf and Bento, Golf and Stay, City Golf Tour và gói dành riêng cho doanh nghiệp.',
  path: '/golf-tour',
  image: MEDIA.hero.tour,
  keywords: ['golf tour', 'tour golf Việt Nam', 'đối tác du lịch golf', 'golf cho khách đoàn'],
});

export default function GolfTourPage() {
  const packages = tourService.getPackages();

  return (
    <>
      <PageHero
        eyebrow="Golf Tour"
        title="Golf như một trải nghiệm du lịch"
        description="Gói tour thiết kế cho khách đoàn, kể cả khi chưa ai trong đoàn từng chơi golf. Có hướng dẫn viên đi cùng và phục vụ song ngữ cho khách quốc tế."
        image={MEDIA.hero.tour}
        breadcrumbs={[{ label: 'Golf Tour' }]}
      />

      {/* Gói tour */}
      <Section>
        <SectionHeader
          eyebrow="Gói tour"
          title="Bảy chương trình cho các nhóm khách khác nhau"
          description="Từ nửa ngày trải nghiệm đến gói kết hợp lưu trú. Mọi gói đều bao gồm dụng cụ và hướng dẫn cơ bản."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg, index) => (
            <Reveal key={pkg.id} delay={Math.min(index * 0.05, 0.25)}>
              <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-muted-surface)]">
                  <Image
                    src={pkg.image}
                    alt={`Gói ${pkg.name}`}
                    fill
                    sizes="(min-width: 1280px) 32vw, (min-width: 768px) 45vw, 92vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                  <Badge variant="glass" size="sm" className="absolute top-3 left-3">
                    {pkg.durationLabel}
                  </Badge>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg leading-snug">{pkg.name}</h3>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{pkg.summary}</p>

                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--color-muted)]">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5" aria-hidden />
                      {pkg.minPax}–{pkg.maxPax} khách
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="size-3.5" aria-hidden />
                      {pkg.durationLabel}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-[var(--color-muted)]">Bao gồm</p>
                    <ul className="space-y-1.5 text-sm text-[var(--color-muted)]">
                      {pkg.includes.slice(0, 4).map((item) => (
                        <li key={item} className="flex gap-2">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <details className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
                    <summary className="cursor-pointer text-sm font-medium">Xem lịch trình mẫu</summary>
                    <ol className="mt-3 space-y-2.5">
                      {pkg.itinerary.map((item) => (
                        <li key={`${item.time}-${item.activity}`} className="flex gap-3 text-xs">
                          <span className="w-24 shrink-0 font-mono font-medium text-[var(--color-accent)]">
                            {item.time}
                          </span>
                          <span className="text-[var(--color-muted)]">{item.activity}</span>
                        </li>
                      ))}
                    </ol>
                  </details>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div>
                      <p className="text-xs text-[var(--color-muted)]">Giá từ</p>
                      <p className="font-[family-name:var(--font-display)] text-xl">
                        {formatCurrency(pkg.priceFrom)}
                        <span className="text-sm font-normal text-[var(--color-muted)]"> / khách</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {pkg.partners.map((partner) => (
                      <Badge key={partner} variant="neutral" size="sm">
                        {partner}
                      </Badge>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Dành cho công ty du lịch */}
      <Section tone="navy">
        <SectionHeader
          eyebrow="Dành cho công ty du lịch"
          title="Trở thành đối tác của Lotus"
          description="Chương trình hợp tác dành cho công ty lữ hành muốn bổ sung golf vào sản phẩm của mình."
          inverse
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGENCY_BENEFITS.map((benefit, index) => {
            const Icon = getIcon(benefit.icon);
            return (
              <Reveal key={benefit.title} delay={Math.min(index * 0.05, 0.28)}>
                <div className="h-full rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-6">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-[var(--color-champagne-300)]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="text-base text-white">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-navy-100)]">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-[var(--color-navy-200)]">
          Mức giá đối tác và tỷ lệ hoa hồng cụ thể được trao đổi trực tiếp và ghi trong hợp đồng hợp tác.
        </p>
      </Section>

      {/* Đối tác */}
      <Section>
        <SectionHeader eyebrow="Đối tác" title="Các đơn vị đang hợp tác cùng Lotus" align="center" />
        <ul className="flex flex-wrap justify-center gap-3">
          {TOUR_PARTNERS.map((partner) => (
            <li
              key={partner}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-4 text-sm font-medium"
            >
              {partner}
            </li>
          ))}
        </ul>
      </Section>

      {/* Forms */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Gửi yêu cầu"
          title="Đặt đoàn hoặc đăng ký làm đại lý"
          description="Chọn đúng biểu mẫu bên dưới. Lotus phản hồi trong 24 giờ làm việc."
          align="center"
        />
        <TourForms />
      </Section>
    </>
  );
}
