import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import {
  confirmMembershipRequest,
  MembershipError,
  rejectMembershipRequest,
} from '@/server/services/membershipJoinService';

const schema = z.object({
  id: z.string().trim().min(1),
  action: z.enum(['confirm', 'reject']),
});

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'membership.assign')) {
    return NextResponse.json({ error: 'Không có quyền duyệt hội viên.' }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu chưa hợp lệ.' }, { status: 400 });

  try {
    if (parsed.data.action === 'confirm') {
      await confirmMembershipRequest(parsed.data.id, session.email);
    } else {
      await rejectMembershipRequest(parsed.data.id, session.email);
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof MembershipError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi xử lý yêu cầu.' }, { status: 500 });
  }
}
