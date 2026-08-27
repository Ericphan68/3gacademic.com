import { LegalPage, type LegalSection } from '@/components/common/legal-page';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Chính sách bảo mật',
  description:
    'Chính sách bảo mật của Lotus Golf Center: dữ liệu được thu thập, cách sử dụng, thời gian lưu trữ và quyền của khách hàng đối với dữ liệu cá nhân.',
  path: '/privacy',
});

const SECTIONS: LegalSection[] = [
  {
    heading: 'Phạm vi áp dụng',
    paragraphs: [
      'Chính sách này áp dụng cho website Lotus Golf Center và các dịch vụ được cung cấp thông qua website, bao gồm đặt lịch, đăng ký hội viên, mua voucher, đăng ký sự kiện và đặt món F&B.',
      'Thông tin bạn cung cấp khi đăng ký tài khoản, đặt lịch hoặc để lại liên hệ được lưu trữ an toàn trên hệ thống của Lotus và chỉ dùng để cung cấp dịch vụ, chăm sóc khách hàng cho bạn.',
    ],
  },
  {
    heading: 'Dữ liệu Lotus thu thập',
    paragraphs: ['Ở phiên bản chính thức, Lotus thu thập các nhóm dữ liệu sau để cung cấp dịch vụ:'],
    bullets: [
      'Thông tin định danh cơ bản: họ tên, số điện thoại, email.',
      'Thông tin đặt lịch: ngày giờ, khu vực, huấn luyện viên, dịch vụ bổ sung, ghi chú.',
      'Thông tin hội viên và giao dịch: hạng hội viên, số dư ví, lịch sử nạp và thanh toán.',
      'Sở thích cá nhân bạn chủ động cung cấp: đồ uống ưa thích, tay thuận, trình độ, mục tiêu tập luyện.',
      'Dữ liệu kỹ thuật: loại thiết bị, trình duyệt và các thông tin cần thiết để website hoạt động ổn định.',
    ],
  },
  {
    heading: 'Mục đích sử dụng dữ liệu',
    bullets: [
      'Xác nhận và thực hiện các lượt đặt lịch, buổi học, đăng ký sự kiện và đơn F&B của bạn.',
      'Cá nhân hoá trải nghiệm: chuẩn bị trước dụng cụ, ghi nhớ sở thích, đề xuất khung giờ phù hợp.',
      'Áp dụng đúng quyền lợi hội viên, voucher và điểm thưởng.',
      'Gửi thông tin về ưu đãi và sự kiện — chỉ khi bạn đã đồng ý nhận.',
      'Cải thiện chất lượng dịch vụ dựa trên phản hồi và số liệu sử dụng tổng hợp.',
    ],
  },
  {
    heading: 'Chia sẻ dữ liệu với bên thứ ba',
    paragraphs: [
      'Lotus không bán dữ liệu cá nhân của khách hàng. Dữ liệu chỉ được chia sẻ trong phạm vi cần thiết để cung cấp dịch vụ bạn yêu cầu.',
    ],
    bullets: [
      'Đối tác F&B: chỉ nhận thông tin đơn hàng và vị trí phục vụ, không nhận thông tin định danh đầy đủ.',
      'Đối tác thanh toán: xử lý giao dịch theo tiêu chuẩn bảo mật của tổ chức thanh toán.',
      'Cơ quan nhà nước có thẩm quyền: khi có yêu cầu hợp pháp bằng văn bản.',
    ],
  },
  {
    heading: 'Thời gian lưu trữ',
    paragraphs: [
      'Dữ liệu tài khoản được lưu trong suốt thời gian bạn sử dụng dịch vụ. Sau khi bạn yêu cầu xoá tài khoản, Lotus xoá dữ liệu định danh trong vòng 30 ngày, trừ các dữ liệu bắt buộc phải lưu theo quy định kế toán và thuế.',
    ],
  },
  {
    heading: 'Quyền của bạn',
    bullets: [
      'Yêu cầu xem lại dữ liệu cá nhân mà Lotus đang lưu giữ.',
      'Yêu cầu chỉnh sửa thông tin không chính xác.',
      'Yêu cầu xoá tài khoản và dữ liệu cá nhân.',
      'Rút lại sự đồng ý nhận thông tin tiếp thị bất cứ lúc nào.',
      'Khiếu nại nếu cho rằng dữ liệu của bạn bị xử lý không đúng.',
    ],
  },
  {
    heading: 'Bảo mật dữ liệu',
    paragraphs: [
      'Lotus áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu: mã hoá đường truyền, phân quyền truy cập theo vai trò và ghi nhật ký thao tác trên hệ thống quản trị.',
      'Lotus không lưu mật khẩu ở dạng có thể đọc được — mật khẩu luôn được mã hoá an toàn (bcrypt). Nếu quên mật khẩu, vui lòng liên hệ Lotus để được hỗ trợ đặt lại.',
    ],
  },
  {
    heading: 'Cookie và công nghệ tương tự',
    paragraphs: [
      'Website sử dụng bộ nhớ cục bộ của trình duyệt để ghi nhớ lựa chọn ngôn ngữ và giao diện sáng/tối. Bạn có thể xoá các dữ liệu này bất cứ lúc nào trong phần cài đặt trình duyệt.',
    ],
  },
  {
    heading: 'Thay đổi chính sách',
    paragraphs: [
      'Khi có thay đổi quan trọng, Lotus sẽ cập nhật nội dung trên trang này và thông báo tới khách hàng qua email hoặc thông báo trên website trước khi thay đổi có hiệu lực.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Chính sách bảo mật"
      breadcrumbLabel="Chính sách bảo mật"
      intro="Lotus Golf Center tôn trọng quyền riêng tư của bạn. Tài liệu này giải thích rõ dữ liệu nào được thu thập, dùng vào việc gì và bạn có những quyền gì đối với dữ liệu của mình."
      updatedAt="01/08/2026"
      sections={SECTIONS}
    />
  );
}
