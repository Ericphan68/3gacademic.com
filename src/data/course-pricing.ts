/**
 * Bảng giá dịch vụ Sân Golf An Phú Lotus.
 * Nguồn: tài liệu "BẢNG GIÁ LOTUS GOLF" — áp dụng từ 07/08/2026.
 * Tách riêng để dễ cập nhật (một chỗ duy nhất) và có thể đưa vào Admin sau này.
 */

export interface PricePackage {
  name: string;
  price: number;
  note?: string;
}

export interface HoleRow {
  label: string;
  duration?: string;
  price: number;
  extra?: string;
}

export interface CourseTable {
  title: string;
  subtitle?: string;
  rules?: string[];
  holes: HoleRow[];
  fullDay: { name: string; price: number; time?: string; includes: string };
  caddie?: string;
  notes?: string[];
}

export interface TrainingProgram {
  name: string;
  price: number;
  unit: string;
  time?: string;
  includes: string[];
  note?: string;
}

export const COURSE_PRICING = {
  brand: 'Sân Golf An Phú Lotus',
  appliedFrom: '07/08/2026',
  openHours: '05:00 – 22:00',

  ballPackages: [
    {
      name: 'Gói 100 bóng tập',
      price: 150000,
      note: 'Tặng 01 lon bia hoặc 01 chai nước suối / cà phê / bánh giò / phần Fast Food.',
    },
    {
      name: 'Gói 200 bóng tập',
      price: 380000,
      note: 'Giá bán 03 khách/ngày. Tặng 01 Voucher sân 9 hố (350.000đ) và 01 giờ học golf miễn phí cùng HLV (danh sách 1).',
    },
    {
      name: 'Gói 250 bóng tập',
      price: 500000,
      note: 'Giá bán 03 khách/ngày. Tặng 01 Voucher sân 9 hố (350.000đ) và 01 buổi học golf cùng HLV 1,5 giờ (danh sách 2).',
    },
  ] satisfies PricePackage[],

  teeLong: {
    title: 'Sân tập Tee dài',
    holes: [
      { label: '9 hố', duration: '2 – 2,5 giờ', price: 400000, extra: 'Extra 9 hố 150.000đ → tổng 550.000đ' },
      { label: '18 hố', duration: '4 giờ', price: 500000, extra: 'Extra 18 hố 215.000đ → tổng 715.000đ' },
      {
        label: '36 hố',
        price: 800000,
        extra: 'Bao gồm ½ con gà, 01 lon bia, nghỉ trưa, nước suối… (booking & thanh toán trước)',
      },
    ],
    fullDay: {
      name: 'Dịch vụ full ngày',
      price: 1400000,
      time: '05:00 – 22:00',
      includes:
        'Bữa trưa ¼ con gà, bữa chiều hải sản (cá/tôm/mực…), HLV tư vấn & trợ giúp kỹ thuật miễn phí trong giờ thực chiến (danh sách 3), nghỉ trưa máy lạnh & sân vườn.',
    },
    caddie: 'Caddie 50.000đ/golfer/9 hố — áp dụng sinh viên, học sinh, doanh nhân trẻ, nhóm, đoàn…',
    notes: [
      'Áp dụng Tee dài được lựa chọn: không nhận quá 16 golfer/ngày.',
      'Booking trước để xếp lịch. Trường hợp chọn gói này phải có caddie ghi chép, trợ giúp ghi điểm — phí 50.000đ/golfer/9 hố.',
    ],
  } satisfies CourseTable,

  teeShort: {
    title: 'Sân tập Tee ngắn (Người mới) — Golf cho cộng đồng',
    rules: [
      'Phát bóng trên thảm tại tee phát.',
      'Book trước giờ chơi.',
      'Không phát bóng xa quá 60 yard theo thảm t-box của sân.',
    ],
    holes: [
      { label: '9 hố', duration: '2 – 2,5 giờ', price: 200000, extra: 'Extra 9 hố 50.000đ → tổng 250.000đ' },
      { label: '18 hố', duration: '4 giờ', price: 350000, extra: 'Extra 18 hố 150.000đ → tổng 500.000đ' },
      { label: '36 hố', price: 500000, extra: 'Bao gồm ¼ con gà, 01 lon bia, nghỉ trưa, nước suối…' },
    ],
    fullDay: {
      name: 'Dịch vụ full ngày',
      price: 1000000,
      time: '05:00 – 22:00',
      includes:
        'HLV tư vấn & trợ giúp kỹ thuật miễn phí 02 giờ (danh sách 4). Bữa trưa ¼ con gà, bữa chiều hải sản (cá/tôm/mực…). Nghỉ trưa võng, sân vườn, ghế bố… (booking & thanh toán trước).',
    },
    caddie: 'Caddie 50.000đ/golfer/9 hố (tính vào tài khoản riêng) — áp dụng sinh viên, học sinh, doanh nhân trẻ, nhóm…',
  } satisfies CourseTable,

  training: [
    {
      name: 'SGI — Trải nghiệm golf cùng HLV',
      price: 500000,
      unit: 'người / 4 giờ',
      time: 'Thứ 2 – Thứ 6 · Sáng 07:00–11:00, Chiều 15:00–19:00',
      includes: [
        'HLV trưởng dẫn nhóm, học và thi đấu ngay',
        'Mini golf (2 cây gậy)',
        'Check-in, chụp & trả hình, bóng tập, gậy golf, nước uống, dù nhỏ, suất ăn nhẹ',
      ],
      note: 'Chiết khấu 10–15% cho người kết nối, giới thiệu nhóm/đoàn/đội golfer (áp dụng chiết khấu, không thanh toán tiền mặt).',
    },
    {
      name: 'SGI & MSC — Học và chơi, thi đấu ngay',
      price: 500000,
      unit: 'người / 5 giờ',
      time: 'Ưu tiên giờ thấp điểm 17:00 – 22:00',
      includes: ['Học và chơi, có thể thi đấu ngay', 'Đánh bóng trong lồng tập và tee ngắn (không quá 60 yard, đánh trên thảm)'],
    },
    {
      name: 'Mini golf — Chương trình đặc biệt',
      price: 500000,
      unit: 'người',
      includes: [
        'Dành cho doanh nhân, sinh viên; booking nhóm',
        'Đào tạo sinh viên trường nghề',
        'Mỗi người tham gia tặng 01 lon bia, 01 chai nước',
      ],
    },
  ] satisfies TrainingProgram[],

  freeServices: [
    'Đón đưa lên xe',
    'Dịch vụ tập cát, khu chipping và putt cát',
  ],

  waterPenalty: {
    price: 90000,
    note: 'Áp dụng cho golfer đăng ký trải nghiệm dịch vụ 9 hố / 18 hố mà không trả phí sân. Tặng 01 lon bia hoặc 01 chai nước suối. (Phí thu để bảo trì, bảo dưỡng sân.)',
  },

  prizes: [
    'Nearest Pin: Voucher sân 9 hố trị giá 350.000đ.',
    'Hole In One (hố 5 và hố 8): 01 thùng bia hoặc quy đổi tiền mặt + Certificate.',
  ],

  notes: [
    'Sắp xếp bàn ghế, chỗ ngồi cho khách, nước uống…',
    'Số lượng theo chính sách có hạn do sức chứa của sân từng thời điểm.',
    'Chương trình & chính sách có thể tạm đóng khi đã nhận đủ khách.',
    'Sân có thể điều chỉnh cho phù hợp thực tế theo khung giờ.',
  ],
} as const;

