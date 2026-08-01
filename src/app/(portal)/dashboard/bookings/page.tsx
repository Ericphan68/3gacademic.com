import { BookingsManager } from '@/features/dashboard/bookings-manager';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Lịch đặt của tôi',
  description: 'Quản lý lịch đặt tại Lotus Golf Center: xem chi tiết, mã QR, đổi lịch và huỷ.',
  path: '/dashboard/bookings',
  noIndex: true,
});

export default function DashboardBookingsPage() {
  return <BookingsManager />;
}
