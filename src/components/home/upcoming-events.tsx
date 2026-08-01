import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { EventCard } from '@/components/cards/event-card';
import { Reveal } from '@/components/common/reveal';
import { Section, SectionHeader } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import { eventService } from '@/services/catalogService';

export function UpcomingEvents() {
  const events = eventService.getUpcoming(3);

  return (
    <Section>
      <SectionHeader
        eyebrow="Sự kiện sắp tới"
        title="Golf là cái cớ để mọi người gặp nhau"
        description="Giải đấu, workshop, networking doanh nhân và ngày hội cho trẻ em — Lotus tổ chức đều đặn hằng tháng."
        action={
          <Button asChild variant="outline">
            <Link href="/events">
              Xem toàn bộ lịch sự kiện
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event, index) => (
          <Reveal key={event.id} delay={Math.min(index * 0.06, 0.2)}>
            <EventCard event={event} className="h-full" />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
