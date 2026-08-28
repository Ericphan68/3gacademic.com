import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { CoachManager } from '@/features/admin/coach-manager';
import { listCoachesForAdmin } from '@/server/services/coachService';

export const dynamic = 'force-dynamic';

export default async function AdminCoachesPage() {
  const coaches = await listCoachesForAdmin();

  return (
    <div>
      <PortalHeader
        title="Huấn luyện viên"
        description="Thêm HLV mới, tải ảnh, sửa tên, chức danh, giới thiệu, số năm kinh nghiệm, học phí và bật/tắt hiển thị từng HLV. Bấm Lưu/Tạo là trang /coaches cập nhật ngay."
        action={
          <Button asChild variant="outline">
            <Link href="/coaches" target="_blank" rel="noopener noreferrer">
              Xem trang public
            </Link>
          </Button>
        }
      />
      <CoachManager coaches={coaches} />
    </div>
  );
}
