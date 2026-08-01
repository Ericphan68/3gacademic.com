import type { Testimonial } from '@/types';

/** Nhân vật hư cấu, không dùng thông tin cá nhân thật. */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'ts-01',
    name: 'Chị Thu Trang',
    role: 'Khách hàng lần đầu chơi golf',
    segment: 'newcomer',
    quote:
      'Tôi đến với tâm thế thử cho biết và nghĩ mình sẽ lúng túng cả buổi. Nhưng có bạn nhân viên đi cùng từ đầu, chỉ từng chút một, nên đến cuối buổi tôi đánh trúng bóng khá đều. Tuần sau tôi quay lại.',
    rating: 5,
    initials: 'TT',
  },
  {
    id: 'ts-02',
    name: 'Anh Quốc Hưng',
    role: 'Hội viên Lotus Member',
    segment: 'member',
    quote:
      'Cái tôi thích nhất là mọi thứ đều nằm trong điện thoại: đặt giờ, xem số dư, quét mã vào cửa. Không phải gọi điện, không phải chờ. Với người bận như tôi thì đó là lý do chính để gắn bó.',
    rating: 5,
    initials: 'QH',
  },
  {
    id: 'ts-03',
    name: 'Chị Mỹ Duyên',
    role: 'Phụ huynh học viên Junior',
    segment: 'newcomer',
    quote:
      'Con tôi 9 tuổi, trước giờ không thích thể thao nào cả. Ở đây các thầy dạy bằng trò chơi nên bé theo được suốt buổi. Giờ cứ đến Thứ Bảy là bé tự nhắc mẹ chở đi.',
    rating: 5,
    initials: 'MD',
  },
  {
    id: 'ts-04',
    name: 'Anh Nam Khánh',
    role: 'Huấn luyện viên tại Lotus',
    segment: 'coach',
    quote:
      'Ở nhiều nơi tôi từng làm, học viên đến rồi đi mà không ai theo dõi được tiến độ. Hệ thống ở đây ghi lại từng buổi, nên tôi biết chính xác học viên đang ở đâu và cần gì tiếp theo.',
    rating: 5,
    initials: 'NK',
  },
  {
    id: 'ts-05',
    name: 'Chị Hoài Anh',
    role: 'Trưởng phòng nhân sự, doanh nghiệp công nghệ',
    segment: 'corporate',
    quote:
      'Chúng tôi tổ chức cho 64 người, trong đó hơn một nửa chưa từng cầm gậy. Lotus bố trí huấn luyện viên riêng cho nhóm đó nên không ai bị bỏ lại. Đây là điều các sân golf ngoại ô không làm được.',
    rating: 5,
    initials: 'HA',
  },
  {
    id: 'ts-06',
    name: 'Anh Trọng Nghĩa',
    role: 'Hội viên Founder',
    segment: 'vip',
    quote:
      'Tôi giữ khung 19:00 Thứ Tư hằng tuần. Đến nơi là bay đã sẵn sàng, nước uống đúng loại tôi hay dùng. Không cần nói gì cả. Sự chu đáo đó mới là thứ tôi trả tiền.',
    rating: 5,
    initials: 'TN',
  },
  {
    id: 'ts-07',
    name: 'Chị Lan Phương',
    role: 'Học viên Academy · 8 buổi',
    segment: 'member',
    quote:
      'Điều tôi đánh giá cao là mỗi buổi chỉ sửa một thứ. Trước đây tôi học chỗ khác, thầy nói nhiều quá nên về nhà chẳng nhớ gì. Ở đây tôi nhớ được và tập lại được.',
    rating: 4,
    initials: 'LP',
  },
  {
    id: 'ts-08',
    name: 'Anh Đức Thịnh',
    role: 'Giám đốc điều hành, khách doanh nghiệp',
    segment: 'corporate',
    quote:
      'Tôi dùng khu VIP để tiếp đối tác nước ngoài. Lối vào riêng, nhân viên nói tiếng Anh, mọi thứ được chuẩn bị trước. Đối tác của tôi ấn tượng, và đó là điều tôi cần.',
    rating: 5,
    initials: 'ĐT',
  },
  {
    id: 'ts-09',
    name: 'Chị Kiều My',
    role: 'Khách tham dự Golf Networking',
    segment: 'newcomer',
    quote:
      'Tôi đi một mình và hơi lo. Nhưng có bạn điều phối giới thiệu ngay từ đầu, rồi đổi nhóm mỗi 30 phút nên gặp được nhiều người. Sau buổi đó tôi có thêm hai mối làm ăn.',
    rating: 5,
    initials: 'KM',
  },
  {
    id: 'ts-10',
    name: 'Anh Vĩnh Phúc',
    role: 'Hội viên Lotus Premium',
    segment: 'vip',
    quote:
      'Tôi chuyển sang đây vì gần nhà, nhưng ở lại vì cách phục vụ. Khăn lạnh sau buổi tập nghe thì nhỏ, nhưng đó là thứ khiến bạn nhớ và quay lại.',
    rating: 5,
    initials: 'VP',
  },
];

