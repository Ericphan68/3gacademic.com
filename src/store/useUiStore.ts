'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/site';
import type { Locale } from '@/lib/i18n/dictionaries';

type Theme = 'light' | 'dark';

interface UiState {
  locale: Locale;
  theme: Theme;
  announcementDismissed: boolean;
  searchOpen: boolean;
  assistantOpen: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  dismissAnnouncement: () => void;
  setSearchOpen: (open: boolean) => void;
  setAssistantOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      locale: 'vi',
      theme: 'light',
      announcementDismissed: false,
      searchOpen: false,
      assistantOpen: false,

      setLocale: (locale) => set({ locale }),
      toggleLocale: () => set((state) => ({ locale: state.locale === 'vi' ? 'en' : 'vi' })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      dismissAnnouncement: () => set({ announcementDismissed: true }),
      setSearchOpen: (searchOpen) => set({ searchOpen }),
      setAssistantOpen: (assistantOpen) => set({ assistantOpen }),
    }),
    {
      name: STORAGE_KEYS.locale,
      version: 1,
      partialize: (state) => ({
        locale: state.locale,
        theme: state.theme,
        announcementDismissed: state.announcementDismissed,
      }),
    },
  ),
);
