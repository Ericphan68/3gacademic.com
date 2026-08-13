import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { EventManager } from '@/features/admin/event-manager';
import { listEventsForAdmin } from '@/server/services/eventService';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  const events = await listEventsForAdmin();

  return (
    <div>
      <PortalHeader
        title="Sự kiện & giải đấu"
        description="Sửa tên, mô tả, thời gian, phí, sức chứa và bật/tắt hiển thị từng sự kiện. Bấm Lưu là trang /events cập nhật ngay."
        action={
          <Button asChild variant="outline">
            <Link href="/events" target="_blank" rel="noopener noreferrer">
              Xem trang public
            </Link>
          </Button>
        }
      />
      <EventManager events={events} />
    </div>
  );
}
