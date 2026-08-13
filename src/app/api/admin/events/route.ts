import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { updateEvent } from '@/server/services/eventService';

const updateSchema = z.object({
  slug: z.string().trim().min(1),
  title: z.string().trim().min(1).max(160),
  summary: z.string().trim().max(500),
  location: z.string().trim().max(200),
  fee: z.number().int().min(0),
  capacity: z.number().int().min(0),
  startsAtLocal: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Thời gian không hợp lệ')
    .optional()
    .or(z.literal('')),
  featured: z.boolean(),
  published: z.boolean(),
});

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'event.update')) {
    return NextResponse.json({ error: 'Không có quyền sửa sự kiện.' }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { startsAtLocal, ...rest } = parsed.data;
  try {
    await updateEvent({ ...rest, startsAtLocal: startsAtLocal || undefined });
    revalidatePath('/events');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật sự kiện.' }, { status: 500 });
  }
}
