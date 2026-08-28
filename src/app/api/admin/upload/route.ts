import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { prisma } from '@/server/db';
import { roleHasPermission } from '@/server/rbac';

// Nhận ảnh dạng dataURL (client đã nén nhỏ), lưu bytes vào DB, trả về link công khai.
const uploadSchema = z.object({
  dataUrl: z
    .string()
    .regex(/^data:image\/(png|jpe?g|webp|gif);base64,/i, 'Chỉ nhận ảnh PNG/JPG/WEBP/GIF.'),
});

// Giới hạn 1MB sau khi giải mã base64 (client đã nén xuống ~200KB trước khi gửi).
const MAX_BYTES = 1 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'content.update')) {
    return NextResponse.json({ error: 'Không có quyền tải ảnh.' }, { status: 403 });
  }

  const parsed = uploadSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const [, mimeType] = /^data:([^;]+);base64,/i.exec(parsed.data.dataUrl) ?? [];
  const base64 = parsed.data.dataUrl.slice(parsed.data.dataUrl.indexOf(',') + 1);
  const data = Buffer.from(base64, 'base64');

  if (!mimeType || data.length === 0) {
    return NextResponse.json({ error: 'Ảnh không hợp lệ.' }, { status: 400 });
  }
  if (data.length > MAX_BYTES) {
    return NextResponse.json({ error: 'Ảnh quá lớn (tối đa 1MB). Vui lòng chọn ảnh nhỏ hơn.' }, { status: 413 });
  }

  try {
    const image = await prisma.imageBlob.create({
      data: { mimeType, data },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, url: `/api/media/${image.id}` });
  } catch {
    return NextResponse.json({ error: 'Lỗi lưu ảnh.' }, { status: 500 });
  }
}
