import { ResetPasswordForm } from '@/features/auth/reset-password-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Đặt lại mật khẩu',
  description: 'Tạo mật khẩu mới cho tài khoản Lotus Golf Center của bạn.',
  path: '/reset-password',
  noIndex: true,
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ResetPasswordForm token={token ?? ''} />;
}
