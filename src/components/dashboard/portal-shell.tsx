'use client';

import { ArrowLeft, LogOut } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { getIcon } from '@/components/common/icon-registry';
import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { InitialsAvatar } from '@/components/ui/misc';
import { useHydrated } from '@/hooks/useHydrated';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

export interface PortalNavItem {
  readonly label: string;
  readonly href: Route;
  readonly icon: string;
}

/**
 * Khung layout dùng chung cho Dashboard khách hàng và Coach Portal:
 * sidebar trên desktop, bottom navigation trên mobile.
 */
export function PortalShell({
  nav,
  title,
  requiredRole,
  children,
}: {
  nav: readonly PortalNavItem[];
  title: string;
  requiredRole?: 'customer' | 'coach' | 'admin';
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  /* Chưa đăng nhập thì đưa về trang đăng nhập. */
  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (requiredRole === 'coach' && user.role !== 'coach') {
      toast.error('Khu vực dành cho huấn luyện viên', {
        description: 'Đăng nhập bằng tài khoản demo coach@lotusgolf.vn để xem Coach Portal.',
      });
      router.replace('/dashboard');
    }
    if (requiredRole === 'admin' && user.role !== 'admin') {
      toast.error('Khu vực quản trị', {
        description: 'Đăng nhập bằng tài khoản demo admin@lotusgolf.vn để xem khu quản trị.',
      });
      router.replace('/dashboard');
    }
  }, [hydrated, user, requiredRole, router]);

  if (!hydrated) {
    return (
      <div className="container-lotus py-20">
        <div className="animate-shimmer h-72 rounded-[var(--radius-lg)]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container-lotus flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl">Bạn cần đăng nhập</h1>
        <p className="mt-2 max-w-md text-[var(--color-muted)]">
          Đăng nhập bằng tài khoản demo để xem khu vực này. Đang chuyển bạn tới trang đăng nhập…
        </p>
        <Button asChild variant="accent" className="mt-6">
          <Link href="/login">Tới trang đăng nhập</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--color-surface)]">
      <div className="mx-auto flex w-full max-w-[100rem] gap-0 lg:gap-8 lg:px-8">
        {/* Sidebar desktop */}
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-background)] py-6 lg:flex lg:rounded-none">
          <div className="px-5">
            <Logo />
          </div>

          <div className="mt-6 px-5">
            <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-3">
              <InitialsAvatar initials={user.avatarInitials} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user.fullName}</p>
                <p className="truncate text-xs text-[var(--color-muted)]">
                  {user.role === 'coach'
                    ? 'Huấn luyện viên'
                    : user.role === 'admin'
                      ? 'Quản trị viên'
                      : 'Khách hàng'}
                </p>
              </div>
            </div>
          </div>

          <nav aria-label={title} className="mt-6 flex-1 px-3">
            <ul className="space-y-1">
              {nav.map((item) => {
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
              onClick={() => {
                logout();
                toast.success('Đã đăng xuất');
                router.push('/');
              }}
              className="flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)] hover:text-[var(--color-danger)]"
            >
              <LogOut className="size-4 shrink-0" aria-hidden />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Nội dung */}
        <div className="min-w-0 flex-1 pb-24 lg:pb-10">
          {/* Header mobile */}
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 px-5 py-3 backdrop-blur-md lg:hidden">
            <Logo compact />
            <div className="flex items-center gap-2">
              <InitialsAvatar initials={user.avatarInitials} size="sm" />
              <button
                type="button"
                onClick={() => {
                  logout();
                  toast.success('Đã đăng xuất');
                  router.push('/');
                }}
                aria-label="Đăng xuất"
                className="flex size-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)]"
              >
                <LogOut className="size-4" aria-hidden />
              </button>
            </div>
          </header>

          <main className="px-5 py-6 md:px-8 md:py-10 lg:px-0">{children}</main>
        </div>
      </div>

      {/* Bottom navigation mobile */}
      <nav
        aria-label={`${title} — điều hướng`}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[var(--color-background)]/97 backdrop-blur-md lg:hidden"
      >
        <ul className="scrollbar-none flex overflow-x-auto">
          {nav.map((item) => {
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

/** Tiêu đề trang trong khu vực portal. */
export function PortalHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl md:text-3xl">{title}</h1>
        {description ? <p className="mt-2 text-[var(--color-muted)]">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
