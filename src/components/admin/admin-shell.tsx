'use client';

import { ArrowLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { getIcon } from '@/components/common/icon-registry';
import { Logo } from '@/components/layout/logo';
import { InitialsAvatar } from '@/components/ui/misc';
import { ADMIN_NAV } from '@/constants/navigation';
import { cn } from '@/lib/utils';

/**
 * Khung khu quản trị — dùng phiên đăng nhập cookie (server), không phụ thuộc
 * localStorage. Nhận thông tin admin qua props (đọc ở layout server).
 */
export function AdminShell({
  email,
  roleLabel,
  children,
}: {
  email: string;
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const logout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    toast.success('Đã đăng xuất');
    router.replace('/admin/login');
    router.refresh();
  };

  const initials = email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-dvh bg-[var(--color-surface)]">
      <div className="mx-auto flex w-full max-w-[100rem] gap-0 lg:gap-8 lg:px-8">
        {/* Sidebar desktop */}
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-background)] py-6 lg:flex">
          <div className="px-5">
            <Logo />
          </div>

          <div className="mt-6 px-5">
            <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3">
              <InitialsAvatar initials={initials} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{email}</p>
                <p className="truncate text-xs text-[var(--color-muted)]">{roleLabel}</p>
              </div>
            </div>
          </div>

          <nav aria-label="Khu quản trị" className="mt-6 flex-1 px-3">
            <ul className="space-y-1">
              {ADMIN_NAV.map((item) => {
                const Icon = getIcon(item.icon);
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm transition-colors',
                        active
                          ? 'bg-[var(--color-golf-50)] font-medium text-[var(--color-accent)]'
                          : 'text-[var(--color-foreground)] hover:bg-[var(--color-muted-surface)]',
                      )}
                    >
                      <Icon className="size-4 shrink-0" aria-hidden />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="space-y-1 border-t border-[var(--color-border)] px-3 pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)]"
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              Về trang chủ
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)] hover:text-[var(--color-danger)] disabled:opacity-50"
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Nội dung */}
        <div className="min-w-0 flex-1 pb-24 lg:pb-10">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 px-5 py-3 backdrop-blur-md lg:hidden">
            <Logo compact />
            <div className="flex items-center gap-2">
              <InitialsAvatar initials={initials} size="sm" />
              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                aria-label="Đăng xuất"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)] disabled:opacity-50"
              >
                <LogOut className="size-4" aria-hidden />
              </button>
            </div>
          </header>

          <main className="px-5 py-6 md:px-8 md:py-10 lg:px-0">{children}</main>
        </div>
      </div>

      {/* Bottom nav mobile */}
      <nav
        aria-label="Khu quản trị — điều hướng"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-background)]/97 backdrop-blur-md lg:hidden"
      >
        <ul className="scrollbar-none flex overflow-x-auto">
          {ADMIN_NAV.map((item) => {
            const Icon = getIcon(item.icon);
            const active = pathname === item.href;
            return (
              <li key={item.href} className="flex-1">
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-w-[4.5rem] flex-col items-center gap-1 px-2 py-2.5 text-[10px] transition-colors',
                    active ? 'text-[var(--color-accent)]' : 'text-[var(--color-muted)]',
                  )}
                >
                  <Icon className="size-5" aria-hidden />
                  <span className="text-center leading-tight">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
