import { RegisterForm } from '@/features/auth/register-form';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Đăng ký tài khoản',
  description:
    'Tạo tài khoản Lotus Golf Center để đặt lịch nhanh hơn, nhận ưu đãi dành riêng và theo dõi tiến độ học golf của bạn.',
  path: '/register',
  noIndex: true,
});

export default function RegisterPage() {
  return <RegisterForm />;
}
