import { ForgotPasswordForm } from '@/features/auth/forgot-password-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Quên mật khẩu',
  description: 'Khôi phục quyền truy cập tài khoản Lotus Golf Center của bạn.',
  path: '/forgot-password',
  noIndex: true,
});

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
