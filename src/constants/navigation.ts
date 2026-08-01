import type { Route } from 'next';

export interface NavItem {
  label: string;
  labelEn: string;
  href: Route;
  description?: string;
}

export interface NavGroup {
  title: string;
  titleEn: string;
  items: NavItem[];
}

/** Menu chính trên header desktop. */
export const MAIN_NAV: NavItem[] = [
  { label: 'Trang chủ', labelEn: 'Home', href: '/' },
  { label: 'Trải nghiệm', labelEn: 'Experiences', href: '/experience' },
  { label: 'Đặt lịch', labelEn: 'Booking', href: '/booking' },
  { label: 'Academy', labelEn: 'Academy', href: '/academy' },
  { label: 'Huấn luyện viên', labelEn: 'Coaches', href: '/coaches' },
  { label: 'Hội viên', labelEn: 'Membership', href: '/membership' },
  { label: 'Sự kiện', labelEn: 'Events', href: '/events' },
  { label: 'Doanh nghiệp', labelEn: 'Corporate', href: '/corporate' },
  { label: 'Golf Tour', labelEn: 'Golf Tour', href: '/golf-tour' },
  { label: 'Về Lotus', labelEn: 'About', href: '/about' },
];

/** Menu mobile được chia nhóm rõ ràng. */
export const MOBILE_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Chơi golf',
    titleEn: 'Play',
    items: [
      { label: 'Đặt lịch ngay', labelEn: 'Book now', href: '/booking', description: 'Chọn giờ, khu vực và HLV' },
      { label: 'Gói trải nghiệm', labelEn: 'Experiences', href: '/experience', description: '12 gói cho mọi đối tượng' },
      { label: 'F&B và Lounge', labelEn: 'Food & Lounge', href: '/food-and-lounge', description: 'Đặt món giao tận thảm tập' },
    ],
  },
  {
    title: 'Học golf',
    titleEn: 'Learn',
    items: [
      { label: 'Lotus Golf Academy', labelEn: 'Academy', href: '/academy', description: 'Lộ trình từ căn bản đến thi đấu' },
      { label: 'Huấn luyện viên', labelEn: 'Coaches', href: '/coaches', description: 'Tìm HLV theo chuyên môn' },
    ],
  },
  {
    title: 'Quyền lợi',
    titleEn: 'Benefits',
    items: [
      { label: 'Hội viên & Top-up', labelEn: 'Membership', href: '/membership', description: '4 hạng hội viên' },
      { label: 'Voucher & Ưu đãi', labelEn: 'Vouchers', href: '/vouchers', description: 'Flash Sale, Off-peak, Gift' },
      { label: 'Sự kiện & Giải đấu', labelEn: 'Events', href: '/events', description: 'Giải đấu, workshop, networking' },
    ],
  },
  {
    title: 'Đối tác',
    titleEn: 'Partners',
    items: [
      { label: 'Golf doanh nghiệp', labelEn: 'Corporate golf', href: '/corporate' },
      { label: 'Golf Tour', labelEn: 'Golf Tour', href: '/golf-tour' },
      { label: 'Cổng đối tác', labelEn: 'Partner portal', href: '/partner' },
    ],
  },
  {
    title: 'Về Lotus',
    titleEn: 'About Lotus',
    items: [
      { label: 'Câu chuyện thương hiệu', labelEn: 'Our story', href: '/about' },
      { label: 'Liên hệ', labelEn: 'Contact', href: '/contact' },
      { label: 'Câu hỏi thường gặp', labelEn: 'FAQ', href: '/faq' },
    ],
  },
];

/** Sidebar Dashboard khách hàng. */
export const DASHBOARD_NAV = [
  { label: 'Tổng quan', href: '/dashboard' as Route, icon: 'LayoutDashboard' },
  { label: 'Lịch đặt', href: '/dashboard/bookings' as Route, icon: 'CalendarCheck' },
  { label: 'Hội viên', href: '/dashboard/membership' as Route, icon: 'Crown' },
  { label: 'Ví Lotus', href: '/dashboard/wallet' as Route, icon: 'Wallet' },
  { label: 'Voucher', href: '/dashboard/vouchers' as Route, icon: 'Ticket' },
  { label: 'Buổi học', href: '/dashboard/lessons' as Route, icon: 'GraduationCap' },
  { label: 'Sự kiện', href: '/dashboard/events' as Route, icon: 'Trophy' },
  { label: 'Hồ sơ', href: '/dashboard/profile' as Route, icon: 'UserRound' },
] as const;

/** Sidebar Coach Portal. */
export const COACH_NAV = [
  { label: 'Tổng quan', href: '/coach-portal' as Route, icon: 'LayoutDashboard' },
  { label: 'Học viên', href: '/coach-portal/students' as Route, icon: 'Users' },
  { label: 'Lịch dạy', href: '/coach-portal/schedule' as Route, icon: 'CalendarDays' },
  { label: 'Hoa hồng', href: '/coach-portal/commission' as Route, icon: 'BadgeDollarSign' },
  { label: 'Giới thiệu', href: '/coach-portal/referrals' as Route, icon: 'Share2' },
] as const;

/** Cấu trúc footer. */
export const FOOTER_NAV: NavGroup[] = [
  {
    title: 'Trải nghiệm',
    titleEn: 'Experience',
    items: [
      { label: 'Gói trải nghiệm', labelEn: 'Packages', href: '/experience' },
      { label: 'Đặt lịch', labelEn: 'Booking', href: '/booking' },
      { label: 'F&B và Lounge', labelEn: 'Food & Lounge', href: '/food-and-lounge' },
      { label: 'Sự kiện', labelEn: 'Events', href: '/events' },
    ],
  },
  {
    title: 'Học viện',
    titleEn: 'Academy',
    items: [
      { label: 'Lotus Golf Academy', labelEn: 'Academy', href: '/academy' },
      { label: 'Huấn luyện viên', labelEn: 'Coaches', href: '/coaches' },
      { label: 'Coach Portal', labelEn: 'Coach Portal', href: '/coach-portal' },
    ],
  },
  {
    title: 'Quyền lợi',
    titleEn: 'Benefits',
    items: [
      { label: 'Hội viên', labelEn: 'Membership', href: '/membership' },
      { label: 'Voucher', labelEn: 'Vouchers', href: '/vouchers' },
      { label: 'Dashboard', labelEn: 'Dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Doanh nghiệp',
    titleEn: 'Business',
    items: [
      { label: 'Golf doanh nghiệp', labelEn: 'Corporate golf', href: '/corporate' },
      { label: 'Golf Tour', labelEn: 'Golf Tour', href: '/golf-tour' },
      { label: 'Cổng đối tác', labelEn: 'Partner portal', href: '/partner' },
    ],
  },
  {
    title: 'Về Lotus',
    titleEn: 'About',
    items: [
      { label: 'Câu chuyện', labelEn: 'Our story', href: '/about' },
      { label: 'Liên hệ', labelEn: 'Contact', href: '/contact' },
      { label: 'FAQ', labelEn: 'FAQ', href: '/faq' },
      { label: 'Chính sách bảo mật', labelEn: 'Privacy', href: '/privacy' },
      { label: 'Điều khoản sử dụng', labelEn: 'Terms', href: '/terms' },
    ],
  },
];
