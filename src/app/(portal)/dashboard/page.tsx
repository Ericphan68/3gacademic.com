import { redirect } from 'next/navigation';

import { BookingsHydrator } from '@/features/dashboard/bookings-hydrator';
import { DashboardOverview } from '@/features/dashboard/dashboard-overview';
import { getCustomerSession } from '@/server/auth/current-customer';
import { listCustomerBookings } from '@/server/services/bookingService';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Tổng quan tài khoản',
  description: 'Tổng quan tài khoản Lotus Golf Center của bạn.',
  path: '/dashboard',
  noIndex: true,
});

export default async function DashboardPage() {
  const session = await getCustomerSession();
  if (!session) redirect('/login');

  const bookings = await listCustomerBookings(session.sub);

  return (
    <>
      <BookingsHydrator bookings={bookings} />
      <DashboardOverview />
    </>
  );
}
