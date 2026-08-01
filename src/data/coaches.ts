import { coachAvatar } from '@/constants/media';
import type { Coach, CoachLanguage, CoachSpecialty } from '@/types';

/**
 * 12 huấn luyện viên demo.
 * Tên là tên hư cấu, không dùng thông tin cá nhân thật.
 * Lịch trống không lưu tĩnh ở đây mà được `coachService.getAvailability()`
 * sinh theo thuật toán xác định, tránh dữ liệu hết hạn theo thời gian.
 */

interface CoachSeed {
  slug: string;
  name: string;
  title: string;
  years: number;
  specialties: CoachSpecialty[];
  languages: CoachLanguage[];
  rating: number;
  reviewCount: number;
  students: number;
  price: number;
  bio: string;
  philosophy: string;
  certifications: string[];
  highlights: string[];
  suitableFor: string[];
  featured: boolean;
  videoNote: string;
}

const SEEDS: CoachSeed[] = [
  {
    slug: 'nguyen-hoang-minh',
    name: 'Nguyễn Hoàng Minh',
    title: 'Head Coach · Giám đốc chuyên môn',
    years: 16,
    specialties: ['advanced', 'swing', 'competition'],
    languages: ['vi', 'en'],
    rating: 4.9,
    reviewCount: 214,
    students: 380,
    price: 1200000,
    bio: 'Mười sáu năm làm việc với cả người mới lẫn vận động viên phong trào, Hoàng Minh xây dựng hệ thống đào tạo của Lotus dựa trên một nguyên tắc: mỗi người có một cơ thể khác nhau, nên không thể có một swing chuẩn cho tất cả.',
    philosophy:
      'Tôi không sửa swing của bạn cho giống ai cả. Tôi tìm ra swing hiệu quả nhất mà cơ thể bạn có thể lặp lại ổn định, rồi giúp bạn giữ nó dưới áp lực.',
    certifications: ['PGA Level 3 (mô phỏng)', 'TPI Certified Level 2', 'Trackman Performance Coach'],
    highlights: [
      'Xây dựng chương trình đào tạo cho 6 trung tâm golf',
      'Huấn luyện 12 vận động viên vào vòng chung kết giải phong trào quốc gia',
      'Diễn giả tại 4 hội thảo kỹ thuật golf trong nước',
    ],
    suitableFor: ['Người chơi muốn giảm handicap', 'Người chuẩn bị thi đấu', 'Người đã học nhưng chững lại'],
    featured: true,
    videoNote: 'Video giới thiệu phương pháp huấn luyện sẽ được cập nhật ở phiên bản chính thức.',
  },
  {
    slug: 'tran-thu-ha',
    name: 'Trần Thu Hà',
    title: 'Senior Coach · Chuyên gia người mới',
    years: 11,
    specialties: ['beginner', 'swing', 'business'],
    languages: ['vi', 'en'],
    rating: 4.9,
    reviewCount: 189,
    students: 420,
    price: 850000,
    bio: 'Thu Hà bắt đầu sự nghiệp bằng việc dạy golf cho những người nói rằng họ "chắc chắn không có năng khiếu". Chín trên mười người trong số đó vẫn đang chơi golf đến hôm nay.',
    philosophy:
      'Buổi học đầu tiên không phải để bạn đánh đẹp. Nó là để bạn rời sân với cảm giác mình làm được — và muốn quay lại.',
    certifications: ['PGA Level 2 (mô phỏng)', 'Chứng chỉ huấn luyện người mới bắt đầu', 'Sơ cấp cứu thể thao'],
    highlights: [
      'Hơn 400 học viên bắt đầu từ con số 0',
      'Thiết kế giáo trình "First Swing" đang dùng tại Lotus',
      'Tỷ lệ học viên tiếp tục sau buổi đầu: 87%',
    ],
    suitableFor: ['Người chưa từng cầm gậy', 'Người sợ bị đánh giá', 'Doanh nhân cần chơi được nhanh'],
    featured: true,
    videoNote: 'Video buổi học mẫu dành cho người mới sẽ được bổ sung.',
  },
  {
    slug: 'le-quang-duy',
    name: 'Lê Quang Duy',
    title: 'Putting & Short Game Specialist',
    years: 9,
    specialties: ['putting', 'short-game'],
    languages: ['vi', 'en'],
    rating: 4.8,
    reviewCount: 156,
    students: 265,
    price: 900000,
    bio: 'Quang Duy dành gần như toàn bộ thời gian huấn luyện của mình trong bán kính 100 mét quanh green — nơi mà theo anh, điểm số thật sự được quyết định.',
    philosophy:
      'Bạn có thể phát bóng xa thêm 20 mét và không giảm được gậy nào. Nhưng cải thiện cú gạt trong 3 buổi thì con số trên thẻ điểm sẽ đổi ngay.',
    certifications: ['Chứng chỉ Short Game chuyên sâu', 'SAM PuttLab Analyst', 'TPI Certified Level 1'],
    highlights: [
      'Giảm trung bình 3,4 gậy putt mỗi vòng cho học viên sau 6 buổi',
      'Xây dựng bài kiểm tra putting 8 trạm của Lotus',
      'Cố vấn kỹ thuật cho đội tuyển golf sinh viên',
    ],
    suitableFor: ['Người chơi mất điểm quanh green', 'Người chuẩn bị thi đấu', 'Người muốn cải thiện nhanh điểm số'],
    featured: true,
    videoNote: 'Video phân tích cú gạt bằng thiết bị đo sẽ được cập nhật.',
  },
  {
    slug: 'pham-nhat-anh',
    name: 'Phạm Nhật Anh',
    title: 'Junior Golf Coach',
    years: 8,
    specialties: ['junior', 'beginner'],
    languages: ['vi', 'en'],
    rating: 5,
    reviewCount: 142,
    students: 310,
    price: 700000,
    bio: 'Nhật Anh chuyển từ huấn luyện thể chất học đường sang golf trẻ em, mang theo cách tiếp cận lấy trò chơi làm trung tâm mà trẻ 7 tuổi vẫn theo được suốt 75 phút.',
    philosophy:
      'Trẻ con không học bằng lời giảng. Chúng học bằng việc chơi một trò chơi có mục tiêu rõ ràng và được khen đúng lúc.',
    certifications: ['Chứng chỉ huấn luyện golf trẻ em', 'Chứng chỉ giáo dục thể chất', 'Sơ cấp cứu nhi'],
    highlights: [
      'Xây dựng chương trình Junior Golf 3 cấp độ',
      'Hơn 300 học viên nhỏ tuổi',
      'Tổ chức 9 kỳ Junior Golf Day tại Lotus',
    ],
    suitableFor: ['Trẻ 7–15 tuổi', 'Bé lần đầu tiếp xúc thể thao', 'Gia đình muốn con vận động đều đặn'],
    featured: true,
    videoNote: 'Video buổi học Junior Golf sẽ được bổ sung sau khi có sự đồng ý của phụ huynh.',
  },
  {
    slug: 'vo-thanh-son',
    name: 'Võ Thành Sơn',
    title: 'Swing Technician · Golf 3D',
    years: 12,
    specialties: ['swing', 'advanced'],
    languages: ['vi', 'en'],
    rating: 4.8,
    reviewCount: 131,
    students: 240,
    price: 1100000,
    bio: 'Thành Sơn làm việc chủ yếu với dữ liệu: tốc độ đầu gậy, góc tấn công, đường bóng. Anh tin rằng cảm giác có thể sai, nhưng con số thì không.',
    philosophy:
      'Trước khi thay đổi bất cứ điều gì, tôi cần biết chuyện gì đang thật sự xảy ra. Đo trước, sửa sau.',
    certifications: ['Trackman Level 2', 'Chứng chỉ phân tích chuyển động 3D', 'TPI Certified Level 2'],
    highlights: [
      'Vận hành phòng phân tích 3D của Lotus',
      'Xây dựng quy trình đánh giá đầu vào bằng số liệu',
      'Đào tạo nội bộ cho đội ngũ HLV về đọc dữ liệu Trackman',
    ],
    suitableFor: ['Người thích số liệu', 'Người chững lại lâu ngày', 'Người muốn hiểu bản chất cú đánh'],
    featured: false,
    videoNote: 'Video demo phòng phân tích 3D sẽ được cập nhật.',
  },
  {
    slug: 'dang-my-linh',
    name: 'Đặng Mỹ Linh',
    title: 'Coach · Chuyên nữ và doanh nhân',
    years: 10,
    specialties: ['beginner', 'business', 'swing'],
    languages: ['vi', 'en', 'ko'],
    rating: 4.9,
    reviewCount: 167,
    students: 295,
    price: 950000,
    bio: 'Mỹ Linh làm việc nhiều với khách nữ và nhóm doanh nhân bận rộn — những người có ít thời gian nhưng cần chơi được tự tin trong các buổi giao lưu công việc.',
    philosophy:
      'Với người bận, mục tiêu không phải là hoàn hảo. Mục tiêu là bạn bước ra sân mà không thấy lúng túng.',
    certifications: ['PGA Level 2 (mô phỏng)', 'Chứng chỉ huấn luyện golf nữ', 'Chứng chỉ tiếng Hàn chuyên ngành thể thao'],
    highlights: [
      'Thiết kế lộ trình "8 buổi chơi được" cho khách doanh nhân',
      'Phụ trách nhóm học viên Hàn Quốc tại Lotus',
      'Tỷ lệ học viên hoàn thành lộ trình: 91%',
    ],
    suitableFor: ['Khách nữ mới bắt đầu', 'Doanh nhân bận rộn', 'Khách Hàn Quốc'],
    featured: true,
    videoNote: 'Video giới thiệu lộ trình 8 buổi sẽ được cập nhật.',
  },
  {
    slug: 'hoang-gia-bao',
    name: 'Hoàng Gia Bảo',
    title: 'Competition Coach',
    years: 14,
    specialties: ['competition', 'advanced', 'short-game'],
    languages: ['vi', 'en'],
    rating: 4.7,
    reviewCount: 98,
    students: 140,
    price: 1300000,
    bio: 'Gia Bảo tập trung vào nhóm học viên chuẩn bị thi đấu: quản trị vòng đấu, chiến thuật chọn gậy và kiểm soát tâm lý ở những hố cuối.',
    philosophy:
      'Kỹ thuật giúp bạn tập tốt. Chiến thuật và cái đầu lạnh mới giúp bạn thi đấu tốt. Hai chuyện đó phải học riêng.',
    certifications: ['Chứng chỉ huấn luyện thi đấu', 'Chứng chỉ tâm lý thể thao cơ bản', 'Trackman Level 1'],
    highlights: [
      'Đồng hành cùng 12 học viên tại các giải phong trào',
      'Xây dựng giáo trình quản trị vòng đấu',
      'Tổ chức các buổi mô phỏng thi đấu tại Lotus',
    ],
    suitableFor: ['Người chuẩn bị giải đấu', 'Người chơi ổn định muốn nâng hạng', 'Người hay mất phong độ cuối vòng'],
    featured: false,
    videoNote: 'Video buổi mô phỏng thi đấu sẽ được cập nhật.',
  },
  {
    slug: 'nguyen-khanh-vy',
    name: 'Nguyễn Khánh Vy',
    title: 'Coach · Putting & Junior',
    years: 7,
    specialties: ['putting', 'junior', 'beginner'],
    languages: ['vi', 'en'],
    rating: 4.8,
    reviewCount: 112,
    students: 205,
    price: 720000,
    bio: 'Khánh Vy dạy cả trẻ em lẫn người lớn mới bắt đầu, và đặc biệt mạnh ở phần putting — nơi cô cho rằng ai cũng có thể giỏi nếu chịu tập đúng cách.',
    philosophy:
      'Putting là phần duy nhất của golf mà thể lực không quyết định. Ai cũng có thể giỏi. Vấn đề chỉ là bạn có chịu đo và sửa hay không.',
    certifications: ['Chứng chỉ huấn luyện golf cơ bản', 'SAM PuttLab Analyst', 'Sơ cấp cứu nhi'],
    highlights: [
      'Phụ trách lớp Putting nhóm cuối tuần',
      'Đồng hành 200+ học viên mới',
      'Xây dựng bộ bài tập putting cho trẻ em',
    ],
    suitableFor: ['Trẻ em', 'Người mới bắt đầu', 'Người muốn cải thiện cú gạt'],
    featured: false,
    videoNote: 'Video bài tập putting cho người mới sẽ được cập nhật.',
  },
  {
    slug: 'bui-tuan-kiet',
    name: 'Bùi Tuấn Kiệt',
    title: 'Coach · Short Game',
    years: 9,
    specialties: ['short-game', 'swing'],
    languages: ['vi'],
    rating: 4.7,
    reviewCount: 87,
    students: 178,
    price: 780000,
    bio: 'Tuấn Kiệt phụ trách khu Short Game của Lotus, nơi anh dựng lại các tình huống khó quanh green và giúp học viên xử lý chúng bằng quy trình thay vì may rủi.',
    philosophy:
      'Cú chip hỏng không phải do bạn kém. Do bạn chưa có quy trình để chọn gậy và chọn quỹ đạo. Có quy trình rồi thì mọi thứ đơn giản hơn nhiều.',
    certifications: ['Chứng chỉ Short Game chuyên sâu', 'Chứng chỉ huấn luyện golf cơ bản'],
    highlights: [
      'Thiết kế 8 tình huống mô phỏng của Short Game Lab',
      'Hơn 170 học viên thường xuyên',
      'Tổ chức thử thách Short Game hàng tháng',
    ],
    suitableFor: ['Người mất điểm quanh green', 'Người chơi trung cấp', 'Người muốn ổn định điểm số'],
    featured: false,
    videoNote: 'Video 8 tình huống Short Game sẽ được cập nhật.',
  },
  {
    slug: 'do-hai-yen',
    name: 'Đỗ Hải Yến',
    title: 'Coach · Người mới và gia đình',
    years: 6,
    specialties: ['beginner', 'junior'],
    languages: ['vi', 'en'],
    rating: 4.8,
    reviewCount: 94,
    students: 186,
    price: 650000,
    bio: 'Hải Yến phụ trách phần lớn các buổi Family Golf Day, nơi cô phải giữ được sự chú ý của cả người lớn lẫn trẻ nhỏ trong cùng một buổi.',
    philosophy:
      'Khi cả nhà cùng học, điều quan trọng nhất là không ai bị bỏ lại phía sau. Tôi luôn thiết kế bài tập có nhiều mức độ trong cùng một trò chơi.',
    certifications: ['Chứng chỉ huấn luyện golf cơ bản', 'Chứng chỉ hoạt động nhóm gia đình', 'Sơ cấp cứu'],
    highlights: [
      'Phụ trách 40+ buổi Family Golf Day',
      'Xây dựng bộ trò chơi putting gia đình',
      'Điểm hài lòng trung bình 4,9/5',
    ],
    suitableFor: ['Gia đình có trẻ nhỏ', 'Người mới bắt đầu', 'Nhóm bạn lần đầu chơi golf'],
    featured: false,
    videoNote: 'Video Family Golf Day sẽ được cập nhật.',
  },
  {
    slug: 'truong-nam-phong',
    name: 'Trương Nam Phong',
    title: 'Coach · Doanh nhân và networking',
    years: 13,
    specialties: ['business', 'advanced', 'swing'],
    languages: ['vi', 'en', 'ja'],
    rating: 4.9,
    reviewCount: 121,
    students: 210,
    price: 1150000,
    bio: 'Nam Phong làm việc nhiều với nhóm khách doanh nhân và khách Nhật Bản, kết hợp huấn luyện kỹ thuật với hiểu biết về nghi thức trên sân.',
    philosophy:
      'Trong một buổi golf công việc, kỹ thuật chỉ là một nửa. Nửa còn lại là cách bạn cư xử trên sân — và điều đó hoàn toàn học được.',
    certifications: ['PGA Level 2 (mô phỏng)', 'Chứng chỉ nghi thức golf', 'Chứng chỉ tiếng Nhật thương mại'],
    highlights: [
      'Phụ trách nhóm khách Nhật Bản tại Lotus',
      'Xây dựng chuyên đề nghi thức golf cho khách doanh nghiệp',
      'Đồng hành các buổi Golf Networking Experience',
    ],
    suitableFor: ['Doanh nhân', 'Khách Nhật Bản', 'Người cần chơi golf trong công việc'],
    featured: false,
    videoNote: 'Video chuyên đề nghi thức golf sẽ được cập nhật.',
  },
  {
    slug: 'ly-thien-an',
    name: 'Lý Thiên Ân',
    title: 'Coach · Swing Improvement',
    years: 8,
    specialties: ['swing', 'beginner', 'advanced'],
    languages: ['vi', 'en'],
    rating: 4.7,
    reviewCount: 76,
    students: 162,
    price: 820000,
    bio: 'Thiên Ân chuyên xử lý nhóm học viên "đã học rồi nhưng không tiến bộ" — thường vì đang cố sửa quá nhiều thứ cùng lúc.',
    philosophy:
      'Mỗi buổi học chỉ sửa một thứ. Sửa ba thứ cùng lúc thì không thứ nào thành thói quen cả.',
    certifications: ['Chứng chỉ huấn luyện golf cơ bản', 'Trackman Level 1', 'TPI Certified Level 1'],
    highlights: [
      'Chương trình "Một buổi một thay đổi"',
      'Hơn 160 học viên đang theo lộ trình',
      'Tỷ lệ học viên quay lại sau 3 tháng: 78%',
    ],
    suitableFor: ['Người học nhiều nơi chưa hiệu quả', 'Người muốn tiến bộ chậm mà chắc', 'Người mới sau 5–10 buổi đầu'],
    featured: false,
    videoNote: 'Video chương trình "Một buổi một thay đổi" sẽ được cập nhật.',
  },
];

