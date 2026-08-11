import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { VoucherManager } from '@/features/admin/voucher-manager';
import { listVouchersForAdmin } from '@/server/services/voucherService';

export const dynamic = 'force-dynamic';

export default async function AdminVouchersPage() {
  const vouchers = await listVouchersForAdmin();

  return (
    <div>
      <PortalHeader
        title="Voucher & ưu đãi"
        description="Sửa nội dung, mức giảm, hạn dùng và bật/tắt hiển thị từng voucher. Bấm Lưu là trang /vouchers cập nhật ngay."
        action={
          <Button asChild variant="outline">
            <Link href="/vouchers" target="_blank" rel="noopener noreferrer">
              Xem trang public
            </Link>
          </Button>
        }
      />
      <VoucherManager vouchers={vouchers} />
    </div>
  );
}
