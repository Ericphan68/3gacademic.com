import { corporateImage } from '@/constants/media';
import type { CorporateCaseStudy, CorporatePackage } from '@/types';

export const CORPORATE_PACKAGES: CorporatePackage[] = [
  {
    id: 'cp-01',
    slug: 'corporate-golf-day',
    name: 'Corporate Golf Day',
    summary: 'Một ngày golf trọn gói cho doanh nghiệp, có giải mini và branding tại chỗ.',
    description:
      'Format phổ biến nhất: đón tiếp, chia đội, thi đấu qua các trạm kỹ năng, ăn trưa và trao giải. Lotus lo toàn bộ khâu tổ chức, doanh nghiệp chỉ cần đưa danh sách khách và lựa chọn thực đơn.',
    image: corporateImage(1),
    idealGroupSize: '20–80 người',
    durationNote: 'Trọn ngày · 8 giờ',
    priceFrom: 28000000,
    includes: [
      'Toàn bộ khu tập trong khung giờ đã chọn',
      'Đội ngũ đón tiếp và điều phối',
      'HLV hỗ trợ nhóm chưa biết chơi',
      'Giải mini có bảng xếp hạng trực tiếp',
      'F&B theo thực đơn chọn trước',
      'Backdrop, standee và cờ tee in thương hiệu',
    ],
    outcomes: ['Gắn kết nội bộ', 'Tiếp khách hàng trong không khí thoải mái', 'Bộ ảnh truyền thông sau sự kiện'],
  },
  {
    id: 'cp-02',
    slug: 'team-building',
    name: 'Team-building qua golf',
    summary: 'Hoạt động nhóm thiết kế riêng, không đòi hỏi ai phải biết chơi golf trước.',
    description:
      'Các thử thách được thiết kế để nhóm phải phối hợp thay vì thi đấu cá nhân: đồng đội cùng tính điểm, luân phiên vị trí, và có phần thưởng cho nhóm tiến bộ nhất chứ không chỉ nhóm mạnh nhất.',
    image: corporateImage(2),
    idealGroupSize: '15–60 người',
    durationNote: 'Nửa ngày · 4 giờ',
    priceFrom: 18000000,
    includes: [
      'Thiết kế thử thách theo mục tiêu của doanh nghiệp',
      'Điều phối viên và trọng tài',
      'HLV hỗ trợ toàn bộ nhóm mới',
      'Bảng điểm đồng đội trực tiếp',
      'Bữa nhẹ và đồ uống',
    ],
    outcomes: ['Phá băng giữa các phòng ban', 'Tăng phối hợp nhóm', 'Không ai bị bỏ lại vì chưa biết chơi'],
  },
  {
    id: 'cp-03',
    slug: 'employee-wellness',
    name: 'Employee Wellness',
    summary: 'Chương trình định kỳ hằng tháng giúp nhân viên vận động đều đặn.',
    description:
      'Doanh nghiệp mua trước một số lượng suất tập, nhân viên tự đặt lịch trong tháng qua website. Lotus gửi báo cáo mức độ sử dụng hằng tháng để bộ phận nhân sự theo dõi hiệu quả chương trình.',
    image: corporateImage(3),
    idealGroupSize: '30–300 nhân viên',
    durationNote: 'Theo tháng hoặc theo quý',
    priceFrom: 45000000,
    includes: [
      'Gói suất tập trả trước cho nhân viên',
      'Trang đặt lịch riêng cho doanh nghiệp',
      'Buổi hướng dẫn nhập môn miễn phí',
      'Báo cáo mức độ sử dụng hằng tháng',
      'Ưu đãi F&B cho nhân viên',
    ],
    outcomes: ['Phúc lợi khác biệt', 'Nhân viên vận động đều đặn hơn', 'Dữ liệu để đánh giá hiệu quả phúc lợi'],
  },
  {
    id: 'cp-04',
    slug: 'client-entertainment',
    name: 'Client Entertainment',
    summary: 'Tiếp khách hàng trong không gian riêng tư, chuẩn bị chu đáo từng chi tiết.',
    description:
      'Lotus dành riêng khu VIP hoặc Private Bay cho buổi tiếp khách của bạn. Mọi chi tiết được thống nhất trước: đồ uống ưa thích của khách, thực đơn, nhiệt độ phòng và cả việc có cần huấn luyện viên hỗ trợ hay không.',
    image: corporateImage(4),
    idealGroupSize: '2–12 khách',
    durationNote: '3–4 giờ',
    priceFrom: 12000000,
    includes: [
      'Khu VIP hoặc Private Bay riêng',
      'Nhân viên phục vụ chuyên trách',
      'Thực đơn và đồ uống thống nhất trước',
      'Lối vào riêng và chỗ đỗ xe ưu tiên',
      'Hỗ trợ song ngữ nếu tiếp khách nước ngoài',
    ],
    outcomes: ['Không gian riêng tư tuyệt đối', 'Ấn tượng chuyên nghiệp với đối tác', 'Không phải lo khâu tổ chức'],
  },
  {
    id: 'cp-05',
    slug: 'executive-networking',
    name: 'Executive Networking',
    summary: 'Buổi kết nối cấp quản lý có điều phối và danh sách khách được sàng lọc.',
    description:
      'Khác với networking mở, buổi Executive được thiết kế cho nhóm nhỏ hơn với danh sách khách mời được sàng lọc theo ngành và cấp bậc. Điều phối viên đảm bảo mỗi khách gặp được ít nhất 6 người khác trong buổi.',
    image: corporateImage(5),
    idealGroupSize: '12–30 khách',
    durationNote: 'Buổi tối · 3,5 giờ',
    priceFrom: 22000000,
    includes: [
      'Sàng lọc và mời khách theo tiêu chí',
      'Điều phối viên chuyên trách',
      'Kịch bản luân phiên nhóm',
      'Đồ uống và finger food tại Lounge',
      'Danh sách khách gửi trước cho người tham dự',
    ],
    outcomes: ['Kết nối đúng đối tượng', 'Không khí tự nhiên hơn hội thảo', 'Quan hệ duy trì được sau sự kiện'],
  },
  {
    id: 'cp-06',
    slug: 'internal-tournament',
    name: 'Internal Tournament',
    summary: 'Giải nội bộ theo mùa cho doanh nghiệp có phong trào golf sẵn.',
    description:
      'Dành cho doanh nghiệp đã có nhóm nhân viên chơi golf thường xuyên. Lotus tổ chức giải nhiều vòng theo mùa, có bảng xếp hạng tích luỹ, hệ thống handicap nội bộ và lễ trao giải cuối mùa.',
    image: corporateImage(6),
    idealGroupSize: '16–64 người chơi',
    durationNote: 'Nhiều vòng theo mùa',
    priceFrom: 60000000,
    includes: [
      'Thiết kế thể thức và điều lệ giải',
      'Hệ thống handicap nội bộ',
      'Bảng xếp hạng tích luỹ trực tuyến',
      'Trọng tài và ban tổ chức',
      'Lễ trao giải cuối mùa',
    ],
    outcomes: ['Phong trào duy trì cả năm', 'Gắn kết xuyên phòng ban', 'Hoạt động truyền thông nội bộ đều đặn'],
  },
  {
    id: 'cp-07',
    slug: 'school-program',
    name: 'School Program',
    summary: 'Chương trình golf học đường cho trường phổ thông, theo học kỳ.',
    description:
      'Lotus phối hợp với nhà trường xây dựng chương trình golf ngoại khoá theo học kỳ. Học sinh học theo nhóm cố định, có đánh giá đầu và cuối kỳ, kết thúc bằng một ngày hội golf có phụ huynh tham dự.',
    image: corporateImage(7),
    idealGroupSize: '20–120 học sinh',
    durationNote: 'Theo học kỳ · 12–16 buổi',
    priceFrom: 52000000,
    includes: [
      'Giáo trình phù hợp lứa tuổi',
      'Huấn luyện viên chuyên trẻ em',
      'Dụng cụ Junior đầy đủ',
      'Đánh giá đầu kỳ và cuối kỳ',
      'Ngày hội golf cuối kỳ có phụ huynh',
    ],
    outcomes: ['Hoạt động ngoại khoá khác biệt', 'Học sinh vận động đều đặn', 'Báo cáo tiến bộ cho nhà trường'],
  },
  {
    id: 'cp-08',
    slug: 'international-school-activity',
    name: 'International School Activity',
    summary: 'Hoạt động golf song ngữ cho trường quốc tế và câu lạc bộ học sinh.',
    description:
      'Phiên bản song ngữ của School Program, với huấn luyện viên nói tiếng Anh và tài liệu hai ngôn ngữ. Phù hợp với các trường quốc tế cần hoạt động thể chất có yếu tố kỹ năng và nghi thức.',
    image: corporateImage(8),
    idealGroupSize: '15–80 học sinh',
    durationNote: 'Theo học kỳ hoặc theo đợt',
    priceFrom: 68000000,
    includes: [
      'Huấn luyện viên song ngữ Việt – Anh',
      'Tài liệu học hai ngôn ngữ',
      'Nội dung nghi thức và tinh thần thể thao',
      'Dụng cụ Junior đầy đủ',
      'Báo cáo tiến bộ song ngữ',
    ],
    outcomes: ['Hoạt động phù hợp chương trình quốc tế', 'Kỹ năng và nghi thức đi cùng nhau', 'Báo cáo minh bạch cho nhà trường'],
  },
];

