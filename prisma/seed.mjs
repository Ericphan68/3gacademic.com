// ============================================================
// LOTUS GOLF — Seed bootstrap (chạy: npm run db:seed)
// Node thuần (ESM) để không phụ thuộc trình biên dịch TS.
// Idempotent: dùng upsert, chạy lại nhiều lần vẫn an toàn.
//
// Phase 1 chỉ seed dữ liệu HỆ THỐNG + CATALOG lõi mà Admin quản trị.
// Migrate đầy đủ catalog khách hàng (coaches/events/vouchers...) ở Phase 6.
// ============================================================
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ROLES = [
  { key: 'SUPER_ADMIN', name: 'Super Admin' },
  { key: 'ADMIN', name: 'Admin' },
  { key: 'MANAGER', name: 'Manager' },
  { key: 'RECEPTION', name: 'Reception / CX' },
  { key: 'COACH_MANAGER', name: 'Coach Manager' },
  { key: 'MARKETING', name: 'Marketing' },
  { key: 'ACCOUNTING', name: 'Accounting / Report' },
];

const SITE_SETTINGS = [
  { group: 'general', key: 'site.name', value: 'Lotus Golf Center' },
  { group: 'general', key: 'site.hotline', value: '1900 1990' },
  { group: 'general', key: 'site.email', value: 'hello@lotusgolf.vn' },
  { group: 'general', key: 'site.address', value: 'Số 8 Đại lộ Sen Vàng, Phường Lotus, TP. Hồ Chí Minh' },
  { group: 'general', key: 'site.openHours', value: '06:00 – 22:00' },
  { group: 'social', key: 'social.zalo', value: 'https://zalo.me/lotusgolf' },
  { group: 'social', key: 'social.facebook', value: '' },
  { group: 'social', key: 'social.instagram', value: '' },
  { group: 'social', key: 'social.youtube', value: '' },
  { group: 'social', key: 'social.tiktok', value: '' },
  { group: 'booking', key: 'booking.openHour', value: 6 },
  { group: 'booking', key: 'booking.closeHour', value: 22 },
  { group: 'booking', key: 'booking.intervalMinutes', value: 60 },
  { group: 'booking', key: 'booking.minAdvanceHours', value: 0 },
  { group: 'booking', key: 'booking.maxAdvanceDays', value: 60 },
  { group: 'booking', key: 'booking.cancellationHours', value: 4 },
  { group: 'seo', key: 'seo.defaultTitle', value: 'Lotus Golf Center' },
  { group: 'seo', key: 'seo.defaultDescription', value: 'Golf thông minh. Dịch vụ từ trái tim. Kết nối bền vững.' },
  { group: 'seo', key: 'seo.ogImage', value: '/images/og-default.jpg' },
];

const MEMBERSHIP_PLANS = [
  { key: 'starter', slug: 'starter', name: 'Starter', price: 0, bonusPercent: 0, courtDiscountPercent: 0, coachDiscountPercent: 0, fnbDiscountPercent: 0, durationMonths: 12, sortOrder: 1 },
  { key: 'member', slug: 'member', name: 'Lotus Member', price: 15000000, bonusPercent: 10, courtDiscountPercent: 15, coachDiscountPercent: 10, fnbDiscountPercent: 10, durationMonths: 12, sortOrder: 2, isFeatured: true },
  { key: 'premium', slug: 'premium', name: 'Lotus Premium', price: 30000000, bonusPercent: 15, courtDiscountPercent: 25, coachDiscountPercent: 20, fnbDiscountPercent: 15, durationMonths: 12, sortOrder: 3 },
  { key: 'founder', slug: 'founder', name: 'Founder', price: 50000000, bonusPercent: 18, courtDiscountPercent: 25, coachDiscountPercent: 20, fnbDiscountPercent: 20, durationMonths: 24, sortOrder: 4 },
];

const ZONES = [
  { key: 'driving-range', name: 'Driving Range', surcharge: 0, sortOrder: 1, capacityNote: '48 thảm · Tối đa 4 khách mỗi thảm' },
  { key: 'putting-green', name: 'Putting Green', surcharge: 0, sortOrder: 2, capacityNote: 'Tối đa 12 khách cùng lúc' },
  { key: 'short-game', name: 'Short Game', surcharge: 50000, sortOrder: 3, capacityNote: 'Tối đa 8 khách cùng lúc' },
  { key: 'private-bay', name: 'Private Bay', surcharge: 350000, sortOrder: 4, capacityNote: '6 bay · Tối đa 4 khách mỗi bay' },
  { key: 'vip-area', name: 'VIP Area', surcharge: 800000, sortOrder: 5, capacityNote: '3 khu · Tối đa 6 khách mỗi khu' },
];

