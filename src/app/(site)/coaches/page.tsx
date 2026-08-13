import { GraduationCap, HeartHandshake, ShieldCheck } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { Section } from '@/components/common/section';
import { StatTile } from '@/components/common/stat-tile';
import { MEDIA } from '@/constants/media';
import { CoachExplorer } from '@/features/coaches/coach-explorer';
import { buildMetadata } from '@/lib/seo';
import { getManagedCoaches } from '@/server/services/coachService';

export const metadata = buildMetadata({
  title: 'Huấn luyện viên golf',
  description:
    'Danh sách 12 huấn luyện viên golf tại Lotus Golf Center. Lọc theo chuyên môn, ngôn ngữ, mức giá và đánh giá để tìm người phù hợp với mục tiêu của bạn.',
  path: '/coaches',
  keywords: ['huấn luyện viên golf', 'học golf', 'thầy dạy golf', 'golf cho người mới'],
});

export default async function CoachesPage() {
  const coaches = await getManagedCoaches();
  const avgRating = coaches.reduce((sum, coach) => sum + coach.rating, 0) / coaches.length;
  const totalStudents = coaches.reduce((sum, coach) => sum + coach.studentCount, 0);

  return (
    <>
      <PageHero
        eyebrow="Đội ngũ huấn luyện"
        title="Tìm huấn luyện viên phù hợp với bạn"
        description="Mỗi huấn luyện viên tại Lotus chuyên trách một mảng riêng. Lọc theo mục tiêu của bạn — người mới, trẻ em, putting, swing hay chuẩn bị thi đấu — để tìm người đồng hành đúng nhất."
        image={MEDIA.hero.academy}
        breadcrumbs={[{ label: 'Huấn luyện viên' }]}
      />

      <Section className="!pt-12">
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile value={coaches.length} label="Huấn luyện viên chuyên trách" icon={<GraduationCap className="size-5" />} />
          <StatTile value={avgRating.toFixed(1)} label="Điểm đánh giá trung bình" tone="accent" icon={<ShieldCheck className="size-5" />} />
          <StatTile value={`${totalStudents.toLocaleString('vi-VN')}+`} label="Lượt học viên đã đồng hành" icon={<HeartHandshake className="size-5" />} />
          <StatTile value="4 ngôn ngữ" label="Việt · Anh · Hàn · Nhật" tone="gold" />
        </div>

        <CoachExplorer catalog={coaches} />
      </Section>
    </>
  );
}
