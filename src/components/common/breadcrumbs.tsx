import { ChevronRight } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

import { SITE } from '@/constants/site';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

/**
 * Breadcrumb kèm structured data BreadcrumbList.
 * Dùng ở mọi trang con để người dùng và công cụ tìm kiếm đều hiểu cấu trúc site.
 */
export function Breadcrumbs({
  items,
  className,
  inverse = false,
}: {
  items: BreadcrumbItem[];
  className?: string;
  inverse?: boolean;
}) {
  const full: BreadcrumbItem[] = [{ label: 'Trang chủ', href: '/' }, ...items];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: full.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE.url}${item.href === '/' ? '' : item.href}` } : {}),
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className={cn('text-sm', className)}>
        <ol className="flex flex-wrap items-center gap-1.5">
          {full.map((item, index) => {
            const isLast = index === full.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                {index > 0 ? (
                  <ChevronRight
                    className={cn('size-3.5', inverse ? 'text-white/50' : 'text-[var(--color-stone-400)]')}
                    aria-hidden
                  />
                ) : null}
                {item.href && !isLast ? (
                  <Link
                    href={item.href as Route}
                    className={cn(
                      'transition-colors',
                      inverse
                        ? 'text-white/75 hover:text-white'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-accent)]',
                    )}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={cn('font-medium', inverse ? 'text-white' : 'text-[var(--color-foreground)]')}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
