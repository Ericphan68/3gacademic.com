import { redirect } from 'next/navigation';

import { VouchersHydrator } from '@/features/dashboard/vouchers-hydrator';
import { VouchersManager } from '@/features/dashboard/vouchers-manager';
import { getCustomerSession } from '@/server/auth/current-customer';
import { listCustomerVouchers } from '@/server/services/voucherPurchaseService';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Voucher của tôi',
  description: 'Voucher đang có, đã dùng và hết hạn.',
  path: '/dashboard/vouchers',
  noIndex: true,
});

export default async function DashboardVouchersPage() {
  const session = await getCustomerSession();
  if (!session) redirect('/login');

  const vouchers = await listCustomerVouchers(session.sub);

  return (
    <>
      <VouchersHydrator vouchers={vouchers} />
      <VouchersManager />
    </>
  );
}
