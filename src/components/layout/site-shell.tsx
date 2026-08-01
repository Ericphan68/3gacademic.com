import { AnnouncementBar } from './announcement-bar';
import { Footer } from './footer';
import { Header } from './header';
import { SearchDialog } from './search-dialog';
import { SmartAssistant } from './smart-assistant';

/** Khung layout dùng cho toàn bộ trang public. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-[var(--radius-md)] focus:bg-[var(--color-navy-800)] focus:px-4 focus:py-2.5 focus:text-sm focus:text-white"
      >
        Bỏ qua điều hướng, tới nội dung chính
      </a>
      <AnnouncementBar />
      <Header />
      <main id="main-content" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
      <SearchDialog />
      <SmartAssistant />
    </>
  );
}
