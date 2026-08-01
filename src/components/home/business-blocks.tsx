import { ArrowRight, Building2, Plane } from 'lucide-react';
import type { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';

const BLOCKS = [
  {
    icon: Building2,
    eyebrow: 'Doanh nghiệp',
    title: 'Golf dành cho doanh nghiệp',
    description:
      'Corporate Golf Day, team-building, tiếp khách hàng và chương trình phúc lợi nhân viên — trong nội thành, không mất nửa ngày di chuyển.',
    points: [
      'Luôn có HLV riêng cho nhóm chưa từng chơi golf',
      'Một đầu mối phụ trách xuyên suốt sự kiện',
      'Branding tại chỗ và báo cáo sau 48 giờ',
    ],
    image: MEDIA.hero.corporate,
    href: '/corporate' as Route,
    cta: 'Yêu cầu báo giá doanh nghiệp',
  },
  {
    icon: Plane,
    eyebrow: 'Golf Tour',
    title: 'Golf Tour cho đối tác du lịch',
    description:
      'Bảy gói tour thiết kế sẵn cho khách đoàn, kèm chương trình dành riêng cho công ty lữ hành và đại lý.',
    points: [
      'Gói nửa ngày đến trọn ngày cho đoàn 2–60 khách',
      'Phục vụ song ngữ cho khách quốc tế',
      'Giá đối tác, hoa hồng và tài liệu bán hàng',
    ],
    image: MEDIA.hero.tour,
    href: '/golf-tour' as Route,
    cta: 'Xem gói Golf Tour',
  },
];

export function BusinessBlocks() {
  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Dành cho tổ chức"
        title="Khi golf phục vụ mục tiêu kinh doanh"
        description="Hai hướng hợp tác được thiết kế riêng: một cho doanh nghiệp, một cho ngành du lịch."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {BLOCKS.map((block, index) => (
          <Reveal key={block.title} delay={index * 0.08}>
            <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={block.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 48vw, 92vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/80 to-transparent"
                  aria-hidden
                />
                <div className="absolute inset-x-6 bottom-6 text-white">
                  <span className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                    <block.icon className="size-5 text-[var(--color-champagne-300)]" aria-hidden />
                  </span>
                  <p className="eyebrow text-[var(--color-champagne-300)]">{block.eyebrow}</p>
                  <h3 className="mt-1.5 text-2xl text-white">{block.title}</h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">{block.description}</p>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {block.points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-[var(--color-champagne-400)]"
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="primary" size="md" className="mt-auto self-start pt-0 md:mt-8">
                  <Link href={block.href}>
                    {block.cta}
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
