import { Check, Minus } from 'lucide-react';

import { FaqAccordion, FaqJsonLd } from '@/components/common/faq-accordion';
import { PageHero } from '@/components/common/page-hero';
import { Section, SectionHeader } from '@/components/common/section';
import { MEDIA } from '@/constants/media';
import { MEMBERSHIP_FAQS } from '@/data/memberships';
import { FounderCountdown } from '@/features/membership/founder-countdown';
import { MembershipCalculator } from '@/features/membership/membership-calculator';
import { MembershipPricing } from '@/features/membership/membership-purchase';
import { buildMetadata } from '@/lib/seo';
import { getCustomerSession } from '@/server/auth/current-customer';
import { getCustomerAccount } from '@/server/services/customerAuthService';
import { getManagedTiers } from '@/server/services/membershipService';
import { getBankSettings } from '@/server/services/settingsService';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Hội viên & Top-up',
  description:
    'Bốn hạng hội viên Lotus Golf Center: Starter, Member, Premium và Founder. Nạp ví nhận bonus tới 25%, ưu đãi giá sân tới 25%, ưu tiên khung giờ và concierge riêng.',
  path: '/membership',
  image: MEDIA.hero.membership,
  keywords: ['hội viên golf', 'thẻ hội viên sân tập golf', 'membership golf', 'top-up golf'],
});

export default async function MembershipPage() {
  const [tiers, bank, session] = await Promise.all([
    getManagedTiers(),
    getBankSettings(),
    getCustomerSession(),
  ]);
  const account = session ? await getCustomerAccount(session.sub) : null;
  const founder = tiers.find((tier) => tier.id === 'founder');

  return (
    <>
      <PageHero
        eyebrow="Hội viên & Top-up"
        title="Chơi càng đều, ưu đãi càng nhiều"
        description="Hội viên Lotus không phải phí thành viên — đó là số dư trả trước bạn dùng cho mọi dịch vụ, kèm bonus và quyền lợi tăng dần theo hạng."
        image={MEDIA.hero.membership}
        breadcrumbs={[{ label: 'Hội viên' }]}
      />

      <Section>
        <SectionHeader
          eyebrow="Bốn hạng hội viên"
          title="Chọn hạng phù hợp với tần suất của bạn"
          description="Số dư Top-up dùng được cho giờ tập, buổi học với huấn luyện viên, F&B, phí sự kiện và mua voucher."
        />
        <MembershipPricing
          tiers={tiers}
          isLoggedIn={Boolean(account)}
          walletBalance={account?.walletBalance ?? 0}
          currentTier={account?.membershipTier ?? null}
          bank={bank}
          phone={account?.phone ?? ''}
        />
      </Section>

      {founder ? (
        <Section tone="surface" className="!py-12">
          <FounderCountdown tier={founder} />
        </Section>
      ) : null}

      {/* Bảng so sánh */}
      <Section>
        <SectionHeader
          eyebrow="So sánh chi tiết"
          title="Toàn bộ quyền lợi đặt cạnh nhau"
          description="Bảng dưới đây liệt kê đầy đủ quyền lợi của từng hạng để bạn dễ đối chiếu."
        />

        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <table className="w-full min-w-[48rem] border-collapse text-sm">
            <caption className="sr-only">Bảng so sánh quyền lợi bốn hạng hội viên Lotus Golf Center</caption>
            <thead>
              <tr className="bg-[var(--color-surface)]">
                <th scope="col" className="p-4 text-left font-medium">
                  Quyền lợi
                </th>
                {tiers.map((tier) => (
                  <th key={tier.id} scope="col" className="p-4 text-left font-medium">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers[0].benefits.map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-[var(--color-border)]">
                  <th scope="row" className="p-4 text-left font-normal text-[var(--color-muted)]">
                    {tiers[0].benefits[rowIndex].label}
                  </th>
                  {tiers.map((tier) => {
                    const benefit = tier.benefits[rowIndex];
                    return (
                      <td key={tier.id} className="p-4">
                        {benefit.included ? (
                          <span className="inline-flex items-center gap-2">
                            <Check className="size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
                            <span className="font-medium">{benefit.value}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-[var(--color-stone-400)]">
                            <Minus className="size-4 shrink-0" aria-hidden />
                            Không áp dụng
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                <th scope="row" className="p-4 text-left font-normal text-[var(--color-muted)]">
                  Chính sách huỷ
                </th>
                {tiers.map((tier) => (
                  <td key={tier.id} className="p-4">
                    {tier.cancellationPolicy}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-[var(--color-border)]">
                <th scope="row" className="p-4 text-left font-normal text-[var(--color-muted)]">
                  Ưu tiên khung giờ
                </th>
                {tiers.map((tier) => (
                  <td key={tier.id} className="p-4">
                    {tier.priorityWindow}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Calculator */}
      <Section tone="surface">
        <MembershipCalculator tiers={tiers} />
      </Section>

      {/* FAQ */}
      <Section>
        <SectionHeader
          eyebrow="Câu hỏi thường gặp"
          title="Về hội viên và số dư Top-up"
          align="center"
        />
        <div className="mx-auto max-w-3xl">
          <FaqAccordion items={MEMBERSHIP_FAQS} />
          <FaqJsonLd items={MEMBERSHIP_FAQS} />
        </div>
      </Section>
    </>
  );
}
