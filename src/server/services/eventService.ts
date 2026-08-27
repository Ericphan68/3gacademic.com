import 'server-only';

import { EVENTS } from '@/data/events';
import { prisma } from '@/server/db';
import type { GolfEvent } from '@/types';

/**
 * Nguồn dữ liệu sự kiện cho website public (khuôn giống voucherService).
 * DB ghi đè các trường "quản trị được" lên trên mock; DB lỗi/trống → mock.
 * Sự kiện chưa "hiển thị" (isPublished=false trong DB) bị ẩn khỏi /events.
 */

// Việt Nam +07:00, không có DST → cộng cố định.
const VN_OFFSET = 7 * 60 * 60 * 1000;
/** Date (UTC trong DB) → 'YYYY-MM-DDTHH:mm' theo giờ VN cho input datetime-local. */
const toLocalInput = (d: Date): string => new Date(d.getTime() + VN_OFFSET).toISOString().slice(0, 16);
/** 'YYYY-MM-DDTHH:mm' (giờ VN) → Date. */
const fromLocalInput = (s: string): Date => new Date(`${s}:00+07:00`);
/** Date → chuỗi ISO có offset +07:00 để hiển thị public. */
const toIsoVN = (d: Date): string => `${new Date(d.getTime() + VN_OFFSET).toISOString().slice(0, 19)}+07:00`;

export interface EventManagedInput {
  slug: string;
  title: string;
  summary: string;
  location: string;
  fee: number;
  capacity: number;
  /** 'YYYY-MM-DDTHH:mm' giờ VN (rỗng = không đổi). */
  startsAtLocal?: string;
  featured: boolean;
  /** Hiển thị trên website (false = ẩn khỏi /events). */
  published: boolean;
}

export interface EventAdminRow {
  slug: string;
  title: string;
  summary: string;
  typeLabel: string;
  location: string;
  fee: number;
  capacity: number;
  startsAtLocal: string;
  featured: boolean;
  published: boolean;
}

interface DbEventRow {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  location: string | null;
  fee: number;
  capacity: number;
  startsAt: Date;
  isFeatured: boolean;
  isPublished: boolean;
}

const SELECT = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  location: true,
  fee: true,
  capacity: true,
  startsAt: true,
  isFeatured: true,
  isPublished: true,
} as const;

function mergeEvent(base: GolfEvent, row: DbEventRow | undefined, registered?: number): GolfEvent {
  if (!row) return { ...base, registered: registered ?? 0 };
  return {
    ...base,
    title: row.title,
    summary: row.summary ?? base.summary,
    location: row.location ?? base.location,
    fee: row.fee,
    capacity: row.capacity,
    registered: registered ?? 0,
    startsAt: toIsoVN(row.startsAt),
  };
}

async function loadRows(): Promise<Map<string, DbEventRow>> {
  const rows = await prisma.event.findMany({ where: { deletedAt: null }, select: SELECT });
  return new Map(rows.map((r) => [r.slug, r]));
}

/** Số người đã đăng ký (tổng attendees, trạng thái REGISTERED) theo eventId. */
async function registeredCounts(): Promise<Map<string, number>> {
  const grouped = await prisma.eventRegistration.groupBy({
    by: ['eventId'],
    where: { status: 'REGISTERED' },
    _sum: { attendees: true },
  });
  return new Map(grouped.map((g) => [g.eventId, g._sum.attendees ?? 0]));
}

/** Danh sách sự kiện hiển thị cho public (ẩn sự kiện đã tắt), số chỗ đã đăng ký là THẬT. */
export async function getManagedEvents(): Promise<GolfEvent[]> {
  try {
    const [byslug, counts] = await Promise.all([loadRows(), registeredCounts()]);
    return EVENTS.map((e) => {
      const row = byslug.get(e.slug);
      const registered = row ? (counts.get(row.id) ?? 0) : 0;
      return mergeEvent(e, row, registered);
    }).filter((e) => {
      const row = byslug.get(e.slug);
      return row ? row.isPublished : true;
    });
  } catch {
    return EVENTS;
  }
}

/** 1 sự kiện theo slug cho trang chi tiết (số chỗ đã đăng ký là THẬT). */
export async function getManagedEvent(slug: string): Promise<GolfEvent | null> {
  const base = EVENTS.find((e) => e.slug === slug);
  if (!base) return null;
  try {
    const row = await prisma.event.findFirst({ where: { slug, deletedAt: null }, select: SELECT });
    let registered = 0;
    if (row) {
      const agg = await prisma.eventRegistration.aggregate({
        where: { eventId: row.id, status: 'REGISTERED' },
        _sum: { attendees: true },
      });
      registered = agg._sum.attendees ?? 0;
    }
    return mergeEvent(base, row ?? undefined, registered);
  } catch {
    return base;
  }
}

/** Danh sách đầy đủ cho Admin. */
export async function listEventsForAdmin(): Promise<EventAdminRow[]> {
  const { EVENT_TYPE_LABELS } = await import('@/data/events');
  let byslug = new Map<string, DbEventRow>();
  try {
    byslug = await loadRows();
  } catch {
    byslug = new Map();
  }
  return EVENTS.map((base) => {
    const row = byslug.get(base.slug);
    const merged = mergeEvent(base, row);
    return {
      slug: merged.slug,
      title: merged.title,
      summary: merged.summary,
      typeLabel: EVENT_TYPE_LABELS[merged.type],
      location: merged.location,
      fee: merged.fee,
      capacity: merged.capacity,
      startsAtLocal: toLocalInput(new Date(merged.startsAt)),
      featured: row ? row.isFeatured : false,
      published: row ? row.isPublished : true,
    } satisfies EventAdminRow;
  });
}

/** Cập nhật (hoặc tạo) 1 sự kiện theo slug. */
export async function updateEvent(input: EventManagedInput) {
  const startsAt = input.startsAtLocal ? fromLocalInput(input.startsAtLocal) : undefined;
  const base = EVENTS.find((e) => e.slug === input.slug);
  return prisma.event.upsert({
    where: { slug: input.slug },
    update: {
      title: input.title,
      summary: input.summary,
      location: input.location,
      fee: input.fee,
      capacity: input.capacity,
      ...(startsAt ? { startsAt } : {}),
      isFeatured: input.featured,
      isPublished: input.published,
    },
    create: {
      slug: input.slug,
      title: input.title,
      summary: input.summary,
      location: input.location,
      fee: input.fee,
      capacity: input.capacity,
      startsAt: startsAt ?? (base ? new Date(base.startsAt) : new Date('2026-01-01T00:00:00+07:00')),
      isFeatured: input.featured,
      isPublished: input.published,
    },
  });
}