const REVIEW_TEMPLATES: [string, number, string][] = [
  ['Minh Trí', 5, 'Buổi đầu tiên tôi đánh trượt liên tục nhưng không hề thấy ngại. Thầy giải thích rất dễ hiểu và luôn tìm được điểm tích cực để nói.'],
  ['Ngọc Hân', 5, 'Sau 6 buổi tôi đã tự tin đi đánh cùng đồng nghiệp. Lộ trình rõ ràng, mỗi buổi đều biết mình cần làm gì.'],
  ['Anh Tuấn', 4, 'Chuyên môn tốt, phản hồi thẳng thắn. Nếu buổi học dài hơn 15 phút nữa thì trọn vẹn hơn.'],
  ['Phương Thảo', 5, 'Con tôi 9 tuổi rất thích các buổi học. Về nhà bé còn tự tập lại động tác trong phòng khách.'],
  ['Hữu Đạt', 5, 'Điểm putt của tôi giảm rõ rệt chỉ sau vài buổi. Cách dùng thiết bị đo giúp tôi thấy vấn đề bằng mắt thay vì đoán.'],
  ['Kim Ngân', 4, 'Thầy kiên nhẫn và biết cách động viên. Lịch dạy hơi kín nên cần đặt trước khá sớm.'],
];

function buildReviews(slug: string, count: number) {
  return REVIEW_TEMPLATES.slice(0, count).map(([author, rating, content], index) => ({
    id: `${slug}-rv-${index + 1}`,
    author,
    rating,
    date: `2026-0${(index % 6) + 1}-1${index + 2}`,
    content,
  }));
}

