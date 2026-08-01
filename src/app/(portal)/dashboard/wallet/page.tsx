import { WalletManager } from '@/features/dashboard/wallet-manager';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Ví Lotus',
  description: 'Số dư, nạp ví, bonus và lịch sử giao dịch tại Lotus Golf Center.',
  path: '/dashboard/wallet',
  noIndex: true,
});

export default function DashboardWalletPage() {
  return <WalletManager />;
}
