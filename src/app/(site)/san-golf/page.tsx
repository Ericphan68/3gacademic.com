import { ArrowRight, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { PageHero } from '@/components/common/page-hero';
import { Section } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MEDIA } from '@/constants/media';
import { COURSE_PRICING } from '@/data/course-pricing';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Sân Golf',
  description:
    'Danh sách các sân golf của Lotus. Xem thông tin, bảng giá dịch vụ và đặt sân trực tuyến.',
  path: '/san-golf',
  image: MEDIA.hero.home,
  keywords: ['sân golf', 'sân golf An Phú Lotus', 'đặt sân golf'],
});

/** Danh sách sân golf. Thêm sân mới → thêm một mục vào mảng này. */
const COURSES = [
  {
    slug: 'an-phu-lotus',
    name: COURSE_PRICING.brand,
    tagline: 'Sân tập Tee dài & Tee ngắn · Học và chơi golf',
    location: 'TP. Hồ Chí Minh',
    openHours: COURSE_PRICING.openHours,
    image: MEDIA.hero.home,
    highlight: 'Đang mở đặt sân',
  },
];

export default function GolfCoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Sân Golf"
        title="Các sân golf của Lotus"
        description="Chọn sân để xem thông tin, bảng giá dịch vụ và đặt sân trực tuyến."
        image={MEDIA.hero.home}
        breadcrumbs={[{ label: 'Sân Golf' }]}
        size="sm"
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {COURSES.map((course) => (
            <Link
              key={course.slug}
              href={`/san-golf/${course.slug}`}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {course.highlight ? (
                  <span className="absolute top-3 left-3">
                    <Badge variant="gold" size="sm">
                      {course.highlight}
                    </Badge>
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl">{course.name}</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{course.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--color-muted)]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-4 text-[var(--color-accent)]" aria-hidden />
                    {course.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="size-4 text-[var(--color-accent)]" aria-hidden />
                    {course.openHours}
                  </span>
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)]">
                  Xem bảng giá & đặt sân
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
          Lotus sẽ tiếp tục cập nhật thêm các sân golf mới.
        </p>

        <div className="mt-6 flex justify-center">
          <Button asChild variant="accent" size="lg">
            <Link href="/booking">
              Đặt sân ngay
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
