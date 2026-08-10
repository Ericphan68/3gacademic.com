import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

import { PageHero } from '@/components/common/page-hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/common/section';
import { MEDIA } from '@/constants/media';
import { buildMetadata } from '@/lib/seo';
import type { BookingExperienceType } from '@/types';

export const metadata = buildMetadata({
  title: 'Bảng giá & Đăng ký gói',
  description:
    'Các gói dịch vụ Sân Golf An Phú Lotus học viên có thể đăng ký: gói bóng tập, sân tập Tee dài và Tee ngắn (9/18/36 hố), dịch vụ full ngày, chương trình trải nghiệm SGI/MSC. Đăng ký để chọn ngày giờ và thanh toán. Áp dụng từ 07/08/2026.',
  path: '/bang-gia',
  keywords: [
    'bảng giá golf',
    'đăng ký gói golf',
    'giá sân golf An Phú Lotus',
    'giá bóng tập golf',
    'trải nghiệm golf SGI MSC',
  ],
});

interface PriceItem {
  name: string;
  meta?: string;
  price?: string;
  description?: string;
  includes?: string[];
  badge?: string;
  /** Nếu có: hiện nút “Đăng ký” dẫn vào luồng đặt lịch với gói tương ứng. */
  register?: BookingExperienceType;
}

interface PriceGroup {
  id: string;
  title: string;
  note?: string;
  items?: PriceItem[];
  bullets?: string[];
  footnote?: string;
}

