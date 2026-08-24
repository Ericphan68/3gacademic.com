import 'server-only';

import { prisma } from '@/server/db';

/**
 * Bài viết Thư Viện (blog). Admin tự đăng/sửa; public đọc bài đã xuất bản.
 * Hàm public bọc try/catch → trang không vỡ nếu DB lỗi.
 */

export interface PostInput {
  slug: string;
  title: string;
  summary?: string | null;
  content: string;
  coverImage?: string | null;
  category?: string | null;
  author?: string | null;
  isPublished: boolean;
}

export interface PostCard {
  slug: string;
  title: string;
  summary: string | null;
  coverImage: string | null;
  category: string | null;
  author: string | null;
  publishedAt: string | null;
}

export interface PostFull extends PostCard {
  content: string;
  updatedAt: string;
}

export interface PostAdminRow {
  id: string;
  slug: string;
  title: string;
  category: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

/** Chuyển tiêu đề tiếng Việt thành slug. */
export function slugify(input: string): string {
  const s = input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return s || 'bai-viet';
}

/** Danh sách bài đã xuất bản (public). */
export async function listPublishedPosts(): Promise<PostCard[]> {
  try {
    const rows = await prisma.post.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        slug: true,
        title: true,
        summary: true,
        coverImage: true,
        category: true,
        author: true,
        publishedAt: true,
      },
    });
    return rows.map((r) => ({ ...r, publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null }));
  } catch {
    return [];
  }
}

/** Chi tiết 1 bài đã xuất bản (public). */
export async function getPublishedPost(slug: string): Promise<PostFull | null> {
  try {
    const r = await prisma.post.findFirst({ where: { slug, isPublished: true } });
    if (!r) return null;
    return {
      slug: r.slug,
      title: r.title,
      summary: r.summary,
      coverImage: r.coverImage,
      category: r.category,
      author: r.author,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      content: r.content,
      updatedAt: r.updatedAt.toISOString(),
    };
  } catch {
    return null;
  }
}

/** Slug của các bài đã xuất bản — cho generateStaticParams. */
export async function getPublishedSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.post.findMany({ where: { isPublished: true }, select: { slug: true } });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

/** Danh sách đầy đủ cho Admin. */
export async function listPostsForAdmin(): Promise<PostAdminRow[]> {
  try {
    const rows = await prisma.post.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        isPublished: true,
        publishedAt: true,
        updatedAt: true,
      },
    });
    return rows.map((r) => ({
      ...r,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export interface PostAdminFull {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

/** Danh sách đầy đủ (kèm nội dung) cho Admin sửa inline. */
export async function listPostsFullForAdmin(): Promise<PostAdminFull[]> {
  try {
    const rows = await prisma.post.findMany({ orderBy: { updatedAt: 'desc' } });
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      summary: r.summary ?? '',
      content: r.content,
      coverImage: r.coverImage ?? '',
      category: r.category ?? '',
      author: r.author ?? '',
      isPublished: r.isPublished,
      publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      updatedAt: r.updatedAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  let slug = slugify(base);
  let n = 1;
  // đảm bảo slug không trùng
  for (;;) {
    const existing = await prisma.post.findUnique({ where: { slug }, select: { id: true } });
    if (!existing || existing.id === exceptId) return slug;
    n += 1;
    slug = `${slugify(base)}-${n}`;
  }
}

export async function createPost(input: PostInput) {
  const slug = await uniqueSlug(input.slug || input.title);
  return prisma.post.create({
    data: {
      slug,
      title: input.title,
      summary: input.summary || null,
      content: input.content,
      coverImage: input.coverImage || null,
      category: input.category || null,
      author: input.author || null,
      isPublished: input.isPublished,
      publishedAt: input.isPublished ? new Date() : null,
    },
    select: { id: true, slug: true },
  });
}

export async function updatePost(id: string, input: PostInput) {
  const current = await prisma.post.findUnique({ where: { id }, select: { publishedAt: true, isPublished: true } });
  const slug = await uniqueSlug(input.slug || input.title, id);
  return prisma.post.update({
    where: { id },
    data: {
      slug,
      title: input.title,
      summary: input.summary || null,
      content: input.content,
      coverImage: input.coverImage || null,
      category: input.category || null,
      author: input.author || null,
      isPublished: input.isPublished,
      // Ghi mốc xuất bản lần đầu; giữ nguyên nếu đã có.
      publishedAt: input.isPublished ? (current?.publishedAt ?? new Date()) : current?.publishedAt ?? null,
    },
    select: { id: true, slug: true },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}
