import { AnnouncementBar } from './announcement-bar';
import { Footer } from './footer';
import { Header } from './header';
import { SearchDialog } from './search-dialog';
import { SmartAssistant } from './smart-assistant';

import { IntroExperience } from '@/features/intro/intro-experience';
import { getHomeContent } from '@/server/services/contentService';

/** Khung layout dùng cho toàn bộ trang public. */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const { announcement } = await getHomeContent();
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-[var(--radius-md)] focus:bg-[var(--color-navy-800)] focus:px-4 focus:py-2.5 focus:text-sm focus:text-white"
      >
        Bỏ qua điều hướng, tới nội dung chính
      </a>
      <AnnouncementBar
        text={announcement.text}
        ctaText={announcement.ctaText}
        ctaLink={announcement.ctaLink}
        enabled={announcement.enabled}
      />
      <Header />
      <main id="main-content" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <SearchDialog />
      <SmartAssistant />
      <IntroExperience />
    </>
  );
}
