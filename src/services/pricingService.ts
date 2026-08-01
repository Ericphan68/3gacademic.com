import { bookingOptionService, coachService, membershipService, voucherCatalogService } from './catalogService';

import { getTimeSlots } from '@/lib/availability';
import { roundMoney } from '@/lib/utils';
import type {
  BookingAddOnSelection,
  BookingDraft,
  BookingPriceBreakdown,
  MembershipTierId,
  Voucher,
} from '@/types';

export interface PricingContext {
  draft: BookingDraft;
  membershipTier: MembershipTierId | null;
  walletBalance: number;
}

export interface VoucherCheck {
  valid: boolean;
  voucher: Voucher | null;
  message: string;
}

/** Kiểm tra voucher với giá trị đơn hàng hiện tại. */
export function validateVoucher(code: string, subtotal: number, isMember: boolean): VoucherCheck {
  if (!code.trim()) return { valid: false, voucher: null, message: '' };

  const voucher = voucherCatalogService.getByCode(code);
  if (!voucher) {
    return { valid: false, voucher: null, message: 'Mã voucher không tồn tại.' };
  }
  if (voucher.memberOnly && !isMember) {
    return { valid: false, voucher, message: 'Voucher này chỉ dành cho hội viên Premium và Founder.' };
  }
  if (subtotal < voucher.minOrder) {
    return {
      valid: false,
      voucher,
      message: `Đơn tối thiểu ${new Intl.NumberFormat('vi-VN').format(voucher.minOrder)}đ để dùng mã này.`,
    };
  }
  if (voucher.soldQuantity >= voucher.totalQuantity) {
    return { valid: false, voucher, message: 'Voucher đã hết lượt sử dụng.' };
  }
  return { valid: true, voucher, message: `Đã áp dụng ${voucher.name}.` };
}

function discountFromVoucher(voucher: Voucher, subtotal: number): number {
  if (voucher.discountType === 'amount') return Math.min(voucher.discountValue, subtotal);
  const raw = (subtotal * voucher.discountValue) / 100;
  return Math.min(voucher.maxDiscount ?? raw, raw, subtotal);
}

/** Quy đổi lựa chọn add-on thành danh sách có tên và đơn giá. */
export function resolveAddOns(addOns: Record<string, number>): BookingAddOnSelection[] {
  return Object.entries(addOns)
    .filter(([, quantity]) => quantity > 0)
    .map(([id, quantity]) => {
      const addOn = bookingOptionService.getAddOn(id);
      return {
        id,
        name: addOn?.name ?? id,
        quantity,
        unitPrice: addOn?.price ?? 0,
      };
    });
}

/**
 * Tính toàn bộ bảng giá của một booking.
 * Đây là nơi duy nhất chứa logic giá — UI chỉ hiển thị kết quả.
 */
export function calculateBookingPrice(context: PricingContext): BookingPriceBreakdown {
  const { draft, membershipTier, walletBalance } = context;

  const experience = draft.experienceType
    ? bookingOptionService.getExperienceType(draft.experienceType)
    : undefined;
  const zone = draft.zoneId ? bookingOptionService.getZone(draft.zoneId) : undefined;
  const coach = draft.coachId ? coachService.getById(draft.coachId) : undefined;
  const tier = membershipTier ? membershipService.getById(membershipTier) : undefined;

  const slotMultiplier =
    draft.date && draft.time
      ? (getTimeSlots(draft.date).find((slot) => slot.time === draft.time)?.priceMultiplier ?? 1)
      : 1;

  const guests = Math.max(1, draft.guests);
  const base = roundMoney((experience?.basePrice ?? 0) * slotMultiplier * guests);
  const zoneSurcharge = roundMoney((zone?.surcharge ?? 0) * (draft.zoneId === 'vip-area' ? 1 : guests));
  const coachFee = coach ? coach.pricePerSession : 0;

  const addOnList = resolveAddOns(draft.addOns);
  const addOns = addOnList.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const subtotal = base + zoneSurcharge + coachFee + addOns;

  // Ưu đãi hội viên áp trên phần giờ tập + khu vực, và phần HLV theo tỷ lệ riêng.
  const membershipDiscount = tier
    ? roundMoney(
        ((base + zoneSurcharge) * tier.courtDiscountPercent) / 100 +
          (coachFee * tier.coachDiscountPercent) / 100,
      )
    : 0;

  const afterMembership = Math.max(0, subtotal - membershipDiscount);

  const voucherCheck = draft.voucherCode
    ? validateVoucher(draft.voucherCode, afterMembership, tier?.id === 'premium' || tier?.id === 'founder')
    : null;
  const voucherDiscount =
    voucherCheck?.valid && voucherCheck.voucher
      ? roundMoney(discountFromVoucher(voucherCheck.voucher, afterMembership))
      : 0;

  const afterVoucher = Math.max(0, afterMembership - voucherDiscount);
  const walletApplied = draft.useWallet ? Math.min(walletBalance, afterVoucher) : 0;
  const total = Math.max(0, afterVoucher - walletApplied);

  return {
    base,
    zoneSurcharge,
    coachFee,
    addOns,
    subtotal,
    membershipDiscount,
    voucherDiscount,
    walletApplied,
    total,
  };
}

/** Tính bonus khi nạp ví theo mức nạp và hạng hội viên. */
export function calculateTopUpBonus(amount: number, tier: MembershipTierId | null): number {
  const presetBonus = [
    { min: 50000000, percent: 18 },
    { min: 20000000, percent: 12 },
    { min: 10000000, percent: 8 },
    { min: 5000000, percent: 5 },
    { min: 0, percent: 0 },
  ].find((row) => amount >= row.min);

  const tierBonus = tier ? (membershipService.getById(tier)?.bonusPercent ?? 0) : 0;
  const percent = Math.max(presetBonus?.percent ?? 0, tierBonus);
  return roundMoney((amount * percent) / 100);
}

/** Ước tính tiết kiệm khi mua hội viên — dùng cho membership calculator. */
export function estimateMembershipSaving(input: {
  sessionsPerMonth: number;
  avgSessionPrice: number;
  lessonsPerMonth: number;
  avgLessonPrice: number;
  fnbPerMonth: number;
  tierId: MembershipTierId;
}): { monthlySpend: number; monthlySaving: number; yearlySaving: number; bonusValue: number } {
  const tier = membershipService.getById(input.tierId);
  if (!tier) {
    return { monthlySpend: 0, monthlySaving: 0, yearlySaving: 0, bonusValue: 0 };
  }

  const sessionSpend = input.sessionsPerMonth * input.avgSessionPrice;
  const lessonSpend = input.lessonsPerMonth * input.avgLessonPrice;
  const monthlySpend = sessionSpend + lessonSpend + input.fnbPerMonth;

  const monthlySaving = roundMoney(
    (sessionSpend * tier.courtDiscountPercent) / 100 +
      (lessonSpend * tier.coachDiscountPercent) / 100 +
      (input.fnbPerMonth * tier.fnbDiscountPercent) / 100,
  );

  const bonusValue = roundMoney((tier.topUpAmount * tier.bonusPercent) / 100);

  return {
    monthlySpend: roundMoney(monthlySpend),
    monthlySaving,
    yearlySaving: monthlySaving * 12,
    bonusValue,
  };
}
