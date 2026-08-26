import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCustomerSession } from '@/server/auth/current-customer';
import {
  createMembershipRequest,
  MembershipError,
  payMembershipFromWallet,
} from '@/server/services/membershipJoinService';

const schema = z.object({
  planKey: z.string().trim().min(1).max(40),
  method: z.enum(['transfer', 'wallet']),
});

export async function POST(req: Request) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: 'Bạn cần đăng nhập.' }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu chưa hợp lệ.' }, { status: 400 });

  try {
    if (parsed.data.method === 'wallet') {
      const balance = await payMembershipFromWallet(session.sub, parsed.data.planKey);
      return NextResponse.json({ ok: true, method: 'wallet', balance });
    }
    const request = await createMembershipRequest(session.sub, parsed.data.planKey);
    return NextResponse.json({ ok: true, method: 'transfer', request });
  } catch (e) {
    if (e instanceof MembershipError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi đăng ký hội viên.' }, { status: 500 });
  }
}
