'use client';

import { ArrowRight, Sparkles, X } from 'lucide-react';
import Link from 'next/link';

import { useHydrated } from '@/hooks/useHydrated';
import { useUiStore } from '@/store/useUiStore';

export function AnnouncementBar() {
  const hydrated = useHydrated();
  const dismissed = useUiStore((state) => state.announcementDismissed);
  const dismiss = useUiStore((state) => state.dismissAnnouncement);

  if (hydrated && dismissed) return null;

  return (
    <div className="relative z-50 bg-[var(--color-navy-800)] text-[var(--color-champagne-50)]">
      <div className="container-lotus flex items-center justify-center gap-3 py-2.5 pr-10 text-center">
        <Sparkles className="hidden size-4 shrink-0 text-[var(--color-champagne-300)] sm:block" aria-hidden />
        <p className="text-[13px] leading-snug">
          <span className="font-medium">Founder Membership</span> đang mở bán với số lượng giới hạn —
          còn 37 suất.
        </p>
        <Link
          href="/membership"
          className="hidden shrink-0 items-center gap-1 text-[13px] font-medium text-[var(--color-champagne-300)] underline-offset-4 transition-colors hover:text-white hover:underline sm:inline-flex"
        >
          Xem ưu đãi
          <ArrowRight className="size-3.5" aria-hidden />
        </Link>
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
