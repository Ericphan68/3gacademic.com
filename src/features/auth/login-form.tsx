'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

    if (!res.ok || !body?.user) {
      toast.error('Đăng nhập chưa thành công', { description: body?.error });
      return;
    }

    setUser(body.user as Parameters<typeof setUser>[0]);
    toast.success('Đăng nhập thành công', { description: 'Chào mừng bạn trở lại Lotus.' });
    router.push('/dashboard');
  };

  return (
    <div>
      <h1 className="text-3xl">Đăng nhập</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Đăng nhập để xem lịch đặt, ví Lotus, voucher và tiến độ học của bạn.
      </p>

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
