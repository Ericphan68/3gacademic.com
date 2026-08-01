import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { ExperienceCard } from '@/components/cards/experience-card';
import { Button } from '@/components/ui/button';
import { experienceService } from '@/services/catalogService';

export function FeaturedExperiences() {
  const items = experienceService.getFeatured(6);

  return (
    <Section tone="surface">
      <SectionHeader
        eyebrow="Gói trải nghiệm"
        title="Chọn cách bạn muốn bắt đầu"
        description="Mỗi gói được thiết kế cho một nhu cầu cụ thể — từ buổi thử đầu tiên cho người chưa cầm gậy, đến một ngày golf trọn gói cho doanh nghiệp."
        action={
          <Button asChild variant="outline">
            <Link href="/experience">
              Xem tất cả 12 gói
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <Reveal key={item.id} delay={Math.min(index * 0.06, 0.3)}>
            <ExperienceCard item={item} className="h-full" priority={index < 3} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
