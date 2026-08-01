'use client';

import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { MAIN_NAV, type MainNavEntry } from '@/constants/navigation';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n/dictionaries';

/**
 * Menu ngang có dropdown cho các mục con.
 *
 * Điều hướng bằng bàn phím: Tab để chuyển mục, Enter/Space hoặc mũi tên xuống
 * để mở dropdown, Escape để đóng. Dropdown cũng mở khi rê chuột.
 */
export function DesktopNav({ inverse, locale }: { inverse: boolean; locale: Locale }) {
  const pathname = usePathname();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeTimer = useRef<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Đóng dropdown khi chuyển trang
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (openIndex !== null) setOpenIndex(null);
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenIndex(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) setOpenIndex(null);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  const isActive = (entry: MainNavEntry) => {
    if (pathname === entry.href) return true;
    return entry.children?.some((child) => pathname.startsWith(child.href)) ?? false;
  };

  const openNow = (index: number) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenIndex(index);
  };

  const closeSoon = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenIndex(null), 140);
  };

  return (
    <nav
      ref={navRef}
      aria-label="Điều hướng chính"
      className="ml-4 hidden min-w-0 flex-1 lg:block"
    >
      <ul className="flex items-center gap-0.5">
        {MAIN_NAV.map((entry, index) => {
          const active = isActive(entry);
          const open = openIndex === index;
          const hasChildren = Boolean(entry.children?.length);
          const label = locale === 'vi' ? entry.label : entry.labelEn;

          return (
            <li
              key={entry.href}
              className="relative"
              onMouseEnter={() => hasChildren && openNow(index)}
              onMouseLeave={closeSoon}
            >
              <div className="flex items-center">
                <Link
                  href={entry.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative rounded-[var(--radius-sm)] py-2 pl-2.5 text-[13px] font-medium whitespace-nowrap transition-colors',
                    hasChildren ? 'pr-1' : 'pr-2.5',
                    inverse
                      ? 'text-white/85 hover:text-white'
                      : active
                        ? 'text-[var(--color-accent)]'
                        : 'text-[var(--color-foreground)] hover:text-[var(--color-accent)]',
                  )}
                >
                  {label}
                  {active ? (
                    <span
                      className={cn(
                        'absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full',
                        inverse ? 'bg-[var(--color-champagne-300)]' : 'bg-[var(--color-accent)]',
                      )}
                      aria-hidden
                    />
                  ) : null}
                </Link>

                {hasChildren ? (
                  <button
                    type="button"
                    aria-label={`${open ? 'Đóng' : 'Mở'} menu con của ${label}`}
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : index)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        openNow(index);
                      }
                    }}
                    className={cn(
                      'flex cursor-pointer items-center rounded-[var(--radius-sm)] py-2 pr-1.5 pl-0.5 transition-colors',
                      inverse ? 'text-white/70 hover:text-white' : 'text-[var(--color-muted)] hover:text-[var(--color-accent)]',
                    )}
                  >
                    <ChevronDown
                      className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')}
                      aria-hidden
                    />
                  </button>
                ) : null}
              </div>

              {/* Dropdown */}
              {hasChildren && open ? (
                <div
                  className="absolute top-full left-0 z-50 pt-2"
                  onMouseEnter={() => openNow(index)}
                  onMouseLeave={closeSoon}
                >
                  <ul className="w-[19rem] overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-2 shadow-[var(--shadow-lift)]">
                    {entry.children?.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={childActive ? 'page' : undefined}
                            onClick={() => setOpenIndex(null)}
                            className={cn(
                              'block rounded-[var(--radius-md)] px-3 py-2.5 transition-colors',
                              childActive
                                ? 'bg-[var(--color-golf-50)] text-[var(--color-accent)]'
                                : 'hover:bg-[var(--color-muted-surface)]',
                            )}
                          >
                            <span className="block text-sm font-medium">
                              {locale === 'vi' ? child.label : child.labelEn}
                            </span>
                            {child.description ? (
                              <span className="mt-0.5 block text-xs leading-relaxed text-[var(--color-muted)]">
                                {child.description}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
