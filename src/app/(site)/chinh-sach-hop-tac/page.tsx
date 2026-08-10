import { LegalPage, type LegalSection } from '@/components/common/legal-page';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Chính sách hợp tác và quyền lợi',
  description:
    'Chính sách hợp tác và quyền lợi của Câu lạc bộ Golf An Phú Lotus dành cho huấn luyện viên, ban điều hành CLB địa phương, đối tác giới thiệu khách và hội viên.',
  path: '/chinh-sach-hop-tac',
  keywords: [
    'chính sách hợp tác golf',
    'quyền lợi huấn luyện viên golf',
    'thẻ thành viên golf',
    'An Phú Lotus Golf Club',
  ],
});

const SECTIONS: LegalSection[] = [
  {
    heading: 'Chính sách dành cho huấn luyện viên (Coach)',
    subsections: [
      {
        heading: 'Quyền lợi sử dụng dịch vụ',
        bullets: [
          'Bóng tập được giảm 50% theo bảng giá niêm yết.',
          'Trong trường hợp sân tập đông khách, huấn luyện viên ưu tiên nhường làn tập cho khách hàng.',
          'Miễn phí khu Chip & Putt, bao gồm cả trường hợp tập luyện cùng học viên.',
          'Chơi sân 9 hố hoặc 18 hố được giảm 50% phí sân khi đăng ký tham gia chương trình của Lotus để chơi hoặc tập một mình.',
          'Đăng ký danh sách với sân và tập luyện an toàn tại sân.',
          'Huấn luyện viên có trách nhiệm cào cát (bunker) và giữ gìn mặt sân trước khi rời sân khi tập cùng học viên.',
        ],
      },
      {
        heading: 'Chính sách đi cùng khách hàng',
        bullets: [
          'Huấn luyện viên đi cùng nhóm khách hàng do mình giới thiệu được miễn phí 100% phí sân.',
          'Được hưởng lợi tức booking trước 10% trên doanh thu cụ thể của khách hàng tham gia 9 hố, 18 hố.',
          'Được ưu tiên tham gia các chương trình khách hàng VIP do sân phân bổ dữ liệu CSKH; tiếp cận học viên golf mới.',
        ],
      },
      {
        heading: 'Trách nhiệm phối hợp',
        bullets: [
          'Báo cáo tình trạng khách hàng và phối hợp chăm sóc khách hàng với bộ phận quản lý sân.',
          'Tuân thủ nội quy, quy định vận hành của sân golf.',
          'Giữ gìn môi trường, vệ sinh chung, ứng xử văn minh và chuyên nghiệp.',
          'Góp ý xây dựng sân, cùng phối hợp giải quyết các vướng mắc phát sinh.',
          'Hợp tác với Ban Quản lý nhằm nâng cao chất lượng dịch vụ và phát triển cộng đồng golf.',
        ],
      },
      {
        heading: 'Quyền lợi khác',
        bullets: [
          'Được bố trí khu vực nghỉ ngơi buổi trưa (phòng lạnh hoặc khu sân vườn tùy điều kiện thực tế).',
          'Được xem xét tham gia chương trình Founding với nhiều lợi ích và lợi tức về sau.',
          'Được tham gia các chương trình đào tạo, sự kiện và hoạt động cộng đồng do sân tổ chức.',
        ],
      },
    ],
  },
  {
    heading: 'Chính sách dành cho Chủ tịch và Ban điều hành câu lạc bộ golf địa phương',
    bullets: [
      'Được giảm 50% phí sân 9 hố khi tham gia chơi, tập golf tại An Phú Lotus.',
      'Khi đi cùng khách hàng hoặc tổ chức booking cho khách: miễn phí phí sân theo chương trình áp dụng cho huấn luyện viên và booking trước.',
      'Hưởng lợi tức từ 10% trên doanh thu phát sinh khi khách đăng ký tham gia 9 hố, 18 hố. Lợi tức được trả thẳng vào tài khoản Chủ tịch hoặc câu lạc bộ theo cam kết đã ký kết.',
      'Phối hợp cùng Ban Quản lý sân trong công tác phát triển hội viên và tổ chức sự kiện.',
    ],
  },
  {
    heading: 'Chính sách khách hàng giới thiệu khách (Booking Partner)',
    bullets: [
      'Khách hàng lần đầu sử dụng dịch vụ áp dụng theo bảng giá niêm yết.',
      'Người booking hộ bản thân, nhóm bạn hoặc khách hàng khác phải cung cấp đầy đủ thông tin xác thực (họ tên, số điện thoại…).',
      'Khi được phê duyệt chương trình cộng tác: được giảm 30% giá dịch vụ cá nhân (dịch vụ sân 9 hố, 18 hố).',
      'Được hưởng lợi tức 10% phát sinh từ doanh thu của nhóm trên các khách còn lại trong nhóm theo chính sách từng thời điểm.',
      'Mọi booking phải được xác nhận trước với bộ phận quản lý sân và lễ tân.',
    ],
  },
  {
    heading: 'Chính sách thẻ thành viên (số lượng giới hạn)',
    subsections: [
      {
        heading: 'Gói Thành viên Tháng — 5.000.000đ/tháng',
        bullets: [
          'Sử dụng sân tập tối đa 03 giờ/ngày; được chơi bóng lồng tập (hệ thống sẽ có máy đo).',
          'Chơi tối đa 18 hố/ngày.',
          'Các lượt phát sinh sau 18 hố được giảm 20% phí dịch vụ sân niêm yết.',
          'Được hưởng các chính sách giới thiệu khách tương tự huấn luyện viên.',
          'Được tham gia các chương trình cộng đồng và sự kiện của câu lạc bộ.',
        ],
      },
      {
        heading: 'Gói Thành viên Quý (3 tháng) — 12.000.000đ/quý',
        bullets: [
          'Toàn bộ quyền lợi của gói thành viên tháng.',
          'Ưu đãi chương trình “Mua 2 tặng 1” theo từng thời kỳ.',
          'Tặng 03 giờ đào tạo golf với huấn luyện viên do sân giới thiệu và khách hàng lựa chọn.',
        ],
      },
      {
        heading: 'Chính sách giới thiệu hội viên',
        bullets: [
          'Cá nhân giới thiệu thành công thành viên mới được hưởng hoa hồng từ 10% (thẻ Member).',
          'Áp dụng cho cả huấn luyện viên, cộng tác viên và thành viên hiện hữu.',
        ],
      },
    ],
  },
  {
    heading: 'Thời gian áp dụng',
    bullets: [
      'Chính sách áp dụng trong thời gian 03 tháng kể từ ngày ban hành 07/08/2026.',
      'Ban Điều hành có quyền điều chỉnh, bổ sung hoặc thay đổi chính sách nhằm phù hợp với tình hình hoạt động thực tế.',
      'Các thay đổi sẽ được cập nhật trên hệ thống quản lý của câu lạc bộ.',
    ],
  },
  {
    heading: 'Định hướng phát triển cộng đồng',
    paragraphs: ['Chương trình được đồng hành và tài trợ bởi Lotus Gold, SCI và MSC.'],
    subsections: [
      {
        heading: 'Mục tiêu phát triển',
        bullets: [
          'Xây dựng cộng đồng golf văn minh và bền vững.',
          'Tổ chức các chương trình du lịch golf trong và ngoài nước.',
          'Tạo cơ hội việc làm cho giới trẻ.',
          'Đào tạo nghề và kỹ năng dịch vụ golf.',
          'Phát triển hệ thống đối tác và nhượng quyền.',
          'Thu hút đầu tư trong và ngoài nước.',
          'Tổ chức các giải đấu và chương trình tri ân với nhiều phần thưởng hấp dẫn.',
        ],
      },
    ],
  },
];

export default function PartnershipPolicyPage() {
  return (
    <LegalPage
      title="Chính sách hợp tác và quyền lợi"
      breadcrumbLabel="Chính sách hợp tác"
      intro="Câu lạc bộ Golf An Phú Lotus — “Kết nối cộng đồng, Nâng tầm trải nghiệm, Đồng hành phát triển.” Chính sách này nêu rõ quyền lợi, trách nhiệm và điều kiện tham gia dành cho huấn luyện viên, ban điều hành câu lạc bộ địa phương, đối tác giới thiệu khách và hội viên."
      updatedAt="07/08/2026"
      sections={SECTIONS}
    />
  );
}