function buildPrograms(slug: string, base: number) {
  return [
    {
      id: `${slug}-pg-1`,
      name: 'Gói làm quen · 4 buổi',
      sessions: 4,
      price: Math.round(base * 4 * 0.92),
      description: 'Nắm kỹ thuật nền tảng và hình thành thói quen tập đúng ngay từ đầu.',
    },
    {
      id: `${slug}-pg-2`,
      name: 'Gói tiến bộ · 8 buổi',
      sessions: 8,
      price: Math.round(base * 8 * 0.86),
      description: 'Lộ trình phổ biến nhất: đủ dài để hình thành swing ổn định, có đánh giá giữa kỳ.',
    },
    {
      id: `${slug}-pg-3`,
      name: 'Gói chuyên sâu · 16 buổi',
      sessions: 16,
      price: Math.round(base * 16 * 0.78),
      description: 'Dành cho người theo đuổi mục tiêu cụ thể: giảm handicap hoặc chuẩn bị thi đấu.',
    },
  ];
}

function buildFaqs(slug: string) {
  return [
    {
      id: `${slug}-faq-1`,
      question: 'Tôi có được đổi huấn luyện viên giữa lộ trình không?',
      answer:
        'Có. Bạn liên hệ bộ phận chăm sóc khách hàng, số buổi còn lại được chuyển nguyên vẹn sang HLV mới mà không mất phí.',
      group: 'coach' as const,
    },
    {
      id: `${slug}-faq-2`,
      question: 'Buổi học kéo dài bao lâu?',
      answer: 'Mỗi buổi 60 phút, chưa tính 10 phút khởi động và trao đổi trước buổi.',
      group: 'coach' as const,
    },
    {
      id: `${slug}-faq-3`,
      question: 'Tôi cần chuẩn bị gì cho buổi đầu tiên?',
      answer:
        'Chỉ cần trang phục thể thao và giày đế bằng. Gậy, bóng và găng tay đều đã có sẵn tại Lotus.',
      group: 'coach' as const,
    },
  ];
}

