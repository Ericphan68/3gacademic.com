import { LegalPage, type LegalSection } from '@/components/common/legal-page';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Điều khoản sử dụng',
  description:
    'Điều khoản sử dụng dịch vụ Lotus Golf Center: quy định đặt lịch, đổi lịch và huỷ, hội viên và ví Lotus, voucher, sự kiện, an toàn tại sân và trách nhiệm các bên.',
  path: '/terms',
});

const SECTIONS: LegalSection[] = [
  {
    heading: 'Chấp nhận điều khoản',
    paragraphs: [
      'Khi sử dụng website và dịch vụ của Lotus Golf Center, bạn đồng ý với các điều khoản dưới đây. Nếu không đồng ý, vui lòng ngừng sử dụng dịch vụ.',
      'Phiên bản website hiện tại là bản demo giao diện. Các giao dịch, thanh toán và tài khoản trên bản demo không có giá trị pháp lý và không phát sinh nghĩa vụ tài chính.',
    ],
  },
  {
    heading: 'Tài khoản người dùng',
    bullets: [
      'Bạn chịu trách nhiệm về tính chính xác của thông tin đăng ký.',
      'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.',
      'Không sử dụng tài khoản của người khác hoặc mạo danh khi đặt lịch.',
      'Lotus có quyền tạm khoá tài khoản có dấu hiệu gian lận hoặc gây ảnh hưởng tới khách hàng khác.',
    ],
  },
  {
    heading: 'Đặt lịch, đổi lịch và huỷ',
    bullets: [
      'Lượt đặt được xác nhận khi bạn nhận mã đặt lịch và mã QR check-in.',
      'Thời gian sử dụng được tính từ giờ đã đặt, kể cả khi bạn đến muộn.',
      'Đổi lịch miễn phí trước 4 giờ với hầu hết các gói. Một số gói yêu cầu báo trước 12 hoặc 24 giờ theo mô tả của từng gói.',
      'Huỷ đúng hạn được hoàn giá trị vào ví Lotus. Huỷ sát giờ có thể bị trừ một phần theo chính sách của từng gói.',
      'Hội viên Premium và Founder được đổi lịch không giới hạn số lần.',
    ],
  },
  {
    heading: 'Hội viên và ví Lotus',
    bullets: [
      'Số dư ví là khoản trả trước dùng cho dịch vụ tại Lotus, không quy đổi thành tiền mặt.',
      'Bonus nạp ví áp dụng theo hạng hội viên tại thời điểm nạp.',
      'Quyền lợi hội viên có hiệu lực trong thời hạn của từng hạng.',
      'Số dư còn lại tiếp tục sử dụng được 6 tháng sau khi hạng hội viên hết hiệu lực.',
      'Việc chuyển số dư sang tài khoản khác hiện chưa được hỗ trợ.',
    ],
  },
  {
    heading: 'Voucher và ưu đãi',
    bullets: [
      'Mỗi đơn chỉ áp dụng một voucher, nhưng vẫn kết hợp được với ưu đãi hội viên.',
      'Voucher chỉ có hiệu lực trong thời hạn và điều kiện ghi trên voucher.',
      'Voucher đã mua không hoàn tiền, nhưng có thể chuyển tặng cho tài khoản khác.',
      'Lotus không vận hành thị trường mua bán lại voucher bằng tiền mặt.',
    ],
  },
  {
    heading: 'Sự kiện và giải đấu',
    bullets: [
      'Mỗi sự kiện có điều lệ riêng, được công bố trên trang chi tiết của sự kiện đó.',
      'Huỷ đăng ký trước 7 ngày được hoàn 100% vào ví Lotus.',
      'Trong vòng 7 ngày trước sự kiện, Lotus hỗ trợ chuyển sang sự kiện kế tiếp.',
      'Quyết định của ban tổ chức và ban giám khảo là quyết định cuối cùng.',
    ],
  },
  {
    heading: 'An toàn tại trung tâm',
    bullets: [
      'Tuân thủ hướng dẫn an toàn của nhân viên, đặc biệt khi ở gần khu vực có người đang đánh bóng.',
      'Trẻ em dưới 12 tuổi cần có người lớn đi cùng trong toàn bộ thời gian ở trung tâm.',
      'Mang giày thể thao đế bằng; không sử dụng giày có đinh nhọn tại khu vực trong nhà.',
      'Lotus có quyền yêu cầu ngừng sử dụng dịch vụ nếu hành vi của khách gây mất an toàn cho người khác.',
    ],
  },
  {
    heading: 'Trách nhiệm và giới hạn trách nhiệm',
    paragraphs: [
      'Lotus chịu trách nhiệm cung cấp dịch vụ đúng mô tả và bảo đảm điều kiện an toàn của cơ sở vật chất.',
      'Lotus không chịu trách nhiệm với thiệt hại phát sinh từ việc khách không tuân thủ hướng dẫn an toàn, hoặc từ tài sản cá nhân khách tự bảo quản mà không gửi tại quầy.',
    ],
  },
  {
    heading: 'Sở hữu trí tuệ',
    paragraphs: [
      'Toàn bộ nội dung, hình ảnh, thiết kế và tài liệu đào tạo trên website thuộc quyền sở hữu của Lotus Golf Center. Việc sao chép hoặc sử dụng lại cho mục đích thương mại cần có sự đồng ý bằng văn bản.',
    ],
  },
  {
    heading: 'Thay đổi điều khoản',
    paragraphs: [
      'Lotus có thể cập nhật điều khoản để phù hợp với thay đổi trong dịch vụ hoặc quy định pháp luật. Các thay đổi quan trọng sẽ được thông báo trước khi có hiệu lực.',
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Điều khoản sử dụng"
      breadcrumbLabel="Điều khoản sử dụng"
      intro="Tài liệu này quy định quyền và nghĩa vụ của khách hàng và Lotus Golf Center khi sử dụng website cùng các dịch vụ đi kèm."
      updatedAt="01/08/2026"
      sections={SECTIONS}
    />
  );
}
