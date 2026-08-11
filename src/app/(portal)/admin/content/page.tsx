import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { ContentEditor } from '@/features/admin/content-editor';
import { getHomeContent } from '@/server/services/contentService';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  const content = await getHomeContent();

  return (
    <div>
      <PortalHeader
        title="Nội dung trang chủ"
        description="Sửa thanh thông báo và phần đầu trang chủ. Bấm Lưu là trang chủ cập nhật ngay."
        action={
          <Button asChild variant="outline">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              Xem trang chủ
            </Link>
          </Button>
        }
      />
      <ContentEditor initial={content} />
    </div>
  );
}
