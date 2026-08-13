import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createLead } from '@/server/services/leadService';

/**
 * Ghi yêu cầu từ form public (liên hệ/doanh nghiệp/tour/đại lý) vào DB.
 * Được gọi song song với localStorage; lỗi thì bỏ qua để không chặn khách.
 */
const schema = z.object({
  type: z.string().trim().min(1).max(40),
  summary: z.string().trim().min(1).max(300),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }
  try {
    const { id } = await createLead(parsed.data);
    return NextResponse.json({ ok: true, id });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
