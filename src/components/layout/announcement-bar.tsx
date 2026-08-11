'use client';

import { ArrowRight, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

import { useHydrated } from '@/hooks/useHydrated';
import { useUiStore } from '@/store/useUiStore';

export function AnnouncementBar({
  text,
  ctaText,
  ctaLink,
  enabled = true,
}: {
  text: string;
  ctaText: string;
  ctaLink: string;
  enabled?: boolean;
}) {
  const hydrated = useHydrated();
  const dismissed = useUiStore((state) => state.announcementDismissed);
  const dismiss = useUiStore((state) => state.dismissAnnouncement);

  if (!enabled) return null;
  if (hydrated && dismissed) return null;

  return (
    <div className="relative z-50 bg-[var(--color-navy-800)] text-[var(--color-champagne-50)]">
      <div className="container-lotus flex items-center justify-center gap-3 py-2.5 pr-10 text-center">
        <Sparkles className="hidden size-4 shrink-0 text-[var(--color-champagne-300)] sm:block" aria-hidden />
        <p className="text-[13px] leading-snug">{text}</p>
        {ctaText && ctaLink ? (
          <Link
            href={ctaLink}
            className="hidden shrink-0 items-center gap-1 text-[13px] font-medium text-[var(--color-champagne-300)] underline-offset-4 transition-colors hover:text-white hover:underline sm:inline-flex"
          >
            {ctaText}
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        ) : null}
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Đóng thông báo"
        className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
