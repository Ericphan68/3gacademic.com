import { ArrowRight, Building2, Handshake, Plane, School } from 'lucide-react';
import Link from 'next/link';

import { getIcon } from '@/components/common/icon-registry';
import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MEDIA } from '@/constants/media';
import { CONTACT } from '@/constants/site';
import { CORPORATE_PROCESS } from '@/data/corporate';
import { AGENCY_BENEFITS, TOUR_PARTNERS } from '@/data/tours';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Cổng đối tác',
  description:
    'Chương trình hợp tác của Lotus Golf Center dành cho doanh nghiệp, công ty du lịch, trường học và đối tác ẩm thực. Quyền lợi, quy trình và cách bắt đầu.',
  path: '/partner',
  image: MEDIA.hero.corporate,
  keywords: ['đối tác golf', 'hợp tác sân tập golf', 'đại lý du lịch golf'],
});

const PARTNER_TRACKS = [
  {
    icon: Building2,
    title: 'Đối tác doanh nghiệp',
    description:
      'Doanh nghiệp muốn tổ chức sự kiện định kỳ, chương trình phúc lợi hoặc giải nội bộ theo mùa.',
    points: ['Giá theo hợp đồng năm', 'Một đầu mối phụ trách xuyên suốt', 'Báo cáo sau mỗi sự kiện'],
    href: '/corporate' as const,
    cta: 'Xem gói doanh nghiệp',
  },
  {
    icon: Plane,
    title: 'Công ty du lịch',
    description:
      'Đại lý lữ hành muốn bổ sung sản phẩm golf vào chương trình tour nội địa và inbound.',
    points: ['Giá đối tác ổn định', 'Bộ tài liệu bán hàng sẵn có', 'Hỗ trợ tại chỗ cho đoàn lớn'],
    href: '/golf-tour' as const,
    cta: 'Xem gói Golf Tour',
  },
  {
    icon: School,
    title: 'Trường học',
    description:
      'Trường phổ thông và trường quốc tế muốn đưa golf vào hoạt động ngoại khoá theo học kỳ.',
    points: ['Giáo trình theo lứa tuổi', 'Huấn luyện viên chuyên trẻ em', 'Báo cáo tiến bộ cho nhà trường'],
    href: '/corporate' as const,
    cta: 'Xem chương trình học đường',
  },
  {
    icon: Handshake,
    title: 'Đối tác dịch vụ',
    description:
      'Đơn vị F&B, khách sạn và thương hiệu muốn hợp tác cung cấp dịch vụ hoặc đồng tổ chức sự kiện.',
    points: ['Hiện diện tại điểm chạm khách hàng', 'Đồng tổ chức sự kiện', 'Trao đổi tệp khách hàng phù hợp'],
    href: '/contact' as const,
    cta: 'Liên hệ hợp tác',
  },
];

export default function PartnerPage() {
  return (
    <>
      <PageHero
        eyebrow="Cổng đối tác"
        title="Cùng Lotus mở rộng cộng đồng golf"
        description="Lotus hợp tác với doanh nghiệp, công ty du lịch, trường học và các thương hiệu dịch vụ để đưa golf đến gần hơn với nhiều người."
        image={MEDIA.hero.corporate}
        breadcrumbs={[{ label: 'Cổng đối tác' }]}
        size="sm"
      />

      {/* Bốn hướng hợp tác */}
      <Section>
        <SectionHeader
          eyebrow="Hình thức hợp tác"
          title="Bốn hướng hợp tác đang mở"
          description="Chọn hướng phù hợp với đơn vị của bạn để xem chi tiết quyền lợi và quy trình."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {PARTNER_TRACKS.map((track, index) => (
            <Reveal key={track.title} delay={index * 0.06}>
              <article className="flex h-full flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--color-golf-50)] text-[var(--color-accent)]">
                  <track.icon className="size-5" aria-hidden />
                </span>

                <h3 className="text-xl">{track.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{track.description}</p>

                <ul className="mt-4 space-y-1.5 text-sm text-[var(--color-muted)]">
                  {track.points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-[var(--color-champagne-400)]" aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>

                <Button asChild variant="outline" className="mt-auto self-start pt-0">
                  <Link href={track.href}>
                    {track.cta}
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Quyền lợi đối tác */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Quyền lợi"
          title="Những gì đối tác nhận được"
          description="Các quyền lợi dưới đây áp dụng ở mức cơ bản. Điều khoản cụ thể được thống nhất trong hợp đồng hợp tác."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AGENCY_BENEFITS.map((benefit, index) => {
            const Icon = getIcon(benefit.icon);
            return (
              <Reveal key={benefit.title} delay={Math.min(index * 0.05, 0.28)}>
                <div className="h-full rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-[var(--color-champagne-50)] text-[var(--color-gold)]">
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

      {/* Quy trình */}
      <Section>
        <SectionHeader
          eyebrow="Quy trình"
          title="Từ liên hệ đến triển khai"
          description="Quy trình áp dụng chung cho mọi hình thức hợp tác, chỉ khác ở phần khảo sát nhu cầu."
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

      {/* Đối tác hiện tại */}
      <Section tone="navy">
        <SectionHeader
          eyebrow="Mạng lưới"
          title="Đối tác đang đồng hành cùng Lotus"
          align="center"
          inverse
        />
        <ul className="flex flex-wrap justify-center gap-3">
          {[...TOUR_PARTNERS, 'Bento House', 'Highland Coffee Lab', 'Sen Vàng Sports'].map((partner) => (
            <li key={partner}>
              <Badge variant="glass" size="lg">
                {partner}
              </Badge>
            </li>
          ))}
        </ul>

        <div className="mt-12 text-center">
          <h3 className="text-2xl text-white">Bắt đầu trao đổi hợp tác</h3>
          <p className="mx-auto mt-3 max-w-lg text-[var(--color-navy-100)]">
            Gửi thông tin đơn vị của bạn hoặc gọi trực tiếp hotline {CONTACT.hotline}. Lotus phản hồi trong 24
            giờ làm việc.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="gold" size="lg">
              <Link href="/golf-tour">
                Đăng ký làm đại lý
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="inverse-outline" size="lg">
              <Link href="/corporate">Yêu cầu báo giá doanh nghiệp</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
