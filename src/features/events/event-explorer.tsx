'use client';

import { CalendarX, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { EventCard } from '@/components/cards/event-card';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';
import { EmptyState } from '@/components/ui/states';
import { EVENT_TYPE_LABELS, EVENT_TYPE_ORDER } from '@/data/events';
import { cn, matchesQuery } from '@/lib/utils';
import { eventService } from '@/services/catalogService';
import type { EventType, GolfEvent } from '@/types';

export function EventExplorer({ catalog }: { catalog?: GolfEvent[] }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState<EventType | 'all'>('all');

  const events = useMemo(() => {
    // Không có dữ liệu server → dùng mock (giữ tương thích ngược).
    if (!catalog) return eventService.filter({ type, query });
    return catalog.filter((event) => {
      if (type !== 'all' && event.type !== type) return false;
      return matchesQuery(query, event.title, event.summary, event.location);
    });
  }, [type, query, catalog]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5">
        <Field label="Tìm sự kiện" htmlFor="event-search" className="max-w-md">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
              aria-hidden
            />
            <Input
              id="event-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tên sự kiện, địa điểm…"
              className="pl-10"
            />
          </div>
        </Field>

        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Lọc theo loại sự kiện">
          <button
            type="button"
            onClick={() => setType('all')}
            aria-pressed={type === 'all'}
            className={cn(
              'shrink-0 cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors',
              type === 'all'
                ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)] text-[var(--color-accent)]'
                : 'border-[var(--color-border-strong)] hover:border-[var(--color-accent)]',
            )}
          >
            Tất cả loại
          </button>
          {EVENT_TYPE_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setType(key)}
              aria-pressed={type === key}
              className={cn(
                'shrink-0 cursor-pointer rounded-full border px-3.5 py-2 text-sm whitespace-nowrap transition-colors',
                type === key
                  ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border-strong)] hover:border-[var(--color-accent)]',
              )}
            >
              {EVENT_TYPE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-6 text-sm text-[var(--color-muted)]" aria-live="polite">
        Tìm thấy <span className="font-medium text-[var(--color-foreground)]">{events.length}</span> sự kiện
      </p>

      {events.length === 0 ? (
        <EmptyState
          title="Không có sự kiện phù hợp"
          description="Thử bỏ bớt bộ lọc hoặc tìm với từ khoá khác."
          icon={CalendarX}
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery('');
                setType('all');
              }}
            >
              Xem tất cả sự kiện
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
