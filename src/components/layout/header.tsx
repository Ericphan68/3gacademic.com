'use client';

import { ArrowRight, LayoutDashboard, LogIn, LogOut, Moon, Search, Sun, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { DesktopNav } from './desktop-nav';
import { Logo } from './logo';
import { MobileNav } from './mobile-nav';

import { Button } from '@/components/ui/button';
import { useHydrated } from '@/hooks/useHydrated';
import { useLocale } from '@/hooks/useLocale';
import { useScrolled } from '@/hooks/useScrollPosition';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useUiStore } from '@/store/useUiStore';

/** Các trang có hero tối toàn màn hình — header khởi đầu ở dạng trong suốt. */
const TRANSPARENT_ROUTES = ['/'];

export function Header() {
  const pathname = usePathname();
  const scrolled = useScrolled(24);
  const hydrated = useHydrated();
  const { locale, toggleLocale } = useLocale();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setSearchOpen = useUiStore((state) => state.setSearchOpen);
  const theme = useUiStore((state) => state.theme);
  const toggleTheme = useUiStore((state) => state.toggleTheme);

  const allowTransparent = TRANSPARENT_ROUTES.includes(pathname);
  const inverse = allowTransparent && !scrolled;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300 ease-[var(--ease-out-soft)]',
        inverse
          ? 'border-b border-transparent bg-transparent'
          : 'border-b border-[var(--color-border)] bg-[var(--color-background)]/92 backdrop-blur-md',
      )}
    >
      <div className="container-lotus flex h-16 items-center gap-4 md:h-[4.5rem]">
        <Logo inverse={inverse} />

        <DesktopNav inverse={inverse} locale={locale} />

        <div className="ml-auto flex shrink-0 items-center gap-1 lg:ml-0 lg:gap-1.5">
          <button
            type="button"
            onClick={toggleLocale}
            aria-label={`Chuyển ngôn ngữ, hiện tại ${locale === 'vi' ? 'tiếng Việt' : 'tiếng Anh'}`}
            className={cn(
              'hidden h-9 cursor-pointer items-center rounded-full border px-2.5 text-xs font-semibold tracking-wide transition-colors sm:flex',
              inverse
                ? 'border-white/30 text-white hover:bg-white/10'
                : 'border-[var(--color-border-strong)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
            )}
          >
            <span className={cn(locale === 'vi' && 'text-[var(--color-accent)]', inverse && locale === 'vi' && 'text-[var(--color-champagne-300)]')}>
              VI
            </span>
            <span className="mx-1 opacity-40">/</span>
            <span className={cn(locale === 'en' && 'text-[var(--color-accent)]', inverse && locale === 'en' && 'text-[var(--color-champagne-300)]')}>
              EN
            </span>
          </button>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Tìm kiếm"
            onClick={() => setSearchOpen(true)}
            className={cn(inverse && 'text-white hover:bg-white/10')}
          >
            <Search aria-hidden />
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            onClick={toggleTheme}
            className={cn('hidden sm:inline-flex', inverse && 'text-white hover:bg-white/10')}
          >
            {hydrated && theme === 'dark' ? <Sun aria-hidden /> : <Moon aria-hidden />}
          </Button>

          {hydrated && user ? (
            <div className="hidden items-center gap-1.5 lg:flex">
              <Button
                asChild
                variant={inverse ? 'inverse-outline' : 'outline'}
                size="sm"
                className="gap-2"
              >
                <Link href={user.role === 'coach' ? '/coach-portal' : '/dashboard'}>
                  <LayoutDashboard aria-hidden />
                  <span className="max-w-24 truncate">{user.fullName.split(' ').slice(-1)[0]}</span>
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Đăng xuất"
                onClick={() => logout()}
                className={cn(inverse && 'text-white hover:bg-white/10')}
              >
                <LogOut aria-hidden />
              </Button>
            </div>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn('hidden lg:inline-flex', inverse && 'text-white hover:bg-white/10')}
            >
              <Link href="/login" aria-label="Đăng nhập">
                {hydrated ? <LogIn aria-hidden /> : <UserRound aria-hidden />}
              </Link>
            </Button>
          )}

          <Button asChild variant={inverse ? 'inverse' : 'accent'} size="sm" className="hidden md:inline-flex">
            <Link href="/booking">
              Đặt lịch ngay
              <ArrowRight aria-hidden />
            </Link>
          </Button>

          <Button asChild variant={inverse ? 'inverse' : 'accent'} size="sm" className="md:hidden">
            <Link href="/booking">Đặt lịch</Link>
          </Button>

          <MobileNav inverse={inverse} />
        </div>
      </div>
    </header>
  );
}
