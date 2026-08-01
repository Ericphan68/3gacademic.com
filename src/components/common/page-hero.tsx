import Image from 'next/image';
import * as React from 'react';

import { Breadcrumbs } from './breadcrumbs';

import { BLUR_DATA_URL } from '@/constants/media';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

/** Hero dùng chung cho các trang con: ảnh nền + overlay + breadcrumb. */
export function PageHero({
  eyebrow,
  title,
  description,
  image,
  breadcrumbs,
  actions,
  align = 'left',
  size = 'md',
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  image: string;
  breadcrumbs: BreadcrumbItem[];
  actions?: React.ReactNode;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}) {
  const heightClass = {
    sm: 'min-h-[15rem] py-14 md:min-h-[18rem]',
    md: 'min-h-[19rem] py-16 md:min-h-[24rem] md:py-20',
    lg: 'min-h-[24rem] py-20 md:min-h-[30rem] md:py-24',
  }[size];

  return (
    <section className={cn('relative isolate flex items-end overflow-hidden', heightClass)}>
      <Image
        src={image}
        alt=""
        fill
        priority
        sizes="100vw"
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy-950)]/92 via-[var(--color-navy-900)]/72 to-[var(--color-navy-900)]/45"
        aria-hidden
      />

      <div className="container-lotus relative">
        <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
          <Breadcrumbs items={breadcrumbs} inverse className="mb-6" />
          {eyebrow ? <p className="eyebrow mb-3 text-[var(--color-champagne-300)]">{eyebrow}</p> : null}
          <h1 className="text-4xl text-white md:text-5xl lg:text-[3.5rem]">{title}</h1>
          {description ? (
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--color-navy-100)] md:text-lg">
              {description}
            </p>
          ) : null}
          {actions ? (
            <div className={cn('mt-8 flex flex-wrap gap-3', align === 'center' && 'justify-center')}>
              {actions}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}
