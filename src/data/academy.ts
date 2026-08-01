import type { AcademyJourneyStep, AcademyProgram } from '@/types';

export const ACADEMY_PROGRAMS: AcademyProgram[] = [
  {
    id: 'ac-01',
    name: 'Golf căn bản',
    level: 'foundation',
    audience: 'Người chưa từng chơi hoặc mới chơi dưới 3 tháng',
    sessions: 8,
    durationMinutes: 60,
    priceFrom: 5900000,
    groupSize: '1 kèm 1',
    summary: 'Nền tảng đầy đủ: cách cầm gậy, tư thế, nhịp swing và những cú đánh cơ bản nhất.',
    outcomes: ['Đánh trúng bóng ổn định', 'Hiểu cấu trúc một cú swing', 'Tự tin ra thảm tập một mình'],
    icon: 'Sprout',
  },
  {
    id: 'ac-02',
    name: 'Golf cho trẻ em',
    level: 'foundation',
    audience: 'Trẻ 7–15 tuổi',
    sessions: 12,
    durationMinutes: 75,
    priceFrom: 6600000,
    groupSize: 'Nhóm 4–6 bé',
    summary: 'Học qua trò chơi có mục tiêu, chú trọng an toàn và duy trì hứng thú lâu dài.',
    outcomes: ['Thói quen vận động đều đặn', 'Kỹ năng golf cơ bản', 'Tinh thần thể thao và kỷ luật'],
    icon: 'Baby',
  },
  {
    id: 'ac-03',
    name: 'Golf cho người lớn',
    level: 'improver',
    audience: 'Người đã chơi được, muốn ổn định kỹ thuật',
    sessions: 12,
    durationMinutes: 60,
    priceFrom: 9200000,
    groupSize: '1 kèm 1',
    summary: 'Rà soát lại toàn bộ kỹ thuật và xây dựng một swing có thể lặp lại ổn định.',
    outcomes: ['Swing nhất quán hơn', 'Giảm cú đánh hỏng', 'Bắt đầu kiểm soát được cự ly'],
    icon: 'Users',
  },
  {
    id: 'ac-04',
    name: 'Golf cho doanh nhân',
    level: 'improver',
    audience: 'Người bận rộn cần chơi được nhanh',
    sessions: 8,
    durationMinutes: 60,
    priceFrom: 8400000,
    groupSize: '1 kèm 1',
    summary: 'Lộ trình rút gọn tập trung vào những gì bạn thật sự cần trong một buổi golf công việc.',
    outcomes: ['Chơi được sau 8 buổi', 'Nắm nghi thức trên sân', 'Lịch học linh hoạt theo tuần'],
    icon: 'Briefcase',
  },
  {
    id: 'ac-05',
    name: 'Lớp cá nhân',
    level: 'improver',
    audience: 'Mọi trình độ',
    sessions: 1,
    durationMinutes: 60,
    priceFrom: 650000,
    groupSize: '1 kèm 1',
    summary: 'Buổi học lẻ theo nhu cầu, phù hợp khi bạn muốn sửa một vấn đề cụ thể.',
    outcomes: ['Giải quyết một vấn đề rõ ràng', 'Không ràng buộc lộ trình', 'Chọn HLV tự do'],
    icon: 'UserRound',
  },
  {
    id: 'ac-06',
    name: 'Lớp nhóm',
    level: 'foundation',
    audience: 'Nhóm bạn hoặc đồng nghiệp 3–6 người',
    sessions: 8,
    durationMinutes: 90,
    priceFrom: 3900000,
    groupSize: 'Nhóm 3–6 người',
    summary: 'Học cùng nhóm với chi phí thấp hơn, không khí vui và có động lực duy trì.',
    outcomes: ['Chi phí hợp lý hơn', 'Có bạn tập cùng', 'Học được từ lỗi của người khác'],
    icon: 'UsersRound',
  },
  {
    id: 'ac-07',
    name: 'Putting chuyên sâu',
    level: 'improver',
    audience: 'Người muốn giảm số gậy putt',
    sessions: 6,
    durationMinutes: 60,
    priceFrom: 4800000,
    groupSize: '1 kèm 1 hoặc nhóm 2',
    summary: 'Đọc độ dốc, kiểm soát lực và giữ nhịp ổn định trên mặt green tiêu chuẩn.',
    outcomes: ['Giảm 2–4 gậy putt mỗi vòng', 'Đọc green chính xác hơn', 'Nhịp gạt ổn định'],
    icon: 'CircleDot',
  },
  {
    id: 'ac-08',
    name: 'Short Game',
    level: 'improver',
    audience: 'Người mất điểm quanh green',
    sessions: 8,
    durationMinutes: 75,
    priceFrom: 6800000,
    groupSize: '1 kèm 1',
    summary: 'Chip, pitch và bunker qua các tình huống mô phỏng thực tế có đo kết quả.',
    outcomes: ['Xử lý được bóng khó quanh green', 'Có quy trình chọn gậy', 'Ổn định điểm số'],
    icon: 'Flag',
  },
  {
    id: 'ac-09',
    name: 'Swing Improvement',
    level: 'advanced',
    audience: 'Người chơi đã ổn định muốn nâng chất lượng cú đánh',
    sessions: 10,
    durationMinutes: 60,
    priceFrom: 11000000,
    groupSize: '1 kèm 1',
    summary: 'Tinh chỉnh swing dựa trên dữ liệu đo được, từng buổi chỉ thay đổi một yếu tố.',
    outcomes: ['Tăng cự ly ổn định', 'Đường bóng dễ đoán hơn', 'Hiểu số liệu cú đánh của mình'],
    icon: 'TrendingUp',
  },
  {
    id: 'ac-10',
    name: 'Luật golf và nghi thức',
    level: 'foundation',
    audience: 'Người chuẩn bị ra sân 18 hố',
    sessions: 2,
    durationMinutes: 120,
    priceFrom: 700000,
    groupSize: 'Nhóm tối đa 20 người',
    summary: 'Những điều luật và nghi thức bạn thật sự cần biết trước khi ra sân lớn lần đầu.',
    outcomes: ['Không lúng túng trên sân', 'Biết cách tính điểm', 'Ứng xử đúng mực với nhóm chơi'],
    icon: 'BookOpen',
  },
  {
    id: 'ac-11',
    name: 'Chuẩn bị thi đấu',
    level: 'competition',
    audience: 'Người chuẩn bị tham gia giải phong trào',
    sessions: 12,
    durationMinutes: 90,
    priceFrom: 15600000,
    groupSize: '1 kèm 1',
    summary: 'Chiến thuật quản trị vòng đấu, kiểm soát tâm lý và mô phỏng áp lực thi đấu.',
    outcomes: ['Giữ được phong độ cuối vòng', 'Có chiến thuật rõ ràng', 'Quen với áp lực thi đấu'],
    icon: 'Trophy',
  },
  {
    id: 'ac-12',
    name: 'Golf 3D và phân tích đường bóng',
    level: 'advanced',
    audience: 'Người muốn hiểu cú đánh bằng số liệu',
    sessions: 6,
    durationMinutes: 75,
    priceFrom: 9600000,
    groupSize: '1 kèm 1',
    summary: 'Đo tốc độ đầu gậy, góc tấn công, spin và đường bóng, rồi điều chỉnh dựa trên dữ liệu.',
    outcomes: ['Biết chính xác vấn đề của mình', 'Điều chỉnh có căn cứ', 'Theo dõi tiến bộ bằng số'],
    icon: 'Radar',
  },
];

