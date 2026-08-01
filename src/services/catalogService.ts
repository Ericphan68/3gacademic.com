/**
 * Service layer cho dữ liệu danh mục (đọc-only).
 *
 * Hiện đọc từ mock data trong `src/data`. Khi có backend:
 * thay phần thân mỗi hàm bằng `fetch(...)` và giữ nguyên chữ ký —
 * component không phải sửa gì.
 */
import { ACADEMY_PROGRAMS } from '@/data/academy';
import { BOOKING_ADD_ONS, BOOKING_EXPERIENCE_TYPES, PRACTICE_ZONES } from '@/data/booking-options';
import { COACHES } from '@/data/coaches';
import { CORPORATE_PACKAGES } from '@/data/corporate';
import { EVENTS } from '@/data/events';
import { EXPERIENCES } from '@/data/experiences';
import { FNB_ITEMS } from '@/data/fnb';
import { MEMBERSHIP_TIERS } from '@/data/memberships';
import { TOUR_PACKAGES } from '@/data/tours';
import { VOUCHERS } from '@/data/vouchers';
import { matchesQuery } from '@/lib/utils';
import type {
  AudienceTag,
  Coach,
  CoachLanguage,
  CoachSpecialty,
  EventType,
  ExperiencePackage,
  FnbCategory,
  GolfEvent,
  MembershipTier,
  MembershipTierId,
  Voucher,
  VoucherCategory,
  ZoneId,
} from '@/types';

/* ---------------- Trải nghiệm ---------------- */

export const experienceService = {
  getAll(): ExperiencePackage[] {
    return EXPERIENCES;
  },
  getFeatured(limit = 6): ExperiencePackage[] {
    return EXPERIENCES.filter((item) => item.featured).slice(0, limit);
  },
  getBySlug(slug: string): ExperiencePackage | undefined {
    return EXPERIENCES.find((item) => item.slug === slug);
  },
  filter(options: { audience?: AudienceTag | 'all'; query?: string }): ExperiencePackage[] {
    return EXPERIENCES.filter((item) => {
      const audienceOk =
        !options.audience || options.audience === 'all' || item.audiences.includes(options.audience);
      const queryOk = matchesQuery(options.query ?? '', item.name, item.tagline, item.description);
      return audienceOk && queryOk;
    });
  },
};

/* ---------------- Huấn luyện viên ---------------- */

export interface CoachFilters {
  query?: string;
  specialty?: CoachSpecialty | 'all';
  language?: CoachLanguage | 'all';
  maxPrice?: number;
  minRating?: number;
  sort?: 'recommended' | 'price-asc' | 'price-desc' | 'rating' | 'experience';
}

