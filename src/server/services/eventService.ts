import 'server-only';

import { eventBanner } from '@/constants/media';
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
  description: string | null;
  banner: string | null;
  location: string | null;
  fee: number;
  capacity: number;
  startsAt: Date;
  endsAt: Date | null;
  isFeatured: boolean;
  isPublished: boolean;
}

const SELECT = {
  id: true,
  slug: true,
  title: true,
  summary: true,
  description: true,
  banner: true,
  location: true,
  fee: true,
  capacity: true,
  startsAt: true,
  endsAt: true,
  isFeatured: true,
  isPublished: true,
} as const;

const MOCK_SLUGS = new Set(EVENTS.map((e) => e.slug));

/** Dựng 1 GolfEvent hoàn chỉnh cho sự kiện do admin tạo (chỉ có trong DB). */
function dbRowToEvent(row: DbEventRow, registered: number): GolfEvent {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: 'tournament',
    summary: row.summary ?? '',
    description: row.description ?? row.summary ?? '',
    banner: row.banner || eventBanner(1),
    startsAt: toIsoVN(row.startsAt),
    endsAt: row.endsAt ? toIsoVN(row.endsAt) : '',
    location: row.location ?? '',
    fee: row.fee,
    capacity: row.capacity,
    registered,
    audience: '',
    schedule: [],
    rules: [],
    benefits: [],
    prizes: [],
    sponsors: [],
    participants: [],
    faqs: [],
  };
}

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
    const fromMock = EVENTS.map((e) => {
      const row = byslug.get(e.slug);
      const registered = row ? (counts.get(row.id) ?? 0) : 0;
      return mergeEvent(e, row, registered);
    }).filter((e) => {
      const row = byslug.get(e.slug);
      return row ? row.isPublished : true;
    });

    // Sự kiện do admin tạo mới (chỉ có trong DB), đang hiển thị.
    const customs = [...byslug.values()]
      .filter((row) => !MOCK_SLUGS.has(row.slug) && row.isPublished)
      .map((row) => dbRowToEvent(row, counts.get(row.id) ?? 0));

    return [...fromMock, ...customs];
  } catch {
    return EVENTS;
  }
}

/** 1 sự kiện theo slug cho trang chi tiết (số chỗ đã đăng ký là THẬT). */
export async function getManagedEvent(slug: string): Promise<GolfEvent | null> {
  const base = EVENTS.find((e) => e.slug === slug);
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
    if (base) {
      if (row && !row.isPublished) return null; // sự kiện gốc đã bị ẩn
      return mergeEvent(base, row ?? undefined, registered);
    }
    // Sự kiện do admin tạo.
    if (row && row.isPublished) return dbRowToEvent(row, registered);
    return null;
  } catch {
    return base ?? null;
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
  const fromMock: EventAdminRow[] = EVENTS.map((base) => {
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

  const customs: EventAdminRow[] = [...byslug.values()]
    .filter((row) => !MOCK_SLUGS.has(row.slug))
    .map((row) => ({
      slug: row.slug,
      title: row.title,
      summary: row.summary ?? '',
      typeLabel: 'Tự thêm',
      location: row.location ?? '',
      fee: row.fee,
      capacity: row.capacity,
      startsAtLocal: toLocalInput(row.startsAt),
      featured: row.isFeatured,
      published: row.isPublished,
    }));

  return [...customs, ...fromMock];
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

export interface CreateEventInput {
  title: string;
  summary: string;
  location: string;
  fee: number;
  capacity: number;
  startsAtLocal: string;
  featured: boolean;
  published: boolean;
}

/** Bỏ dấu tiếng Việt + tạo slug an toàn. */
function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/** Tạo sự kiện mới (do admin). Trả về slug đã tạo. */
export async function createEvent(input: CreateEventInput): Promise<{ slug: string }> {
  const bases = slugify(input.title) || 'su-kien';
  let slug = bases;
  let n = 2;
  while (MOCK_SLUGS.has(slug) || (await prisma.event.findUnique({ where: { slug }, select: { id: true } }))) {
    slug = `${bases}-${n}`;
    n += 1;
  }

  await prisma.event.create({
    data: {
      slug,
      title: input.title,
      summary: input.summary,
      location: input.location,
      fee: input.fee,
      capacity: input.capacity,
      startsAt: input.startsAtLocal ? fromLocalInput(input.startsAtLocal) : new Date('2026-01-01T00:00:00+07:00'),
      isFeatured: input.featured,
      isPublished: input.published,
    },
  });
  return { slug };
}
