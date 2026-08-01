import Image from 'next/image';
import Link from 'next/link';

import { Logo } from '@/components/layout/logo';
import { BLUR_DATA_URL, MEDIA } from '@/constants/media';
import { SITE } from '@/constants/site';

/** Layout hai cột cho các trang đăng nhập / đăng ký / quên mật khẩu. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1fr_1.1fr]">
      {/* Cột nội dung */}
      <div className="flex flex-col px-5 py-8 md:px-10 md:py-12">
        <header className="mb-10 flex items-center justify-between gap-4">
          <Logo />
          <Link
            href="/"
            className="text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            Về trang chủ
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">{children}</div>
        </main>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
          <p>© 2026 {SITE.legalName}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="transition-colors hover:text-[var(--color-accent)]">
              Bảo mật
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[var(--color-accent)]">
              Điều khoản
            </Link>
            <Link href="/faq" className="transition-colors hover:text-[var(--color-accent)]">
              Hỗ trợ
            </Link>
          </div>
        </footer>
      </div>

      {/* Cột hình ảnh thương hiệu */}
      <div className="relative hidden lg:block">
        <Image
          src={MEDIA.hero.auth}
          alt=""
          fill
          priority
          sizes="55vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/92 via-[var(--color-navy-900)]/55 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="font-[family-name:var(--font-display)] text-3xl leading-snug text-white">
            {SITE.heroHeadline}
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-[var(--color-navy-100)]">{SITE.description}</p>
          <p className="mt-6 text-sm text-[var(--color-champagne-300)]">{SITE.tagline}</p>
        </div>
      </div>
    </div>
  );
}
