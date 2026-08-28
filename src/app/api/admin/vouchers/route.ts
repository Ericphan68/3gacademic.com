import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getAdminSession } from '@/server/auth/current-admin';
import { roleHasPermission } from '@/server/rbac';
import { createVoucher, updateVoucher } from '@/server/services/voucherService';

const updateSchema = z.object({
  code: z.string().trim().min(1),
  name: z.string().trim().min(1),
  description: z.string().trim().max(500),
  discountValue: z.number().int().min(0),
  minOrder: z.number().int().min(0),
  maxDiscount: z.number().int().min(0).nullable().optional(),
  expiresAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày không hợp lệ')
    .optional()
    .or(z.literal('')),
  memberOnly: z.boolean(),
  hot: z.boolean(),
  visible: z.boolean(),
});

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'voucher.update')) {
    return NextResponse.json({ error: 'Không có quyền sửa voucher.' }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { expiresAt, ...rest } = parsed.data;
  try {
    await updateVoucher({ ...rest, expiresAt: expiresAt || undefined });
    // Làm mới trang /vouchers để hiển thị ưu đãi mới ngay.
    revalidatePath('/vouchers');
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Lỗi cập nhật voucher.' }, { status: 500 });
  }
}

const createSchema = z.object({
  code: z.string().trim().min(2, 'Mã voucher tối thiểu 2 ký tự').max(40),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500),
  discountType: z.enum(['percent', 'amount']),
  discountValue: z.number().int().min(0),
  minOrder: z.number().int().min(0),
  maxDiscount: z.number().int().min(0).nullable().optional(),
  totalQuantity: z.number().int().min(0),
  expiresAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày không hợp lệ')
    .optional()
    .or(z.literal('')),
  memberOnly: z.boolean(),
  hot: z.boolean(),
  visible: z.boolean(),
});

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 });
  if (!roleHasPermission(session.role, 'voucher.create')) {
    return NextResponse.json({ error: 'Không có quyền tạo voucher.' }, { status: 403 });
  }

  const parsed = createSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  const { expiresAt, ...rest } = parsed.data;
  try {
    const { code } = await createVoucher({ ...rest, expiresAt: expiresAt || undefined });
    revalidatePath('/vouchers');
    return NextResponse.json({ ok: true, code });
  } catch (e) {
    if (e instanceof Error && e.message === 'DUPLICATE') {
      return NextResponse.json({ error: 'Mã voucher đã tồn tại. Vui lòng chọn mã khác.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Lỗi tạo voucher.' }, { status: 500 });
  }
}
