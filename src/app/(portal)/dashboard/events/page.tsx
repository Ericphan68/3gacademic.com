import { EventsPanel } from '@/features/dashboard/events-panel';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Sự kiện của tôi',
  description: 'Sự kiện đã đăng ký tại Lotus Golf Center kèm mã QR check-in.',
  path: '/dashboard/events',
  noIndex: true,
});

export default function DashboardEventsPage() {
  return <EventsPanel />;
}
