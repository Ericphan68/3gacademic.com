import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { confirmTopup, rejectTopup, TopupError } from '@/server/services/topupService';

const schema = z.object({
  id: z.string().trim().min(1),
  action: z.enum(['confirm', 'reject']),
});

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'customer.update')) {
    return NextResponse.json({ error: 'Không có quyền duyệt nạp ví.' }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu chưa hợp lệ.' }, { status: 400 });

  try {
    if (parsed.data.action === 'confirm') {
      const balance = await confirmTopup(parsed.data.id, session.email);
      return NextResponse.json({ ok: true, balance });
    }
    await rejectTopup(parsed.data.id, session.email);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof TopupError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu.' }, { status: 500 });
  }
}
