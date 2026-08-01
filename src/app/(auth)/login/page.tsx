import { LoginForm } from '@/features/auth/login-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Đăng nhập',
  description:
    'Đăng nhập tài khoản Lotus Golf Center để quản lý lịch đặt, ví Lotus, voucher, hội viên và tiến độ học golf.',
  path: '/login',
  noIndex: true,
});

export default function LoginPage() {
  return <LoginForm />;
}
