import { ArrowRight, Award, Check, Droplets, Gift, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { PageHero } from '@/components/common/page-hero';
import { Section, SectionHeader } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MEDIA } from '@/constants/media';
import { CONTACT } from '@/constants/site';
import { COURSE_PRICING, type CourseTable } from '@/data/course-pricing';
import { formatCurrency } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';

const P = COURSE_PRICING;

export const metadata = buildMetadata({
  title: 'Sân Golf An Phú Lotus — Bảng giá dịch vụ',
  description:
    'Bảng giá dịch vụ Sân Golf An Phú Lotus: gói bóng tập, sân Tee dài & Tee ngắn (9/18/36 hố), dịch vụ full ngày, chương trình đào tạo SGI/MSC, caddie và ưu đãi. Áp dụng từ 07/08/2026.',
  path: '/san-golf',
  image: MEDIA.hero.home,
  keywords: ['sân golf An Phú Lotus', 'bảng giá golf', 'giá sân tập golf', 'golf 9 hố 18 hố'],
});

export default function GolfCoursePage() {
  return (
    <>
      <PageHero
        eyebrow="Sân Golf An Phú Lotus"
        title="Bảng giá dịch vụ sân golf"
        description={`Áp dụng từ ngày ${P.appliedFrom} cho đến khi có thông báo mới. Mở cửa ${P.openHours} mỗi ngày.`}
        image={MEDIA.hero.home}
        breadcrumbs={[{ label: 'Sân Golf' }]}
      />

      {/* I. Gói bóng tập */}
      <Section>
        <SectionHeader eyebrow="I. Gói bóng tập" title="Chọn gói bóng phù hợp" />
        <div className="grid gap-5 md:grid-cols-3">
          {P.ballPackages.map((pkg) => (
            <div
              key={pkg.name}
              className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6"
            >
              <p className="text-base font-medium">{pkg.name}</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--color-accent)]">
                {formatCurrency(pkg.price)}
              </p>
              {pkg.note ? (
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">{pkg.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {/* II + III. Sân Tee dài */}
      <Section tone="surface">
        <SectionHeader eyebrow="Sân tập Tee dài" title={P.teeLong.title} />
        <CourseTableView table={P.teeLong} />
      </Section>

      {/* IV. Sân Tee ngắn */}
      <Section>
        <SectionHeader
          eyebrow="Người mới · Golf cho cộng đồng"
          title={P.teeShort.title}
          description="Phù hợp người mới bắt đầu, học sinh, sinh viên và khách muốn trải nghiệm."
        />
        <CourseTableView table={P.teeShort} />
      </Section>

      {/* Đào tạo & trải nghiệm */}
      <Section tone="surface">
        <SectionHeader eyebrow="Chương trình" title="Đào tạo & trải nghiệm golf" />
        <div className="grid gap-5 md:grid-cols-3">
          {P.training.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6"
            >
              <p className="text-base font-medium">{t.name}</p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-xl text-[var(--color-accent)]">
                {formatCurrency(t.price)}
                <span className="ml-1 text-sm font-normal text-[var(--color-muted)]">/ {t.unit}</span>
              </p>
              {t.time ? <p className="mt-1 text-xs text-[var(--color-muted)]">{t.time}</p> : null}
              <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                {t.includes.map((inc) => (
                  <li key={inc} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
              {t.note ? (
                <p className="mt-4 border-t border-[var(--color-border)] pt-3 text-xs text-[var(--color-muted)]">
                  {t.note}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </Section>

      {/* Dịch vụ miễn phí + Water penalty + Giải thưởng */}
      <Section>
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

      {/* Lưu ý + CTA */}
      <Section tone="surface" className="!pt-4">
        <div className="mx-auto max-w-3xl rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
          <h3 className="mb-3 text-lg">Lưu ý chung</h3>
          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            {P.notes.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="accent" size="lg">
            <Link href="/booking">
              Đặt lịch chơi golf
              <ArrowRight aria-hidden />
            </Link>
          </Button>
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
        </div>
      </Section>
    </>
  );
}

function CourseTableView({ table }: { table: CourseTable }) {
  return (
    <div className="space-y-5">
      {table.rules ? (
        <div className="flex flex-wrap gap-2">
          {table.rules.map((rule) => (
            <Badge key={rule} variant="outline" size="sm">
              {rule}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
              <th className="px-5 py-3 font-medium">Hạng mục</th>
              <th className="px-5 py-3 font-medium">Thời lượng</th>
              <th className="px-5 py-3 text-right font-medium">Giá / Round</th>
              <th className="px-5 py-3 font-medium">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {table.holes.map((h) => (
              <tr key={h.label} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-5 py-3 font-medium whitespace-nowrap">{h.label}</td>
                <td className="px-5 py-3 whitespace-nowrap text-[var(--color-muted)]">{h.duration ?? '—'}</td>
                <td className="px-5 py-3 text-right font-medium whitespace-nowrap text-[var(--color-accent)]">
                  {formatCurrency(h.price)}
                </td>
                <td className="px-5 py-3 text-[var(--color-muted)]">{h.extra ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-golf-50)] p-5">
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className="font-medium">{table.fullDay.name}</p>
            {table.fullDay.time ? (
              <Badge variant="gold" size="sm">
                {table.fullDay.time}
              </Badge>
            ) : null}
          </div>
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-accent)]">
            {formatCurrency(table.fullDay.price)}
            <span className="ml-1 text-sm font-normal text-[var(--color-muted)]">/ golfer</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{table.fullDay.includes}</p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-5 text-sm text-[var(--color-muted)]">
          {table.caddie ? <p className="mb-2">{table.caddie}</p> : null}
          {table.notes?.map((note) => (
            <p key={note} className="mt-2 flex gap-2">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--color-accent)]" aria-hidden />
              <span>{note}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
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
