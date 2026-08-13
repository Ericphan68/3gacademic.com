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

/**
 * Menu chính trên header desktop.
 *
 * Các mục có `children` sẽ hiển thị dạng dropdown khi hover hoặc focus.
 * Gom nhóm giúp thanh menu chỉ còn 5 mục cấp một, luôn đủ chỗ trên một hàng
 * và người dùng dễ quét hơn so với 10 mục phẳng.
 */
export interface MainNavEntry {
  label: string;
  labelEn: string;
  href: Route;
  children?: NavItem[];
}

export const MAIN_NAV: MainNavEntry[] = [
  {
    label: 'Học golf',
    labelEn: 'Learn',
    href: '/academy',
    children: [
      {
        label: 'Lotus Golf Academy',
        labelEn: 'Academy',
        href: '/academy',
        description: '12 chương trình từ căn bản đến thi đấu',
      },
      {
        label: 'Huấn luyện viên',
        labelEn: 'Coaches',
        href: '/coaches',
        description: 'Tìm HLV theo chuyên môn và ngôn ngữ',
      },
      {
        label: 'Gói trải nghiệm',
        labelEn: 'Experience packages',
        href: '/experience',
        description: '12 gói cho người mới đến khách VIP',
      },
      {
        label: 'Đặt lịch ngay',
        labelEn: 'Book now',
        href: '/booking',
        description: 'Chọn giờ, khu vực và huấn luyện viên',
      },
    ],
  },
  {
    label: 'Sân golf',
    labelEn: 'Golf Courses',
    href: '/san-golf',
    children: [
      {
        label: 'Sân Golf An Phú Lotus',
        labelEn: 'An Phu Lotus Golf',
        href: '/san-golf/an-phu-lotus',
        description: 'Bảng giá dịch vụ & đặt sân',
      },
    ],
  },
  {
    label: 'Quyền lợi',
    labelEn: 'Benefits',
    href: '/membership',
    children: [
      {
        label: 'Hội viên & Top-up',
        labelEn: 'Membership',
        href: '/membership',
        description: '4 hạng, bonus tới 25% khi nạp ví',
      },
      {
        label: 'Voucher & Ưu đãi',
        labelEn: 'Vouchers',
        href: '/vouchers',
        description: 'Flash Sale, giờ thấp điểm, quà tặng',
      },
      {
        label: 'Sự kiện & Giải đấu',
        labelEn: 'Events',
        href: '/events',
        description: 'Giải đấu, workshop, networking',
      },
    ],
  },
  {
    label: 'Doanh nghiệp',
    labelEn: 'Business',
    href: '/corporate',
    children: [
      {
        label: 'Golf doanh nghiệp',
        labelEn: 'Corporate golf',
        href: '/corporate',
        description: 'Corporate Golf Day, team-building',
      },
      {
        label: 'Golf Tour',
        labelEn: 'Golf Tour',
        href: '/golf-tour',
        description: '7 gói tour cho khách đoàn',
      },
      {
        label: 'Cổng đối tác',
        labelEn: 'Partner portal',
        href: '/partner',
        description: 'Hợp tác cùng Lotus',
      },
    ],
  },
  {
    label: 'Dịch vụ khác',
    labelEn: 'More Services',
    href: '/food-and-lounge',
    children: [
      {
        label: 'F&B và Lounge',
        labelEn: 'Food & Lounge',
        href: '/food-and-lounge',
        description: 'Đặt món giao tận thảm tập',
      },
    ],
  },
  {
    label: 'Về Lotus',
    labelEn: 'About',
    href: '/about',
    children: [
      {
        label: 'Câu chuyện thương hiệu',
        labelEn: 'Our story',
        href: '/about',
        description: 'Tầm nhìn, giá trị và đội ngũ',
      },
      {
        label: 'Liên hệ',
        labelEn: 'Contact',
        href: '/contact',
        description: 'Địa chỉ, hotline và chỉ đường',
      },
      {
        label: 'Câu hỏi thường gặp',
        labelEn: 'FAQ',
        href: '/faq',
        description: '11 nhóm câu hỏi có tìm kiếm',
      },
    ],
  },
];

