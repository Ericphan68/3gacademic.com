import { ReferralsPanel } from '@/features/coach-portal/referrals-panel';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Giới thiệu — Coach Portal',
  description: 'Liên kết giới thiệu, mã QR và danh sách học viên được ghi nhận.',
  path: '/coach-portal/referrals',
  noIndex: true,
});

export default function CoachReferralsPage() {
  return <ReferralsPanel />;
}
