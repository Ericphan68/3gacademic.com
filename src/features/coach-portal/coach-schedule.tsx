'use client';

import { addDays, addWeeks, format, startOfWeek } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Ban, CalendarDays, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/disclosure';
import { useHydrated } from '@/hooks/useHydrated';
import { buildCalendarGrid, dateKey, getCoachAvailability, isPastDate } from '@/lib/availability';
import { formatDateLong } from '@/lib/format';
import { cn } from '@/lib/utils';
import { COACH_STUDENTS } from '@/data/coach-portal';
import { coachService } from '@/services/catalogService';
import { useAuthStore } from '@/store/useAuthStore';

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

export function CoachSchedule() {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);

  const [weekOffset, setWeekOffset] = useState(0);
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [blocked, setBlocked] = useState<Set<string>>(new Set());

  const coach = user?.coachSlug ? coachService.getBySlug(user.coachSlug) : undefined;
  const coachId = coach?.id ?? 'coach-02';

  const availability = useMemo(() => {
    const map = new Map<string, string[]>();
    getCoachAvailability(coachId, 60).forEach((entry) => map.set(entry.date, entry.times));
    return map;
  }, [coachId]);

  const weekStart = useMemo(
    () => addWeeks(startOfWeek(new Date(), { weekStartsOn: 1 }), weekOffset),
    [weekOffset],
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, index) => dateKey(addDays(weekStart, index))),
    [weekStart],
  );

  const monthCells = useMemo(
    () => buildCalendarGrid(monthCursor.getFullYear(), monthCursor.getMonth()),
    [monthCursor],
  );

  if (!hydrated) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  /** Gán học viên vào slot theo thứ tự xác định để lịch demo trông thật. */
  const bookingFor = (date: string, time: string): string | null => {
    const key = `${date}${time}`;
    let hash = 0;
    for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    return hash % 5 < 2 ? COACH_STUDENTS[hash % COACH_STUDENTS.length].name : null;
  };

  const toggleBlock = (date: string, time: string) => {
    const key = `${date}|${time}`;
    setBlocked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        toast.success('Đã mở lại khung giờ', { description: `${formatDateLong(date)} · ${time}` });
      } else {
        next.add(key);
        toast.success('Đã chặn khung giờ', {
          description: `${formatDateLong(date)} · ${time} sẽ không nhận booking mới.`,
        });
      }
      return next;
    });
  };

  return (
    <div>
      <PortalHeader
        title="Lịch dạy"
        description="Xem lịch theo tuần hoặc tháng, kiểm tra slot trống và chặn khung giờ bạn bận."
      />

      <Tabs defaultValue="week">
        <TabsList className="self-start">
          <TabsTrigger value="week">Lịch tuần</TabsTrigger>
          <TabsTrigger value="month">Lịch tháng</TabsTrigger>
        </TabsList>

        {/* Lịch tuần */}
        <TabsContent value="week">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Button variant="outline" size="sm" onClick={() => setWeekOffset((prev) => prev - 1)}>
              <ChevronLeft aria-hidden />
              Tuần trước
            </Button>

            <p className="text-sm font-medium" aria-live="polite">
              {format(weekStart, 'dd/MM')} – {format(addDays(weekStart, 6), 'dd/MM/yyyy')}
            </p>

            <Button variant="outline" size="sm" onClick={() => setWeekOffset((prev) => prev + 1)}>
              Tuần sau
              <ChevronRight aria-hidden />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {weekDays.map((date) => {
              const times = availability.get(date) ?? [];
              const past = isPastDate(date);

              return (
                <div
                  key={date}
                  className={cn(
                    'rounded-[var(--radius-lg)] border p-4',
                    past
                      ? 'border-[var(--color-border)] bg-[var(--color-surface)] opacity-60'
                      : 'border-[var(--color-border)] bg-[var(--color-background)]',
                  )}
                >
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium">
                      {format(new Date(date), 'EEEE', { locale: vi })}
                    </p>
                    <p className="text-xs text-[var(--color-muted)]">{format(new Date(date), 'dd/MM')}</p>
                  </div>

                  {times.length === 0 ? (
                    <p className="rounded-[var(--radius-sm)] bg-[var(--color-muted-surface)] px-3 py-2 text-xs text-[var(--color-muted)]">
                      Ngày nghỉ
                    </p>
                  ) : (
                    <ul className="space-y-2">
                      {times.map((time) => {
                        const student = bookingFor(date, time);
                        const isBlocked = blocked.has(`${date}|${time}`);

                        return (
                          <li key={time}>
                            <button
                              type="button"
                              onClick={() => !student && !past && toggleBlock(date, time)}
                              disabled={Boolean(student) || past}
                              className={cn(
                                'w-full rounded-[var(--radius-sm)] border px-3 py-2 text-left text-xs transition-colors',
                                student
                                  ? 'cursor-default border-[var(--color-golf-200)] bg-[var(--color-golf-50)]'
                                  : isBlocked
                                    ? 'cursor-pointer border-[var(--color-border-strong)] bg-[var(--color-muted-surface)] text-[var(--color-muted)]'
                                    : 'cursor-pointer border-dashed border-[var(--color-border-strong)] hover:border-[var(--color-accent)]',
                                past && 'cursor-not-allowed',
                              )}
                            >
                              <span className="flex items-center justify-between gap-2">
                                <span className="font-medium tabular-nums">{time}</span>
                                {student ? (
                                  <Badge variant="accent" size="sm">
                                    Đã đặt
                                  </Badge>
                                ) : isBlocked ? (
                                  <Lock className="size-3.5" aria-hidden />
                                ) : (
                                  <span className="text-[10px] text-[var(--color-muted)]">Trống</span>
                                )}
                              </span>
                              {student ? (
                                <span className="mt-1 block truncate text-[var(--color-golf-800)]">
                                  {student}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Ban className="size-4 shrink-0" aria-hidden />
            Bấm vào một khung giờ trống để chặn hoặc mở lại. Đây là thao tác demo, chỉ lưu trong phiên hiện
            tại.
          </p>
        </TabsContent>

        {/* Lịch tháng */}
        <TabsContent value="month">
          <div className="mb-5 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
            >
              <ChevronLeft aria-hidden />
              Tháng trước
            </Button>

            <p className="text-sm font-medium" aria-live="polite">
              {format(monthCursor, 'MMMM yyyy', { locale: vi })}
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
            >
              Tháng sau
              <ChevronRight aria-hidden />
            </Button>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-4">
            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="pb-2 text-center text-[11px] font-semibold tracking-wide text-[var(--color-muted)] uppercase"
                >
                  {day}
                </div>
              ))}

              {monthCells.map((cell, index) => {
                if (!cell) return <div key={`empty-${index}`} aria-hidden />;

                const times = availability.get(cell) ?? [];
                const past = isPastDate(cell);
                const bookedCount = times.filter((time) => bookingFor(cell, time)).length;

                return (
                  <div
                    key={cell}
                    className={cn(
                      'min-h-20 rounded-[var(--radius-sm)] border p-2',
                      past
                        ? 'border-transparent bg-[var(--color-surface)] opacity-50'
                        : times.length === 0
                          ? 'border-transparent bg-[var(--color-muted-surface)]'
                          : 'border-[var(--color-border)]',
                    )}
                  >
                    <p className="text-xs font-medium">{Number(cell.slice(8, 10))}</p>
                    {!past && times.length > 0 ? (
                      <div className="mt-1.5 space-y-1">
                        {bookedCount > 0 ? (
                          <p className="rounded-sm bg-[var(--color-golf-100)] px-1.5 py-0.5 text-[10px] text-[var(--color-golf-800)]">
                            {bookedCount} buổi dạy
                          </p>
                        ) : null}
                        <p className="text-[10px] text-[var(--color-muted)]">
                          {times.length - bookedCount} slot trống
                        </p>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            Lịch tháng hiển thị tổng quan số buổi dạy và slot còn trống mỗi ngày.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
