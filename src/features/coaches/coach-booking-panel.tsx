'use client';

import { CalendarClock, Check, Copy, Heart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useHydrated } from '@/hooks/useHydrated';
import { getCoachAvailability } from '@/lib/availability';
import { formatCurrency, formatDateShort } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAccountStore } from '@/store/useAccountStore';
import type { Coach } from '@/types';

/** Sidebar đặt lịch trên trang chi tiết huấn luyện viên. */
export function CoachBookingPanel({ coach }: { coach: Coach }) {
  const hydrated = useHydrated();
  const favorites = useAccountStore((state) => state.favoriteCoaches);
  const toggleFavorite = useAccountStore((state) => state.toggleFavoriteCoach);
  const isFavorite = hydrated && favorites.includes(coach.id);

  const availability = getCoachAvailability(coach.id, 10).slice(0, 4);
  const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(coach.referralCode);
      toast.success('Đã sao chép mã giới thiệu', {
        description: `Mã ${coach.referralCode} — dùng khi đăng ký để ghi nhận cho huấn luyện viên.`,
      });
    } catch {
      toast.error('Không sao chép được', { description: `Bạn có thể ghi lại mã: ${coach.referralCode}` });
    }
  };

  return (
    <aside className="lg:sticky lg:top-28">
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 shadow-[var(--shadow-subtle)]">
        <div className="flex items-baseline gap-2">
          <span className="text-sm text-[var(--color-muted)]">Học phí từ</span>
        </div>
        <p className="mt-1 font-[family-name:var(--font-display)] text-3xl">
          {formatCurrency(coach.pricePerSession)}
          <span className="ml-1.5 text-sm font-normal text-[var(--color-muted)]">/ buổi 60 phút</span>
        </p>

        <div className="mt-6">
          <p className="mb-3 flex items-center gap-2 text-sm font-medium">
            <CalendarClock className="size-4 text-[var(--color-accent)]" aria-hidden />
            Lịch trống gần nhất
          </p>

          {availability.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">
              Lịch của huấn luyện viên đang kín. Bạn gửi yêu cầu đặt lịch để Lotus sắp xếp khung phù hợp.
            </p>
          ) : (
            <div className="space-y-3">
              {availability.map((day) => (
                <div key={day.date}>
                  <p className="mb-1.5 text-xs font-medium text-[var(--color-muted)]">
                    {formatDateShort(day.date)}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {day.times.map((time) => {
                      const active = selected?.date === day.date && selected?.time === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setSelected({ date: day.date, time })}
                          aria-pressed={active}
                          className={cn(
                            'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                            active
                              ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                              : 'border-[var(--color-border-strong)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
                          )}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 space-y-2.5">
          <Button asChild variant="accent" size="lg" block>
            <Link
              href={{
                pathname: '/booking',
                query: {
                  coach: coach.slug,
                  ...(selected ? { date: selected.date, time: selected.time } : {}),
                },
              }}
            >
              {selected ? `Đặt lịch ${formatDateShort(selected.date)} · ${selected.time}` : 'Đặt lịch với huấn luyện viên'}
            </Link>
          </Button>

          <Button
            variant="outline"
            block
            onClick={() => {
              toggleFavorite(coach.id);
              toast.success(isFavorite ? 'Đã bỏ khỏi yêu thích' : 'Đã thêm vào yêu thích');
            }}
          >
            <Heart className={cn(isFavorite && 'fill-[var(--color-danger)] text-[var(--color-danger)]')} aria-hidden />
            {isFavorite ? 'Bỏ yêu thích' : 'Lưu vào yêu thích'}
          </Button>
        </div>

        <div className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-[var(--color-muted)]">Mã giới thiệu của huấn luyện viên</p>
              <p className="truncate font-mono text-sm font-medium">{coach.referralCode}</p>
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="Sao chép mã giới thiệu" onClick={copyReferral}>
              <Copy aria-hidden />
            </Button>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-[var(--color-muted)]">
            Nhập mã này khi đăng ký để buổi học của bạn được ghi nhận cho huấn luyện viên. Đây là tính năng demo.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-5">
        <Badge variant="accent" size="sm" className="mb-3">
          Gợi ý thông minh
        </Badge>
        <p className="text-sm leading-relaxed text-[var(--color-golf-800)]">
          Với mục tiêu của bạn, lộ trình <span className="font-medium">{coach.programs[1].name}</span> được
          học viên chọn nhiều nhất — {formatCurrency(coach.programs[1].price)} cho{' '}
          {coach.programs[1].sessions} buổi.
        </p>
        <ul className="mt-3 space-y-1.5 text-xs text-[var(--color-golf-700)]">
          {coach.suitableFor.slice(0, 3).map((item) => (
            <li key={item} className="flex gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
