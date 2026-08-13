import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { FaqManager } from '@/features/admin/faq-manager';
import { listFaqsForAdmin } from '@/server/services/faqService';

export const dynamic = 'force-dynamic';

export default async function AdminFaqPage() {
  const faqs = await listFaqsForAdmin();

  return (
    <div>
      <PortalHeader
        title="Câu hỏi thường gặp"
        description="Sửa câu hỏi, câu trả lời và bật/tắt hiển thị từng mục. Bấm Lưu là trang /faq cập nhật ngay."
        action={
          <Button asChild variant="outline">
            <Link href="/faq" target="_blank" rel="noopener noreferrer">
              Xem trang public
            </Link>
          </Button>
        }
      />
      <FaqManager faqs={faqs} />
    </div>
  );
}
