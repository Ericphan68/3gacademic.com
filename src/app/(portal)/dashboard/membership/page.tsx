import { MembershipPanel } from '@/features/dashboard/membership-panel';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Hội viên của tôi',
  description: 'Thẻ hội viên, quyền lợi, thời hạn và tiến độ lên hạng tại Lotus Golf Center.',
  path: '/dashboard/membership',
  noIndex: true,
});

export default function DashboardMembershipPage() {
  return <MembershipPanel />;
}