export const CORPORATE_BENEFITS = [
  {
    title: 'Không ai bị bỏ lại',
    description:
      'Luôn có huấn luyện viên riêng cho nhóm chưa từng chơi golf. Đây là khác biệt lớn nhất so với việc tổ chức tại sân golf 18 hố.',
    icon: 'HeartHandshake',
  },
  {
    title: 'Một đầu mối duy nhất',
    description:
      'Bạn làm việc với một người phụ trách xuyên suốt: từ khảo sát nhu cầu, báo giá, tổ chức đến báo cáo sau sự kiện.',
    icon: 'UserCheck',
  },
  {
    title: 'Chi phí rõ ràng',
    description:
      'Báo giá liệt kê từng hạng mục, không có phí phát sinh vào phút cuối. Thay đổi số lượng khách được cập nhật minh bạch.',
    icon: 'ReceiptText',
  },
  {
    title: 'Trong nội thành',
    description:
      'Không mất nửa ngày di chuyển như sân golf ngoại ô. Nhân viên có thể tham gia rồi quay lại công việc trong ngày.',
    icon: 'MapPin',
  },
  {
    title: 'Branding tại chỗ',
    description:
      'Backdrop, standee, cờ tee, bảng điểm và quà tặng đều có thể in thương hiệu của doanh nghiệp.',
    icon: 'Palette',
  },
  {
    title: 'Báo cáo sau sự kiện',
    description:
      'Trong 48 giờ, doanh nghiệp nhận báo cáo tổ chức kèm bộ ảnh đã chỉnh sửa để dùng cho truyền thông nội bộ.',
    icon: 'FileBarChart',
  },
];

