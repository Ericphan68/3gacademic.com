import { CoachSchedule } from '@/features/coach-portal/coach-schedule';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Lịch dạy — Coach Portal',
  description: 'Lịch tuần, lịch tháng, slot trống và chặn khung giờ.',
  path: '/coach-portal/schedule',
  noIndex: true,
});

export default function CoachSchedulePage() {
  return <CoachSchedule />;
}
