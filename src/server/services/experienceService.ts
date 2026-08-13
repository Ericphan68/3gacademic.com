import 'server-only';

import { EXPERIENCES } from '@/data/experiences';
import { prisma } from '@/server/db';
import type { ExperiencePackage } from '@/types';

/**
 * Nguồn dữ liệu gói trải nghiệm cho public (khuôn giống voucherService).
 * DB ghi đè các trường "quản trị được" lên mock; DB lỗi/trống → mock.
 * Gói bị tắt (isActive=false) sẽ ẩn khỏi /experience.
 */

export interface ExperienceManagedInput {
  slug: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  minGuests: number;
  maxGuests: number;
  featured: boolean;
  active: boolean;
}

export interface ExperienceAdminRow {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  durationMinutes: number;
  minGuests: number;
  maxGuests: number;
  featured: boolean;
  active: boolean;
}

interface DbExpRow {
  slug: string;
  name: string;
  description: string | null;
  basePrice: number;
  durationMinutes: number;
  minGuests: number;
  maxGuests: number;
  isFeatured: boolean;
  isActive: boolean;
}

const SELECT = {
  slug: true,
  name: true,
  description: true,
  basePrice: true,
  durationMinutes: true,
  minGuests: true,
  maxGuests: true,
  isFeatured: true,
  isActive: true,
} as const;

function mergeExp(base: ExperiencePackage, row: DbExpRow | undefined): ExperiencePackage {
  if (!row) return base;
  return {
    ...base,
    name: row.name,
    description: row.description ?? base.description,
    price: row.basePrice,
    durationMinutes: row.durationMinutes,
    minGuests: row.minGuests,
    maxGuests: row.maxGuests,
    featured: row.isFeatured,
  };
}

async function loadRows(): Promise<Map<string, DbExpRow>> {
  const rows = await prisma.experience.findMany({ where: { deletedAt: null }, select: SELECT });
  return new Map(rows.map((r) => [r.slug, r]));
}

/** Danh sách gói trải nghiệm hiển thị cho public (ẩn gói đã tắt). */
export async function getManagedExperiences(): Promise<ExperiencePackage[]> {
  try {
    const byslug = await loadRows();
    if (byslug.size === 0) return EXPERIENCES;
    return EXPERIENCES.map((e) => mergeExp(e, byslug.get(e.slug))).filter((e) => {
      const row = byslug.get(e.slug);
      return row ? row.isActive : true;
    });
  } catch {
    return EXPERIENCES;
  }
}

/** Danh sách đầy đủ cho Admin. */
export async function listExperiencesForAdmin(): Promise<ExperienceAdminRow[]> {
  let byslug = new Map<string, DbExpRow>();
  try {
    byslug = await loadRows();
  } catch {
    byslug = new Map();
  }
  return EXPERIENCES.map((base) => {
    const row = byslug.get(base.slug);
    const merged = mergeExp(base, row);
    return {
      slug: merged.slug,
      name: merged.name,
      tagline: merged.tagline,
      description: merged.description,
      price: merged.price,
      durationMinutes: merged.durationMinutes,
      minGuests: merged.minGuests,
      maxGuests: merged.maxGuests,
      featured: merged.featured,
      active: row ? row.isActive : true,
    } satisfies ExperienceAdminRow;
  });
}

/** Cập nhật (hoặc tạo) 1 gói theo slug. */
export async function updateExperience(input: ExperienceManagedInput) {
  return prisma.experience.upsert({
    where: { slug: input.slug },
    update: {
      name: input.name,
      description: input.description,
      basePrice: input.price,
      durationMinutes: input.durationMinutes,
      minGuests: input.minGuests,
      maxGuests: input.maxGuests,
      isFeatured: input.featured,
      isActive: input.active,
    },
    create: {
      slug: input.slug,
      // key là @unique và bắt buộc; dùng slug làm key (chỉ để thoả ràng buộc,
      // không ảnh hưởng hiển thị public vì ta không đọc lại trường này).
      key: input.slug,
      name: input.name,
      description: input.description,
      basePrice: input.price,
      durationMinutes: input.durationMinutes,
      minGuests: input.minGuests,
      maxGuests: input.maxGuests,
      isFeatured: input.featured,
      isActive: input.active,
    },
  });
}
