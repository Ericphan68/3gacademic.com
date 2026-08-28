import 'server-only';

import { coachAvatar } from '@/constants/media';
import { COACHES } from '@/data/coaches';
import { prisma } from '@/server/db';
import type { Coach } from '@/types';

/**
 * Nguồn dữ liệu huấn luyện viên cho website public.
 * - HLV "gốc" đến từ file mock @/data/coaches, DB ghi đè các trường quản trị được.
 * - HLV do admin TẠO MỚI chỉ nằm trong DB (slug không có trong mock) và được gộp thêm.
 * - HLV bị tắt (isActive=false) sẽ ẩn khỏi trang /coaches.
 */

export interface CoachManagedInput {
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string; // link ảnh (/api/media/... hoặc /images/...), rỗng = giữ nguyên/ảnh mặc định
  yearsExperience: number;
  pricePerSession: number;
  featured: boolean;
  /** Hiển thị trong danh sách HLV (false = ẩn). */
  active: boolean;
}

export interface CreateCoachInput {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  yearsExperience: number;
  pricePerSession: number;
  featured: boolean;
  active: boolean;
}

export interface CoachAdminRow {
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  yearsExperience: number;
  pricePerSession: number;
  rating: number;
  featured: boolean;
  active: boolean;
  /** true nếu HLV do admin tạo (chỉ có trong DB), false nếu là HLV gốc từ mock. */
  custom: boolean;
}

interface DbCoachRow {
  id: string;
  slug: string;
  name: string;
  title: string;
  avatar: string | null;
  bio: string | null;
  yearsExperience: number;
  pricePerSession: number;
  rating: number;
  reviewCount: number;
  studentCount: number;
  certifications: string[];
  referralCode: string | null;
  isFeatured: boolean;
  isActive: boolean;
}

const SELECT = {
  id: true,
  slug: true,
  name: true,
  title: true,
  avatar: true,
  bio: true,
  yearsExperience: true,
  pricePerSession: true,
  rating: true,
  reviewCount: true,
  studentCount: true,
  certifications: true,
  referralCode: true,
  isFeatured: true,
  isActive: true,
} as const;

/** Ghép DB (ghi đè trường quản trị) lên 1 HLV gốc từ mock. */
function mergeCoach(base: Coach, row: DbCoachRow | undefined): Coach {
  if (!row) return base;
  return {
    ...base,
    name: row.name,
    title: row.title,
    avatar: row.avatar || base.avatar,
    bio: row.bio ?? base.bio,
    yearsExperience: row.yearsExperience,
    pricePerSession: row.pricePerSession,
    featured: row.isFeatured,
  };
}

/** Dựng 1 Coach hoàn chỉnh cho HLV do admin tạo (chỉ có trong DB). */
function dbRowToCoach(row: DbCoachRow): Coach {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    avatar: row.avatar || coachAvatar(1),
    bio: row.bio ?? '',
    philosophy: row.bio ?? '',
    yearsExperience: row.yearsExperience,
    specialties: [],
    languages: ['vi'],
    rating: row.rating,
    reviewCount: row.reviewCount,
    studentCount: row.studentCount,
    pricePerSession: row.pricePerSession,
    certifications: row.certifications ?? [],
    careerHighlights: [],
    suitableFor: [],
    programs: [],
    reviews: [],
    faqs: [],
    referralCode: row.referralCode ?? '',
    featured: row.isFeatured,
    introVideoNote: '',
  };
}

async function loadRows(): Promise<Map<string, DbCoachRow>> {
  const rows = await prisma.coach.findMany({ where: { deletedAt: null }, select: SELECT });
  return new Map(rows.map((r) => [r.slug, r]));
}

const MOCK_SLUGS = new Set(COACHES.map((c) => c.slug));

/** Danh sách HLV hiển thị cho public (ẩn HLV đã tắt). */
export async function getManagedCoaches(): Promise<Coach[]> {
  let byslug: Map<string, DbCoachRow>;
  try {
    byslug = await loadRows();
  } catch {
    return COACHES;
  }
  if (byslug.size === 0) return COACHES;

  // 1) HLV gốc (mock) + ghi đè DB, ẩn cái bị tắt.
  const fromMock = COACHES.map((c) => mergeCoach(c, byslug.get(c.slug))).filter((c) => {
    const row = byslug.get(c.slug);
    return row ? row.isActive : true;
  });

  // 2) HLV do admin tạo mới (chỉ có trong DB), đang bật.
  const customs = [...byslug.values()]
    .filter((row) => !MOCK_SLUGS.has(row.slug) && row.isActive)
    .map(dbRowToCoach);

  return [...fromMock, ...customs];
}

