'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, KeyRound, MailCheck, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';
import { CONTACT } from '@/constants/site';

const schema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [emailDisabled, setEmailDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = async (values: FormValues) => {
    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email }),
    });
    const body = (await res.json().catch(() => null)) as { ok?: boolean; emailDisabled?: boolean } | null;

    if (!res.ok) {
      toast.error('Chưa gửi được. Vui lòng thử lại.');
      return;
    }
    if (body?.emailDisabled) {
      setEmailDisabled(true);
      return;
    }
    setSentTo(values.email);
  };

  // Đã gửi email đặt lại thành công.
  if (sentTo) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
          <MailCheck className="size-8" aria-hidden />
        </span>
        <h1 className="text-3xl">Kiểm tra email của bạn</h1>
        <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
          Nếu <span className="font-medium text-[var(--color-foreground)]">{sentTo}</span> là email đã đăng ký,
          chúng tôi vừa gửi một email hướng dẫn đặt lại mật khẩu. Mở email và bấm nút để tạo mật khẩu mới.
        </p>
        <div className="mt-8">
          <Button asChild variant="accent" block>
            <Link href="/login">Về trang đăng nhập</Link>
          </Button>
        </div>
        <p className="mt-6 text-xs text-[var(--color-muted)]">
          Link có hiệu lực trong 1 giờ. Nhớ kiểm tra cả hộp thư rác (Spam) nếu không thấy email.
        </p>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Quay lại đăng nhập
      </Link>

      <span className="mb-5 flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
        <KeyRound className="size-7" aria-hidden />
      </span>

      <h1 className="text-3xl">Quên mật khẩu</h1>
      <p className="mt-3 leading-relaxed text-[var(--color-muted)]">
        Nhập email bạn đã dùng để đăng ký. Chúng tôi sẽ gửi cho bạn một đường link để đặt lại mật khẩu.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <Field label="Email" htmlFor="fp-email" required error={errors.email?.message}>
          <Input
            id="fp-email"
            type="email"
            placeholder="email@cua-ban.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting}>
          <Send aria-hidden />
          Gửi link đặt lại mật khẩu
        </Button>
      </form>

      {emailDisabled ? (
        <div className="mt-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed text-[var(--color-muted)]">
          <p className="font-medium text-[var(--color-foreground)]">Hệ thống email đang tạm bảo trì.</p>
          <p className="mt-1">Vui lòng gọi hotline để được hỗ trợ đặt lại mật khẩu:</p>
          <Button asChild variant="accent" size="sm" className="mt-3">
            <a href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}>
              <Phone aria-hidden />
              Gọi {CONTACT.hotline}
            </a>
          </Button>
        </div>
      ) : (
        <p className="mt-8 text-center text-sm text-[var(--color-muted)]">
          Không nhận được email? Gọi hotline{' '}
          <a
            href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}
            className="font-medium text-[var(--color-accent)] hover:underline"
          >
            {CONTACT.hotline}
          </a>{' '}
          để được hỗ trợ.
        </p>
      )}

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Đã nhớ ra mật khẩu?{' '}
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