/** Menu mobile được chia nhóm rõ ràng. */
export const MOBILE_NAV_GROUPS: NavGroup[] = [
  {
    title: 'Học golf',
    titleEn: 'Learn',
    items: [
      { label: 'Trang chủ', labelEn: 'Home', href: '/' },
      { label: 'Lotus Golf Academy', labelEn: 'Academy', href: '/academy', description: 'Lộ trình từ căn bản đến thi đấu' },
      { label: 'Huấn luyện viên', labelEn: 'Coaches', href: '/coaches', description: 'Tìm HLV theo chuyên môn' },
      { label: 'Gói trải nghiệm', labelEn: 'Experiences', href: '/experience', description: '12 gói cho mọi đối tượng' },
      { label: 'Đặt lịch ngay', labelEn: 'Book now', href: '/booking', description: 'Chọn giờ, khu vực và HLV' },
    ],
  },
  {
    title: 'Sân golf',
    titleEn: 'Golf Courses',
    items: [
      { label: 'Tất cả sân golf', labelEn: 'All courses', href: '/san-golf' },
      { label: 'Sân Golf An Phú Lotus', labelEn: 'An Phu Lotus Golf', href: '/san-golf/an-phu-lotus', description: 'Bảng giá & đặt sân' },
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
    title: 'Doanh nghiệp',
    titleEn: 'Business',
    items: [
      { label: 'Golf doanh nghiệp', labelEn: 'Corporate golf', href: '/corporate' },
      { label: 'Golf Tour', labelEn: 'Golf Tour', href: '/golf-tour' },
      { label: 'Cổng đối tác', labelEn: 'Partner portal', href: '/partner' },
    ],
  },
  {
    title: 'Dịch vụ khác',
    titleEn: 'More Services',
    items: [
      { label: 'F&B và Lounge', labelEn: 'Food & Lounge', href: '/food-and-lounge', description: 'Đặt món giao tận thảm tập' },
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

/** Sidebar khu quản trị. */
export const ADMIN_NAV = [
  { label: 'Tổng quan', href: '/admin' as Route, icon: 'LayoutDashboard' },
  { label: 'Booking', href: '/admin/bookings' as Route, icon: 'CalendarCheck' },
  { label: 'Gói trải nghiệm', href: '/admin/experiences' as Route, icon: 'Sparkles' },
  { label: 'Hội viên', href: '/admin/memberships' as Route, icon: 'Crown' },
  { label: 'Voucher', href: '/admin/vouchers' as Route, icon: 'Ticket' },
  { label: 'Sự kiện', href: '/admin/events' as Route, icon: 'Trophy' },
  { label: 'Huấn luyện viên', href: '/admin/coaches' as Route, icon: 'GraduationCap' },
  { label: 'Nội dung', href: '/admin/content' as Route, icon: 'BookOpen' },
  { label: 'FAQ', href: '/admin/faq' as Route, icon: 'HelpCircle' },
  { label: 'Đăng ký', href: '/admin/registrations' as Route, icon: 'ReceiptText' },
  { label: 'Khách hàng', href: '/admin/customers' as Route, icon: 'UsersRound' },
  { label: 'Cấu hình', href: '/admin/settings' as Route, icon: 'Settings' },
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
      { label: 'Bảng giá dịch vụ', labelEn: 'Pricing', href: '/bang-gia' },
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
      { label: 'Chính sách hợp tác', labelEn: 'Partnership policy', href: '/chinh-sach-hop-tac' },
      { label: 'Chính sách bảo mật', labelEn: 'Privacy', href: '/privacy' },
      { label: 'Điều khoản sử dụng', labelEn: 'Terms', href: '/terms' },
    ],
  },
];
