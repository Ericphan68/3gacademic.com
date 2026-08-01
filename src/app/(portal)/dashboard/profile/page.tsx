import { ProfileForm } from '@/features/dashboard/profile-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Hồ sơ của tôi',
  description: 'Thông tin cá nhân, sở thích, trình độ golf, thông báo và bảo mật tài khoản.',
  path: '/dashboard/profile',
  noIndex: true,
});

export default function DashboardProfilePage() {
  return <ProfileForm />;
}
