import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { CoachCard } from '@/components/cards/coach-card';
import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import { coachService } from '@/services/catalogService';

export function FeaturedCoaches() {
  const coaches = coachService.getFeatured(4);

  return (
    <Section>
      <SectionHeader
        eyebrow="Huấn luyện viên"
        title="Người đồng hành phù hợp với mục tiêu của bạn"
        description="Mỗi huấn luyện viên tại Lotus chuyên sâu một mảng cụ thể. Bạn chọn theo mục tiêu — người mới, trẻ em, putting, swing hay chuẩn bị thi đấu."
        action={
          <Button asChild variant="outline">
            <Link href="/coaches">
              Xem cả 12 huấn luyện viên
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {coaches.map((coach, index) => (
          <Reveal key={coach.id} delay={Math.min(index * 0.06, 0.24)}>
            <CoachCard coach={coach} className="h-full" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
