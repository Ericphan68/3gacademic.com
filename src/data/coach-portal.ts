import type {
  CoachMetrics,
  CoachReferral,
  CoachStudent,
  CommissionRecord,
} from '@/types';

/** Dữ liệu demo cho Coach Portal (tài khoản coach@lotusgolf.vn → Trần Thu Hà). */

export const COACH_PORTAL_METRICS: CoachMetrics = {
  totalStudents: 42,
  newStudentsThisMonth: 6,
  lessonsToday: 5,
  revenueThisMonth: 68400000,
  commissionThisMonth: 23940000,
  commissionPending: 5100000,
  rating: 4.9,
  rankThisMonth: 2,
  rankTotal: 12,
  monthlySeries: [
    { month: 'T2', revenue: 41500000, commission: 14525000, lessons: 48 },
    { month: 'T3', revenue: 47200000, commission: 16520000, lessons: 55 },
    { month: 'T4', revenue: 52800000, commission: 18480000, lessons: 61 },
    { month: 'T5', revenue: 49600000, commission: 17360000, lessons: 58 },
    { month: 'T6', revenue: 58900000, commission: 20615000, lessons: 68 },
    { month: 'T7', revenue: 68400000, commission: 23940000, lessons: 79 },
  ],
};

const STUDENT_SEEDS: [string, CoachStudent['level'], string, number, number, string, boolean][] = [
  ['Nguyễn Thu Trang', 'beginner', 'Golf căn bản · 8 buổi', 8, 3, 'Đã ổn định tư thế, cần luyện thêm nhịp chuyển trọng tâm.', false],
  ['Trần Quốc Hưng', 'intermediate', 'Swing Improvement · 10 buổi', 10, 6, 'Đường bóng bên phải giảm rõ. Tiếp tục bài tập đường ngắm.', true],
  ['Lê Mỹ Duyên', 'beginner', 'Golf căn bản · 8 buổi', 8, 1, 'Buổi cuối tuần này là buổi kết thúc lộ trình, cần đánh giá tổng kết.', false],
  ['Phạm Đức Thịnh', 'advanced', 'Chuẩn bị thi đấu · 12 buổi', 12, 9, 'Tâm lý ổn định hơn ở các bài mô phỏng áp lực.', false],
  ['Đỗ Lan Phương', 'intermediate', 'Golf cho người lớn · 12 buổi', 12, 5, 'Cần tập trung vào kiểm soát cự ly gậy sắt.', true],
  ['Hoàng Vĩnh Phúc', 'intermediate', 'Short Game · 8 buổi', 8, 4, 'Cú chip đã ổn, chuyển sang xử lý bunker từ buổi tới.', false],
  ['Vũ Kiều My', 'beginner', 'Lớp nhóm · 8 buổi', 8, 7, 'Học cùng nhóm bạn, tiến bộ nhanh, tinh thần tốt.', true],
  ['Bùi Nam Khang', 'advanced', 'Golf 3D · 6 buổi', 6, 2, 'Số liệu góc tấn công đã cải thiện 3 độ so với buổi đầu.', false],
  ['Ngô Thanh Hà', 'beginner', 'Golf cho doanh nhân · 8 buổi', 8, 5, 'Lịch bận, ưu tiên khung 20:00. Cần bài tập ngắn tại nhà.', false],
  ['Đặng Minh Quân', 'intermediate', 'Putting chuyên sâu · 6 buổi', 6, 3, 'Giảm được 2 gậy putt trung bình sau 3 buổi.', true],
  ['Lý Bảo Ngọc', 'beginner', 'Golf căn bản · 8 buổi', 8, 8, 'Học viên mới, buổi đầu tiên vào tuần sau.', false],
  ['Trương Gia Huy', 'advanced', 'Swing Improvement · 10 buổi', 10, 1, 'Sắp hoàn thành lộ trình, cân nhắc chuyển sang gói thi đấu.', false],
];

export const COACH_STUDENTS: CoachStudent[] = STUDENT_SEEDS.map(
  ([name, level, programName, total, remaining, note, referred], index) => ({
    id: `st-${String(index + 1).padStart(2, '0')}`,
    name,
    initials: name
      .split(' ')
      .map((p) => p[0])
      .slice(-2)
      .join('')
      .toUpperCase(),
    level,
    programName,
    sessionsTotal: total,
    sessionsRemaining: remaining,
    lastLessonDate: `2026-07-${String(28 - index).padStart(2, '0')}`,
    note,
    joinedAt: `2026-0${(index % 6) + 1}-1${(index % 9) + 1}`,
    referredByCoach: referred,
  }),
);

