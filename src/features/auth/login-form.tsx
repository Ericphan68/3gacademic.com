'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn, Phone, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Label } from '@/components/ui/form-fields';
import { Separator } from '@/components/ui/misc';
import { DEMO_ACCOUNTS } from '@/constants/site';
import { useAuthStore } from '@/store/useAuthStore';

const schema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const loginWithProvider = useAuthStore((state) => state.loginWithProvider);

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const redirectAfterLogin = (role: 'customer' | 'coach') => {
    router.push(role === 'coach' ? '/coach-portal' : '/dashboard');
  };

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const result = login(values.email, values.password);

    if (!result.success) {
      toast.error('Đăng nhập chưa thành công', { description: result.message });
      return;
    }

    toast.success('Đăng nhập thành công', { description: result.message });
    redirectAfterLogin(useAuthStore.getState().user?.role ?? 'customer');
  };

  const signInWithDemoAccount = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
    const result = login(email, password);
    if (result.success) {
      toast.success('Đã đăng nhập bằng tài khoản demo', { description: result.message });
      redirectAfterLogin(useAuthStore.getState().user?.role ?? 'customer');
    }
  };

  const handleProvider = (provider: 'google' | 'phone') => {
    const result = loginWithProvider(provider);
    toast.success('Đăng nhập demo thành công', { description: result.message });
    redirectAfterLogin('customer');
  };

  return (
    <div>
      <h1 className="text-3xl">Đăng nhập</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Đăng nhập để xem lịch đặt, ví Lotus, voucher và tiến độ học của bạn.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <Field label="Email" htmlFor="login-email" required error={errors.email?.message}>
          <Input
            id="login-email"
            type="email"
            placeholder="email@cua-ban.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <Field label="Mật khẩu" htmlFor="login-password" required error={errors.password?.message}>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
              invalid={Boolean(errors.password)}
              className="pr-12"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)]"
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </div>
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="login-remember"
              checked={remember}
              onCheckedChange={(checked) => setRemember(checked === true)}
            />
            <Label htmlFor="login-remember" className="font-normal">
              Ghi nhớ đăng nhập
            </Label>
          </div>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[var(--color-accent)] underline-offset-4 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting}>
          <LogIn aria-hidden />
          Đăng nhập
        </Button>
      </form>

      <div className="my-7 flex items-center gap-4">
        <Separator className="flex-1" />
        <span className="text-xs tracking-widest text-[var(--color-muted)] uppercase">Hoặc</span>
        <Separator className="flex-1" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={() => handleProvider('google')}>
          <GoogleIcon />
          Google (demo)
        </Button>
        <Button variant="outline" onClick={() => handleProvider('phone')}>
          <Phone aria-hidden />
          Số điện thoại (demo)
        </Button>
      </div>

      {/* Tài khoản demo */}
      <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-5">
        <p className="flex items-center gap-2 text-sm font-medium text-[var(--color-champagne-800)]">
          <ShieldCheck className="size-4" aria-hidden />
          Tài khoản demo — bấm để đăng nhập ngay
        </p>

        <ul className="mt-4 space-y-3">
          {DEMO_ACCOUNTS.map((account) => (
            <li
              key={account.email}
              className="rounded-[var(--radius-md)] border border-[var(--color-champagne-200)] bg-[var(--color-surface-raised)] p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{account.role}</p>
                  <p className="mt-0.5 font-mono text-xs break-all text-[var(--color-muted)]">
                    {account.email} · {account.password}
                  </p>
                </div>
                <Button
                  variant="subtle"
                  size="sm"
                  onClick={() => signInWithDemoAccount(account.email, account.password)}
                >
                  Dùng tài khoản này
                </Button>
              </div>
              <p className="mt-2 text-xs text-[var(--color-muted)]">{account.description}</p>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-[var(--color-champagne-800)]">
          Đây là hệ thống đăng nhập minh hoạ, dữ liệu chỉ lưu trong trình duyệt của bạn. Vui lòng không dùng
          mật khẩu thật.
        </p>
      </div>

      <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="font-medium text-[var(--color-accent)] hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.85-.08-1.67-.22-2.45H12v4.64h6.2a5.3 5.3 0 0 1-2.3 3.48v2.89h3.72c2.18-2 3.44-4.96 3.44-8.46Z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.11 0 5.72-1.03 7.62-2.79l-3.72-2.89c-1.03.69-2.35 1.1-3.9 1.1-3 0-5.54-2.03-6.45-4.75H1.7v2.98A11.5 11.5 0 0 0 12 23.5Z"
      />
      <path
        fill="#FBBC05"
        d="M5.55 14.17a6.9 6.9 0 0 1 0-4.34V6.85H1.7a11.5 11.5 0 0 0 0 10.3l3.85-2.98Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.72 1.3 15.11.25 12 .25A11.5 11.5 0 0 0 1.7 6.85l3.85 2.98C6.46 7.1 9 4.77 12 4.77Z"
      />
    </svg>
  );
}