export const ACADEMY_JOURNEY: AcademyJourneyStep[] = [
  {
    step: 1,
    title: 'Đánh giá đầu vào',
    description:
      'Buổi 45 phút đo hiện trạng: tư thế, nhịp swing, cự ly và độ ổn định. Kết quả được ghi lại làm mốc so sánh.',
  },
  {
    step: 2,
    title: 'Chọn mục tiêu',
    description:
      'Bạn muốn chơi giải trí, chơi cùng đối tác hay thi đấu? Mục tiêu quyết định toàn bộ lộ trình phía sau.',
  },
  {
    step: 3,
    title: 'Chọn huấn luyện viên',
    description:
      'Lotus đề xuất 2–3 huấn luyện viên phù hợp với mục tiêu, phong cách học và lịch rảnh của bạn.',
  },
  {
    step: 4,
    title: 'Xây dựng lộ trình',
    description:
      'Huấn luyện viên thiết kế lộ trình theo số buổi, chia thành các giai đoạn có mục tiêu đo được.',
  },
  {
    step: 5,
    title: 'Đặt buổi học',
    description:
      'Đặt lịch trực tiếp trên website hoặc để huấn luyện viên giữ khung giờ cố định hằng tuần cho bạn.',
  },
  {
    step: 6,
    title: 'Theo dõi tiến độ',
    description:
      'Mỗi buổi học đều có ghi chú và bài tập về nhà, hiển thị trong Dashboard của bạn.',
  },
  {
    step: 7,
    title: 'Đánh giá định kỳ',
    description:
      'Sau mỗi 4 buổi, bạn được đo lại các chỉ số ban đầu để thấy rõ mình đã tiến bộ ở đâu.',
  },
  {
    step: 8,
    title: 'Hoàn thành chương trình',
    description:
      'Nhận báo cáo tổng kết, chứng nhận hoàn thành và gợi ý lộ trình tiếp theo nếu bạn muốn đi xa hơn.',
  },
];

