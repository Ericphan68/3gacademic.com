import { NextResponse } from 'next/server';
import { z } from 'zod';

import { resendVerification } from '@/server/services/emailVerificationService';

const schema = z.object({ email: z.string().trim().email().max(160) });

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Email chưa hợp lệ.' }, { status: 400 });

  // Luôn trả ok để không tiết lộ email có tồn tại hay không.
  await resendVerification(parsed.data.email).catch(() => {});
  return NextResponse.json({ ok: true });
}
