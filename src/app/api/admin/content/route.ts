import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { updateHomeSection } from '@/server/services/contentService';

const schema = z.object({
  announcement: z
    .object({
      enabled: z.boolean(),
      text: z.string().trim().max(200),
      ctaText: z.string().trim().max(60),
      ctaLink: z.string().trim().max(200),
    })
    .optional(),
  hero: z
    .object({
      eyebrow: z.string().trim().max(160),
      title: z.string().trim().max(160),
      subtitle: z.string().trim().max(400),
      ctaText: z.string().trim().max(60),
      ctaLink: z.string().trim().max(200),
    })
    .optional(),
});

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'content.update')) {
    return NextResponse.json({ error: 'Không có quyền sửa nội dung.' }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { announcement, hero } = parsed.data;
  if (!announcement && !hero) {
    return NextResponse.json({ error: 'Không có thay đổi.' }, { status: 400 });
  }

  if (announcement) await updateHomeSection('announcement', announcement);
  if (hero) await updateHomeSection('hero', hero);

  // Thanh thông báo hiện ở mọi trang → làm mới toàn site; hero ở trang chủ.
  revalidatePath('/', 'layout');

  return NextResponse.json({ ok: true });
}
