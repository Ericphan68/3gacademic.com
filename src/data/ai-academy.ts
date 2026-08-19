/**
 * Nội dung công khai của "Lotus AI Golf Academy" (giáo trình đào tạo golf ứng
 * dụng AI). Đã lọc bỏ phần nội bộ/kinh doanh (mô hình 1 coach+AI, kiến trúc
 * thương hiệu, mô hình triển khai). Tách riêng để dễ cập nhật.
 */

export interface AiLevel {
  level: string;
  name: string;
  tagline: string;
  duration?: string;
  forWho?: string;
  highlights: string[];
  output?: string;
}

export const AI_ACADEMY = {
  brand: 'Lotus AI Golf Academy',
  slogan: 'GREATNESS – GOLF – GLOBAL',
  tagline: 'Học Golf bằng công nghệ · Luyện tập bằng dữ liệu · Phát triển bằng năng lực thực chiến',
  intro:
    'Mô hình đào tạo Golf thế hệ mới của hệ sinh thái An Phú Lotus — kết hợp huấn luyện viên, trí tuệ nhân tạo, dữ liệu và trải nghiệm sân thật. Không chỉ dạy bạn "đánh được Golf", mà giúp bạn hiểu chính cú đánh của mình và tiến bộ có đo lường.',
  brandMessageEn: 'Coach by human. Powered by AI. Perfected by practice.',
  brandMessageVi:
    'Golf của thế hệ mới — nơi con người huấn luyện, dữ liệu dẫn đường và AI giúp mỗi người chơi tiến bộ nhanh hơn.',

  philosophy3G: [
    { key: 'GREATNESS', desc: 'Phẩm cách, kỷ luật, chính trực và bản lĩnh.' },
    { key: 'GOLF', desc: 'Đào tạo Golf thực chiến từ cơ bản đến chuyên nghiệp.' },
    { key: 'GLOBAL', desc: 'Tiếp cận tiêu chuẩn, công nghệ và chứng chỉ quốc tế.' },
  ],

  aiTiers: [
    { name: 'AI Assessment', desc: 'AI đánh giá trình độ ban đầu của bạn.' },
    { name: 'AI Swing Analysis', desc: 'Phân tích video cú swing chi tiết.' },
    { name: 'AI Personal Coach', desc: 'Đề xuất bài tập riêng cho từng học viên.' },
    { name: 'AI Progress Tracking', desc: 'Theo dõi sự tiến bộ bằng dữ liệu.' },
    { name: 'AI Golf Profile', desc: 'Xây dựng hồ sơ năng lực Golf cá nhân.' },
  ],

  flow: ['Học viên', 'Camera / Sensor', 'AI', 'Dữ liệu', 'Coach', 'Bài tập cá nhân', 'Đo lại', 'Tiến bộ'],

  levels: [
    {
      level: 'Level 0',
      name: 'Lotus Golf Discovery',
      tagline: 'Làm quen với Golf trong 1 ngày',
      duration: '1 buổi · 3–4 giờ',
      forWho: 'Người chưa từng chơi Golf',
      highlights: [
        'Làm quen sân Golf & golf etiquette',
        'Các loại gậy, grip, setup, posture',
        'Full swing cơ bản, putting, chipping',
        'Trải nghiệm đánh Golf thực tế',
      ],
      output: 'Nhận Lotus AI Golf Profile — phiên bản 01',
    },
    {
      level: 'Level 1',
      name: 'Lotus Golf Foundation',
      tagline: 'Nền tảng Golf chuẩn',
      duration: '4 tuần · 16 buổi',
      highlights: [
        'Golf Fundamentals: grip, stance, posture, alignment, ball position',
        'Swing Fundamentals: takeaway → backswing → impact → follow-through',
        'Short game: putting, chipping, pitching',
        'Course etiquette, luật cơ bản & văn hóa Golf',
      ],
    },
    {
      level: 'Level 2',
      name: 'Lotus AI Swing',
      tagline: 'Biến dữ liệu thành cú đánh tốt hơn',
      duration: '6 tuần · 24 buổi',
      highlights: [
        'Driver, fairway wood, hybrid, iron, wedge, putting',
        'AI Swing Lab: club path, face angle, swing plane, tempo, impact…',
        'Lotus Swing Score /100 — đo tiến bộ theo từng chỉ số',
      ],
      output: 'Mục tiêu: hôm nay tốt hơn chính mình của tháng trước',
    },
    {
      level: 'Level 3',
      name: 'Lotus AI Performance',
      tagline: 'Từ đánh Golf sang chơi Golf',
      duration: '8 tuần · 32 buổi',
      highlights: [
        'Distance: phân tích khoảng cách từng gậy',
        'Accuracy: direction, dispersion, miss pattern',
        'Short game & putting: distance control, 3-putt, tỉ lệ putt',
        'Course strategy: Tee → Fairway → Approach → Green → Putt',
      ],
    },
    {
      level: 'Level 4',
      name: 'Lotus AI Course',
      tagline: 'Học Golf trên sân thật',
      duration: '4–8 tuần',
      highlights: [
        'Ứng dụng thực chiến ngoài sân',
        'AI Caddie: gợi ý gậy, mục tiêu, vùng an toàn, rủi ro & chiến thuật',
        'Coach vẫn là người quyết định chuyên môn cuối cùng',
      ],
    },
    {
      level: 'Level 5',
      name: 'Lotus Golf Professional',
      tagline: 'Đào tạo nguồn nhân lực Golf',
      highlights: [
        'Định hướng nghề: Caddie, Golf Instructor, Golf Operations',
        'Golf Technology: AI Golf, computer vision, simulator, data analytics',
        'Chuẩn hoá từ căn bản đến chuyên nghiệp',
      ],
    },
  ] satisfies AiLevel[],

  features: [
    {
      name: 'Lotus AI Golf ID',
      desc: 'Hồ sơ điện tử cá nhân: handicap, trình độ, mục tiêu, lịch sử luyện tập cùng các chỉ số Swing Score, Accuracy, Distance, Putting, Short Game.',
    },
    {
      name: 'Lotus AI Coach',
      desc: 'Trợ lý AI riêng: gợi ý bài tập mỗi ngày, giải thích vì sao bóng bị slice, nên tập driver hay iron, chọn gậy theo khoảng cách…',
    },
    {
      name: 'Báo cáo tiến bộ',
      desc: 'AI tự tạo báo cáo theo mốc 30/60/90 ngày — ví dụ: "Sau 90 ngày, Swing Score tăng từ 61 lên 78."',
    },
  ],

  products: [
    {
      name: 'Lotus 90 — 90 ngày để chơi Golf tốt hơn',
      steps: ['30 ngày: Build the Foundation', '30 ngày: Build the Swing', '30 ngày: Build the Game'],
      desc: 'Cuối khóa: AI Test → Coach Test → Course Test, sau đó cấp Lotus AI Golf Certificate kèm AI Performance Report.',
    },
    {
      name: 'Lotus AI Golf Camp — 3 ngày',
      steps: ['Day 1: Assessment (AI đánh giá toàn diện)', 'Day 2: Correction (Coach + AI sửa lỗi chính)', 'Day 3: Performance (ra sân + đánh giá lại)'],
      desc: 'Kết thúc nhận Lotus AI Golf Performance Report.',
    },
  ],
} as const;
