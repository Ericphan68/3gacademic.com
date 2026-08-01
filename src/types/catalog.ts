import type { FaqItem, ID } from './common';

/* ============================================================
   TRẢI NGHIỆM GOLF
   ============================================================ */

export type AudienceTag =
  | 'beginner'
  | 'friends'
  | 'family'
  | 'junior'
  | 'business'
  | 'vip'
  | 'corporate';

export interface ExperiencePackage {
  id: ID;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  compareAtPrice?: number;
  durationMinutes: number;
  minGuests: number;
  maxGuests: number;
  audiences: AudienceTag[];
  includes: string[];
  excludes: string[];
  reschedulePolicy: string;
  highlights: string[];
  gallery: string[];
  faqs: FaqItem[];
  featured: boolean;
  badge?: string;
}

/* ============================================================
   HUẤN LUYỆN VIÊN
   ============================================================ */

export type CoachSpecialty =
  | 'beginner'
  | 'junior'
  | 'advanced'
  | 'putting'
  | 'swing'
  | 'short-game'
  | 'competition'
  | 'business';

export type CoachLanguage = 'vi' | 'en' | 'ko' | 'ja';

export interface CoachReview {
  id: ID;
  author: string;
  rating: number;
  date: string;
  content: string;
}

export interface CoachAvailabilitySlot {
  /** ISO date: yyyy-MM-dd */
  date: string;
  /** HH:mm */
  times: string[];
}

export interface Coach {
  id: ID;
  slug: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  philosophy: string;
  yearsExperience: number;
  specialties: CoachSpecialty[];
  languages: CoachLanguage[];
  rating: number;
  reviewCount: number;
  studentCount: number;
  pricePerSession: number;
  certifications: string[];
  careerHighlights: string[];
  suitableFor: string[];
  programs: CoachProgram[];
  reviews: CoachReview[];
  faqs: FaqItem[];
  referralCode: string;
  featured: boolean;
  introVideoNote: string;
}

export interface CoachProgram {
  id: ID;
  name: string;
  sessions: number;
  price: number;
  description: string;
}

/* ============================================================
   HỘI VIÊN
   ============================================================ */

export type MembershipTierId = 'starter' | 'member' | 'premium' | 'founder';

export interface MembershipBenefit {
  label: string;
  value: string;
  included: boolean;
}

export interface MembershipTier {
  id: MembershipTierId;
  name: string;
  tagline: string;
  topUpAmount: number;
  bonusPercent: number;
  courtDiscountPercent: number;
  coachDiscountPercent: number;
  fnbDiscountPercent: number;
  advanceBookingDays: number;
  priorityWindow: string;
  eventInvites: number;
  birthdayGift: string;
  concierge: boolean;
  cancellationPolicy: string;
  validityMonths: number;
  benefits: MembershipBenefit[];
  highlight?: string;
  image: string;
  limited?: {
    total: number;
    remaining: number;
    /** ISO datetime kết thúc ưu đãi (demo) */
    endsAt: string;
  };
}

/* ============================================================
   VOUCHER
   ============================================================ */

export type VoucherCategory =
  | 'new-member'
  | 'flash-sale'
  | 'off-peak'
  | 'coach-package'
  | 'fnb'
  | 'event'
  | 'corporate'
  | 'gift';

export type VoucherDiscountType = 'percent' | 'amount';

export interface Voucher {
  id: ID;
  code: string;
  name: string;
  description: string;
  category: VoucherCategory;
  /** Giá bán voucher (0 = miễn phí nhận) */
  price: number;
  /** Giá trị quy đổi hiển thị */
  faceValue: number;
  discountType: VoucherDiscountType;
  discountValue: number;
  maxDiscount?: number;
  minOrder: number;
  expiresAt: string;
  conditions: string[];
  totalQuantity: number;
  soldQuantity: number;
  memberOnly: boolean;
  hot: boolean;
  image: string;
}

/* ============================================================
   SỰ KIỆN
   ============================================================ */

export type EventType =
  | 'tournament'
  | 'coach-tournament'
  | 'student-tournament'
  | 'corporate-golf-day'
  | 'networking'
  | 'junior-golf-day'
  | 'workshop'
  | 'demo-day'
  | 'grand-opening';

export interface EventScheduleItem {
  time: string;
  title: string;
  detail: string;
}

export interface GolfEvent {
  id: ID;
  slug: string;
  title: string;
  type: EventType;
  summary: string;
  description: string;
  banner: string;
  /** ISO datetime */
  startsAt: string;
  endsAt: string;
  location: string;
  fee: number;
  capacity: number;
  registered: number;
  audience: string;
  schedule: EventScheduleItem[];
  rules: string[];
  benefits: string[];
  prizes: string[];
  sponsors: string[];
  participants: { name: string; note: string }[];
  faqs: FaqItem[];
}

/* ============================================================
   F&B
   ============================================================ */

export type FnbCategory =
  | 'coffee'
  | 'cold-brew'
  | 'tea'
  | 'water'
  | 'energy-bar'
  | 'bento-jp'
  | 'bento-kr'
  | 'snack'
  | 'healthy';

export interface FnbItem {
  id: ID;
  name: string;
  category: FnbCategory;
  description: string;
  price: number;
  image: string;
  partner?: string;
  tags: string[];
  calories?: number;
  available: boolean;
  popular: boolean;
}

/* ============================================================
   DOANH NGHIỆP & GOLF TOUR
   ============================================================ */

export interface CorporatePackage {
  id: ID;
  slug: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  idealGroupSize: string;
  durationNote: string;
  priceFrom: number;
  includes: string[];
  outcomes: string[];
}

export interface CorporateCaseStudy {
  id: ID;
  industry: string;
  headline: string;
  challenge: string;
  solution: string;
  result: string;
  participants: number;
}

export interface TourItineraryItem {
  time: string;
  activity: string;
}

export interface TourPackage {
  id: ID;
  slug: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  priceFrom: number;
  durationLabel: string;
  minPax: number;
  maxPax: number;
  includes: string[];
  itinerary: TourItineraryItem[];
  partners: string[];
}

/* ============================================================
   ACADEMY
   ============================================================ */

export type AcademyLevel = 'foundation' | 'improver' | 'advanced' | 'competition';

export interface AcademyProgram {
  id: ID;
  name: string;
  level: AcademyLevel;
  audience: string;
  sessions: number;
  durationMinutes: number;
  priceFrom: number;
  groupSize: string;
  summary: string;
  outcomes: string[];
  icon: string;
}

export interface AcademyJourneyStep {
  step: number;
  title: string;
  description: string;
}

/* ============================================================
   KHU VỰC TẬP LUYỆN
   ============================================================ */

export type ZoneId = 'driving-range' | 'putting-green' | 'short-game' | 'private-bay' | 'vip-area';

export interface PracticeZone {
  id: ZoneId;
  name: string;
  description: string;
  image: string;
  capacityNote: string;
  surcharge: number;
  features: string[];
}