/** Tra 1 HLV theo slug cho trang chi tiết (gộp cả HLV do admin tạo). Ẩn HLV đã tắt. */
export async function getManagedCoachBySlug(slug: string): Promise<Coach | null> {
  let byslug: Map<string, DbCoachRow>;
  try {
    byslug = await loadRows();
  } catch {
    byslug = new Map();
  }
  const row = byslug.get(slug);

  const base = COACHES.find((c) => c.slug === slug);
  if (base) {
    if (row && !row.isActive) return null; // HLV gốc đã bị ẩn
    return mergeCoach(base, row);
  }
  // HLV do admin tạo.
  if (row && row.isActive) return dbRowToCoach(row);
  return null;
}

/** Danh sách đầy đủ cho Admin (gồm cả HLV do admin tạo). */
export async function listCoachesForAdmin(): Promise<CoachAdminRow[]> {
  let byslug = new Map<string, DbCoachRow>();
  try {
    byslug = await loadRows();
  } catch {
    byslug = new Map();
  }

  const fromMock: CoachAdminRow[] = COACHES.map((base) => {
    const row = byslug.get(base.slug);
    const merged = mergeCoach(base, row);
    return {
      slug: merged.slug,
      name: merged.name,
      title: merged.title,
      bio: merged.bio,
      avatar: merged.avatar,
      yearsExperience: merged.yearsExperience,
      pricePerSession: merged.pricePerSession,
      rating: merged.rating,
      featured: merged.featured,
      active: row ? row.isActive : true,
      custom: false,
    } satisfies CoachAdminRow;
  });

  const customs: CoachAdminRow[] = [...byslug.values()]
    .filter((row) => !MOCK_SLUGS.has(row.slug))
    .map((row) => {
      const c = dbRowToCoach(row);
      return {
        slug: c.slug,
        name: c.name,
        title: c.title,
        bio: c.bio,
        avatar: c.avatar,
        yearsExperience: c.yearsExperience,
        pricePerSession: c.pricePerSession,
        rating: c.rating,
        featured: c.featured,
        active: row.isActive,
        custom: true,
      } satisfies CoachAdminRow;
    });

  // HLV mới nhất (do admin tạo) lên đầu, sau đó tới HLV gốc.
  return [...customs, ...fromMock];
}

/** Cập nhật (hoặc tạo theo slug) 1 HLV. */
export async function updateCoach(input: CoachManagedInput) {
  const data = {
    name: input.name,
    title: input.title,
    bio: input.bio,
    yearsExperience: input.yearsExperience,
    pricePerSession: input.pricePerSession,
    isFeatured: input.featured,
    isActive: input.active,
    ...(input.avatar ? { avatar: input.avatar } : {}),
  };
  return prisma.coach.upsert({
    where: { slug: input.slug },
    update: data,
    create: {
      slug: input.slug,
      ...data,
    },
  });
}

/** Bỏ dấu tiếng Việt + tạo slug an toàn từ tên. */
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

/** Sinh slug duy nhất (không đụng mock lẫn DB). */
async function uniqueCoachSlug(name: string): Promise<string> {
  const bases = slugify(name) || 'hlv';
  let candidate = bases;
  let n = 2;
  // Kiểm tra trùng với mock và DB (vòng lặp nhỏ, hiếm khi trùng quá vài lần).
  while (MOCK_SLUGS.has(candidate) || (await prisma.coach.findUnique({ where: { slug: candidate }, select: { id: true } }))) {
    candidate = `${bases}-${n}`;
    n += 1;
  }
  return candidate;
}

/** Tạo HLV mới (do admin). Trả về slug đã tạo. */
export async function createCoach(input: CreateCoachInput): Promise<{ slug: string }> {
  const slug = await uniqueCoachSlug(input.name);
  // Mã giới thiệu bám theo slug (đã duy nhất) nên không đụng khoá unique.
  const referralCode = `LOTUS-${slug.replace(/-/g, '').toUpperCase().slice(0, 10) || 'HLV'}`;

  await prisma.coach.create({
    data: {
      slug,
      name: input.name,
      title: input.title,
      bio: input.bio,
      avatar: input.avatar || coachAvatar(1),
      yearsExperience: input.yearsExperience,
      pricePerSession: input.pricePerSession,
      isFeatured: input.featured,
      isActive: input.active,
      referralCode,
    },
  });
  return { slug };
}
