import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { updateSettings } from '@/server/services/settingsService';

const schema = z.object({
  name: z.string().trim().max(120).optional(),
  hotline: z.string().trim().max(40).optional(),
  email: z.string().trim().max(120).optional(),
  address: z.string().trim().max(300).optional(),
  openHours: z.string().trim().max(60).optional(),
  zalo: z.string().trim().max(300).optional(),
  facebook: z.string().trim().max(300).optional(),
  instagram: z.string().trim().max(300).optional(),
  youtube: z.string().trim().max(300).optional(),
  tiktok: z.string().trim().max(300).optional(),
});

const KEY_MAP: Record<string, { key: string; group: string }> = {
  name: { key: 'site.name', group: 'general' },
  hotline: { key: 'site.hotline', group: 'general' },
  email: { key: 'site.email', group: 'general' },
  address: { key: 'site.address', group: 'general' },
  openHours: { key: 'site.openHours', group: 'general' },
  zalo: { key: 'social.zalo', group: 'social' },
  facebook: { key: 'social.facebook', group: 'social' },
  instagram: { key: 'social.instagram', group: 'social' },
  youtube: { key: 'social.youtube', group: 'social' },
  tiktok: { key: 'social.tiktok', group: 'social' },
};

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'setting.update')) {
    return NextResponse.json({ error: 'Không có quyền sửa cấu hình.' }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const entries = Object.entries(parsed.data)
    .filter(([, value]) => value !== undefined)
    .map(([field, value]) => ({ ...KEY_MAP[field], value: String(value) }));

  if (entries.length === 0) {
    return NextResponse.json({ error: 'Không có thay đổi.' }, { status: 400 });
  }

  await updateSettings(entries);

  // Làm mới toàn bộ trang public (chân trang hiển thị ở mọi trang).
  revalidatePath('/', 'layout');

  return NextResponse.json({ ok: true });
}
