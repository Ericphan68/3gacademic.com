import { VouchersManager } from '@/features/dashboard/vouchers-manager';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Voucher của tôi',
  description: 'Voucher đang có, đã dùng, hết hạn và chức năng chuyển tặng voucher demo.',
  path: '/dashboard/vouchers',
  noIndex: true,
});

export default function DashboardVouchersPage() {
  return <VouchersManager />;
}
