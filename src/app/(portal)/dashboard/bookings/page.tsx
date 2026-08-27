import { redirect } from 'next/navigation';

import { BookingsHydrator } from '@/features/dashboard/bookings-hydrator';
import { BookingsManager } from '@/features/dashboard/bookings-manager';
import { getCustomerSession } from '@/server/auth/current-customer';
import { listCustomerBookings } from '@/server/services/bookingService';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Lịch đặt của tôi',
  description: 'Quản lý lịch đặt tại Lotus Golf Center: xem chi tiết, mã QR, đổi lịch và huỷ.',
  path: '/dashboard/bookings',
  noIndex: true,
});

export default async function DashboardBookingsPage() {
  const session = await getCustomerSession();
  if (!session) redirect('/login');

  const bookings = await listCustomerBookings(session.sub);

  return (
    <>
      <BookingsHydrator bookings={bookings} />
      <BookingsManager />
    </>
  );
}
