import { CalendarDays, Trophy, Users } from 'lucide-react';

import { PageHero } from '@/components/common/page-hero';
import { Section, SectionHeader } from '@/components/common/section';
import { StatTile } from '@/components/common/stat-tile';
import { MEDIA } from '@/constants/media';
import { EventExplorer } from '@/features/events/event-explorer';
import { buildMetadata } from '@/lib/seo';
import { getManagedEvents } from '@/server/services/eventService';

export const metadata = buildMetadata({
  title: 'Sự kiện và giải đấu golf',
  description:
    'Lịch sự kiện tại Lotus Golf Center: giải đấu, Corporate Golf Day, Junior Golf Day, workshop luật golf, Demo Day công nghệ và các buổi networking dành cho doanh nhân.',
  path: '/events',
  image: MEDIA.hero.events,
  keywords: ['giải golf', 'sự kiện golf', 'giải đấu golf phong trào', 'golf networking'],
});

export default async function EventsPage() {
  const events = await getManagedEvents();
  const totalSeats = events.reduce((sum, event) => sum + event.capacity, 0);
  const freeEvents = events.filter((event) => event.fee === 0).length;

  return (
    <>
      <PageHero
        eyebrow="Sự kiện & Giải đấu"
        title="Golf vui hơn khi có người cùng chơi"
        description="Mỗi tháng Lotus tổ chức giải đấu, workshop và các buổi networking. Nhiều sự kiện mở cho cả người chưa từng cầm gậy."
        image={MEDIA.hero.events}
        breadcrumbs={[{ label: 'Sự kiện' }]}
      />

      <Section className="!pb-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile value={events.length} label="Sự kiện đang mở đăng ký" icon={<CalendarDays className="size-5" />} />
          <StatTile value={freeEvents} label="Sự kiện miễn phí tham dự" tone="accent" icon={<Trophy className="size-5" />} />
          <StatTile value={totalSeats.toLocaleString('vi-VN')} label="Tổng số chỗ trong năm" icon={<Users className="size-5" />} />
          <StatTile value="9 loại" label="Từ giải đấu đến workshop" tone="gold" />
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Lịch sự kiện"
          title="Chọn sự kiện phù hợp với bạn"
          description="Giải đấu dành cho người đã chơi được. Workshop, Demo Day và networking mở cho tất cả mọi trình độ."
        />
        <EventExplorer catalog={events} />
      </Section>
    </>
  );
}
