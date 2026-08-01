import { ArrowRight, CalendarCheck, GraduationCap, Home, Search } from 'lucide-react';
import Link from 'next/link';

import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';

const SUGGESTIONS = [
  { label: 'Trang chủ', href: '/' as const, icon: Home, hint: 'Quay lại điểm bắt đầu' },
  { label: 'Đặt lịch', href: '/booking' as const, icon: CalendarCheck, hint: 'Chọn giờ và khu vực tập' },
  { label: 'Huấn luyện viên', href: '/coaches' as const, icon: GraduationCap, hint: 'Tìm HLV phù hợp' },
  { label: 'Câu hỏi thường gặp', href: '/faq' as const, icon: Search, hint: 'Tìm câu trả lời nhanh' },
];

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-[var(--color-border)]">
        <div className="container-lotus flex h-16 items-center md:h-[4.5rem]">
          <Logo />
        </div>
      </header>

      <main className="container-lotus flex flex-1 items-center py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-[family-name:var(--font-display)] text-7xl text-[var(--color-champagne-300)] md:text-8xl">
            404
          </p>

          <h1 className="mt-6 text-3xl md:text-4xl">Không tìm thấy trang này</h1>
          <p className="mx-auto mt-4 max-w-lg leading-relaxed text-[var(--color-muted)]">
            Đường dẫn bạn truy cập có thể đã thay đổi hoặc không còn tồn tại. Bạn thử một trong các mục bên
            dưới nhé.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild variant="accent" size="lg">
              <Link href="/">
                Về trang chủ
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Liên hệ hỗ trợ</Link>
            </Button>
          </div>

          <ul className="mt-12 grid gap-3 sm:grid-cols-2">
            {SUGGESTIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)] hover:shadow-[var(--shadow-card)]"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-golf-50)] text-[var(--color-accent)]">
                    <item.icon className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="block text-xs text-[var(--color-muted)]">{item.hint}</span>
                  </span>
                  <ArrowRight
                    className="size-4 shrink-0 text-[var(--color-stone-400)] transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
