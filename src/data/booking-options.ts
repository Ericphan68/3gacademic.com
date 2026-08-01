import { MEDIA } from '@/constants/media';
import type { AddOnItem, BookingExperienceType, PracticeZone } from '@/types';

/** Bước 1 — các loại trải nghiệm có thể đặt lịch. */
export const BOOKING_EXPERIENCE_TYPES: {
  id: BookingExperienceType;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  icon: string;
  suggestedZone: PracticeZone['id'];
  requiresCoach: boolean;
}[] = [
  {
    id: 'range',
    name: 'Tập sân',
    description: 'Thảm tập tiêu chuẩn với bóng và gậy đầy đủ. Lựa chọn phổ biến nhất.',
    basePrice: 320000,
    durationMinutes: 60,
    icon: 'Target',
    suggestedZone: 'driving-range',
    requiresCoach: false,
  },
  {
    id: 'coaching',
    name: 'Học với huấn luyện viên',
    description: 'Buổi học 1-1 có phân tích kỹ thuật và lộ trình cá nhân hoá.',
    basePrice: 450000,
    durationMinutes: 90,
    icon: 'GraduationCap',
    suggestedZone: 'driving-range',
    requiresCoach: true,
  },
  {
    id: 'putting',
    name: 'Putting',
    description: 'Luyện cú gạt trên mặt green tiêu chuẩn tốc độ 10.0.',
    basePrice: 260000,
    durationMinutes: 60,
    icon: 'CircleDot',
    suggestedZone: 'putting-green',
    requiresCoach: false,
  },
  {
    id: 'golf-3in1',
    name: 'Golf 3-in-1',
    description: 'Tập sân, Short Game và Putting trong cùng một buổi 150 phút.',
    basePrice: 780000,
    durationMinutes: 150,
    icon: 'Layers',
    suggestedZone: 'driving-range',
    requiresCoach: false,
  },
  {
    id: 'vip',
    name: 'Private VIP',
    description: 'Bay riêng, nhân viên phục vụ chuyên trách và lối vào riêng.',
    basePrice: 1600000,
    durationMinutes: 180,
    icon: 'Crown',
    suggestedZone: 'vip-area',
    requiresCoach: false,
  },
  {
    id: 'event',
    name: 'Sự kiện',
    description: 'Giữ chỗ cho các buổi networking, workshop và giải đấu tại Lotus.',
    basePrice: 900000,
    durationMinutes: 180,
    icon: 'Trophy',
    suggestedZone: 'driving-range',
    requiresCoach: false,
  },
  {
    id: 'corporate',
    name: 'Nhóm doanh nghiệp',
    description: 'Khung giờ riêng cho nhóm từ 10 người, có điều phối viên đi cùng.',
    basePrice: 2400000,
    durationMinutes: 240,
    icon: 'Building2',
    suggestedZone: 'driving-range',
    requiresCoach: false,
  },
];

/** Bước 4 — khu vực tập luyện. */
export const PRACTICE_ZONES: PracticeZone[] = [
  {
    id: 'driving-range',
    name: 'Driving Range',
    description:
      '48 thảm tập hai tầng, lưới cao 25 mét, hệ thống trả bóng tự động và đèn chiếu sáng toàn khu cho khung giờ tối.',
    image: MEDIA.facility['driving-range'],
    capacityNote: '48 thảm · Tối đa 4 khách mỗi thảm',
    surcharge: 0,
    features: ['Trả bóng tự động', 'Đèn chiếu sáng buổi tối', 'Quạt làm mát', 'Bảng đo cự ly'],
  },
  {
    id: 'putting-green',
    name: 'Putting Green',
    description:
      'Mặt green tiêu chuẩn với tốc độ được đo mỗi sáng, nhiều độ dốc khác nhau để mô phỏng điều kiện sân thật.',
    image: MEDIA.facility['putting-green'],
    capacityNote: 'Tối đa 12 khách cùng lúc',
    surcharge: 0,
    features: ['Tốc độ green 10.0', 'Nhiều độ dốc', 'Thiết bị đo đường lăn', 'Mượn putter cao cấp'],
  },
  {
    id: 'short-game',
    name: 'Short Game',
    description:
      'Khu xử lý bóng quanh green với bunker cát thật, cỏ rough và các vị trí bóng khó được thiết lập lại hằng ngày.',
    image: MEDIA.facility['short-game'],
    capacityNote: 'Tối đa 8 khách cùng lúc',
    surcharge: 50000,
    features: ['Bunker cát thật', 'Vùng cỏ rough', '8 tình huống mô phỏng', 'Mượn bộ wedge'],
  },
  {
    id: 'private-bay',
    name: 'Private Bay',
    description:
      'Bay riêng có vách ngăn, điều hoà, màn hình phân tích đường bóng và ghế nghỉ. Phù hợp khi cần tập trung hoặc tiếp khách.',
    image: MEDIA.facility['private-bay'],
    capacityNote: '6 bay · Tối đa 4 khách mỗi bay',
    surcharge: 350000,
    features: ['Điều hoà riêng', 'Màn hình phân tích', 'Vách ngăn riêng tư', 'Ghế nghỉ và bàn'],
  },
  {
    id: 'vip-area',
    name: 'VIP Area',
    description:
      'Khu VIP có lối vào riêng, nhân viên phục vụ chuyên trách, phòng thay đồ riêng và không gian tiếp khách bên cạnh bay tập.',
    image: MEDIA.facility['vip-area'],
    capacityNote: '3 khu · Tối đa 6 khách mỗi khu',
    surcharge: 800000,
    features: ['Lối vào riêng', 'Nhân viên chuyên trách', 'Phòng thay đồ riêng', 'Khu tiếp khách'],
  },
];

