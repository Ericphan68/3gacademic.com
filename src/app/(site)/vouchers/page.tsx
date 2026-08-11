import { Gift, Info, Ticket, Zap } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { Section, SectionHeader } from '@/components/common/section';
import { StatTile } from '@/components/common/stat-tile';
import { MEDIA } from '@/constants/media';
import { VoucherExplorer } from '@/features/vouchers/voucher-explorer';
import { buildMetadata } from '@/lib/seo';
import { getManagedVouchers } from '@/server/services/voucherService';

export const metadata = buildMetadata({
  title: 'Voucher và ưu đãi',
  description:
    'Voucher golf tại Lotus Golf Center: ưu đãi khách mới, Flash Sale, giờ thấp điểm, gói huấn luyện, F&B, sự kiện, doanh nghiệp và voucher quà tặng.',
  path: '/vouchers',
  keywords: ['voucher golf', 'ưu đãi golf', 'giảm giá sân tập golf', 'flash sale golf'],
});

export default async function VouchersPage() {
  const vouchers = await getManagedVouchers();
  const hotCount = vouchers.filter((voucher) => voucher.hot).length;
  const freeCount = vouchers.filter((voucher) => voucher.price === 0).length;

  return (
    <>
      <PageHero
        eyebrow="Voucher & Ưu đãi"
        title="Ưu đãi cho mọi nhu cầu chơi golf"
        description="Từ ưu đãi dành riêng cho khách mới đến Flash Sale giờ thấp điểm và voucher quà tặng. Voucher đã lưu sẽ tự động hiện ở bước thanh toán khi bạn đặt lịch."
        image={MEDIA.hero.membership}
        breadcrumbs={[{ label: 'Voucher' }]}
        size="sm"
      />

      <Section className="!pb-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile value={vouchers.length} label="Voucher đang mở" icon={<Ticket className="size-5" />} />
          <StatTile value={hotCount} label="Ưu đãi đang hot" tone="gold" icon={<Zap className="size-5" />} />
          <StatTile value={freeCount} label="Voucher nhận miễn phí" tone="accent" icon={<Gift className="size-5" />} />
          <StatTile value="8 nhóm" label="Phân loại theo nhu cầu" />
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Kho voucher"
          title="Chọn ưu đãi phù hợp với bạn"
          description="Lưu voucher vào tài khoản để dùng sau, hoặc mua voucher quà tặng cho người thân."
        />
        <VoucherExplorer catalog={vouchers} />
      </Section>

      <Section tone="surface" className="!py-12">
        <div className="mx-auto flex max-w-3xl items-start gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
          <Info className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
          <div className="text-sm leading-relaxed text-[var(--color-muted)]">
            <p className="font-medium text-[var(--color-foreground)]">Về tính năng chuyển tặng voucher</p>
            <p className="mt-2">
              Bạn có thể chuyển tặng voucher giữa các tài khoản trong mục Voucher của Dashboard. Đây là{' '}
              <span className="font-medium text-[var(--color-foreground)]">tính năng demo</span> phục vụ trình
              diễn giao diện. Lotus không vận hành thị trường mua bán lại voucher bằng tiền mặt.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
