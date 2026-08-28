import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { adminResetCustomerPassword } from '@/server/services/customerAuthService';

const schema = z.object({
  id: z.string().trim().min(1),
  newPassword: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').max(100),
});

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'customer.update')) {
    return NextResponse.json({ error: 'Không có quyền đặt lại mật khẩu khách.' }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu chưa hợp lệ.' }, { status: 400 });
  }

  try {
    await adminResetCustomerPassword(parsed.data.id, parsed.data.newPassword);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi đặt lại mật khẩu.' }, { status: 500 });
  }
}
