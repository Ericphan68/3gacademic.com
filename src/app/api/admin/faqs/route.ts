import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { updateFaq } from '@/server/services/faqService';

const updateSchema = z.object({
  key: z.string().trim().min(1),
  question: z.string().trim().min(1).max(300),
  answer: z.string().trim().min(1).max(2000),
  active: z.boolean(),
});

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'faq.update')) {
    return NextResponse.json({ error: 'Không có quyền sửa FAQ.' }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  try {
    await updateFaq(parsed.data);
    revalidatePath('/faq');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật FAQ.' }, { status: 500 });
  }
}
