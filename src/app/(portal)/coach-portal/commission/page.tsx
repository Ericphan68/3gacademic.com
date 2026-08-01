import { CommissionPanel } from '@/features/coach-portal/commission-panel';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Hoa hồng — Coach Portal',
  description: 'Tổng hoa hồng, trạng thái xác nhận, lịch sử giao dịch và chính sách.',
  path: '/coach-portal/commission',
  noIndex: true,
});

export default function CoachCommissionPage() {
  return <CommissionPanel />;
}