/** Một gói có thể đặt & thanh toán trực tuyến. */
export interface BookablePackage {
  id: string;
  category: string;
  name: string;
  price: number;
  unit: string;
  duration?: string;
  desc: string;
  featured?: boolean;
}

/**
 * Danh sách gói "đặt được luôn" trên trang Sân Golf An Phú Lotus.
 * Phân theo nhóm; mỗi gói có nút đặt & thanh toán riêng.
 */
export const BOOKABLE_PACKAGES: BookablePackage[] = [
  // Gói bóng tập
  { id: 'ball-100', category: 'Gói bóng tập', name: 'Gói 100 bóng tập', price: 150000, unit: 'gói', desc: 'Tặng 01 lon bia / nước suối / cà phê / bánh giò / phần Fast Food.' },
  { id: 'ball-200', category: 'Gói bóng tập', name: 'Gói 200 bóng tập', price: 380000, unit: 'gói', desc: 'Tặng Voucher sân 9 hố (350.000đ) + 01 giờ học golf cùng HLV.' },
  { id: 'ball-250', category: 'Gói bóng tập', name: 'Gói 250 bóng tập', price: 500000, unit: 'gói', desc: 'Tặng Voucher sân 9 hố (350.000đ) + 01 buổi học golf 1,5 giờ cùng HLV.' },

  // Sân Tee dài
  { id: 'long-9', category: 'Sân Tee dài', name: 'Tee dài · 9 hố', price: 400000, unit: 'round', duration: '2 – 2,5 giờ', desc: 'Extra 9 hố 150.000đ.' },
  { id: 'long-18', category: 'Sân Tee dài', name: 'Tee dài · 18 hố', price: 500000, unit: 'round', duration: '4 giờ', desc: 'Extra 18 hố 215.000đ.' },
  { id: 'long-36', category: 'Sân Tee dài', name: 'Tee dài · 36 hố', price: 800000, unit: 'golfer', desc: 'Bao gồm ½ con gà, 01 lon bia, nghỉ trưa, nước suối…' },
  { id: 'long-full', category: 'Sân Tee dài', name: 'Tee dài · Full ngày', price: 1400000, unit: 'golfer', duration: '05:00 – 22:00', desc: 'Bữa trưa ¼ gà, bữa chiều hải sản, HLV hỗ trợ, nghỉ trưa máy lạnh.', featured: true },

  // Sân Tee ngắn (Người mới)
  { id: 'short-9', category: 'Sân Tee ngắn (Người mới)', name: 'Tee ngắn · 9 hố', price: 200000, unit: 'round', duration: '2 – 2,5 giờ', desc: 'Extra 9 hố 50.000đ.' },
  { id: 'short-18', category: 'Sân Tee ngắn (Người mới)', name: 'Tee ngắn · 18 hố', price: 350000, unit: 'round', duration: '4 giờ', desc: 'Extra 18 hố 150.000đ.' },
  { id: 'short-36', category: 'Sân Tee ngắn (Người mới)', name: 'Tee ngắn · 36 hố', price: 500000, unit: 'golfer', desc: 'Bao gồm ¼ con gà, 01 lon bia, nghỉ trưa, nước suối…' },
  { id: 'short-full', category: 'Sân Tee ngắn (Người mới)', name: 'Tee ngắn · Full ngày', price: 1000000, unit: 'golfer', duration: '05:00 – 22:00', desc: 'HLV hỗ trợ 02 giờ, bữa trưa ¼ gà, bữa chiều hải sản.', featured: true },

  // Đào tạo & trải nghiệm
  { id: 'sgi', category: 'Đào tạo & trải nghiệm', name: 'SGI · Trải nghiệm cùng HLV', price: 500000, unit: 'người', duration: '4 giờ', desc: 'HLV trưởng dẫn nhóm, mini golf, suất ăn nhẹ, học & thi đấu ngay.' },
  { id: 'sgi-msc', category: 'Đào tạo & trải nghiệm', name: 'SGI & MSC · Học và chơi', price: 500000, unit: 'người', duration: '5 giờ', desc: 'Ưu tiên giờ thấp điểm 17:00–22:00, thi đấu ngay.' },
  { id: 'mini', category: 'Đào tạo & trải nghiệm', name: 'Mini golf · Chương trình đặc biệt', price: 500000, unit: 'người', desc: 'Cho doanh nhân, sinh viên; booking nhóm; tặng bia & nước.' },
];
