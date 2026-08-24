import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { createPost, deletePost, updatePost } from '@/server/services/postService';

const postSchema = z.object({
  slug: z.string().trim().max(90).optional(),
  title: z.string().trim().min(1).max(200),
  summary: z.string().trim().max(600).nullish(),
  content: z.string().trim().min(1),
  coverImage: z.string().trim().max(600).nullish(),
  category: z.string().trim().max(80).nullish(),
  author: z.string().trim().max(120).nullish(),
  isPublished: z.boolean(),
});

async function guard() {
  const session = await getAdminSession();
  if (!session) return { error: 'Chưa đăng nhập.', status: 401 as const };
  if (!roleHasPermission(session.role, 'content.update')) {
    return { error: 'Không có quyền quản lý bài viết.', status: 403 as const };
  }
  return null;
}

export async function POST(req: Request) {
  const g = await guard();
  if (g) return NextResponse.json({ error: g.error }, { status: g.status });

  const parsed = postSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });

  try {
    const post = await createPost({ ...parsed.data, slug: parsed.data.slug ?? '' });
    revalidatePath('/thu-vien');
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ error: 'Lỗi tạo bài viết.' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const g = await guard();
  if (g) return NextResponse.json({ error: g.error }, { status: g.status });

  const schema = postSchema.extend({ id: z.string().trim().min(1) });
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });

  const { id, ...data } = parsed.data;
  try {
    const post = await updatePost(id, { ...data, slug: data.slug ?? '' });
    revalidatePath('/thu-vien');
    revalidatePath(`/thu-vien/${post.slug}`);
    return NextResponse.json({ ok: true, post });
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật bài viết.' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const g = await guard();
  if (g) return NextResponse.json({ error: g.error }, { status: g.status });

  const parsed = z.object({ id: z.string().trim().min(1) }).safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });

  try {
    await deletePost(parsed.data.id);
    revalidatePath('/thu-vien');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi xoá bài viết.' }, { status: 500 });
  }
}
