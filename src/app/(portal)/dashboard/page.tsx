import { DashboardOverview } from '@/features/dashboard/dashboard-overview';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Tổng quan tài khoản',
  description: 'Tổng quan tài khoản Lotus Golf Center của bạn.',
  path: '/dashboard',
  noIndex: true,
});

export default function DashboardPage() {
  return <DashboardOverview />;
}
