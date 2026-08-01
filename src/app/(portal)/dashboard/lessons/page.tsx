import { LessonsPanel } from '@/features/dashboard/lessons-panel';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Buổi học của tôi',
  description: 'Lộ trình học, tiến độ, ghi chú và bài tập từ huấn luyện viên Lotus Golf Center.',
  path: '/dashboard/lessons',
  noIndex: true,
});

export default function DashboardLessonsPage() {
  return <LessonsPanel />;
}
