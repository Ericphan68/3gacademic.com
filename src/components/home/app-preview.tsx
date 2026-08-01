import {
  CalendarCheck,
  Crown,
  Gift,
  GraduationCap,
  QrCode,
  Ticket,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { APP_FEATURES } from '@/data/testimonials';

const ICONS: Record<string, LucideIcon> = {
  CalendarCheck,
  Wallet,
  QrCode,
  Ticket,
  Crown,
  GraduationCap,
  Gift,
};

/** Mockup điện thoại dựng bằng CSS — không dùng ảnh nặng. */
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[15rem] sm:w-[17rem]">
      <div className="relative rounded-[2.25rem] border-[6px] border-[var(--color-navy-950)] bg-[var(--color-navy-900)] p-2 shadow-[var(--shadow-overlay)]">
        <div className="absolute top-2.5 left-1/2 h-5 w-24 -translate-x-1/2 rounded-full bg-[var(--color-navy-950)]" aria-hidden />
        <div className="overflow-hidden rounded-[1.75rem] bg-[var(--color-navy-800)]">
          <div className="px-4 pt-9 pb-4">
            <p className="text-[10px] tracking-widest text-[var(--color-champagne-300)] uppercase">
              Lotus Golf
            </p>
            <p className="mt-1 font-[family-name:var(--font-display)] text-lg text-white">
              Chào buổi chiều, Trang
            </p>

            <div className="mt-4 rounded-[var(--radius-md)] bg-white/10 p-3">
              <p className="text-[10px] text-[var(--color-navy-200)]">Số dư ví Lotus</p>
              <p className="font-[family-name:var(--font-display)] text-xl text-white">8.450.000đ</p>
              <p className="mt-1 text-[10px] text-[var(--color-champagne-300)]">
                Hạng Lotus Member · +10% bonus
              </p>
            </div>

            <div className="mt-3 rounded-[var(--radius-md)] border border-white/10 p-3">
              <p className="text-[10px] text-[var(--color-navy-200)]">Buổi tập sắp tới</p>
              <p className="mt-0.5 text-xs font-medium text-white">Học với HLV · 18:00</p>
              <p className="text-[10px] text-[var(--color-navy-200)]">Driving Range · Trần Thu Hà</p>
              <div className="mt-2 flex items-center gap-1.5">
                <QrCode className="size-3 text-[var(--color-champagne-300)]" aria-hidden />
                <span className="text-[10px] text-[var(--color-champagne-300)]">Chạm để check-in</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-2">
              {[CalendarCheck, Wallet, Ticket, Gift].map((Icon, index) => (
                <div
                  key={index}
                  className="flex aspect-square items-center justify-center rounded-[var(--radius-sm)] bg-white/[0.07]"
                >
                  <Icon className="size-4 text-white/70" aria-hidden />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppPreview() {
  return (
    <Section tone="navy">
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <SectionHeader
            inverse
            eyebrow="Smart Golf Experience"
            title="Toàn bộ trải nghiệm nằm gọn trong điện thoại"
            description="Đặt lịch, nạp ví, check-in bằng QR, quản lý voucher và theo dõi tiến độ học — không cần gọi điện, không phải chờ ở quầy."
            className="mb-8"
          />

          <ul className="grid gap-4 sm:grid-cols-2">
            {APP_FEATURES.map((feature, index) => {
              const Icon = ICONS[feature.icon] ?? CalendarCheck;
              return (
                <Reveal as="li" key={feature.title} delay={Math.min(index * 0.05, 0.3)}>
                  <div className="flex gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-champagne-300)]/15 text-[var(--color-champagne-300)]">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-white">{feature.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-navy-200)]">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge variant="glass">Ứng dụng đang được phát triển</Badge>
            <p className="text-sm text-[var(--color-navy-200)]">
              Hiện tại toàn bộ tính năng đã có trên website.
            </p>
          </div>
        </div>

        <Reveal>
          <PhoneMockup />
        </Reveal>
      </div>
    </Section>
  );
}
