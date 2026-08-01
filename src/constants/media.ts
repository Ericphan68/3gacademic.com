/**
 * Registry ảnh tập trung.
 *
 * Toàn bộ component tham chiếu ảnh qua object này, không hard-code đường dẫn.
 * Khi có ảnh thật: thay giá trị bên dưới bằng URL CDN (nhớ thêm host vào
 * `images.remotePatterns` trong next.config.ts) hoặc ghi đè file trong
 * /public/images với cùng tên.
 */
export const MEDIA = {
  hero: {
    home: '/images/hero-range.jpg',
    academy: '/images/hero-academy.jpg',
    corporate: '/images/hero-corporate.jpg',
    tour: '/images/hero-tour.jpg',
    events: '/images/hero-events.jpg',
    membership: '/images/hero-membership.jpg',
    about: '/images/hero-about.jpg',
    lounge: '/images/hero-lounge.jpg',
    contact: '/images/hero-contact.jpg',
    auth: '/images/hero-auth.jpg',
  },
  facility: {
    'driving-range': '/images/facility-driving-range.jpg',
    'putting-green': '/images/facility-putting-green.jpg',
    'short-game': '/images/facility-short-game.jpg',
    'private-bay': '/images/facility-private-bay.jpg',
    'vip-area': '/images/facility-vip-area.jpg',
    lounge: '/images/facility-lounge.jpg',
    academy: '/images/facility-academy.jpg',
    networking: '/images/facility-networking.jpg',
  },
  section: {
    serviceCulture: '/images/service-culture.jpg',
    appBackdrop: '/images/app-backdrop.jpg',
    testimonial: '/images/testimonial-bg.jpg',
  },
  ogDefault: '/images/og-default.jpg',
  logoMark: '/lotus-mark.svg',
} as const;

/** Gallery 3 ảnh cho mỗi gói trải nghiệm. */
export function experienceGallery(slug: string): string[] {
  return [1, 2, 3].map((n) => `/images/experience/${slug}-${n}.jpg`);
}

export function coachAvatar(index: number): string {
  return `/images/coaches/coach-${index}.jpg`;
}

export function eventBanner(index: number): string {
  return `/images/events/event-${index}.jpg`;
}

export function fnbImage(index: number): string {
  return `/images/food/item-${index}.jpg`;
}

export function tourImage(index: number): string {
  return `/images/tours/tour-${index}.jpg`;
}

export function corporateImage(index: number): string {
  return `/images/corporate/pkg-${index}.jpg`;
}

export function academyImage(index: number): string {
  return `/images/academy/program-${index}.jpg`;
}

export function membershipImage(tier: string): string {
  return `/images/membership/${tier}.jpg`;
}

export function voucherImage(category: string): string {
  return `/images/vouchers/${category}.jpg`;
}

/**
 * Blur placeholder dùng chung — tránh nhấp nháy khi ảnh tải.
 * SVG 8x6 màu navy nhạt, mã hoá sẵn base64 để dùng được cả trên client.
 */
export const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjYiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjYiIGZpbGw9IiMxYjNkNTIiLz48L3N2Zz4=';
