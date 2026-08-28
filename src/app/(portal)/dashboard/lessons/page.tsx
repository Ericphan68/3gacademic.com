import { redirect } from 'next/navigation';

import { LessonsHydrator } from '@/features/dashboard/lessons-hydrator';
import { LessonsPanel } from '@/features/dashboard/lessons-panel';
import { getCustomerSession } from '@/server/auth/current-customer';
import { listCustomerLessons } from '@/server/services/bookingService';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Buổi học của tôi',
  description: 'Lộ trình học và ghi chú từ huấn luyện viên Lotus Golf Center.',
  path: '/dashboard/lessons',
  noIndex: true,
});

export default async function DashboardLessonsPage() {
  const session = await getCustomerSession();
  if (!session) redirect('/login');

  const lessons = await listCustomerLessons(session.sub);

  return (
    <>
      <LessonsHydrator lessons={lessons} />
      <LessonsPanel />
    </>
  );
}
