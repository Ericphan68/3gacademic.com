import type { ID } from './common';
import type { MembershipTierId, VoucherCategory } from './catalog';

/* ============================================================
   TÀI KHOẢN & DASHBOARD
   ============================================================ */

export type UserRole = 'customer' | 'coach';
export type Handedness = 'right' | 'left';
export type GolfLevel = 'never' | 'beginner' | 'intermediate' | 'advanced';

export interface UserPreferences {
  drink: string;
  handedness: Handedness;
  golfLevel: GolfLevel;
  goal: string;
  language: 'vi' | 'en';
  notifyEmail: boolean;
  notifyZalo: boolean;
  notifyPromotions: boolean;
}

export interface User {
  id: ID;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string;
  avatarInitials: string;
  joinedAt: string;
  membershipTier: MembershipTierId | null;
  membershipExpiresAt: string | null;
  walletBalance: number;
  loyaltyPoints: number;
  preferences: UserPreferences;
  /** Slug hồ sơ HLV, chỉ có khi role = 'coach' */
  coachSlug?: string;
}

export type TransactionType = 'top-up' | 'bonus' | 'payment' | 'refund' | 'voucher-purchase';

export interface WalletTransaction {
  id: ID;
  type: TransactionType;
  label: string;
  amount: number;
  balanceAfter: number;
  createdAt: string;
  reference?: string;
}

export type OwnedVoucherStatus = 'active' | 'used' | 'expired' | 'gifted';

export interface OwnedVoucher {
  id: ID;
  voucherId: ID;
  code: string;
  name: string;
  category: VoucherCategory;
  faceValue: number;
  discountLabel: string;
  expiresAt: string;
  status: OwnedVoucherStatus;
  acquiredAt: string;
  giftedTo?: string;
}

export type LessonStatus = 'scheduled' | 'completed' | 'cancelled';

export interface LessonRecord {
  id: ID;
  coachId: ID;
  coachName: string;
  programName: string;
  /** yyyy-MM-dd */
  date: string;
  time: string;
  status: LessonStatus;
  focus: string;
  coachNote: string;
  homework: string;
  progressScore: number;
}

export interface EventRegistration {
  id: ID;
  eventId: ID;
  eventSlug: string;
  eventTitle: string;
  startsAt: string;
  location: string;
  attendees: number;
  fee: number;
  registeredAt: string;
  qrPayload: string;
}

export interface FnbOrderItem {
  id: ID;
  name: string;
  quantity: number;
  price: number;
}

export type FnbDeliveryTarget = 'bay' | 'lounge' | 'pickup';

export interface FnbOrder {
  id: ID;
  code: string;
  items: FnbOrderItem[];
  total: number;
  deliveryTarget: FnbDeliveryTarget;
  bayNumber?: string;
  scheduledTime: string;
  note: string;
  createdAt: string;
  status: 'preparing' | 'delivered';
}

export interface MembershipRecord {
  tierId: MembershipTierId;
  purchasedAt: string;
  expiresAt: string;
  topUpAmount: number;
  bonusAmount: number;
}

/* ============================================================
   YÊU CẦU DOANH NGHIỆP / TOUR / ĐẠI LÝ
   ============================================================ */

export type LeadType = 'corporate' | 'tour-group' | 'agency' | 'contact';

export interface LeadRequest {
  id: ID;
  type: LeadType;
  createdAt: string;
  summary: string;
  payload: Record<string, string | number | boolean>;
  status: 'received';
}

/* ============================================================
   COACH PORTAL
   ============================================================ */

export interface CoachStudent {
  id: ID;
  name: string;
  initials: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  programName: string;
  sessionsTotal: number;
  sessionsRemaining: number;
  lastLessonDate: string;
  note: string;
  joinedAt: string;
  referredByCoach: boolean;
}

export interface CoachScheduleEntry {
  id: ID;
  /** yyyy-MM-dd */
  date: string;
  /** HH:mm */
  time: string;
  durationMinutes: number;
  studentName: string | null;
  type: 'lesson' | 'available' | 'blocked';
  zoneName: string;
}

export type CommissionStatus = 'confirmed' | 'pending';

export interface CommissionRecord {
  id: ID;
  date: string;
  source: 'lesson' | 'referral' | 'package' | 'event';
  label: string;
  grossAmount: number;
  commissionAmount: number;
  status: CommissionStatus;
}

export interface CoachReferral {
  id: ID;
  studentName: string;
  joinedAt: string;
  firstBookingAt: string | null;
  lifetimeValue: number;
  status: 'active' | 'inactive';
}

export interface CoachMetrics {
  totalStudents: number;
  newStudentsThisMonth: number;
  lessonsToday: number;
  revenueThisMonth: number;
  commissionThisMonth: number;
  commissionPending: number;
  rating: number;
  rankThisMonth: number;
  rankTotal: number;
  monthlySeries: { month: string; revenue: number; commission: number; lessons: number }[];
}
