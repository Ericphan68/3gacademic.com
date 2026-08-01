'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MailCheck, Send } from 'lucide-react';
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

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSentTo(values.email);
    toast.success('Đã gửi hướng dẫn đặt lại mật khẩu', {
      description: 'Đây là bước demo — không có email thật nào được gửi đi.',
    });
  };

  if (sentTo) {
    return (
      <div className="text-center">
        <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
          <MailCheck className="size-8" aria-hidden />
        </span>

        <h1 className="text-3xl">Kiểm tra email của bạn</h1>
        <p className="mt-3 text-[var(--color-muted)]">
          Nếu <span className="font-medium text-[var(--color-foreground)]">{sentTo}</span> đã đăng ký tại
          Lotus, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu trong vài phút.
        </p>

        <div className="mt-8 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] p-5 text-left">
          <p className="text-sm font-medium">Đây là bước demo</p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
            Phiên bản này chưa gửi email thật. Để thử các tính năng của tài khoản, bạn dùng tài khoản demo có
            sẵn ở trang đăng nhập.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button asChild variant="accent" block>
            <Link href="/login">Quay lại đăng nhập</Link>
          </Button>
          <Button variant="ghost" block onClick={() => setSentTo(null)}>
            Gửi lại cho email khác
          </Button>
        </div>
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

      <h1 className="text-3xl">Quên mật khẩu</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Nhập email bạn đã dùng để đăng ký. Lotus sẽ gửi hướng dẫn đặt lại mật khẩu.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <Field
          label="Email đã đăng ký"
          htmlFor="forgot-email"
          required
          error={errors.email?.message}
          helper="Kiểm tra cả hộp thư rác nếu bạn không thấy email sau vài phút."
        >
          <Input
            id="forgot-email"
            type="email"
            placeholder="email@cua-ban.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting}>
          <Send aria-hidden />
          Gửi hướng dẫn đặt lại
        </Button>
      </form>

      <div className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <p className="text-sm font-medium">Cần hỗ trợ trực tiếp?</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          Gọi hotline{' '}
          <a
            href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}
            className="font-medium text-[var(--color-accent)] hover:underline"
          >
            {CONTACT.hotline}
          </a>{' '}
          trong khung giờ {CONTACT.openHours}, đội chăm sóc khách hàng sẽ xác minh và hỗ trợ bạn khôi phục tài
          khoản.
        </p>
        <p className="mt-3 text-xs text-[var(--color-muted)]">
          Email đang thử: {getValues('email') || 'chưa nhập'}
        </p>
      </div>
    </div>
  );
}
