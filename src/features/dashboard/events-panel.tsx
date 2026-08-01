'use client';

import { format } from 'date-fns';
import { CalendarPlus, MapPin, Trophy, Users } from 'lucide-react';
import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DemoQrCode } from '@/components/ui/misc';
import { EmptyState } from '@/components/ui/states';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDateLong, formatTime } from '@/lib/format';
import { useAccountStore } from '@/store/useAccountStore';
import type { EventRegistration } from '@/types';

export function EventsPanel() {
  const hydrated = useHydrated();
  const registrations = useAccountStore((state) => state.eventRegistrations);

  if (!hydrated) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const sorted = [...registrations].sort((a, b) => a.startsAt.localeCompare(b.startsAt));

  return (
    <div>
      <PortalHeader
        title="Sự kiện của tôi"
        description="Các sự kiện bạn đã đăng ký, kèm mã QR check-in tại cổng sự kiện."
        action={
          <Button asChild variant="accent">
            <Link href="/events">Xem lịch sự kiện</Link>
          </Button>
        }
      />

      {sorted.length === 0 ? (
        <EmptyState
          title="Bạn chưa đăng ký sự kiện nào"
          description="Lotus tổ chức giải đấu, workshop, Demo Day và các buổi networking hằng tháng. Nhiều sự kiện mở cho cả người chưa từng chơi golf."
          icon={Trophy}
          action={
            <Button asChild variant="accent">
              <Link href="/events">Khám phá sự kiện</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-5 lg:grid-cols-2">
          {sorted.map((registration) => (
            <li
              key={registration.id}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg leading-snug">
                    <Link
                      href={`/events/${registration.eventSlug}`}
                      className="transition-colors hover:text-[var(--color-accent)]"
                    >
                      {registration.eventTitle}
                    </Link>
                  </h2>
                  <ul className="mt-3 space-y-1.5 text-sm text-[var(--color-muted)]">
                    <li>
                      {formatDateLong(registration.startsAt)} · {formatTime(registration.startsAt)}
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" aria-hidden />
                      {registration.location}
                    </li>
                    <li className="inline-flex items-center gap-1.5">
                      <Users className="size-3.5" aria-hidden />
                      {registration.attendees} người tham dự
                    </li>
                  </ul>
                </div>

                <Badge variant="success" size="sm">
                  Đã đăng ký
                </Badge>
              </div>

              <div className="mt-5 flex flex-col items-center gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:flex-row">
                <DemoQrCode
                  payload={registration.qrPayload}
                  size={104}
                  className="shrink-0 border border-[var(--color-border)]"
                />
                <div className="min-w-0 text-center sm:text-left">
                  <p className="text-xs tracking-widest text-[var(--color-muted)] uppercase">
                    Mã check-in sự kiện
                  </p>
                  <p className="mt-1 font-mono text-xs break-all">{registration.qrPayload}</p>
                  <p className="mt-2 text-sm">
                    Phí:{' '}
                    <span className="font-medium">
                      {registration.fee === 0 ? 'Miễn phí' : formatCurrency(registration.fee)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline" size="sm" className="flex-1">
                  <a href={buildCalendarUrl(registration)} target="_blank" rel="noopener noreferrer">
                    <CalendarPlus aria-hidden />
                    Thêm vào lịch
                  </a>
                </Button>
                <Button asChild variant="subtle" size="sm" className="flex-1">
                  <Link href={`/events/${registration.eventSlug}`}>Xem chi tiết</Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function buildCalendarUrl(registration: EventRegistration): string {
  const start = new Date(registration.startsAt);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const stamp = (date: Date) => format(date, "yyyyMMdd'T'HHmmss");

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Lotus Golf Center — ${registration.eventTitle}`,
    dates: `${stamp(start)}/${stamp(end)}`,
    location: `Lotus Golf Center — ${registration.location}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
