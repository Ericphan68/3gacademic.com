import type { FaqGroup, FaqItem } from '@/types';

export const FAQ_GROUP_LABELS: Record<FaqGroup, string> = {
  beginner: 'Người mới',
  booking: 'Đặt lịch',
  membership: 'Hội viên',
  coach: 'Huấn luyện viên',
  junior: 'Trẻ em',
  corporate: 'Doanh nghiệp',
  voucher: 'Voucher',
  reschedule: 'Đổi lịch & huỷ',
  dresscode: 'Trang phục',
  equipment: 'Dụng cụ',
  payment: 'Thanh toán',
};

export const FAQ_GROUP_ORDER: FaqGroup[] = [
  'beginner',
  'booking',
  'membership',
  'coach',
  'junior',
  'corporate',
  'voucher',
  'reschedule',
  'dresscode',
  'equipment',
  'payment',
];

function make(group: FaqGroup, items: [string, string][]): FaqItem[] {
  return items.map(([question, answer], index) => ({
    id: `${group}-${index + 1}`,
    question,
    answer,
    group,
  }));
}

export const FAQS: FaqItem[] = [
  ...make('beginner', [
    [
      'Tôi chưa bao giờ chơi golf, bắt đầu từ đâu?',
      'Bắt đầu bằng gói Lotus Discovery. Đây là buổi 60 phút có nhân viên đi cùng từ đầu đến cuối, bạn không cần biết gì trước và không cần mang theo bất cứ thứ gì.',
    ],
    [
      'Golf có khó không? Tôi sợ mình không có năng khiếu.',
      'Phần lớn khách của Lotus bắt đầu từ con số 0 và đánh trúng bóng ngay trong buổi đầu tiên. Golf khó ở chỗ chơi giỏi, nhưng để bắt đầu và thấy vui thì không khó.',
    ],
    [
      'Tôi đi một mình có kỳ không?',
      'Hoàn toàn không. Rất nhiều khách đến một mình. Khu tập được bố trí để bạn có không gian riêng, và luôn có nhân viên hỗ trợ khi cần.',
    ],
    [
      'Một buổi tập tốn khoảng bao nhiêu?',
      'Gói cơ bản từ 320.000đ cho một giờ tập. Gói dành cho người mới có kèm hướng dẫn từ 390.000đ. Bạn xem chi tiết ở trang Trải nghiệm.',
    ],
    [
      'Bao lâu thì tôi chơi được ra sân 18 hố?',
      'Tuỳ tần suất tập. Trung bình học viên học 8–12 buổi và tập thêm đều đặn thì có thể ra sân lớn sau khoảng 3–4 tháng.',
    ],
    [
      'Tôi lớn tuổi rồi, có tập được không?',
      'Được. Golf là môn thể thao ít va chạm và có thể điều chỉnh cường độ. Huấn luyện viên sẽ thiết kế bài tập phù hợp với thể trạng của bạn.',
    ],
    [
      'Trung tâm có hỗ trợ tiếng Anh không?',
      'Có. Nhiều huấn luyện viên và nhân viên nói được tiếng Anh. Một số huấn luyện viên còn hỗ trợ tiếng Hàn và tiếng Nhật.',
    ],
  ]),
  ...make('booking', [
    [
      'Tôi có cần đặt lịch trước không?',
      'Nên đặt trước để chắc chắn có chỗ, đặc biệt khung 18:00–20:00 và cuối tuần. Bạn vẫn có thể đến trực tiếp nếu còn thảm trống.',
    ],
    [
      'Đặt lịch trước bao lâu là hợp lý?',
      'Khách thường 1–2 ngày là đủ. Hội viên được đặt trước 7 đến 60 ngày tuỳ hạng.',
    ],
    [
      'Tôi có thể đặt cho nhóm bạn không?',
      'Có. Ở bước chọn số khách, bạn nhập tổng số người. Với nhóm trên 10 người, dùng form Golf doanh nghiệp để được bố trí khu riêng.',
    ],
    [
      'Khung giờ nào rẻ nhất?',
      'Khung 09:00–15:00 các ngày trong tuần là giờ thấp điểm, có mức giá tốt nhất và thường vắng hơn.',
    ],
    [
      'Check-in như thế nào?',
      'Sau khi đặt lịch, bạn nhận một mã QR trong Dashboard. Quét mã tại quầy là xong, không cần khai lại thông tin.',
    ],
    [
      'Tôi đến muộn thì sao?',
      'Thời gian tập được tính từ giờ đã đặt. Nếu bạn báo trước, Lotus sẽ cố gắng giữ nguyên thời lượng nếu khung sau còn trống.',
    ],
  ]),
  ...make('membership', [
    [
      'Có bắt buộc phải làm hội viên không?',
      'Không. Bạn hoàn toàn có thể đặt lịch lẻ. Hội viên chỉ dành cho người chơi thường xuyên và muốn có ưu đãi tốt hơn.',
    ],
    [
      'Hạng nào phù hợp với tôi?',
      'Nếu bạn chơi 2–4 lần mỗi tháng, Lotus Member là hạng hợp lý nhất. Chơi ít hơn thì chọn Starter, chơi rất thường xuyên thì cân nhắc Premium.',
    ],
    [
      'Số dư Top-up dùng được cho những gì?',
      'Dùng được cho toàn bộ dịch vụ: giờ tập, buổi học với huấn luyện viên, F&B, phí sự kiện và mua voucher.',
    ],
    [
      'Tôi có thể nâng hạng giữa chừng không?',
      'Có. Bạn chỉ bù phần chênh lệch, thời hạn tính lại từ ngày nâng cấp.',
    ],
    [
      'Thẻ hội viên có phải thẻ cứng không?',
      'Là thẻ điện tử trong Dashboard, kèm mã QR. Hội viên Premium và Founder được tặng thêm thẻ cứng.',
    ],
    [
      'Founder Membership còn mở đến khi nào?',
      'Founder Membership giới hạn 120 suất trong giai đoạn khai trương. Số suất còn lại được hiển thị trực tiếp trên trang Hội viên.',
    ],
  ]),
  ...make('coach', [
    [
      'Tôi nên chọn huấn luyện viên thế nào?',
      'Lọc theo chuyên môn phù hợp với mục tiêu của bạn: người mới, putting, swing, trẻ em hay thi đấu. Sau đó xem hồ sơ và đánh giá từ học viên khác.',
    ],
    [
      'Tôi có thể học thử một buổi trước không?',
      'Có. Gói First Swing Experience chính là buổi học thử có đánh giá đầu vào, không ràng buộc phải mua tiếp lộ trình.',
    ],
    [
      'Đổi huấn luyện viên giữa chừng có mất phí không?',
      'Không. Số buổi còn lại được chuyển nguyên vẹn sang huấn luyện viên mới.',
    ],
    [
      'Một buổi học kéo dài bao lâu?',
      'Mỗi buổi 60 phút, chưa tính khoảng 10 phút khởi động và trao đổi trước buổi.',
    ],
    [
      'Huấn luyện viên có ghi chú lại buổi học không?',
      'Có. Ghi chú và bài tập về nhà xuất hiện trong mục Buổi học ở Dashboard của bạn sau mỗi buổi.',
    ],
    [
      'Tôi học nhóm với bạn được không?',
      'Được. Lớp nhóm 3–6 người có chi phí thấp hơn đáng kể so với học 1 kèm 1.',
    ],
  ]),
  ...make('junior', [
    ['Bé mấy tuổi thì học được?', 'Lotus nhận học viên từ 7 tuổi để đảm bảo bé đủ sức cầm gậy an toàn.'],
    ['Có cần mua gậy cho bé không?', 'Không cần. Lotus có bộ gậy Junior nhiều kích cỡ, chọn theo chiều cao của bé.'],
    ['Phụ huynh có được vào xem không?', 'Có khu chờ riêng nhìn thẳng ra khu tập, kèm đồ uống miễn phí cho phụ huynh.'],
    ['Bé học bao lâu thì thấy tiến bộ?', 'Thường sau 6–8 buổi bé đã đánh trúng bóng đều đặn và giữ được tư thế cơ bản.'],
    ['Có lớp học vào cuối tuần không?', 'Có. Các lớp Junior tập trung vào sáng Thứ Bảy và Chủ Nhật.'],
    ['Bé có nhận được báo cáo học tập không?', 'Sau mỗi buổi, phụ huynh nhận một báo cáo ngắn về nội dung học và điểm cần luyện thêm.'],
  ]),
  ...make('corporate', [
    [
      'Nhân viên công ty tôi chưa ai chơi golf, tổ chức được không?',
      'Đây là tình huống phổ biến nhất. Lotus luôn bố trí huấn luyện viên riêng cho nhóm người mới trong suốt sự kiện.',
    ],
    [
      'Cần đặt trước bao lâu?',
      'Với nhóm dưới 30 người, nên đặt trước 2 tuần. Nhóm lớn hơn hoặc cần branding riêng thì 3–4 tuần.',
    ],
    [
      'Có xuất hoá đơn VAT không?',
      'Có. Lotus xuất hoá đơn đầy đủ theo thông tin doanh nghiệp bạn cung cấp.',
    ],
    [
      'Có thể in logo công ty lên các hạng mục không?',
      'Có. Backdrop, standee, cờ tee, bảng điểm và quà tặng đều có thể in thương hiệu doanh nghiệp.',
    ],
    [
      'Nếu trời mưa thì sao?',
      'Khu Driving Range có mái che toàn bộ, sự kiện vẫn diễn ra bình thường. Các hạng mục ngoài trời có phương án dự phòng trong nhà.',
    ],
    [
      'Sau sự kiện có báo cáo không?',
      'Trong vòng 48 giờ, doanh nghiệp nhận báo cáo tổ chức kèm bộ ảnh đã chỉnh sửa.',
    ],
  ]),
  ...make('voucher', [
    ['Voucher dùng thế nào?', 'Ở bước 7 của luồng đặt lịch, bạn nhập mã hoặc chọn voucher đang có trong tài khoản.'],
    ['Có được dùng nhiều voucher cùng lúc không?', 'Mỗi đơn chỉ áp dụng một voucher. Voucher vẫn kết hợp được với ưu đãi hội viên.'],
    ['Voucher đã mua có hoàn tiền được không?', 'Voucher đã mua không hoàn tiền, nhưng bạn có thể chuyển tặng cho tài khoản khác.'],
    ['Voucher hết hạn có gia hạn được không?', 'Voucher trả phí được gia hạn một lần 30 ngày. Voucher tặng miễn phí không gia hạn.'],
    ['Tôi tặng voucher cho bạn được không?', 'Được. Trong mục Voucher ở Dashboard có chức năng chuyển tặng — hiện là tính năng demo.'],
    ['Flash Sale diễn ra khi nào?', 'Không cố định. Lotus thông báo qua email và Zalo cho những người đã đăng ký nhận tin.'],
  ]),
  ...make('reschedule', [
    ['Đổi lịch có mất phí không?', 'Đổi trước 4 giờ là miễn phí với hầu hết các gói. Một số gói yêu cầu báo trước 12 hoặc 24 giờ.'],
    ['Huỷ lịch có được hoàn tiền không?', 'Huỷ đúng hạn được hoàn 100% vào ví Lotus. Huỷ sát giờ sẽ bị trừ một phần theo chính sách từng gói.'],
    ['Tôi đổi lịch bằng cách nào?', 'Vào Dashboard, mục Lịch đặt, chọn booking rồi bấm Đổi lịch. Không cần gọi điện.'],
    ['Có giới hạn số lần đổi lịch không?', 'Khách thường được đổi tối đa 2 lần cho một booking. Hội viên Premium và Founder không giới hạn.'],
    ['Nếu tôi không đến mà không báo?', 'Booking được tính là đã sử dụng. Lotus khuyến khích bạn báo sớm để nhường chỗ cho khách khác.'],
    ['Trời mưa thì có được đổi không?', 'Khu tập có mái che nên vẫn hoạt động bình thường. Nếu thời tiết cực đoan, Lotus chủ động liên hệ và hỗ trợ đổi lịch miễn phí.'],
  ]),
  ...make('dresscode', [
    ['Tôi nên mặc gì khi đến tập?', 'Trang phục thể thao thoải mái là đủ. Lotus không yêu cầu trang phục golf chuyên dụng ở khu tập.'],
    ['Có được mặc quần short không?', 'Được, miễn là quần short thể thao lịch sự.'],
    ['Giày như thế nào là phù hợp?', 'Giày thể thao đế bằng. Không bắt buộc giày golf có đinh.'],
    ['Có phòng thay đồ không?', 'Có phòng thay đồ và tủ khoá miễn phí cho tất cả khách. Khu VIP có phòng thay đồ riêng.'],
    ['Tôi đi làm về, mặc đồ công sở được không?', 'Được, và bạn có thể thay đồ tại trung tâm. Nhiều khách đến thẳng sau giờ làm.'],
    ['Có cần mang găng tay không?', 'Không bắt buộc. Lotus có găng tay cho mượn hoặc bán tại quầy nếu bạn muốn dùng riêng.'],
  ]),
  ...make('equipment', [
    ['Tôi chưa có gậy, có sao không?', 'Không sao. Lotus cho mượn bộ gậy đầy đủ, chọn theo chiều cao và tay thuận của bạn.'],
    ['Mượn gậy có mất phí không?', 'Một số gói đã bao gồm. Nếu chưa, phí thuê là 150.000đ một bộ.'],
    ['Tôi mang gậy riêng được không?', 'Hoàn toàn được, và Lotus khuyến khích nếu bạn đã quen với gậy của mình.'],
    ['Có dịch vụ gửi gậy tại trung tâm không?', 'Có tủ gửi gậy dành cho hội viên Premium và Founder.'],
    ['Trung tâm có bán dụng cụ không?', 'Quầy pro shop có găng tay, bóng, tee và một số phụ kiện cơ bản.'],
    ['Gậy cho trẻ em có sẵn không?', 'Có bộ gậy Junior nhiều kích cỡ, chọn theo chiều cao của bé.'],
  ]),
  ...make('payment', [
    ['Có những hình thức thanh toán nào?', 'Ví Lotus, chuyển khoản, thẻ ngân hàng, hoặc thanh toán trực tiếp khi đến trung tâm.'],
    ['Tôi phải trả trước khi đặt lịch không?', 'Không bắt buộc. Bạn có thể chọn thanh toán tại trung tâm khi check-in.'],
    ['Ví Lotus là gì?', 'Là số dư trả trước trong tài khoản của bạn. Nạp càng nhiều thì mức bonus càng cao.'],
    ['Có xuất hoá đơn được không?', 'Có. Bạn ghi chú thông tin xuất hoá đơn khi đặt lịch hoặc báo tại quầy.'],
    ['Thanh toán bằng thẻ quốc tế được không?', 'Được. Trung tâm chấp nhận cả thẻ nội địa và thẻ quốc tế.'],
    ['Số dư ví có bị hết hạn không?', 'Số dư còn dùng được thêm 6 tháng sau khi hạng hội viên hết hiệu lực.'],
  ]),
];

export function getFaqsByGroup(group: FaqGroup): FaqItem[] {
  return FAQS.filter((faq) => faq.group === group);
}