/** Thông số hiển thị ở trust bar và các section chứng minh năng lực. */
export const TRUST_FEATURES = [
  { title: 'Smart Booking', description: 'Đặt lịch online, chọn giờ và khu vực trong vài chạm', icon: 'CalendarCheck' },
  { title: 'QR Check-in', description: 'Quét mã tại quầy, không cần khai lại thông tin', icon: 'QrCode' },
  { title: 'Professional Coaches', description: '12 huấn luyện viên chuyên trách theo từng mảng', icon: 'GraduationCap' },
  { title: 'Premium Hospitality', description: 'Phục vụ tận tâm, ghi nhớ sở thích của từng khách', icon: 'HeartHandshake' },
  { title: 'Green 10.0', description: 'Mặt green tiêu chuẩn, tốc độ được đo mỗi sáng', icon: 'Flag' },
  { title: 'Member Rewards', description: 'Ưu đãi và điểm thưởng tích luỹ cho hội viên', icon: 'Gift' },
];

export const SERVICE_CULTURE = [
  {
    title: 'Đón tiếp bằng sự chú tâm',
    description:
      'Nhân viên nhớ tên bạn từ lần thứ hai. Không phải vì được yêu cầu, mà vì đó là cách Lotus làm việc.',
    icon: 'Handshake',
  },
  {
    title: 'Ghi nhớ sở thích của bạn',
    description:
      'Loại nước bạn hay uống, thảm tập bạn thích, khung giờ bạn quen. Những chi tiết đó được lưu lại để lần sau bạn không phải nói lại.',
    icon: 'BookmarkCheck',
  },
  {
    title: 'Hỗ trợ trước khi bạn cần hỏi',
    description:
      'Nếu bạn đang loay hoay với tư thế, sẽ có người đến hỏi xem bạn có cần giúp không — trước khi bạn phải giơ tay.',
    icon: 'Lightbulb',
  },
  {
    title: 'Khăn lạnh sau buổi tập',
    description:
      'Một chi tiết nhỏ, nhưng là chi tiết được khách nhắc đến nhiều nhất khi nói về cảm giác ở Lotus.',
    icon: 'Sparkles',
  },
  {
    title: 'Không gian luôn sạch',
    description:
      'Thảm tập được kiểm tra sau mỗi lượt khách. Khu vệ sinh được dọn theo giờ cố định trong ngày.',
    icon: 'Wind',
  },
  {
    title: 'Tinh tế nhưng không làm phiền',
    description:
      'Nếu bạn muốn tập một mình trong yên tĩnh, chúng tôi hiểu và giữ khoảng cách. Phục vụ tốt là biết khi nào nên lùi lại.',
    icon: 'Ear',
  },
];

/** Các khu vực trải nghiệm hiển thị ở trang chủ. */
export const EXPERIENCE_HIGHLIGHTS = [
  { name: 'Driving Range', description: '48 thảm tập hai tầng, có mái che và đèn chiếu sáng', icon: 'Target', href: '/booking' },
  { name: 'Putting Green', description: 'Mặt green tiêu chuẩn tốc độ 10.0, đo mỗi sáng', icon: 'CircleDot', href: '/booking' },
  { name: 'Golf Academy', description: '12 chương trình đào tạo từ căn bản đến thi đấu', icon: 'GraduationCap', href: '/academy' },
  { name: 'Private Coaching', description: '12 huấn luyện viên chuyên trách theo từng mảng', icon: 'UserRound', href: '/coaches' },
  { name: 'Events', description: 'Giải đấu, workshop và networking hằng tháng', icon: 'Trophy', href: '/events' },
  { name: 'F&B', description: 'Cà phê, trà, bento Nhật – Hàn, giao tận thảm tập', icon: 'Utensils', href: '/food-and-lounge' },
  { name: 'Lounge', description: 'Không gian nghỉ trong nhà và khu ngoài trời có mái che', icon: 'Sofa', href: '/food-and-lounge' },
  { name: 'Networking', description: 'Cộng đồng doanh nhân gặp nhau qua golf', icon: 'Users', href: '/events' },
];

/** Tính năng của ứng dụng Smart Golf (mockup, chưa phát hành). */
export const APP_FEATURES = [
  { title: 'Đặt lịch', description: 'Chọn giờ, khu vực và huấn luyện viên trong vài chạm', icon: 'CalendarCheck' },
  { title: 'Top-up', description: 'Nạp ví và nhận bonus theo hạng hội viên', icon: 'Wallet' },
  { title: 'QR Check-in', description: 'Quét mã tại quầy, vào sân không cần chờ', icon: 'QrCode' },
  { title: 'Voucher', description: 'Quản lý voucher đang có và nhận ưu đãi mới', icon: 'Ticket' },
  { title: 'Membership', description: 'Thẻ hội viên điện tử và tiến độ lên hạng', icon: 'Crown' },
  { title: 'Coach', description: 'Xem lịch học, ghi chú và bài tập từ huấn luyện viên', icon: 'GraduationCap' },
  { title: 'Rewards', description: 'Tích điểm và đổi quyền lợi tại Lotus', icon: 'Gift' },
];
