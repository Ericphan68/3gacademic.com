import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { updateExperience } from '@/server/services/experienceService';

const updateSchema = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(600),
  price: z.number().int().min(0),
  durationMinutes: z.number().int().min(0).max(1440),
  minGuests: z.number().int().min(1).max(100),
  maxGuests: z.number().int().min(1).max(100),
  featured: z.boolean(),
  active: z.boolean(),
});

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'experience.update')) {
    return NextResponse.json({ error: 'Không có quyền sửa gói trải nghiệm.' }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  try {
    await updateExperience(parsed.data);
    revalidatePath('/experience');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật gói trải nghiệm.' }, { status: 500 });
  }
}
