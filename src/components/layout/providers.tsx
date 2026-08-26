'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';

import { TooltipProvider } from '@/components/ui/overlays';
import { useHydrated } from '@/hooks/useHydrated';
import { buildCustomerDemoData } from '@/services/demoSeedService';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useUiStore } from '@/store/useUiStore';

/** Đồng bộ theme đã lưu vào thuộc tính data-theme trên <html>. */
function ThemeSync() {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return null;
}

/** Nạp phiên đăng nhập thật (từ cookie server) vào store client khi tải trang. */
function SessionSync() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    let alive = true;
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (alive) setUser(data?.user ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [setUser]);

  return null;
}

/** Đồng bộ ngôn ngữ đang chọn vào thuộc tính lang của <html>. */
function LocaleSync() {
  const locale = useUiStore((state) => state.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}

/**
 * Nạp dữ liệu demo một lần khi đăng nhập bằng tài khoản mẫu,
 * để Dashboard có sẵn booking, giao dịch, voucher và buổi học.
 */
function DemoDataSeeder() {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const seeded = useAccountStore((state) => state.seeded);
  const seedDemoData = useAccountStore((state) => state.seedDemoData);

  useEffect(() => {
    if (!hydrated || !user || seeded) return;
    if (user.id !== 'user-demo-customer' && user.id !== 'user-demo-coach') return;
    seedDemoData(buildCustomerDemoData(user.walletBalance));
  }, [hydrated, user, seeded, seedDemoData]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider delayDuration={200}>
      <ThemeSync />
      <LocaleSync />
      <SessionSync />
      <DemoDataSeeder />
      {children}
      <Toaster
        position="bottom-center"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            toast:
              'rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-card)]',
          },
        }}
      />
    </TooltipProvider>
  );
}
