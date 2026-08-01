import { AppPreview } from '@/components/home/app-preview';
import { BeginnerSection } from '@/components/home/beginner-section';
import { BusinessBlocks } from '@/components/home/business-blocks';
import { ExperienceHighlights } from '@/components/home/experience-highlights';
import { FeaturedCoaches } from '@/components/home/featured-coaches';
import { FeaturedExperiences } from '@/components/home/featured-experiences';
import { Hero } from '@/components/home/hero';
import { MembershipPreview } from '@/components/home/membership-preview';
import { ServiceCulture } from '@/components/home/service-culture';
import { TestimonialsSection } from '@/components/home/testimonials-section';
import { TrustBar } from '@/components/home/trust-bar';
import { UpcomingEvents } from '@/components/home/upcoming-events';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Lotus Golf Center — Sân tập golf, học viện và hội viên tại TP. Hồ Chí Minh',
  description:
    'Sân tập golf cao cấp trong nội thành: đặt lịch online, huấn luyện viên chuyên trách, học viện golf, hội viên và ưu đãi. Mở cửa 06:00–22:00, hỗ trợ tận tình cho người mới bắt đầu.',
  path: '/',
  keywords: [
    'sân tập golf',
    'học golf',
    'Lotus Golf Center',
    'đặt lịch golf',
    'golf cho người mới',
    'hội viên golf',
  ],
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <BeginnerSection />
      <FeaturedExperiences />
      <ExperienceHighlights />
      <ServiceCulture />
      <FeaturedCoaches />
      <MembershipPreview />
      <UpcomingEvents />
      <BusinessBlocks />
      <AppPreview />
      <TestimonialsSection />
    </>
  );
}
