'use client';

import { getDictionary, type Dictionary, type Locale } from '@/lib/i18n/dictionaries';
import { useUiStore } from '@/store/useUiStore';

/**
 * Truy cập từ điển theo ngôn ngữ đang chọn.
 * Khi chuyển sang next-intl, chỉ cần đổi phần thân hook này.
 */
export function useLocale(): { locale: Locale; t: Dictionary; toggleLocale: () => void } {
  const locale = useUiStore((state) => state.locale);
  const toggleLocale = useUiStore((state) => state.toggleLocale);
  return { locale, t: getDictionary(locale), toggleLocale };
}
