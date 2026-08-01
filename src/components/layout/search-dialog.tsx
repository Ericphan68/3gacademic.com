'use client';

import { ArrowRight, CalendarCheck, GraduationCap, Search, Ticket, Trophy, Utensils } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/overlays';
import { COACHES } from '@/data/coaches';
import { EVENTS } from '@/data/events';
import { EXPERIENCES } from '@/data/experiences';
import { FNB_ITEMS } from '@/data/fnb';
import { VOUCHERS } from '@/data/vouchers';
import { matchesQuery } from '@/lib/utils';
import { useUiStore } from '@/store/useUiStore';

interface Result {
  id: string;
  label: string;
  detail: string;
  href: Route;
  group: string;
  icon: typeof Search;
}

const QUICK_LINKS: Result[] = [
  { id: 'q1', label: 'Đặt lịch trải nghiệm', detail: 'Chọn giờ, khu vực và huấn luyện viên', href: '/booking', group: 'Truy cập nhanh', icon: CalendarCheck },
  { id: 'q2', label: 'Tìm huấn luyện viên', detail: '12 HLV theo chuyên môn và ngôn ngữ', href: '/coaches', group: 'Truy cập nhanh', icon: GraduationCap },
  { id: 'q3', label: 'Voucher và ưu đãi', detail: 'Flash Sale, giờ thấp điểm, quà tặng', href: '/vouchers', group: 'Truy cập nhanh', icon: Ticket },
  { id: 'q4', label: 'Sự kiện sắp tới', detail: 'Giải đấu, workshop và networking', href: '/events', group: 'Truy cập nhanh', icon: Trophy },
];

export function SearchDialog() {
  const open = useUiStore((state) => state.searchOpen);
  const setOpen = useUiStore((state) => state.setSearchOpen);
  const [query, setQuery] = useState('');

  const results = useMemo<Result[]>(() => {
    if (!query.trim()) return QUICK_LINKS;

    const items: Result[] = [
      ...EXPERIENCES.filter((item) => matchesQuery(query, item.name, item.tagline)).map((item) => ({
        id: `exp-${item.id}`,
        label: item.name,
        detail: item.tagline,
        href: `/experience/${item.slug}` as Route,
        group: 'Gói trải nghiệm',
        icon: CalendarCheck,
      })),
      ...COACHES.filter((coach) => matchesQuery(query, coach.name, coach.title)).map((coach) => ({
        id: `co-${coach.id}`,
        label: coach.name,
        detail: coach.title,
        href: `/coaches/${coach.slug}` as Route,
        group: 'Huấn luyện viên',
        icon: GraduationCap,
      })),
      ...EVENTS.filter((event) => matchesQuery(query, event.title, event.summary)).map((event) => ({
        id: `ev-${event.id}`,
        label: event.title,
        detail: event.summary,
        href: `/events/${event.slug}` as Route,
        group: 'Sự kiện',
        icon: Trophy,
      })),
      ...VOUCHERS.filter((voucher) => matchesQuery(query, voucher.name, voucher.code)).map((voucher) => ({
        id: `vo-${voucher.id}`,
        label: voucher.name,
        detail: `Mã ${voucher.code}`,
        href: '/vouchers' as Route,
        group: 'Voucher',
        icon: Ticket,
      })),
      ...FNB_ITEMS.filter((item) => matchesQuery(query, item.name, item.description)).map((item) => ({
        id: `fb-${item.id}`,
        label: item.name,
        detail: item.description,
        href: '/food-and-lounge' as Route,
        group: 'F&B',
        icon: Utensils,
      })),
    ];

    return items.slice(0, 12);
  }, [query]);

  const grouped = useMemo(() => {
    return results.reduce<Record<string, Result[]>>((acc, item) => {
      acc[item.group] = [...(acc[item.group] ?? []), item];
      return acc;
    }, {});
  }, [results]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setQuery('');
      }}
    >
      <DialogContent size="lg" className="p-0">
        <DialogHeader className="mb-0 border-b border-[var(--color-border)] p-5 pr-14">
          <DialogTitle className="sr-only">Tìm kiếm trên Lotus Golf Center</DialogTitle>
          <DialogDescription className="sr-only">
            Tìm gói trải nghiệm, huấn luyện viên, sự kiện, voucher và món F&amp;B.
          </DialogDescription>
          <div className="flex items-center gap-3">
            <Search className="size-5 shrink-0 text-[var(--color-muted)]" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm gói trải nghiệm, huấn luyện viên, sự kiện…"
              aria-label="Từ khoá tìm kiếm"
              className="w-full bg-transparent text-base outline-none placeholder:text-[var(--color-stone-400)]"
            />
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto p-3">
          {results.length === 0 ? (
            <p className="px-3 py-10 text-center text-sm text-[var(--color-muted)]">
              Không tìm thấy kết quả cho “{query}”. Thử từ khoá khác như “người mới”, “putting” hoặc “doanh nghiệp”.
            </p>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-2">
                <p className="px-3 py-2 text-[11px] font-semibold tracking-widest text-[var(--color-muted)] uppercase">
                  {group}
                </p>
                <ul>
                  {items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 transition-colors hover:bg-[var(--color-muted-surface)]"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-golf-50)] text-[var(--color-accent)]">
                          <item.icon className="size-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.label}</span>
                          <span className="block truncate text-xs text-[var(--color-muted)]">{item.detail}</span>
                        </span>
                        <ArrowRight
                          className="size-4 shrink-0 text-[var(--color-stone-400)] transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
