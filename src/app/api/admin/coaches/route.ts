import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { updateCoach } from '@/server/services/coachService';

const updateSchema = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  bio: z.string().trim().max(1000),
  yearsExperience: z.number().int().min(0).max(80),
  pricePerSession: z.number().int().min(0),
  featured: z.boolean(),
  active: z.boolean(),
});

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
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật huấn luyện viên.' }, { status: 500 });
  }
}
