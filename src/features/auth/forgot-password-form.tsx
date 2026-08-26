'use client';

import { ArrowLeft, KeyRound, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CONTACT } from '@/constants/site';

export function ForgotPasswordForm() {
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
        Để bảo mật tài khoản, việc đặt lại mật khẩu hiện được đội ngũ Lotus hỗ trợ trực tiếp. Vui lòng liên hệ
        với chúng tôi — nhân viên sẽ xác minh và cấp cho bạn mật khẩu mới ngay.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <Button asChild variant="accent" size="lg" block>
          <a href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}>
            <Phone aria-hidden />
            Gọi hotline {CONTACT.hotline}
          </a>
        </Button>
        {CONTACT.zalo ? (
          <Button asChild variant="outline" size="lg" block>
            <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden />
              Nhắn Zalo hỗ trợ
            </a>
          </Button>
        ) : null}
      </div>

      <p className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm leading-relaxed text-[var(--color-muted)]">
        Khi liên hệ, bạn hãy cung cấp <span className="font-medium text-[var(--color-foreground)]">email hoặc số điện thoại</span> đã dùng để đăng ký. Sau khi nhận mật khẩu mới, bạn nên đăng nhập và có thể yêu cầu đổi lại mật khẩu tuỳ ý.
      </p>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Đã nhớ ra mật khẩu?{' '}
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
