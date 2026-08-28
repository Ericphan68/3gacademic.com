import { NextResponse } from 'next/server';
import { z } from 'zod';

import { isEmailConfigured } from '@/server/email/brevo';
import { requestPasswordReset } from '@/server/services/passwordResetService';

const schema = z.object({ email: z.string().trim().email().max(160) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Email chưa hợp lệ.' }, { status: 400 });

  // Nếu hệ thống email chưa cấu hình -> báo client hiển thị hướng dẫn liên hệ hotline.
  if (!isEmailConfigured()) {
    return NextResponse.json({ ok: true, emailDisabled: true });
  }

  // Luôn trả ok để không tiết lộ email có tồn tại hay không.
  await requestPasswordReset(parsed.data.email).catch(() => {});
  return NextResponse.json({ ok: true });
}
