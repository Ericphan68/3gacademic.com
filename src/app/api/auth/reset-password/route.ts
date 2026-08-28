import { NextResponse } from 'next/server';
import { z } from 'zod';

import { resetPasswordWithToken } from '@/server/services/passwordResetService';

const schema = z.object({
  token: z.string().trim().min(1),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').max(100),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu chưa hợp lệ.' }, { status: 400 });
  }

  const result = await resetPasswordWithToken(parsed.data.token, parsed.data.password).catch(() => 'invalid' as const);

  if (result === 'ok') return NextResponse.json({ ok: true });
  if (result === 'expired') {
    return NextResponse.json({ error: 'Link đặt lại đã hết hạn. Vui lòng yêu cầu link mới.' }, { status: 400 });
  }
  return NextResponse.json({ error: 'Link đặt lại không hợp lệ. Vui lòng yêu cầu link mới.' }, { status: 400 });
}