export const ACADEMY_TECHNOLOGY = [
  {
    name: 'Phân tích swing 3D',
    description:
      'Hệ thống ghi lại chuyển động cơ thể ở nhiều góc, cho phép huấn luyện viên chỉ ra sai lệch mà mắt thường khó thấy.',
    icon: 'Box',
  },
  {
    name: 'Đo đường bóng',
    description:
      'Tốc độ đầu gậy, tốc độ bóng, góc phóng, độ xoáy và cự ly thực tế được ghi lại cho từng cú đánh.',
    icon: 'Radar',
  },
  {
    name: 'Phân tích cú gạt',
    description:
      'Thiết bị đo đường lăn và mặt gậy lúc chạm bóng, giúp phát hiện lệch hướng chỉ vài độ.',
    icon: 'CircleDot',
  },
  {
    name: 'Hồ sơ học viên số hoá',
    description:
      'Mọi buổi học, ghi chú và chỉ số đều được lưu trong hồ sơ, xem lại bất cứ lúc nào trong Dashboard.',
    icon: 'FolderOpen',
  },
];

export const ACADEMY_ACHIEVEMENTS = [
  { value: '1.240+', label: 'Học viên đã theo học' },
  { value: '87%', label: 'Học viên tiếp tục sau buổi đầu' },
  { value: '12', label: 'Huấn luyện viên chuyên trách' },
  { value: '4,8/5', label: 'Điểm hài lòng trung bình' },
];

export const ACADEMY_STUDENT_RESULTS = [
  {
    name: 'Học viên T.',
    program: 'Golf căn bản · 8 buổi',
    before: 'Chưa từng cầm gậy',
    after: 'Đánh trúng bóng ổn định, tự tin ra thảm tập một mình',
  },
  {
    name: 'Học viên H.',
    program: 'Putting chuyên sâu · 6 buổi',
    before: 'Trung bình 38 gậy putt mỗi vòng',
    after: 'Giảm còn 33 gậy putt, đọc green chính xác hơn rõ rệt',
  },
  {
    name: 'Học viên M.',
    program: 'Chuẩn bị thi đấu · 12 buổi',
    before: 'Hay mất phong độ ở 4 hố cuối',
    after: 'Giữ ổn định cả vòng, vào chung kết một giải phong trào',
  },
  {
    name: 'Học viên bé N. (10 tuổi)',
    program: 'Golf cho trẻ em · 12 buổi',
    before: 'Chưa quen vận động đều đặn',
    after: 'Tham gia Junior Golf Day và đạt giải nhóm tuổi',
  },
];
