import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { markBookingPaid, setBookingStatus } from '@/server/services/bookingService';

const schema = z.object({
  id: z.string().trim().min(1),
  action: z.enum(['mark-paid', 'set-status']),
  status: z
    .enum(['PENDING', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'])
    .optional(),
});

export async function PATCH(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'booking.update')) {
    return NextResponse.json({ error: 'Không có quyền sửa booking.' }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { id, action, status } = parsed.data;
  try {
    if (action === 'mark-paid') {
      await markBookingPaid(id);
    } else {
      if (!status) return NextResponse.json({ error: 'Thiếu trạng thái.' }, { status: 400 });
      await setBookingStatus(id, status);
    }
    revalidatePath('/admin/bookings');
    revalidatePath('/admin');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật booking.' }, { status: 500 });
  }
}
