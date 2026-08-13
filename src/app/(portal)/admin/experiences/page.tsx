import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { ExperienceManager } from '@/features/admin/experience-manager';
import { listExperiencesForAdmin } from '@/server/services/experienceService';

export const dynamic = 'force-dynamic';

export default async function AdminExperiencesPage() {
  const experiences = await listExperiencesForAdmin();

  return (
    <div>
      <PortalHeader
        title="Gói trải nghiệm"
        description="Sửa tên, mô tả, giá, thời lượng, số khách và bật/tắt hiển thị từng gói. Bấm Lưu là trang /experience cập nhật ngay."
        action={
          <Button asChild variant="outline">
            <Link href="/experience" target="_blank" rel="noopener noreferrer">
              Xem trang public
            </Link>
          </Button>
        }
      />
      <ExperienceManager experiences={experiences} />
    </div>
  );
}
