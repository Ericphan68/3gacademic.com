import { Check, Info } from 'lucide-react';
import Image from 'next/image';

import { PageHero } from '@/components/common/page-hero';
import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import { LOUNGE_SPACES } from '@/data/fnb';
import { FnbCart, FnbMenu } from '@/features/food/fnb-menu';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'F&B và không gian thư giãn',
  description:
    'Menu cà phê, cold brew, trà, bento Nhật – Hàn và món healthy tại Lotus Golf Center. Đặt món giao tận thảm tập hoặc dùng tại Lounge trong nhà và khu nghỉ ngoài trời.',
  path: '/food-and-lounge',
  image: MEDIA.hero.lounge,
  keywords: ['F&B sân golf', 'lounge golf', 'bento', 'cà phê sân tập golf'],
});

export default function FoodAndLoungePage() {
  return (
    <>
      <PageHero
        eyebrow="F&B & Lounge"
        title="Nghỉ ngơi cũng là một phần của buổi tập"
        description="Đồ uống pha tại chỗ, bento từ đối tác và không gian nghỉ trong nhà lẫn ngoài trời. Đặt món trên website, nhân viên mang đến tận thảm tập của bạn."
        image={MEDIA.hero.lounge}
        breadcrumbs={[{ label: 'F&B và Lounge' }]}
      />

      {/* Không gian */}
      <Section>
        <SectionHeader
          eyebrow="Không gian"
          title="Ba cách để nghỉ giữa buổi tập"
          description="Bạn chọn cách phù hợp với nhịp của mình — ngồi lại trò chuyện, làm việc ngắn hay tiếp tục tập mà không cần rời thảm."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {LOUNGE_SPACES.map((space, index) => (
            <Reveal key={space.id} delay={index * 0.07}>
              <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-muted-surface)]">
                  <Image
                    src={space.image}
                    alt={space.name}
                    fill
                    sizes="(min-width: 768px) 32vw, 92vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg">{space.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{space.description}</p>

                  <ul className="mt-4 space-y-1.5 text-sm text-[var(--color-muted)]">
                    {space.features.map((feature) => (
                      <li key={feature} className="flex gap-2">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Menu */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Menu"
          title="Đặt món ngay trên website"
          description="Chọn món, chọn nơi phục vụ và thời gian mong muốn. Đơn hàng được lưu lại trong tài khoản của bạn."
        />
        <FnbMenu />
      </Section>

      {/* Ghi chú chính sách */}
      <Section className="!py-12">
        <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <Info className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
          <div className="text-sm leading-relaxed text-[var(--color-muted)]">
            <p className="font-medium text-[var(--color-foreground)]">Về menu tại Lotus</p>
            <p className="mt-2">
              Menu kết hợp sản phẩm pha chế tại chỗ và món từ đối tác ẩm thực. Phiên bản website này không
              hiển thị hoặc phục vụ đồ uống có cồn, thuốc lá hay bất kỳ sản phẩm giới hạn độ tuổi nào.
            </p>
          </div>
        </div>
      </Section>

      <FnbCart />
    </>
  );
}
