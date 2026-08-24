import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { PostManager } from '@/features/admin/post-manager';
import { listPostsFullForAdmin } from '@/server/services/postService';

export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  const posts = await listPostsFullForAdmin();

  return (
    <div>
      <PortalHeader
        title="Thư Viện — Bài viết"
        description="Đăng, sửa và ẩn/hiện bài viết. Bài đã xuất bản hiển thị ở trang /thu-vien."
        action={
          <Button asChild variant="outline">
            <Link href="/thu-vien" target="_blank" rel="noopener noreferrer">
              Xem Thư Viện
            </Link>
          </Button>
        }
      />
      <PostManager posts={posts} />
    </div>
  );
}
