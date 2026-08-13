import { ArrowRight, Flag, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

import { PageHero } from '@/components/common/page-hero';
import { Section } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import { MEDIA } from '@/constants/media';
import { CONTACT } from '@/constants/site';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Sân Golf',
  description:
    'Thông tin các sân golf của Lotus Golf Center đang được cập nhật. Liên hệ Lotus để được tư vấn về sân golf, đặt lịch và trải nghiệm.',
  path: '/san-golf',
  image: MEDIA.hero.home,
  keywords: ['sân golf', 'sân golf An Phú Lotus', 'đặt sân golf'],
});

export default function GolfCoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Sân Golf"
        title="Các sân golf của Lotus"
        description="Danh sách và thông tin chi tiết từng sân golf đang được cập nhật. Vui lòng liên hệ Lotus để được tư vấn ngay."
        image={MEDIA.hero.home}
        breadcrumbs={[{ label: 'Sân Golf' }]}
      />

      <Section>
        <div className="mx-auto max-w-3xl rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8 text-center sm:p-12">
          <span className="mx-auto mb-5 flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
            <Flag className="size-7" aria-hidden />
          </span>
          <h2 className="text-2xl">Nội dung đang được cập nhật</h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--color-muted)]">
            Chúng tôi đang hoàn thiện thông tin từng sân golf để mang đến cho bạn trải nghiệm đầy đủ nhất.
            Trong thời gian này, hãy liên hệ Lotus để được tư vấn trực tiếp về sân golf và đặt lịch.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="accent">
              <a href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}>
                <Phone aria-hidden />
                Gọi {CONTACT.hotline}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden />
                Nhắn Zalo
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/booking">
                Đặt lịch trải nghiệm
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
