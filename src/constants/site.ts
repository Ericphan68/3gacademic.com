/** Cấu hình trung tâm cho thương hiệu, liên hệ và SEO. */

const PRODUCTION_URL = 'https://lotusgolfcenter.com';

/**
 * URL gốc của website.
 * Ở production LUÔN dùng domain thật (lotusgolfcenter.com) để không bị phụ thuộc
 * vào biến NEXT_PUBLIC_SITE_URL trên máy chủ — biến này từng bị đặt nhầm sang
 * domain khác, làm hỏng link email xác nhận và các thẻ SEO (canonical/og/sitemap).
 * Chỉ khi chạy dev (localhost) mới cho phép ghi đè bằng biến môi trường.
 */
export const SITE_URL =
  process.env.NODE_ENV === 'production'
    ? PRODUCTION_URL
    : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const SITE = {
  name: 'Lotus Golf Center',
  shortName: 'Lotus Golf',
  legalName: 'Lotus Golf Center',
  tagline: 'Golf thông minh. Dịch vụ từ trái tim. Kết nối bền vững.',
  taglineEn: 'Smart Golf. Heartfelt Service. Lasting Connections.',
  heroHeadline: 'A New Standard of Golf Experience',
  description:
    'Trải nghiệm golf, học tập, kết nối và thư giãn trong một không gian được vận hành bằng công nghệ và phục vụ bằng sự tận tâm.',
  url: SITE_URL,
  locale: 'vi_VN',
  ogImage: '/images/og-default.jpg',
} as const;

export const CONTACT = {
  hotline: process.env.NEXT_PUBLIC_HOTLINE ?? '1900 1990',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@lotusgolf.vn',
  zalo: process.env.NEXT_PUBLIC_ZALO_URL ?? 'https://zalo.me/lotusgolf',
  addressLine: 'Số 8 Đại lộ Sen Vàng, Phường Lotus, TP. Hồ Chí Minh',
  addressShort: 'Đại lộ Sen Vàng, TP. Hồ Chí Minh',
  district: 'TP. Hồ Chí Minh',
  country: 'VN',
  postalCode: '700000',
  geo: { lat: 10.7769, lng: 106.7009 },
  openHours: '06:00 – 22:00',
  openTime: '06:00',
  closeTime: '22:00',
  parkingNote:
    'Bãi xe riêng trong khuôn viên, miễn phí cho khách đặt lịch. Lối vào dành cho ô tô ở cổng số 2, xe máy ở cổng số 1.',
} as const;

export const BRAND_VALUES = [
  { title: 'Tận tâm', description: 'Phục vụ bằng sự quan tâm thật, không theo kịch bản.' },
  { title: 'Tôn trọng', description: 'Mỗi khách hàng đều được đón tiếp như một hội viên.' },
  { title: 'Trung tín', description: 'Đã cam kết là thực hiện, đúng giờ và đúng chất lượng.' },
  { title: 'Minh bạch', description: 'Giá, quyền lợi và chính sách luôn rõ ràng, không ẩn phí.' },
  { title: 'Đổi mới', description: 'Công nghệ giúp vận hành mượt để con người tập trung phục vụ.' },
  { title: 'Cộng đồng', description: 'Golf là cầu nối để mọi người gặp nhau và gắn bó lâu dài.' },
] as const;

/** Khung giờ hoạt động dùng cho booking & lịch HLV. */
export const OPERATING_HOURS = {
  start: 6,
  end: 22,
} as const;

export const SEO_KEYWORDS = [
  'Lotus Golf Center',
  'sân tập golf',
  'học golf',
  'huấn luyện viên golf',
  'golf cho người mới',
  'golf doanh nghiệp',
  'golf tour',
  'golf academy',
  'đặt lịch golf',
  'hội viên golf',
];

/** Tài khoản demo hiển thị công khai trên trang đăng nhập. */
export const DEMO_ACCOUNTS = [
  {
    role: 'Khách hàng',
    email: 'customer@lotusgolf.vn',
    password: 'Demo123!',
    description: 'Xem Dashboard khách hàng, ví, voucher, booking và buổi học.',
  },
  {
    role: 'Huấn luyện viên',
    email: 'coach@lotusgolf.vn',
    password: 'Demo123!',
    description: 'Xem Coach Portal: học viên, lịch dạy, hoa hồng và referral.',
  },
  {
    role: 'Quản trị viên',
    email: 'admin@lotusgolf.vn',
    password: 'Demo123!',
    description: 'Khu quản trị: toàn bộ booking, đăng ký, khách hàng và doanh thu.',
  },
] as const;

export const STORAGE_KEYS = {
  auth: 'lotus.auth.v1',
  users: 'lotus.users.v1',
  bookings: 'lotus.bookings.v1',
  wallet: 'lotus.wallet.v1',
  vouchers: 'lotus.vouchers.v1',
  membership: 'lotus.membership.v1',
  events: 'lotus.event-registrations.v1',
  lessons: 'lotus.lessons.v1',
  fnbCart: 'lotus.fnb-cart.v1',
  fnbOrders: 'lotus.fnb-orders.v1',
  favorites: 'lotus.favorites.v1',
  leads: 'lotus.leads.v1',
  bookingDraft: 'lotus.booking-draft.v1',
  locale: 'lotus.locale.v1',
  theme: 'lotus.theme.v1',
  announcement: 'lotus.announcement.v1',
} as const;
