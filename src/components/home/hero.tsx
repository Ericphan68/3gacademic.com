import { ArrowRight, Clock, QrCode, Sparkles, TabletSmartphone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import { CONTACT } from '@/constants/site';
import { getHomeContent } from '@/server/services/contentService';

const QUICK_FACTS = [
  { icon: Clock, label: `Mở cửa ${CONTACT.openHours}` },
  { icon: TabletSmartphone, label: 'Đặt lịch online' },
  { icon: QrCode, label: 'Check-in bằng QR' },
  { icon: Sparkles, label: 'Hỗ trợ người mới' },
];

export async function Hero() {
  const { hero } = await getHomeContent();
  return (
    // Kéo hero lên dưới header trong suốt (header cao 4rem / 4.5rem từ md).
    <section className="relative isolate -mt-16 flex min-h-[clamp(34rem,88svh,52rem)] items-center overflow-hidden md:-mt-[4.5rem]">
      <Image
        src={MEDIA.hero.home}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy-950)]/90 via-[var(--color-navy-900)]/70 to-[var(--color-navy-900)]/35"
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-background)] to-transparent"
        aria-hidden
      />

      <div className="container-lotus relative pt-36 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl">
          <p className="animate-fade-in eyebrow mb-5 text-[var(--color-champagne-300)]">
            {hero.eyebrow}
          </p>

          <h1 className="animate-fade-up text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.05] text-white">
            {hero.title}
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-[var(--color-navy-100)] md:text-lg"
            style={{ animationDelay: '80ms' }}
          >
            {hero.subtitle}
          </p>

          <div
            className="animate-fade-up mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: '160ms' }}
          >
            <Button asChild variant="gold" size="xl">
              <Link href={hero.ctaLink}>
                {hero.ctaText}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="inverse-outline" size="xl">
              <Link href="/membership">Khám phá hội viên</Link>
            </Button>
            <Link
              href="/coaches"
              className="ml-1 text-sm font-medium text-white/85 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Tìm huấn luyện viên →
            </Link>
          </div>

          <ul
            className="animate-fade-up mt-12 flex flex-wrap gap-x-7 gap-y-3"
            style={{ animationDelay: '240ms' }}
          >
            {QUICK_FACTS.map((fact) => (
              <li key={fact.label} className="flex items-center gap-2 text-sm text-white/80">
                <fact.icon className="size-4 text-[var(--color-champagne-300)]" aria-hidden />
                {fact.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
