import 'server-only';

import { COACHES } from '@/data/coaches';
import { prisma } from '@/server/db';
import type { Coach } from '@/types';

/**
 * Nguồn dữ liệu huấn luyện viên cho website public (khuôn giống voucherService).
 * DB ghi đè các trường "quản trị được" lên mock; DB lỗi/trống → mock.
 * HLV bị tắt (isActive=false trong DB) sẽ ẩn khỏi danh sách /coaches.
 */

export interface CoachManagedInput {
  slug: string;
  name: string;
  title: string;
  bio: string;
  yearsExperience: number;
  pricePerSession: number;
  featured: boolean;
  /** Hiển thị trong danh sách HLV (false = ẩn). */
  active: boolean;
}

export interface CoachAdminRow {
  slug: string;
  name: string;
  title: string;
  bio: string;
  yearsExperience: number;
  pricePerSession: number;
  rating: number;
  featured: boolean;
  active: boolean;
}

interface DbCoachRow {
  slug: string;
  name: string;
  title: string;
  bio: string | null;
  yearsExperience: number;
  pricePerSession: number;
  isFeatured: boolean;
  isActive: boolean;
}

const SELECT = {
  slug: true,
  name: true,
  title: true,
  bio: true,
  yearsExperience: true,
  pricePerSession: true,
  isFeatured: true,
  isActive: true,
} as const;

function mergeCoach(base: Coach, row: DbCoachRow | undefined): Coach {
  if (!row) return base;
  return {
    ...base,
    name: row.name,
    title: row.title,
    bio: row.bio ?? base.bio,
    yearsExperience: row.yearsExperience,
    pricePerSession: row.pricePerSession,
    featured: row.isFeatured,
  };
}

async function loadRows(): Promise<Map<string, DbCoachRow>> {
  const rows = await prisma.coach.findMany({ where: { deletedAt: null }, select: SELECT });
  return new Map(rows.map((r) => [r.slug, r]));
}

/** Danh sách HLV hiển thị cho public (ẩn HLV đã tắt). */
export async function getManagedCoaches(): Promise<Coach[]> {
  try {
    const byslug = await loadRows();
    if (byslug.size === 0) return COACHES;
    return COACHES.map((c) => mergeCoach(c, byslug.get(c.slug))).filter((c) => {
      const row = byslug.get(c.slug);
      return row ? row.isActive : true;
    });
  } catch {
    return COACHES;
  }
}

/** Danh sách đầy đủ cho Admin. */
export async function listCoachesForAdmin(): Promise<CoachAdminRow[]> {
  let byslug = new Map<string, DbCoachRow>();
  try {
    byslug = await loadRows();
  } catch {
    byslug = new Map();
  }
  return COACHES.map((base) => {
    const row = byslug.get(base.slug);
    const merged = mergeCoach(base, row);
    return {
      slug: merged.slug,
      name: merged.name,
      title: merged.title,
      bio: merged.bio,
      yearsExperience: merged.yearsExperience,
      pricePerSession: merged.pricePerSession,
      rating: merged.rating,
      featured: merged.featured,
      active: row ? row.isActive : true,
    } satisfies CoachAdminRow;
  });
}

/** Cập nhật (hoặc tạo) 1 HLV theo slug. */
export async function updateCoach(input: CoachManagedInput) {
  return prisma.coach.upsert({
    where: { slug: input.slug },
    update: {
      name: input.name,
      title: input.title,
      bio: input.bio,
      yearsExperience: input.yearsExperience,
      pricePerSession: input.pricePerSession,
      isFeatured: input.featured,
      isActive: input.active,
    },
    create: {
      slug: input.slug,
      name: input.name,
      title: input.title,
      bio: input.bio,
      yearsExperience: input.yearsExperience,
      pricePerSession: input.pricePerSession,
      isFeatured: input.featured,
      isActive: input.active,
    },
  });
}
