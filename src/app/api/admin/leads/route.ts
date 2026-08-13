import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { setLeadHandled } from '@/server/services/leadService';

const schema = z.object({
  id: z.string().trim().min(1),
  handled: z.boolean(),
});

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  // Yêu cầu/liên hệ thuộc nhóm CRM khách hàng.
  if (!roleHasPermission(session.role, 'customer.update')) {
    return NextResponse.json({ error: 'Không có quyền cập nhật yêu cầu.' }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  try {
    await setLeadHandled(parsed.data.id, parsed.data.handled);
    revalidatePath('/admin/registrations');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật.' }, { status: 500 });
  }
}
