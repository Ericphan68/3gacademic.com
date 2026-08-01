import { ArrowRight, Car, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { PageHero } from '@/components/common/page-hero';
import { Section, SectionHeader } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import { CONTACT } from '@/constants/site';
import { ContactForm } from '@/features/contact/contact-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Liên hệ',
  description:
    'Thông tin liên hệ Lotus Golf Center: địa chỉ, hotline, Zalo, email, giờ mở cửa 06:00–22:00 và hướng dẫn đỗ xe. Gửi câu hỏi trực tiếp qua biểu mẫu liên hệ.',
  path: '/contact',
  image: MEDIA.hero.contact,
  keywords: ['liên hệ Lotus Golf Center', 'địa chỉ sân tập golf', 'hotline golf'],
});

const CHANNELS = [
  {
    icon: Phone,
    label: 'Hotline',
    value: CONTACT.hotline,
    href: `tel:${CONTACT.hotline.replace(/\s/g, '')}`,
    hint: 'Trực từ 06:00 đến 22:00 mỗi ngày',
  },
  {
    icon: MessageCircle,
    label: 'Zalo',
    value: 'Nhắn tin qua Zalo',
    href: CONTACT.zalo,
    hint: 'Phản hồi nhanh nhất trong giờ làm việc',
    external: true,
  },
  {
    icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
    hint: 'Dành cho yêu cầu doanh nghiệp và hợp tác',
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Liên hệ"
        title="Lotus luôn sẵn sàng hỗ trợ bạn"
        description="Gọi hotline, nhắn Zalo hoặc gửi biểu mẫu. Đội chăm sóc khách hàng phản hồi trong giờ làm việc, thường dưới 30 phút."
        image={MEDIA.hero.contact}
        breadcrumbs={[{ label: 'Liên hệ' }]}
        size="sm"
      />

      {/* Kênh liên hệ */}
      <Section className="!pb-0">
        <div className="grid gap-5 md:grid-cols-3">
          {CHANNELS.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)]"
            >
              <span className="mb-4 flex size-11 items-center justify-center rounded-full bg-[var(--color-golf-50)] text-[var(--color-accent)]">
                <channel.icon className="size-5" aria-hidden />
              </span>
              <p className="text-xs tracking-widest text-[var(--color-muted)] uppercase">{channel.label}</p>
              <p className="mt-1 text-lg font-medium transition-colors group-hover:text-[var(--color-accent)]">
                {channel.value}
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{channel.hint}</p>
            </a>
          ))}
        </div>
      </Section>

      {/* Địa chỉ, bản đồ, đỗ xe */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeader
              eyebrow="Địa điểm"
              title="Tìm đường đến Lotus"
              description="Trung tâm nằm trong nội thành, thuận tiện di chuyển sau giờ làm."
              className="!mb-8"
            />

            <ul className="space-y-5">
              <li className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted-surface)] text-[var(--color-accent)]">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">Địa chỉ</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{CONTACT.addressLine}</p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted-surface)] text-[var(--color-accent)]">
                  <Clock className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">Giờ mở cửa</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    Tất cả các ngày trong tuần, {CONTACT.openHours}
                  </p>
                </div>
              </li>

              <li className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted-surface)] text-[var(--color-accent)]">
                  <Car className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-medium">Đỗ xe</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">{CONTACT.parkingNote}</p>
                </div>
              </li>
            </ul>

            {/* Bản đồ placeholder */}
            <div className="mt-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
              <div className="surface-grid relative flex aspect-[16/10] items-center justify-center bg-[var(--color-surface)]">
                <div className="relative z-10 max-w-xs px-6 text-center">
                  <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
                    <MapPin className="size-6" aria-hidden />
                  </span>
                  <p className="font-medium">{CONTACT.addressShort}</p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">
                    Bản đồ tương tác sẽ được nhúng ở phiên bản chính thức. Toạ độ demo:{' '}
                    {CONTACT.geo.lat}, {CONTACT.geo.lng}
                  </p>
                </div>
              </div>
            </div>

            {/* Ảnh lối vào */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[MEDIA.hero.contact, MEDIA.facility.lounge].map((src, index) => (
                <div
                  key={src}
                  className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-muted-surface)]"
                >
                  <Image
                    src={src}
                    alt={index === 0 ? 'Lối vào Lotus Golf Center' : 'Khu vực sảnh và Lounge'}
                    fill
                    sizes="(min-width: 1024px) 24vw, 45vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <ContactForm />

            <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-6">
              <h3 className="text-lg">Muốn đến thử ngay?</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-champagne-800)]">
                Bạn không cần gọi trước. Đặt lịch trực tuyến mất chưa tới hai phút và bạn nhận mã QR check-in
                ngay sau đó.
              </p>
              <Button asChild variant="primary" className="mt-5">
                <Link href="/booking">
                  Đặt lịch trải nghiệm
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
