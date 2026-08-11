import 'server-only';

import { MEMBERSHIP_TIERS } from '@/data/memberships';
import { prisma } from '@/server/db';
import type { MembershipTier, MembershipTierId } from '@/types';

/**
 * Nguồn dữ liệu gói hội viên cho website public.
 *
 * Cách hoạt động (migrate an toàn):
 * - Lấy phần "quản trị được" (giá, % ưu đãi, tên, tagline, featured, thứ tự)
 *   từ DATABASE.
 * - Ghép lên trên dữ liệu mock gốc để GIỮ NGUYÊN các trường mô tả/giao diện
 *   chưa đưa vào Admin (benefits, ảnh, concierge, limited countdown...).
 * - Nếu DB lỗi/trống → trả về mock. Public không bao giờ vỡ.
 */

/** Các trường Admin được phép sửa. */
export interface MembershipManagedInput {
  name?: string;
  tagline?: string;
  price?: number; // = topUpAmount
  bonusPercent?: number;
  courtDiscountPercent?: number;
  coachDiscountPercent?: number;
  fnbDiscountPercent?: number;
  advanceBookingDays?: number;
  durationMonths?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  sortOrder?: number;
}

export async function getManagedTiers(): Promise<MembershipTier[]> {
  try {
    const plans = await prisma.membershipPlan.findMany({ where: { deletedAt: null } });
    if (plans.length === 0) return MEMBERSHIP_TIERS;

    const byKey = new Map(plans.map((plan) => [plan.key, plan]));

    return MEMBERSHIP_TIERS.map((tier) => {
      const plan = byKey.get(tier.id);
      if (!plan) return tier;
      return {
        ...tier,
        name: plan.name,
        tagline: plan.tagline ?? tier.tagline,
        topUpAmount: plan.price,
        bonusPercent: plan.bonusPercent,
        courtDiscountPercent: plan.courtDiscountPercent,
        coachDiscountPercent: plan.coachDiscountPercent,
        fnbDiscountPercent: plan.fnbDiscountPercent,
        advanceBookingDays: plan.advanceBookingDays,
        validityMonths: plan.durationMonths,
        highlight: plan.isFeatured ? (tier.highlight ?? 'Được chọn nhiều nhất') : tier.highlight,
      } satisfies MembershipTier;
    })
      .filter((tier) => {
        const plan = byKey.get(tier.id);
        return plan ? plan.isActive : true;
      })
      .sort((a, b) => {
        const sa = byKey.get(a.id)?.sortOrder ?? 0;
        const sb = byKey.get(b.id)?.sortOrder ?? 0;
        return sa - sb;
      });
  } catch {
    // DB không sẵn sàng → dùng mock để public luôn hiển thị được.
    return MEMBERSHIP_TIERS;
  }
}

/** Danh sách gói cho trang Admin (đọc thẳng từ DB). */
export async function listMembershipPlans() {
  return prisma.membershipPlan.findMany({
    where: { deletedAt: null },
    orderBy: { sortOrder: 'asc' },
  });
}

/** Cập nhật một gói theo key (starter/member/premium/founder). */
export async function updateMembershipPlan(key: MembershipTierId | string, input: MembershipManagedInput) {
  return prisma.membershipPlan.update({
    where: { key },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.tagline !== undefined ? { tagline: input.tagline } : {}),
      ...(input.price !== undefined ? { price: input.price } : {}),
      ...(input.bonusPercent !== undefined ? { bonusPercent: input.bonusPercent } : {}),
      ...(input.courtDiscountPercent !== undefined ? { courtDiscountPercent: input.courtDiscountPercent } : {}),
      ...(input.coachDiscountPercent !== undefined ? { coachDiscountPercent: input.coachDiscountPercent } : {}),
      ...(input.fnbDiscountPercent !== undefined ? { fnbDiscountPercent: input.fnbDiscountPercent } : {}),
      ...(input.advanceBookingDays !== undefined ? { advanceBookingDays: input.advanceBookingDays } : {}),
      ...(input.durationMonths !== undefined ? { durationMonths: input.durationMonths } : {}),
      ...(input.isFeatured !== undefined ? { isFeatured: input.isFeatured } : {}),
      ...(input.isActive !== undefined ? { isActive: input.isActive } : {}),
      ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
    },
  });
}