export const CORPORATE_PROCESS = [
  { step: 1, title: 'Gửi yêu cầu', description: 'Điền form báo giá với số người, ngày dự kiến và mục tiêu sự kiện.' },
  { step: 2, title: 'Khảo sát nhu cầu', description: 'Lotus liên hệ trong 24 giờ làm việc để làm rõ yêu cầu chi tiết.' },
  { step: 3, title: 'Nhận báo giá', description: 'Báo giá liệt kê từng hạng mục, kèm 2–3 phương án để bạn lựa chọn.' },
  { step: 4, title: 'Chốt phương án', description: 'Thống nhất kịch bản, thực đơn, hạng mục branding và lịch trình.' },
  { step: 5, title: 'Tổ chức sự kiện', description: 'Lotus vận hành toàn bộ, doanh nghiệp chỉ cần có mặt và tham dự.' },
  { step: 6, title: 'Báo cáo và bàn giao', description: 'Nhận báo cáo tổ chức và bộ ảnh trong vòng 48 giờ.' },
];

export const CORPORATE_CASE_STUDIES: CorporateCaseStudy[] = [
  {
    id: 'cs-01',
    industry: 'Công nghệ',
    headline: 'Gắn kết 3 phòng ban vừa sáp nhập',
    challenge:
      'Sau sáp nhập, ba nhóm kỹ thuật hầu như không tương tác ngoài công việc. Hoạt động team-building trước đó có tỷ lệ tham gia thấp.',
    solution:
      'Corporate Golf Day format đồng đội, mỗi đội bắt buộc trộn người từ cả ba phòng ban, tính điểm theo mức tiến bộ chứ không theo trình độ.',
    result: 'Tỷ lệ tham gia 92%. Ba tháng sau, nhóm tự tổ chức buổi golf hằng tháng bằng ngân sách phòng ban.',
    participants: 64,
  },
  {
    id: 'cs-02',
    industry: 'Tài chính',
    headline: 'Tiếp 12 khách hàng ưu tiên trong một buổi tối',
    challenge:
      'Cần một không gian riêng tư để tiếp nhóm khách hàng lớn, nhưng nhà hàng thì ồn còn sân golf ngoại ô thì quá xa.',
    solution:
      'Client Entertainment tại khu VIP với lối vào riêng, thực đơn thống nhất trước và huấn luyện viên hỗ trợ những khách chưa từng chơi.',
    result: 'Toàn bộ 12 khách tham dự đủ buổi. Doanh nghiệp đặt lại format này theo quý.',
    participants: 12,
  },
  {
    id: 'cs-03',
    industry: 'Sản xuất',
    headline: 'Phúc lợi thể thao cho 240 nhân viên văn phòng',
    challenge:
      'Ngân sách phúc lợi thể thao trước đó dùng cho thẻ phòng gym nhưng tỷ lệ sử dụng chỉ khoảng 20%.',
    solution:
      'Employee Wellness với suất tập trả trước, nhân viên tự đặt lịch qua trang riêng, kèm một buổi nhập môn miễn phí.',
    result: 'Tỷ lệ sử dụng đạt 68% trong quý đầu. Bộ phận nhân sự có báo cáo hằng tháng để đánh giá.',
    participants: 240,
  },
  {
    id: 'cs-04',
    industry: 'Giáo dục',
    headline: 'Chương trình ngoại khoá golf cho một trường quốc tế',
    challenge:
      'Nhà trường muốn bổ sung môn thể thao mới, nhưng cần đảm bảo an toàn tuyệt đối và có đánh giá tiến bộ rõ ràng.',
    solution:
      'International School Activity với huấn luyện viên song ngữ, nhóm nhỏ 6 học sinh, đánh giá đầu và cuối kỳ.',
    result: 'Kết thúc học kỳ, 84% học sinh đăng ký học tiếp kỳ sau. Ngày hội cuối kỳ có 70 phụ huynh tham dự.',
    participants: 96,
  },
];
