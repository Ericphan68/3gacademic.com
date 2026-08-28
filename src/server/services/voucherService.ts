import 'server-only';

import { VOUCHERS } from '@/data/vouchers';
import { prisma } from '@/server/db';
import type { Voucher } from '@/types';

/**
 * Nguồn dữ liệu voucher cho website public.
 *
 * Cách hoạt động (migrate an toàn — giống membershipService):
 * - Lấy phần "quản trị được" (tên, mô tả, giá trị giảm, đơn tối thiểu, hạn dùng,
 *   hội viên, nổi bật, ẩn/hiện) từ DATABASE.
 * - Ghép lên trên dữ liệu mock gốc để GIỮ NGUYÊN các trường giao diện chưa đưa
 *   vào Admin (ảnh, nhóm, điều kiện, số lượng, loại giảm...).
 * - Nếu DB lỗi/trống → trả về mock. Public không bao giờ vỡ.
 */

/** Các trường Admin được phép sửa. */
export interface VoucherManagedInput {
  code: string;
  name: string;
  description: string;
  discountValue: number;
  minOrder: number;
  maxDiscount?: number | null;
  /** Hạn dùng dạng 'YYYY-MM-DD' (rỗng = không đổi). */
  expiresAt?: string;
  memberOnly: boolean;
  /** Đánh dấu "đang hot". */
  hot: boolean;
  /** Hiển thị trên website (false = ẩn khỏi trang /vouchers). */
  visible: boolean;
}

/** Một dòng voucher cho trang Admin (đã ghép DB + mock). */
export interface VoucherAdminRow {
  code: string;
  name: string;
  description: string;
  categoryLabel: string;
  discountType: Voucher['discountType'];
  discountValue: number;
  minOrder: number;
  maxDiscount: number | null;
  expiresAt: string;
  memberOnly: boolean;
  hot: boolean;
  visible: boolean;
}

const toDateInput = (d: Date): string => d.toISOString().slice(0, 10);

/** Ghép 1 voucher mock với bản ghi DB (nếu có), số đã bán tính THẬT từ redemption. */
function mergeVoucher(base: Voucher, row: DbVoucherRow | undefined, sold?: number): Voucher {
  const soldQuantity = typeof sold === 'number' ? Math.min(sold, base.totalQuantity) : base.soldQuantity;
  if (!row) return { ...base, soldQuantity };
  return {
    ...base,
    name: row.name,
    description: row.description ?? base.description,
    discountValue: row.discountValue,
    minOrder: row.minOrder,
    maxDiscount: row.maxDiscount ?? base.maxDiscount,
    expiresAt: row.endAt ? toDateInput(row.endAt) : base.expiresAt,
    memberOnly: row.memberOnly,
    hot: row.isFeatured,
    soldQuantity,
  };
}

interface DbVoucherRow {
  id: string;
  code: string;
  name: string;
  description: string | null;
  discountValue: number;
  minOrder: number;
  maxDiscount: number | null;
  endAt: Date | null;
  memberOnly: boolean;
  isFeatured: boolean;
  status: string;
}

async function loadRows(): Promise<Map<string, DbVoucherRow>> {
  const rows = await prisma.voucher.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      code: true,
      name: true,
      description: true,
      discountValue: true,
      minOrder: true,
      maxDiscount: true,
      endAt: true,
      memberOnly: true,
      isFeatured: true,
      status: true,
    },
  });
  return new Map(rows.map((r) => [r.code, r]));
}

/** Số lượt đã mua/đổi theo voucherId (kho thật). */
async function soldCounts(): Promise<Map<string, number>> {
  const grouped = await prisma.voucherRedemption.groupBy({ by: ['voucherId'], _count: { _all: true } });
  return new Map(grouped.map((g) => [g.voucherId, g._count._all]));
}

/** Danh sách voucher hiển thị cho public (ẩn voucher đã tắt), số đã bán là THẬT. */
export async function getManagedVouchers(): Promise<Voucher[]> {
  try {
    const [byCode, counts] = await Promise.all([loadRows(), soldCounts()]);
    if (byCode.size === 0) return VOUCHERS;

    return VOUCHERS.map((v) => {
      const row = byCode.get(v.code);
      const sold = row ? (counts.get(row.id) ?? 0) : undefined;
      return mergeVoucher(v, row, sold);
    }).filter((v) => {
      const row = byCode.get(v.code);
      // Có bản ghi DB và không ở trạng thái ACTIVE → ẩn khỏi website.
      return row ? row.status === 'ACTIVE' : true;
    });
  } catch {
    return VOUCHERS;
  }
}

/** Danh sách đầy đủ cho Admin (kèm cờ ẩn/hiện). */
export async function listVouchersForAdmin(): Promise<VoucherAdminRow[]> {
  const { VOUCHER_CATEGORY_LABELS } = await import('@/data/vouchers');
  let byCode = new Map<string, DbVoucherRow>();
  try {
    byCode = await loadRows();
  } catch {
    byCode = new Map();
  }

  return VOUCHERS.map((base) => {
    const row = byCode.get(base.code);
    const merged = mergeVoucher(base, row);
    return {
      code: merged.code,
      name: merged.name,
      description: merged.description,
      categoryLabel: VOUCHER_CATEGORY_LABELS[merged.category],
      discountType: merged.discountType,
      discountValue: merged.discountValue,
      minOrder: merged.minOrder,
      maxDiscount: merged.maxDiscount ?? null,
      expiresAt: merged.expiresAt,
      memberOnly: merged.memberOnly,
      hot: merged.hot,
      // Chưa có bản ghi DB → coi như đang hiển thị (theo mock).
      visible: row ? row.status === 'ACTIVE' : true,
    } satisfies VoucherAdminRow;
  });
}

/** Cập nhật (hoặc tạo mới) 1 voucher theo code. */
export async function updateVoucher(input: VoucherManagedInput) {
  const status: 'ACTIVE' | 'INACTIVE' = input.visible ? 'ACTIVE' : 'INACTIVE';
  const endAt = input.expiresAt ? new Date(input.expiresAt) : undefined;

  return prisma.voucher.upsert({
    where: { code: input.code },
    update: {
      name: input.name,
      description: input.description,
      discountValue: input.discountValue,
      minOrder: input.minOrder,
      ...(input.maxDiscount !== undefined ? { maxDiscount: input.maxDiscount } : {}),
      ...(endAt ? { endAt } : {}),
      memberOnly: input.memberOnly,
      isFeatured: input.hot,
      status,
    },
    create: {
      code: input.code,
      name: input.name,
      description: input.description,
      discountValue: input.discountValue,
      minOrder: input.minOrder,
      maxDiscount: input.maxDiscount ?? null,
      endAt: endAt ?? null,
      memberOnly: input.memberOnly,
      isFeatured: input.hot,
      status,
    },
  });
}