export const COACH_COMMISSIONS: CommissionRecord[] = [
  { id: 'cm-01', date: '2026-07-30', source: 'lesson', label: 'Buổi học 1-1 · Nguyễn Thu Trang', grossAmount: 850000, commissionAmount: 297500, status: 'confirmed' },
  { id: 'cm-02', date: '2026-07-30', source: 'lesson', label: 'Buổi học 1-1 · Phạm Đức Thịnh', grossAmount: 850000, commissionAmount: 297500, status: 'confirmed' },
  { id: 'cm-03', date: '2026-07-29', source: 'package', label: 'Gói 8 buổi · Lý Bảo Ngọc', grossAmount: 5900000, commissionAmount: 1180000, status: 'confirmed' },
  { id: 'cm-04', date: '2026-07-29', source: 'referral', label: 'Giới thiệu hội viên · Trần Quốc Hưng', grossAmount: 15000000, commissionAmount: 750000, status: 'confirmed' },
  { id: 'cm-05', date: '2026-07-28', source: 'lesson', label: 'Buổi học nhóm · Lớp Thứ Ba', grossAmount: 1950000, commissionAmount: 585000, status: 'confirmed' },
  { id: 'cm-06', date: '2026-07-27', source: 'event', label: 'Hỗ trợ Corporate Golf Day', grossAmount: 3000000, commissionAmount: 900000, status: 'confirmed' },
  { id: 'cm-07', date: '2026-07-26', source: 'lesson', label: 'Buổi học 1-1 · Đỗ Lan Phương', grossAmount: 850000, commissionAmount: 297500, status: 'confirmed' },
  { id: 'cm-08', date: '2026-07-25', source: 'package', label: 'Gói 12 buổi · Trương Gia Huy', grossAmount: 9200000, commissionAmount: 1840000, status: 'pending' },
  { id: 'cm-09', date: '2026-07-24', source: 'referral', label: 'Giới thiệu hội viên · Đặng Minh Quân', grossAmount: 15000000, commissionAmount: 750000, status: 'pending' },
  { id: 'cm-10', date: '2026-07-23', source: 'lesson', label: 'Buổi học 1-1 · Vũ Kiều My', grossAmount: 850000, commissionAmount: 297500, status: 'pending' },
  { id: 'cm-11', date: '2026-07-22', source: 'lesson', label: 'Buổi học 1-1 · Ngô Thanh Hà', grossAmount: 850000, commissionAmount: 297500, status: 'confirmed' },
  { id: 'cm-12', date: '2026-07-21', source: 'package', label: 'Gói 6 buổi · Bùi Nam Khang', grossAmount: 4800000, commissionAmount: 960000, status: 'pending' },
];

export const COACH_REFERRALS: CoachReferral[] = [
  { id: 'rf-01', studentName: 'Trần Quốc Hưng', joinedAt: '2026-03-14', firstBookingAt: '2026-03-16', lifetimeValue: 24500000, status: 'active' },
  { id: 'rf-02', studentName: 'Đỗ Lan Phương', joinedAt: '2026-04-02', firstBookingAt: '2026-04-05', lifetimeValue: 18200000, status: 'active' },
  { id: 'rf-03', studentName: 'Vũ Kiều My', joinedAt: '2026-05-11', firstBookingAt: '2026-05-11', lifetimeValue: 9600000, status: 'active' },
  { id: 'rf-04', studentName: 'Đặng Minh Quân', joinedAt: '2026-06-08', firstBookingAt: '2026-06-13', lifetimeValue: 16800000, status: 'active' },
  { id: 'rf-05', studentName: 'Nguyễn Hải Đăng', joinedAt: '2026-06-21', firstBookingAt: null, lifetimeValue: 0, status: 'inactive' },
  { id: 'rf-06', studentName: 'Phan Thuỳ Dương', joinedAt: '2026-07-04', firstBookingAt: '2026-07-06', lifetimeValue: 5400000, status: 'active' },
];

export const COACH_LEADERBOARD = [
  { rank: 1, name: 'Nguyễn Hoàng Minh', lessons: 86, rating: 4.9 },
  { rank: 2, name: 'Trần Thu Hà', lessons: 79, rating: 4.9 },
  { rank: 3, name: 'Đặng Mỹ Linh', lessons: 74, rating: 4.9 },
  { rank: 4, name: 'Lê Quang Duy', lessons: 68, rating: 4.8 },
  { rank: 5, name: 'Phạm Nhật Anh', lessons: 65, rating: 5 },
];

export const COMMISSION_POLICY = [
  {
    title: 'Buổi học 1-1',
    rate: '35%',
    detail: 'Áp dụng cho mọi buổi học lẻ do huấn luyện viên trực tiếp giảng dạy.',
  },
  {
    title: 'Gói học nhiều buổi',
    rate: '20%',
    detail: 'Tính trên giá trị gói tại thời điểm học viên thanh toán.',
  },
  {
    title: 'Lớp nhóm',
    rate: '30%',
    detail: 'Tính trên tổng doanh thu lớp, chia theo số buổi thực dạy.',
  },
  {
    title: 'Giới thiệu hội viên',
    rate: '5%',
    detail: 'Áp dụng một lần trên giá trị gói hội viên mà người được giới thiệu đăng ký.',
  },
  {
    title: 'Hỗ trợ sự kiện',
    rate: '30%',
    detail: 'Tính trên phần thù lao sự kiện được phân bổ cho huấn luyện viên.',
  },
];

export const REFERRAL_ATTRIBUTION_NOTE =
  'Học viên được ghi nhận cho huấn luyện viên giới thiệu khi đăng ký qua link hoặc mã referral. Trạng thái ghi nhận và hoa hồng hiển thị minh bạch tại đây. Đây là giao diện demo, số liệu chưa kết nối hệ thống thật.';
