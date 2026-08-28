'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CheckCircle2, Eye, EyeOff, KeyRound, MailWarning } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';

const schema = z
  .object({
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận chưa khớp',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const password = useWatch({ control, name: 'password' }) ?? '';

  const onSubmit = async (values: FormValues) => {
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: values.password }),
    });
    const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;

    if (!res.ok) {
      toast.error('Chưa đặt lại được mật khẩu', { description: body?.error });
      return;
    }
    setDone(true);
  };

  // Không có token trong link.
  if (!token) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--color-warning)]/10 text-[var(--color-warning)]">
          <MailWarning className="size-8" aria-hidden />
        </span>
        <h1 className="text-3xl">Link không hợp lệ</h1>
        <p className="mt-3 text-[var(--color-muted)]">
          Đường link đặt lại mật khẩu thiếu hoặc không đúng. Hãy yêu cầu gửi lại link mới.
        </p>
        <div className="mt-8">
          <Button asChild variant="accent" block>
            <Link href="/forgot-password">Yêu cầu link mới</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Đặt lại thành công.
  if (done) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
          <CheckCircle2 className="size-8" aria-hidden />
        </span>
        <h1 className="text-3xl">Đã đổi mật khẩu</h1>
        <p className="mt-3 text-[var(--color-muted)]">
          Mật khẩu của bạn đã được cập nhật. Mời bạn đăng nhập bằng mật khẩu mới.
        </p>
        <div className="mt-8">
          <Button variant="accent" block onClick={() => router.push('/login')}>
            Tới trang đăng nhập
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
        <KeyRound className="size-7" aria-hidden />
      </span>

      <h1 className="text-3xl">Đặt lại mật khẩu</h1>
      <p className="mt-3 text-[var(--color-muted)]">Nhập mật khẩu mới cho tài khoản của bạn.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <Field label="Mật khẩu mới" htmlFor="rp-password" required error={errors.password?.message}>
          <div className="relative">
            <Input
              id="rp-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tạo mật khẩu mới"
              autoComplete="new-password"
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

        <div className="flex items-center gap-1.5 text-xs">
          <Check
            className={`size-3.5 ${password.length >= 6 ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'}`}
            strokeWidth={password.length >= 6 ? 3 : 2}
            aria-hidden
          />
          <span className={password.length >= 6 ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'}>
            Tối thiểu 6 ký tự
          </span>
        </div>

        <Field label="Xác nhận mật khẩu" htmlFor="rp-confirm" required error={errors.confirmPassword?.message}>
          <Input
            id="rp-confirm"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            autoComplete="new-password"
            invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </Field>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting}>
          <KeyRound aria-hidden />
          Đặt lại mật khẩu
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}
