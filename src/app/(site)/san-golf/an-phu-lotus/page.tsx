import { ArrowRight, Award, Check, Droplets, Gift, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { PageHero } from '@/components/common/page-hero';
import { Section, SectionHeader } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import { MEDIA } from '@/constants/media';
import { CONTACT } from '@/constants/site';
import { COURSE_PRICING } from '@/data/course-pricing';
import { PackageBooking } from '@/features/san-golf/package-booking';
import { formatCurrency } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

const P = COURSE_PRICING;

export const metadata = buildMetadata({
  title: 'Sân Golf An Phú Lotus — Bảng giá & đặt sân',
  description:
    'Đặt & thanh toán trực tuyến các gói dịch vụ Sân Golf An Phú Lotus: gói bóng tập, sân Tee dài & Tee ngắn (9/18/36 hố), full ngày, chương trình đào tạo SGI/MSC. Áp dụng từ 07/08/2026.',
  path: '/san-golf/an-phu-lotus',
  image: MEDIA.hero.home,
  keywords: ['sân golf An Phú Lotus', 'đặt sân golf', 'bảng giá golf', 'thanh toán golf online'],
});

export default function AnPhuLotusPage() {
  return (
    <>
      <PageHero
        eyebrow="Sân Golf An Phú Lotus"
        title="Bảng giá dịch vụ & đặt sân"
        description={`Chọn gói phù hợp và đặt sân ngay. Áp dụng từ ngày ${P.appliedFrom}. Mở cửa ${P.openHours} mỗi ngày.`}
        image={MEDIA.hero.home}
        breadcrumbs={[{ label: 'Sân Golf', href: '/san-golf' }, { label: 'Sân Golf An Phú Lotus' }]}
        actions={
          <Button asChild variant="accent" size="lg">
            <a href="#goi-dich-vu">
              Xem các gói &amp; đặt sân
              <ArrowRight aria-hidden />
            </a>
          </Button>
        }
      />

      {/* Các gói dịch vụ — đặt & thanh toán từng gói */}
      <Section>
        <div id="goi-dich-vu" className="scroll-mt-24">
          <SectionHeader
            eyebrow="Bảng giá & đặt sân"
            title="Chọn gói và thanh toán ngay"
            description="Mỗi gói đặt và thanh toán trực tuyến (MoMo, VNPay, chuyển khoản hoặc trả tại quầy)."
          />
        </div>
        <PackageBooking />
      </Section>

      {/* Dịch vụ miễn phí + Water penalty + Giải thưởng */}
      <Section tone="surface">
        <SectionHeader eyebrow="Quyền lợi kèm theo" title="Dịch vụ, ưu đãi & giải thưởng" />
        <div className="grid gap-5 lg:grid-cols-3">
          <InfoCard icon={<Gift className="size-5" aria-hidden />} title="Dịch vụ miễn phí">
            <ul className="space-y-2">
              {P.freeServices.map((s) => (
                <li key={s} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </InfoCard>

          <InfoCard icon={<Droplets className="size-5" aria-hidden />} title="Water Penalty">
            <p className="mb-1 font-[family-name:var(--font-display)] text-xl text-[var(--color-accent)]">
              {formatCurrency(P.waterPenalty.price)}
              <span className="ml-1 text-sm font-normal text-[var(--color-muted)]">/ bóng</span>
            </p>
            <p>{P.waterPenalty.note}</p>
          </InfoCard>

          <InfoCard icon={<Award className="size-5" aria-hidden />} title="Giải thưởng">
            <ul className="space-y-2">
              {P.prizes.map((p) => (
                <li key={p} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>
      </Section>

      {/* Lưu ý & quy định */}
      <Section className="!pt-4">
        <div className="mx-auto max-w-3xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
          <h3 className="mb-3 text-lg">Lưu ý & quy định</h3>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            {[
              'Caddie 50.000đ/golfer/9 hố (tính vào tài khoản riêng) — áp dụng sinh viên, học sinh, doanh nhân trẻ, nhóm, đoàn…',
              'Tee ngắn: phát bóng trên thảm tại tee phát, không quá 60 yard theo t-box của sân.',
              'Tee dài được lựa chọn: không nhận quá 16 golfer/ngày; booking trước để xếp lịch.',
              ...P.notes,
            ].map((note) => (
              <li key={note} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" size="lg">
            <a href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}>
              <Phone aria-hidden />
              Gọi {CONTACT.hotline}
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden />
              Nhắn Zalo
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link href="/san-golf">
              Xem các sân golf khác
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      </Section>
    </>
  );
}

function InfoCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-9 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
          {icon}
        </span>
        <h3 className="text-base">{title}</h3>
      </div>
      <div className="text-sm leading-relaxed text-[var(--color-muted)]">{children}</div>
    </div>
  );
}
