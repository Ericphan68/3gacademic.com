import { PortalHeader } from '@/components/dashboard/portal-shell';
import { BookingsTable } from '@/features/admin/bookings-table';
import { listBookings } from '@/server/services/bookingService';

export const dynamic = 'force-dynamic';

export default async function AdminBookingsPage() {
  const bookings = await listBookings();

  return (
    <div>
      <PortalHeader
        title="Quản lý đặt lịch"
        description="Toàn bộ đơn đặt lịch khách gửi từ website. Xác nhận thanh toán cho đơn chuyển khoản hoặc trả tại quầy."
      />
      <BookingsTable bookings={bookings} />
    </div>
  );
}