export const COACHES: Coach[] = SEEDS.map((seed, index) => ({
  id: `coach-${String(index + 1).padStart(2, '0')}`,
  slug: seed.slug,
  name: seed.name,
  title: seed.title,
  avatar: coachAvatar(index + 1),
  bio: seed.bio,
  philosophy: seed.philosophy,
  yearsExperience: seed.years,
  specialties: seed.specialties,
  languages: seed.languages,
  rating: seed.rating,
  reviewCount: seed.reviewCount,
  studentCount: seed.students,
  pricePerSession: seed.price,
  certifications: seed.certifications,
  careerHighlights: seed.highlights,
  suitableFor: seed.suitableFor,
  programs: buildPrograms(seed.slug, seed.price),
  reviews: buildReviews(seed.slug, 4 + (index % 3)),
  faqs: buildFaqs(seed.slug),
  referralCode: `LOTUS-${seed.slug.split('-').map((p) => p[0]).join('').toUpperCase()}${String(index + 1).padStart(2, '0')}`,
  featured: seed.featured,
  introVideoNote: seed.videoNote,
}));

export const SPECIALTY_LABELS: Record<CoachSpecialty, string> = {
  beginner: 'Người mới',
  junior: 'Trẻ em',
  advanced: 'Nâng cao',
  putting: 'Putting',
  swing: 'Swing',
  'short-game': 'Short Game',
  competition: 'Thi đấu',
  business: 'Doanh nhân',
};

export const LANGUAGE_LABELS: Record<CoachLanguage, string> = {
  vi: 'Tiếng Việt',
  en: 'Tiếng Anh',
  ko: 'Tiếng Hàn',
  ja: 'Tiếng Nhật',
};