export const coachService = {
  getAll(): Coach[] {
    return COACHES;
  },
  getFeatured(limit = 6): Coach[] {
    return COACHES.filter((coach) => coach.featured).slice(0, limit);
  },
  getBySlug(slug: string): Coach | undefined {
    return COACHES.find((coach) => coach.slug === slug);
  },
  getById(id: string): Coach | undefined {
    return COACHES.find((coach) => coach.id === id);
  },
  filter(filters: CoachFilters): Coach[] {
    const result = COACHES.filter((coach) => {
      if (!matchesQuery(filters.query ?? '', coach.name, coach.title, coach.bio)) return false;
      if (filters.specialty && filters.specialty !== 'all' && !coach.specialties.includes(filters.specialty))
        return false;
      if (filters.language && filters.language !== 'all' && !coach.languages.includes(filters.language))
        return false;
      if (filters.maxPrice && coach.pricePerSession > filters.maxPrice) return false;
      if (filters.minRating && coach.rating < filters.minRating) return false;
      return true;
    });

    switch (filters.sort) {
      case 'price-asc':
        return [...result].sort((a, b) => a.pricePerSession - b.pricePerSession);
      case 'price-desc':
        return [...result].sort((a, b) => b.pricePerSession - a.pricePerSession);
      case 'rating':
        return [...result].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      case 'experience':
        return [...result].sort((a, b) => b.yearsExperience - a.yearsExperience);
      default:
        return [...result].sort(
          (a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
        );
    }
  },
  /** Gợi ý HLV cho một loại trải nghiệm — chỗ để cắm mô hình thật sau này. */
  recommend(experience: string, limit = 3): Coach[] {
    const map: Record<string, CoachSpecialty> = {
      coaching: 'beginner',
      putting: 'putting',
      'golf-3in1': 'swing',
      vip: 'business',
      corporate: 'business',
      range: 'swing',
      event: 'competition',
    };
    const specialty = map[experience] ?? 'beginner';
    return COACHES.filter((coach) => coach.specialties.includes(specialty))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  },
};

/* ---------------- Hội viên ---------------- */

export const membershipService = {
  getAll(): MembershipTier[] {
    return MEMBERSHIP_TIERS;
  },
  getById(id: MembershipTierId): MembershipTier | undefined {
    return MEMBERSHIP_TIERS.find((tier) => tier.id === id);
  },
};

/* ---------------- Voucher ---------------- */

export const voucherCatalogService = {
  getAll(): Voucher[] {
    return VOUCHERS;
  },
  getByCode(code: string): Voucher | undefined {
    return VOUCHERS.find((voucher) => voucher.code.toUpperCase() === code.trim().toUpperCase());
  },
  getById(id: string): Voucher | undefined {
    return VOUCHERS.find((voucher) => voucher.id === id);
  },
  filter(options: { category?: VoucherCategory | 'all'; tab?: 'all' | 'hot' | 'ending' | 'member' }): Voucher[] {
    return VOUCHERS.filter((voucher) => {
      if (options.category && options.category !== 'all' && voucher.category !== options.category)
        return false;
      if (options.tab === 'hot' && !voucher.hot) return false;
      if (options.tab === 'ending' && voucher.soldQuantity / voucher.totalQuantity < 0.8) return false;
      if (options.tab === 'member' && !voucher.memberOnly) return false;
      return true;
    });
  },
};

/* ---------------- Sự kiện ---------------- */

export const eventService = {
  getAll(): GolfEvent[] {
    return EVENTS;
  },
  getUpcoming(limit = 4): GolfEvent[] {
    return [...EVENTS]
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
      .slice(0, limit);
  },
  getBySlug(slug: string): GolfEvent | undefined {
    return EVENTS.find((event) => event.slug === slug);
  },
  filter(options: { type?: EventType | 'all'; query?: string }): GolfEvent[] {
    return EVENTS.filter((event) => {
      if (options.type && options.type !== 'all' && event.type !== options.type) return false;
      return matchesQuery(options.query ?? '', event.title, event.summary, event.location);
    });
  },
};

/* ---------------- F&B ---------------- */

export const fnbService = {
  getAll() {
    return FNB_ITEMS;
  },
  filter(options: { category?: FnbCategory | 'all'; query?: string; popularOnly?: boolean }) {
    return FNB_ITEMS.filter((item) => {
      if (options.category && options.category !== 'all' && item.category !== options.category)
        return false;
      if (options.popularOnly && !item.popular) return false;
      return matchesQuery(options.query ?? '', item.name, item.description, item.partner);
    });
  },
  getById(id: string) {
    return FNB_ITEMS.find((item) => item.id === id);
  },
};

/* ---------------- Booking options ---------------- */

export const bookingOptionService = {
  getExperienceTypes() {
    return BOOKING_EXPERIENCE_TYPES;
  },
  getExperienceType(id: string) {
    return BOOKING_EXPERIENCE_TYPES.find((item) => item.id === id);
  },
  getZones() {
    return PRACTICE_ZONES;
  },
  getZone(id: ZoneId) {
    return PRACTICE_ZONES.find((zone) => zone.id === id);
  },
  getAddOns() {
    return BOOKING_ADD_ONS;
  },
  getAddOn(id: string) {
    return BOOKING_ADD_ONS.find((addOn) => addOn.id === id);
  },
};

/* ---------------- Academy / Corporate / Tour ---------------- */

export const academyService = {
  getPrograms() {
    return ACADEMY_PROGRAMS;
  },
  getProgram(id: string) {
    return ACADEMY_PROGRAMS.find((program) => program.id === id);
  },
};

export const corporateService = {
  getPackages() {
    return CORPORATE_PACKAGES;
  },
  getPackage(slug: string) {
    return CORPORATE_PACKAGES.find((pkg) => pkg.slug === slug);
  },
};

export const tourService = {
  getPackages() {
    return TOUR_PACKAGES;
  },
  getPackage(slug: string) {
    return TOUR_PACKAGES.find((pkg) => pkg.slug === slug);
  },
};
