import { ArrowRight, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';

const POINTS = [
  {
    title: 'Không cần biết gì trước',
    detail: 'Nhân viên đón bạn tại sảnh và đi cùng suốt buổi đầu tiên, từ cách cầm gậy đến cú đánh đầu tiên.',
  },
  {
    title: 'Không cần mang theo gì',
    detail: 'Gậy, bóng, găng tay đều có sẵn. Bạn chỉ cần trang phục thể thao và giày đế bằng.',
  },
  {
    title: 'Không ai đánh giá bạn',
    detail: 'Phần lớn khách ở đây cũng đang học. Thảm tập được bố trí để bạn có không gian riêng.',
  },
  {
    title: 'Không tốn nhiều thời gian',
    detail: 'Một buổi 60 phút là đủ để bạn biết mình có thích môn này hay không.',
  },
];

export function BeginnerSection() {
  return (
    <Section>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-xl)]">
            <Image
              src={MEDIA.facility['driving-range']}
              alt="Khu thảm tập của Lotus Golf Center vào buổi sáng"
              fill
              sizes="(min-width: 1024px) 48vw, 92vw"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
              className="object-cover"
            />
            <div
              className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--color-navy-950)]/80 to-transparent"
              aria-hidden
            />
            <div className="absolute inset-x-6 bottom-6 text-white">
              <p className="font-[family-name:var(--font-display)] text-2xl">87%</p>
              <p className="mt-1 text-sm text-white/80">
                khách thử buổi đầu tiên quay lại trong vòng một tháng
              </p>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeader
            eyebrow="Dành cho người mới"
            title="Không cần biết golf để bắt đầu"
            description="Rất nhiều người muốn thử golf nhưng ngại bước vào một nơi mà ai cũng có vẻ đã biết mình đang làm gì. Lotus được thiết kế để xoá đúng cảm giác đó."
            className="mb-8"
          />

          <ul className="space-y-5">
            {POINTS.map((point, index) => (
              <Reveal as="li" key={point.title} delay={index * 0.06}>
                <div className="flex gap-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-golf-700)]">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <div>
                    <p className="font-medium">{point.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{point.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href={{ pathname: '/booking', query: { experience: 'lotus-discovery' } }}>
                Bắt đầu trải nghiệm đầu tiên
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/faq">Câu hỏi thường gặp</Link>
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
