import type { ID } from './common';
import type { ZoneId } from './catalog';

/* ============================================================
   LUỒNG ĐẶT LỊCH
   ============================================================ */

export type BookingExperienceType =
  | 'range'
  | 'coaching'
  | 'putting'
  | 'golf-3in1'
  | 'vip'
  | 'event'
  | 'corporate';

export type SlotStatus = 'available' | 'filling' | 'full';
export type SlotPricing = 'off-peak' | 'standard' | 'peak';

export interface TimeSlot {
  /** HH:mm */
  time: string;
  status: SlotStatus;
  pricing: SlotPricing;
  /** Hệ số nhân giá theo khung giờ */
  priceMultiplier: number;
  seatsLeft: number;
}

export interface DayMeta {
  /** yyyy-MM-dd */
  date: string;
  isPeak: boolean;
  hasPromotion: boolean;
  promotionLabel?: string;
}

export interface AddOnItem {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  max: number;
  icon: string;
}

export interface BookingAddOnSelection {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface BookingContact {
  fullName: string;
  phone: string;
  email: string;
  note: string;
  isFirstTime: boolean;
}

export type PaymentMethod = 'wallet' | 'transfer' | 'card' | 'at-center';

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface BookingPriceBreakdown {
  base: number;
  zoneSurcharge: number;
  coachFee: number;
  addOns: number;
  subtotal: number;
  membershipDiscount: number;
  voucherDiscount: number;
  walletApplied: number;
  total: number;
}

export interface Booking {
  id: ID;
  /** Mã hiển thị cho khách, ví dụ LG-8F3K2Q */
  code: string;
  experienceType: BookingExperienceType;
  experienceLabel: string;
  /** yyyy-MM-dd */
  date: string;
  /** HH:mm */
  time: string;
  durationMinutes: number;
  zoneId: ZoneId;
  zoneName: string;
  coachId: ID | null;
  coachName: string | null;
  guests: number;
  addOns: BookingAddOnSelection[];
  voucherCode: string | null;
  contact: BookingContact;
  paymentMethod: PaymentMethod;
  price: BookingPriceBreakdown;
  status: BookingStatus;
  createdAt: string;
  /** Payload mã hoá vào QR check-in (demo) */
  qrPayload: string;
}

/** State của form booking nhiều bước (giữ trong Zustand). */
export interface BookingDraft {
  step: number;
  experienceType: BookingExperienceType | null;
  date: string | null;
  time: string | null;
  zoneId: ZoneId | null;
  coachId: ID | null;
  guests: number;
  addOns: Record<string, number>;
  voucherCode: string | null;
  useWallet: boolean;
  contact: BookingContact;
  paymentMethod: PaymentMethod;
  acceptedTerms: boolean;
}
