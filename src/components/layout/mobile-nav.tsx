'use client';

import { ArrowRight, LayoutDashboard, LogIn, LogOut, Menu, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { Logo } from './logo';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/overlays';
import { MOBILE_NAV_GROUPS } from '@/constants/navigation';
import { CONTACT } from '@/constants/site';
import { useHydrated } from '@/hooks/useHydrated';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';

export function MobileNav({ inverse }: { inverse: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Đóng drawer khi điều hướng sang route khác — điều chỉnh state ngay trong
  // lúc render thay vì dùng effect, tránh một vòng render thừa.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Mở menu"
          className={cn('lg:hidden', inverse && 'text-white hover:bg-white/10')}
        >
          <Menu aria-hidden />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-[min(26rem,94vw)] p-0">
        <div className="flex items-center border-b border-[var(--color-border)] p-5">
          <Logo />
        </div>
        <SheetTitle className="sr-only">Menu điều hướng</SheetTitle>
        <SheetDescription className="sr-only">
          Các nhóm chức năng chính của Lotus Golf Center.
        </SheetDescription>

        <div className="border-b border-[var(--color-border)] p-5">
          <Button asChild variant="accent" size="lg" block>
            <Link href="/booking">
              Đặt lịch ngay
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-5" aria-label="Menu chính">
          {MOBILE_NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-7 last:mb-0">
              <p className="mb-3 text-[11px] font-semibold tracking-widest text-[var(--color-muted)] uppercase">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'block rounded-[var(--radius-md)] px-3 py-2.5 transition-colors',
                          active
                            ? 'bg-[var(--color-golf-50)] text-[var(--color-accent)]'
                            : 'hover:bg-[var(--color-muted-surface)]',
                        )}
                      >
                        <span className="block text-[15px] font-medium">{item.label}</span>
                        {item.description ? (
                          <span className="mt-0.5 block text-xs text-[var(--color-muted)]">
                            {item.description}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-3 border-t border-[var(--color-border)] p-5">
          {hydrated && user ? (
            <>
              <Button asChild variant="outline" block>
                <Link href={user.role === 'coach' ? '/coach-portal' : '/dashboard'}>
                  <LayoutDashboard aria-hidden />
                  {user.role === 'coach' ? 'Coach Portal' : 'Tài khoản của tôi'}
                </Link>
              </Button>
              <Button variant="ghost" block onClick={() => logout()}>
                <LogOut aria-hidden />
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" block>
              <Link href="/login">
                <LogIn aria-hidden />
                Đăng nhập
              </Link>
            </Button>
          )}

          <a
            href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}
            className="flex items-center justify-center gap-2 py-2 text-sm text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
          >
            <Phone className="size-4" aria-hidden />
            Hotline {CONTACT.hotline}
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}
