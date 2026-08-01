import { PageHero } from '@/components/common/page-hero';
import { Section, SectionHeader } from '@/components/common/section';
import { ExperienceComparisonTable } from '@/features/experience/comparison-table';
import { ExperienceExplorer } from '@/features/experience/experience-explorer';
import { MEDIA } from '@/constants/media';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Gói trải nghiệm golf',
  description:
    '12 gói trải nghiệm golf tại Lotus Golf Center: cho người mới, nhóm bạn, gia đình, trẻ em, doanh nhân, khách VIP và doanh nghiệp. Xem giá, thời lượng và quyền lợi từng gói.',
  path: '/experience',
  image: MEDIA.hero.home,
  keywords: ['gói trải nghiệm golf', 'golf cho người mới', 'golf gia đình', 'golf doanh nghiệp'],
});

export default function ExperiencePage() {
  return (
    <>
      <PageHero
        eyebrow="Trải nghiệm golf"
        title="Chọn cách bạn muốn bắt đầu"
        description="Mỗi gói được thiết kế cho một nhu cầu cụ thể. Lọc theo người đi cùng để tìm gói phù hợp nhất với bạn."
        image={MEDIA.hero.home}
        breadcrumbs={[{ label: 'Trải nghiệm' }]}
      />

      <Section>
        <ExperienceExplorer />
      </Section>

      <Section tone="surface">
        <SectionHeader
          eyebrow="So sánh"
          title="Đặt các gói cạnh nhau để dễ chọn"
          description="Bảng dưới đây so sánh những gói được đặt nhiều nhất và các gói phù hợp với người mới."
        />
        <ExperienceComparisonTable />
      </Section>
    </>
  );
}
