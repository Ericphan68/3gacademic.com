import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { createCoach, updateCoach } from '@/server/services/coachService';

const baseSchema = {
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  bio: z.string().trim().max(1000),
  avatar: z.string().trim().max(500).optional().default(''),
  yearsExperience: z.number().int().min(0).max(80),
  pricePerSession: z.number().int().min(0),
  featured: z.boolean(),
  active: z.boolean(),
};

const updateSchema = z.object({ slug: z.string().trim().min(1), ...baseSchema });
const createSchema = z.object(baseSchema);

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'coach.update')) {
    return NextResponse.json({ error: 'Không có quyền sửa huấn luyện viên.' }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  try {
    await updateCoach(parsed.data);
    revalidatePath('/coaches');
    revalidatePath(`/coaches/${parsed.data.slug}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật huấn luyện viên.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'coach.create')) {
    return NextResponse.json({ error: 'Không có quyền tạo huấn luyện viên.' }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  try {
    const { slug } = await createCoach(parsed.data);
    revalidatePath('/coaches');
    revalidatePath(`/coaches/${slug}`);
    return NextResponse.json({ ok: true, slug });
  } catch {
    return NextResponse.json({ error: 'Lỗi tạo huấn luyện viên.' }, { status: 500 });
  }
}