const EXPERIENCES = [
  { key: 'range', slug: 'range', name: 'Tập sân', basePrice: 320000, durationMinutes: 60, suggestedZoneKey: 'driving-range', requiresCoach: false, sortOrder: 1, isFeatured: true },
  { key: 'coaching', slug: 'coaching', name: 'Học với huấn luyện viên', basePrice: 450000, durationMinutes: 90, suggestedZoneKey: 'driving-range', requiresCoach: true, sortOrder: 2 },
  { key: 'putting', slug: 'putting', name: 'Putting', basePrice: 260000, durationMinutes: 60, suggestedZoneKey: 'putting-green', requiresCoach: false, sortOrder: 3 },
  { key: 'golf-3in1', slug: 'golf-3in1', name: 'Golf 3-in-1', basePrice: 780000, durationMinutes: 150, suggestedZoneKey: 'driving-range', requiresCoach: false, sortOrder: 4 },
  { key: 'vip', slug: 'private-vip-golf', name: 'Private VIP', basePrice: 1600000, durationMinutes: 180, suggestedZoneKey: 'vip-area', requiresCoach: false, sortOrder: 5 },
  { key: 'event', slug: 'golf-networking', name: 'Sự kiện', basePrice: 900000, durationMinutes: 180, suggestedZoneKey: 'driving-range', requiresCoach: false, sortOrder: 6 },
  { key: 'corporate', slug: 'corporate-golf-day', name: 'Nhóm doanh nghiệp', basePrice: 2400000, durationMinutes: 240, suggestedZoneKey: 'driving-range', requiresCoach: false, sortOrder: 7 },
];

const ADDONS = [
  { key: 'balls-extra', name: 'Bóng tập thêm', price: 60000, unit: 'khay 50 bóng', max: 10, icon: 'CircleDot', sortOrder: 1 },
  { key: 'club-rental', name: 'Thuê gậy', price: 150000, unit: 'bộ', max: 6, icon: 'Wrench', sortOrder: 2 },
  { key: 'drink', name: 'Nước uống', price: 35000, unit: 'chai', max: 12, icon: 'CupSoda', sortOrder: 3 },
  { key: 'bento', name: 'Suất bento', price: 185000, unit: 'suất', max: 10, icon: 'Utensils', sortOrder: 4 },
  { key: 'cold-towel', name: 'Khăn lạnh', price: 20000, unit: 'khăn', max: 10, icon: 'Sparkles', sortOrder: 5 },
  { key: 'lounge-access', name: 'Khu nghỉ Lounge', price: 120000, unit: 'khách', max: 8, icon: 'Sofa', sortOrder: 6 },
  { key: 'photo', name: 'Chụp ảnh', price: 500000, unit: 'buổi', max: 1, icon: 'Camera', sortOrder: 7 },
  { key: 'vip-service', name: 'Dịch vụ VIP', price: 700000, unit: 'buổi', max: 1, icon: 'Crown', sortOrder: 8 },
];

const HOME_SECTIONS = [
  { key: 'announcement', label: 'Announcement bar', sortOrder: 0, data: { text: 'Founder Membership đang mở bán với số lượng giới hạn.', ctaText: 'Xem ưu đãi', ctaLink: '/membership' } },
  { key: 'hero', label: 'Hero', sortOrder: 1, data: { eyebrow: 'Smart Golf. Heartfelt Service. Lasting Connections.', title: 'A New Standard of Golf Experience', subtitle: 'Trải nghiệm golf, học tập, kết nối và thư giãn trong một không gian được vận hành bằng công nghệ và phục vụ bằng sự tận tâm.', image: '/images/hero-range.jpg', ctaText: 'Đặt lịch trải nghiệm', ctaLink: '/booking' } },
];

async function main() {
  // Roles
  for (const r of ROLES) {
    await prisma.role.upsert({
      where: { key: r.key },
      update: { name: r.name },
      create: { key: r.key, name: r.name, isSystem: true },
    });
  }

  // Site settings
  for (const s of SITE_SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, group: s.group },
      create: s,
    });
  }

  // Membership plans
  for (const p of MEMBERSHIP_PLANS) {
    await prisma.membershipPlan.upsert({ where: { key: p.key }, update: p, create: p });
  }

  // Practice zones
  for (const z of ZONES) {
    await prisma.practiceZone.upsert({ where: { key: z.key }, update: z, create: z });
  }

  // Experiences
  for (const e of EXPERIENCES) {
    await prisma.experience.upsert({ where: { key: e.key }, update: e, create: e });
  }

  // Add-ons
  for (const a of ADDONS) {
    await prisma.addOn.upsert({ where: { key: a.key }, update: a, create: a });
  }

  // Content: HOME page + sections
  const home = await prisma.contentPage.upsert({
    where: { key: 'HOME' },
    update: { title: 'Trang chủ' },
    create: { key: 'HOME', title: 'Trang chủ' },
  });
  for (const s of HOME_SECTIONS) {
    await prisma.contentSection.upsert({
      where: { pageId_key: { pageId: home.id, key: s.key } },
      update: { label: s.label, data: s.data, sortOrder: s.sortOrder },
      create: { pageId: home.id, key: s.key, label: s.label, data: s.data, sortOrder: s.sortOrder },
    });
  }
  for (const key of ['ABOUT', 'CONTACT', 'ACADEMY', 'CORPORATE', 'TOUR', 'FNB', 'MEMBERSHIP']) {
    await prisma.contentPage.upsert({ where: { key }, update: {}, create: { key, title: key } });
  }

  console.log('✅ Seed bootstrap hoàn tất: roles, settings, membership plans, zones, experiences, add-ons, content.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error('❌ Seed lỗi:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