const GROUPS: PriceGroup[] = [
  {
    id: 'goi-bong-tap',
    title: 'I. Gói bóng tập',
    items: [
      {
        name: 'Gói 100 bóng tập',
        price: '190.000₫',
        register: 'range',
        description:
          'Tặng 01 lon bia hoặc 01 chai nước suối / ly cà phê / bánh giò / phần fast food (đảm bảo chất lượng trước khi phục vụ).',
      },
      {
        name: 'Gói 200 bóng tập',
        meta: 'Bán 03 khách/ngày',
        price: '380.000₫',
        badge: 'Kèm quà',
        register: 'range',
        description:
          'Tặng 01 Voucher sân 9 hố trị giá 350.000₫ và 01 giờ học golf miễn phí cùng HLV (chọn HLV theo danh sách 1).',
      },
      {
        name: 'Gói 250 bóng tập',
        meta: 'Bán 03 khách/ngày',
        price: '500.000₫',
        badge: 'Kèm quà',
        register: 'coaching',
        description:
          'Tặng 01 Voucher sân 9 hố trị giá 350.000₫ và 01 buổi học golf cùng HLV (1,5 giờ, chọn HLV theo danh sách 2).',
      },
    ],
  },
  {
    id: 'dich-vu-mien-phi',
    title: 'II. Dịch vụ miễn phí',
    bullets: ['Đón đưa lên xe.', 'Dịch vụ tập cát, khu chipping và putt cát.'],
  },
  {
    id: 'tee-dai',
    title: 'III. Dịch vụ sân tập Tee dài',
    items: [
      {
        name: 'Sân 9 hố',
        meta: '2 – 2,5 giờ',
        price: '350.000₫ / round',
        register: 'range',
        description: 'Extra 9 hố: +150.000₫ → tổng 500.000₫.',
      },
      {
        name: 'Sân 18 hố',
        meta: '4 giờ',
        price: '500.000₫ / round',
        register: 'range',
        description: 'Extra 18 hố: +215.000₫ → tổng 715.000₫.',
      },
      {
        name: 'Sân 36 hố',
        price: '800.000₫ / golfer',
        register: 'range',
        description: 'Booking & thanh toán trước.',
        includes: ['½ con gà', '01 lon bia', 'Dịch vụ nghỉ trưa', 'Nước suối'],
      },
      {
        name: 'Dịch vụ full ngày',
        meta: '05:00 – 22:00',
        price: '1.400.000₫ / golfer',
        badge: 'Trọn gói',
        register: 'golf-3in1',
        includes: [
          'Bữa trưa ¼ con gà',
          'Bữa chiều hải sản (cá, tôm, mực…)',
          'HLV tư vấn & trợ giúp kỹ thuật miễn phí trong giờ thực chiến (danh sách 3)',
          'Nghỉ trưa máy lạnh & sân vườn',
        ],
      },
      {
        name: 'Dịch vụ Caddie',
        meta: 'Tính vào tài khoản riêng',
        price: '50.000₫ / golfer / 9 hố',
        description:
          'Áp dụng cho sinh viên, học sinh, doanh nhân trẻ, nhóm, đoàn và khách muốn trải nghiệm.',
      },
    ],
    footnote:
      'Áp dụng Tee dài được lựa chọn: không nhận quá 16 golfer/ngày. Cần booking trước để xếp lịch. Khi chọn gói này phải có caddie ghi chép, trợ giúp ghi điểm — phí 50.000₫/golfer/9 hố.',
  },
  {
    id: 'tee-ngan',
    title: 'IV. Dịch vụ sân tập Tee ngắn (người mới) — Golf cho cộng đồng',
    note: 'Phát bóng trên thảm tại tee phát; book trước giờ chơi; không phát bóng xa quá 60 yard theo thảm t-box của sân.',
    items: [
      {
        name: 'Sân 9 hố',
        meta: '2 – 2,5 giờ',
        price: '200.000₫ / round',
        register: 'range',
        description: 'Extra 9 hố: +50.000₫ → tổng 250.000₫.',
      },
      {
        name: 'Sân 18 hố',
        meta: '4 giờ',
        price: '350.000₫ / round',
        register: 'range',
        description: 'Extra 18 hố: +150.000₫ → tổng 500.000₫.',
      },
      {
        name: 'Sân 36 hố',
        price: '500.000₫ / golfer',
        register: 'range',
        includes: ['¼ con gà', '01 lon bia', 'Dịch vụ nghỉ trưa', 'Nước suối'],
      },
      {
        name: 'Dịch vụ full ngày',
        meta: '05:00 – 22:00',
        price: '1.000.000₫ / golfer',
        badge: 'Trọn gói',
        register: 'golf-3in1',
        description: 'Booking & thanh toán trước.',
        includes: [
          'HLV tư vấn, trợ giúp kỹ thuật miễn phí trong 02 giờ (danh sách 4)',
          'Bữa trưa ¼ con gà',
          'Bữa chiều hải sản (cá, tôm, mực…)',
          'Nghỉ trưa võng, sân vườn, ghế bố',
        ],
      },
      {
        name: 'Dịch vụ Caddie',
        meta: 'Tính vào tài khoản riêng',
        price: '50.000₫ / golfer / 9 hố',
        description:
          'Áp dụng cho sinh viên, học sinh, doanh nhân trẻ, nhóm và khách muốn trải nghiệm.',
      },
    ],
  },
  {
    id: 'water-penalty',
    title: 'V. Water Penalty — phí phạt nước (bảo trì, bảo dưỡng sân)',
    items: [
      {
        name: 'Phạt nước',
        price: '90.000₫ / bóng',
        description:
          'Áp dụng cho golfer đăng ký trải nghiệm dịch vụ 9 hố, 18 hố mà không trả phí sân. Tặng 01 lon bia hoặc 01 chai nước suối.',
      },
    ],
  },
  {
    id: 'giai-thuong',
    title: 'VI. Giải thưởng',
    bullets: [
      'Nearest Pin: Voucher sân 9 hố trị giá 350.000₫.',
      'Hole In One (hố 5 và hố 8): 01 thùng bia hoặc quy đổi tiền mặt, kèm Certificate.',
    ],
  },
  {
    id: 'trai-nghiem-dao-tao',
    title: 'VII. Chương trình trải nghiệm & đào tạo (SGI / MSC)',
    items: [
      {
        name: 'SGI — Trải nghiệm golf cùng HLV',
        meta: 'T2 – T6 · Sáng 7–11h, Chiều 15–19h',
        price: '500.000₫ / người / 4 giờ',
        register: 'coaching',
        includes: [
          'HLV trưởng dẫn nhóm',
          'Mini golf (2 cây gậy)',
          'Check-in, chụp & trả hình',
          'Bóng tập, gậy golf, nước uống, dù nhỏ, suất ăn nhẹ',
        ],
        description:
          'Cho học sinh, sinh viên, doanh nhân trẻ, nhóm, đoàn thể, công ty… Chiết khấu 10–15% cho người kết nối/giới thiệu nhóm (áp dụng hoa hồng cho cả HLV, thanh toán chuyển khoản).',
      },
      {
        name: 'SGI & MSC — Học và chơi, có thể thi đấu ngay',
        meta: 'Ưu tiên giờ thấp điểm 17 – 22h',
        price: '500.000₫ / người / 5 giờ',
        badge: 'Doanh nhân · Sinh viên',
        register: 'coaching',
        includes: [
          'Mini golf — chương trình đặc biệt cho doanh nhân, sinh viên',
          'Booking nhóm',
          'Đào tạo sinh viên trường nghề',
        ],
        description:
          'Đặt lịch trước qua giới thiệu, kết nối hoặc poster quảng cáo. Mỗi người tặng 01 lon bia và 01 chai nước.',
      },
    ],
    footnote:
      'Đánh bóng trong lồng tập và tee ngắn không quá 60 yard, đánh trên thảm. Dịch vụ Caddie 50.000₫/golfer (tài khoản riêng) — không nhận quá 20 golfer/ngày.',
  },
  {
    id: 'luu-y',
    title: 'Lưu ý chung',
    bullets: [
      'Sắp xếp bàn ghế, chỗ ngồi và nước uống cho khách.',
      'Số lượng chính sách có hạn theo dung lượng tiếp khách của sân từng thời điểm.',
      'Chương trình có thể tạm đóng khi đã nhận đủ khách.',
      'Sân có thể điều chỉnh cho phù hợp thực tế theo từng khung giờ.',
    ],
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Sân Golf An Phú Lotus"
        title="Các gói dịch vụ & đăng ký"
        description="Chọn gói phù hợp rồi bấm “Đăng ký” để chọn ngày giờ và thanh toán. Áp dụng từ 07/08/2026 cho đến khi có thông báo mới; giá đã bao gồm các quyền lợi kèm theo trong từng gói."
        image={MEDIA.hero.membership}
        breadcrumbs={[{ label: 'Bảng giá' }]}
        actions={
          <Button asChild variant="accent" size="lg">
            <Link href="/booking">
              Đặt lịch ngay
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <Section>
        <div className="mx-auto max-w-5xl">
          {/* Mục lục */}
          <nav
            aria-label="Danh mục bảng giá"
            className="mb-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <p className="mb-3 text-sm font-medium">Danh mục</p>
            <ul className="grid gap-2 text-sm sm:grid-cols-2">
              {GROUPS.map((group) => (
                <li key={group.id}>
                  <a
                    href={`#${group.id}`}
                    className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {group.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {GROUPS.map((group) => (
              <section key={group.id} id={group.id} className="scroll-mt-28">
                <h2 className="text-2xl md:text-3xl">{group.title}</h2>

                {group.note ? (
                  <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{group.note}</p>
                ) : null}

                {group.items ? (
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((item) => (
                      <PriceCard key={item.name} item={item} />
                    ))}
                  </div>
                ) : null}

                {group.bullets ? (
                  <ul className="mt-6 space-y-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
                    {group.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 leading-relaxed text-[var(--color-muted)]">
                        <span
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--color-champagne-400)]"
                          aria-hidden
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {group.footnote ? (
                  <p className="mt-5 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] p-4 text-sm leading-relaxed text-[var(--color-muted)]">
                    {group.footnote}
                  </p>
                ) : null}
              </section>
            ))}
          </div>

          {/* CTA cuối trang */}
          <div className="mt-16 flex flex-col items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl">Sẵn sàng ra sân?</h2>
              <p className="mt-1 text-sm text-[var(--color-golf-800)]">
                Đăng ký gói để chọn ngày giờ và giữ chỗ. Thanh toán linh hoạt: ví, MoMo, VNPay, thẻ, chuyển
                khoản hoặc tại quầy.
              </p>
            </div>
            <Button asChild variant="accent" size="lg" className="shrink-0">
              <Link href="/booking">
                Đặt lịch ngay
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

function PriceCard({ item }: { item: PriceItem }) {
  return (
    <article className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-medium">{item.name}</h3>
        {item.badge ? (
          <Badge variant="gold" size="sm" className="shrink-0">
            {item.badge}
          </Badge>
        ) : null}
      </div>

      {item.meta ? <p className="mt-1 text-xs text-[var(--color-muted)]">{item.meta}</p> : null}

      {item.price ? (
        <p className="mt-3 font-[family-name:var(--font-display)] text-2xl text-[var(--color-accent)]">
          {item.price}
        </p>
      ) : null}

      {item.description ? (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">{item.description}</p>
      ) : null}

      {item.includes ? (
        <ul className="mt-3 space-y-1.5 border-t border-[var(--color-border)] pt-3">
          {item.includes.map((line) => (
            <li key={line} className="flex gap-2 text-sm text-[var(--color-muted)]">
              <Check className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
              {line}
            </li>
          ))}
        </ul>
      ) : null}

      {item.register ? (
        <div className="mt-auto pt-5">
          <Button asChild variant="accent" size="sm" block>
            <Link href={{ pathname: '/booking', query: { experience: item.register } }}>
              Đăng ký
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      ) : null}
    </article>
  );
}
