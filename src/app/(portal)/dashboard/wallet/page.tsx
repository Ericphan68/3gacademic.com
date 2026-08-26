import { redirect } from 'next/navigation';

import { WalletManager } from '@/features/dashboard/wallet-manager';
import { getCustomerSession } from '@/server/auth/current-customer';
import { getCustomerAccount } from '@/server/services/customerAuthService';
import { getBankSettings } from '@/server/services/settingsService';
import { getWalletData } from '@/server/services/topupService';
import { buildMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Ví Lotus',
  description: 'Số dư, nạp ví và lịch sử giao dịch tại Lotus Golf Center.',
  path: '/dashboard/wallet',
  noIndex: true,
});

export default async function DashboardWalletPage() {
  const session = await getCustomerSession();
  if (!session) redirect('/login');

  const [wallet, bank, account] = await Promise.all([
    getWalletData(session.sub),
    getBankSettings(),
    getCustomerAccount(session.sub),
  ]);

  return <WalletManager wallet={wallet} bank={bank} phone={account?.phone ?? ''} />;
}