/** Bước 6 — dịch vụ bổ sung. */
export const BOOKING_ADD_ONS: AddOnItem[] = [
  {
    id: 'balls-extra',
    name: 'Bóng tập thêm',
    description: 'Mỗi khay 50 bóng, thêm bao nhiêu tuỳ nhu cầu.',
    price: 60000,
    unit: 'khay 50 bóng',
    max: 10,
    icon: 'CircleDot',
  },
  {
    id: 'club-rental',
    name: 'Thuê gậy',
    description: 'Bộ gậy đầy đủ, chọn theo chiều cao và tay thuận.',
    price: 150000,
    unit: 'bộ',
    max: 6,
    icon: 'Wrench',
  },
  {
    id: 'drink',
    name: 'Nước uống',
    description: 'Nước khoáng hoặc nước điện giải, phục vụ lạnh tại thảm tập.',
    price: 35000,
    unit: 'chai',
    max: 12,
    icon: 'CupSoda',
  },
  {
    id: 'bento',
    name: 'Suất bento',
    description: 'Bento Nhật hoặc Hàn từ đối tác Bento House, chọn món khi check-in.',
    price: 185000,
    unit: 'suất',
    max: 10,
    icon: 'Utensils',
  },
  {
    id: 'cold-towel',
    name: 'Khăn lạnh',
    description: 'Khăn lạnh hương sen phục vụ sau buổi tập.',
    price: 20000,
    unit: 'khăn',
    max: 10,
    icon: 'Sparkles',
  },
  {
    id: 'lounge-access',
    name: 'Khu nghỉ Lounge',
    description: 'Sử dụng Lounge 60 phút sau buổi tập, kèm một đồ uống.',
    price: 120000,
    unit: 'khách',
    max: 8,
    icon: 'Sofa',
  },
  {
    id: 'photo',
    name: 'Chụp ảnh',
    description: 'Nhiếp ảnh gia chụp trong 30 phút, ảnh đã chỉnh gửi trong 48 giờ.',
    price: 500000,
    unit: 'buổi',
    max: 1,
    icon: 'Camera',
  },
  {
    id: 'vip-service',
    name: 'Dịch vụ VIP',
    description: 'Nhân viên phục vụ chuyên trách, chăm sóc gậy và đón tiếp riêng.',
    price: 700000,
    unit: 'buổi',
    max: 1,
    icon: 'Crown',
  },
];

/** Mệnh giá nạp ví demo. */
export const TOP_UP_PRESETS = [
  { amount: 2000000, bonusPercent: 0 },
  { amount: 5000000, bonusPercent: 5 },
  { amount: 10000000, bonusPercent: 8 },
  { amount: 20000000, bonusPercent: 12 },
  { amount: 50000000, bonusPercent: 18 },
];

export const PAYMENT_METHODS = [
  { id: 'wallet', name: 'Ví Lotus', description: 'Thanh toán bằng số dư Top-up, áp dụng ưu đãi hội viên.', icon: 'Wallet' },
  { id: 'transfer', name: 'Chuyển khoản', description: 'Nhận thông tin chuyển khoản sau khi xác nhận đặt lịch.', icon: 'Landmark' },
  { id: 'card', name: 'Thẻ ngân hàng', description: 'Thanh toán bằng thẻ nội địa hoặc thẻ quốc tế.', icon: 'CreditCard' },
  { id: 'at-center', name: 'Thanh toán tại trung tâm', description: 'Giữ chỗ trước, thanh toán khi đến check-in.', icon: 'Store' },
] as const;
