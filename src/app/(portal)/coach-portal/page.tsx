import { CoachOverview } from '@/features/coach-portal/coach-overview';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Coach Portal',
  description: 'Khu vực dành cho huấn luyện viên Lotus Golf Center.',
  path: '/coach-portal',
  noIndex: true,
});

export default function CoachPortalPage() {
  return <CoachOverview />;
}
