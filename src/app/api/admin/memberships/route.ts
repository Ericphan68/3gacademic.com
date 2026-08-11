import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { listMembershipPlans, updateMembershipPlan } from '@/server/services/membershipService';

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'membership.read')) {
    return NextResponse.json({ error: 'Không có quyền.' }, { status: 403 });
  }
  const plans = await listMembershipPlans();
  return NextResponse.json({ plans });
}

const updateSchema = z.object({
  key: z.string().min(1),
  name: z.string().trim().min(1).optional(),
  tagline: z.string().trim().optional(),
  price: z.number().int().min(0).optional(),
  bonusPercent: z.number().int().min(0).max(100).optional(),
  courtDiscountPercent: z.number().int().min(0).max(100).optional(),
  coachDiscountPercent: z.number().int().min(0).max(100).optional(),
  fnbDiscountPercent: z.number().int().min(0).max(100).optional(),
  advanceBookingDays: z.number().int().min(0).max(365).optional(),
  durationMonths: z.number().int().min(1).max(120).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'membership.update')) {
    return NextResponse.json({ error: 'Không có quyền sửa gói hội viên.' }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { key, ...input } = parsed.data;
  try {
    const plan = await updateMembershipPlan(key, input);
    // Làm mới cache trang public để hiển thị giá mới ngay.
    revalidatePath('/membership');
    revalidatePath('/');
    return NextResponse.json({ ok: true, plan });
  } catch {
    return NextResponse.json({ error: 'Không tìm thấy gói hoặc lỗi cập nhật.' }, { status: 404 });
  }
}
