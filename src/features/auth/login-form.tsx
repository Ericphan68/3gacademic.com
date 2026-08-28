'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Eye, EyeOff, LogIn, MailWarning } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Label } from '@/components/ui/form-fields';
import { useAuthStore } from '@/store/useAuthStore';

const schema = z.object({
  identifier: z.string().min(1, 'Vui lòng nhập email hoặc số điện thoại'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [verified, setVerified] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('verified');
    if (v) {
      const t = setTimeout(() => setVerified(v), 0);
      return () => clearTimeout(t);
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { identifier: '', password: '' } });

  const onSubmit = async (values: FormValues) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: values.identifier, password: values.password }),
    });
    const body = (await res.json().catch(() => null)) as { user?: unknown; error?: string } | null;

    if (!res.ok) {
      if (res.status === 403 && body?.error === 'EMAIL_UNVERIFIED') {
        setVerified(null);
        setUnverifiedEmail(values.identifier.includes('@') ? values.identifier : '');
        return;
      }
      toast.error('Đăng nhập chưa thành công', { description: body?.error });
      return;
    }
    if (!body?.user) {
      toast.error('Đăng nhập chưa thành công');
      return;
    }

    setUser(body.user as Parameters<typeof setUser>[0]);
    toast.success('Đăng nhập thành công', { description: 'Chào mừng bạn trở lại Lotus.' });
    router.push('/dashboard');
  };

  const resendVerify = async () => {
    if (!unverifiedEmail) {
      toast.message('Vui lòng đăng nhập bằng email để gửi lại xác nhận.');
      return;
    }
    await fetch('/api/auth/resend-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: unverifiedEmail }),
    }).catch(() => {});
    toast.success('Đã gửi lại email xác nhận', { description: 'Kiểm tra hộp thư (kể cả Spam).' });
  };

  return (
    <div>
      <h1 className="text-3xl">Đăng nhập</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Đăng nhập để xem lịch đặt, ví Lotus, voucher và tiến độ học của bạn.
      </p>

      {verified === 'ok' ? (
        <div className="mt-5 flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-4 text-sm text-[var(--color-golf-800)]">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>Email đã được xác nhận. Mời bạn đăng nhập.</span>
        </div>
      ) : null}
      {verified === 'expired' || verified === 'invalid' ? (
        <div className="mt-5 flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning)]/10 p-4 text-sm">
          <MailWarning className="mt-0.5 size-4 shrink-0 text-[var(--color-warning)]" aria-hidden />
          <span>
            {verified === 'expired'
              ? 'Link xác nhận đã hết hạn. Hãy đăng nhập rồi bấm “gửi lại” để nhận link mới.'
              : 'Link xác nhận không hợp lệ. Hãy đăng nhập để nhận lại email xác nhận.'}
          </span>
        </div>
      ) : null}
      {unverifiedEmail !== null ? (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning)]/10 p-4 text-sm">
          <p className="flex items-center gap-2 font-medium">
            <MailWarning className="size-4 shrink-0 text-[var(--color-warning)]" aria-hidden />
            Email chưa được xác nhận
          </p>
          <p className="mt-1 text-[var(--color-muted)]">
            Vui lòng mở email và bấm link xác nhận để kích hoạt tài khoản.
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={resendVerify}>
            Gửi lại email xác nhận
          </Button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <Field
          label="Email hoặc số điện thoại"
          htmlFor="login-id"
          required
          error={errors.identifier?.message}
        >
          <Input
            id="login-id"
            placeholder="email@cua-ban.com hoặc 0901234567"
            autoComplete="username"
            invalid={Boolean(errors.identifier)}
            {...register('identifier')}
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

      <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
        Chưa có tài khoản?{' '}
        <Link href="/register" className="font-medium text-[var(--color-accent)] hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
