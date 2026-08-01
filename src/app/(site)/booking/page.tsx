import { Suspense } from 'react';

import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { BookingFlow } from '@/features/booking/booking-flow';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Đặt lịch golf',
  description:
    'Đặt lịch tập golf tại Lotus Golf Center chỉ trong vài bước: chọn trải nghiệm, ngày giờ, khu vực, huấn luyện viên và dịch vụ bổ sung. Mở cửa 06:00–22:00, check-in bằng mã QR.',
  path: '/booking',
  keywords: ['đặt lịch golf', 'đặt sân tập golf', 'booking golf', 'sân tập golf TP HCM'],
});

export default function BookingPage() {
  return (
    <>
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container-lotus py-5">
          <Breadcrumbs items={[{ label: 'Đặt lịch' }]} />
        </div>
      </div>

      <Suspense
        fallback={
          <div className="container-lotus py-16">
            <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />
          </div>
        }
      >
        <BookingFlow />
      </Suspense>
    </>
  );
}
