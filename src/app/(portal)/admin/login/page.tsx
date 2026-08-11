'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, ShieldCheck } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';

const schema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = async (values: FormValues) => {
    setError(null);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(body?.error ?? 'Đăng nhập chưa thành công.');
      return;
    }
    router.replace(nextPath.startsWith('/admin') ? nextPath : '/admin');
    router.refresh();
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>

      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-7 shadow-[var(--shadow-subtle)]">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
            <ShieldCheck className="size-5" aria-hidden />
          </span>
          <h1 className="text-2xl">Đăng nhập quản trị</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Khu vực dành cho quản trị viên Lotus Golf.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Field label="Email" htmlFor="admin-email" required error={errors.email?.message}>
            <Input
              id="admin-email"
              type="email"
              autoComplete="email"
              placeholder="admin@lotusgolf.vn"
              invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </Field>

          <Field label="Mật khẩu" htmlFor="admin-password" required error={errors.password?.message}>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              invalid={Boolean(errors.password)}
              {...register('password')}
            />
          </Field>

          {error ? (
            <p className="rounded-[var(--radius-md)] border border-[var(--color-danger)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-danger)]" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" variant="accent" size="lg" block loading={isSubmitting}>
            <LogIn aria-hidden />
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[var(--color-surface)] px-5 py-12">
      <Suspense fallback={<div className="animate-shimmer h-96 w-full max-w-sm rounded-[var(--radius-xl)]" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
