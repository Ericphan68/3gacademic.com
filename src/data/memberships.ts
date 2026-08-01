import { membershipImage } from '@/constants/media';
import type { MembershipTier, MembershipTierId } from '@/types';

/**
 * 4 hạng hội viên. Toàn bộ con số là mức demo dùng để trình diễn giao diện,
 * không phải chính sách thương mại chính thức.
 */
export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'starter',
    name: 'Lotus Starter',
    tagline: 'Bắt đầu nhẹ nhàng, không ràng buộc',
    topUpAmount: 5000000,
    bonusPercent: 5,
    courtDiscountPercent: 5,
    coachDiscountPercent: 0,
    fnbDiscountPercent: 5,
    advanceBookingDays: 7,
    priorityWindow: 'Khung giờ tiêu chuẩn',
    eventInvites: 1,
    birthdayGift: 'Voucher 300.000đ trong tháng sinh nhật',
    concierge: false,
    cancellationPolicy: 'Huỷ miễn phí trước 4 giờ',
    validityMonths: 12,
    image: membershipImage('starter'),
    benefits: [
      { label: 'Bonus khi nạp', value: '+5%', included: true },
      { label: 'Ưu đãi giá sân', value: '5%', included: true },
      { label: 'Ưu đãi huấn luyện viên', value: '—', included: false },
      { label: 'Ưu đãi F&B', value: '5%', included: true },
      { label: 'Đặt lịch trước', value: '7 ngày', included: true },
      { label: 'Ưu tiên khung giờ cao điểm', value: '—', included: false },
      { label: 'Vé sự kiện mỗi năm', value: '1 vé', included: true },
      { label: 'Quà sinh nhật', value: 'Voucher 300k', included: true },
      { label: 'Concierge riêng', value: '—', included: false },
      { label: 'Thời hạn', value: '12 tháng', included: true },
    ],
  },
  {
    id: 'member',
    name: 'Lotus Member',
    tagline: 'Hạng phổ biến nhất cho người chơi đều đặn',
    topUpAmount: 15000000,
    bonusPercent: 10,
    courtDiscountPercent: 10,
    coachDiscountPercent: 5,
    fnbDiscountPercent: 10,
    advanceBookingDays: 14,
    priorityWindow: 'Ưu tiên khung 18:00 – 20:00',
    eventInvites: 3,
    birthdayGift: 'Buổi tập miễn phí + voucher 500.000đ',
    concierge: false,
    cancellationPolicy: 'Huỷ miễn phí trước 2 giờ',
    validityMonths: 12,
    image: membershipImage('member'),
    highlight: 'Được chọn nhiều nhất',
    benefits: [
      { label: 'Bonus khi nạp', value: '+10%', included: true },
      { label: 'Ưu đãi giá sân', value: '10%', included: true },
      { label: 'Ưu đãi huấn luyện viên', value: '5%', included: true },
      { label: 'Ưu đãi F&B', value: '10%', included: true },
      { label: 'Đặt lịch trước', value: '14 ngày', included: true },
      { label: 'Ưu tiên khung giờ cao điểm', value: '18:00–20:00', included: true },
      { label: 'Vé sự kiện mỗi năm', value: '3 vé', included: true },
      { label: 'Quà sinh nhật', value: 'Buổi tập + 500k', included: true },
      { label: 'Concierge riêng', value: '—', included: false },
      { label: 'Thời hạn', value: '12 tháng', included: true },
    ],
  },
  {
    id: 'premium',
    name: 'Lotus Premium',
    tagline: 'Ưu tiên cao, có concierge đồng hành',
    topUpAmount: 40000000,
    bonusPercent: 15,
    courtDiscountPercent: 18,
    coachDiscountPercent: 12,
    fnbDiscountPercent: 15,
    advanceBookingDays: 30,
    priorityWindow: 'Ưu tiên toàn bộ khung cao điểm',
    eventInvites: 8,
    birthdayGift: 'Private Bay 1 buổi + bento cho 2 khách',
    concierge: true,
    cancellationPolicy: 'Huỷ miễn phí trước 1 giờ',
    validityMonths: 18,
    image: membershipImage('premium'),
    benefits: [
      { label: 'Bonus khi nạp', value: '+15%', included: true },
      { label: 'Ưu đãi giá sân', value: '18%', included: true },
      { label: 'Ưu đãi huấn luyện viên', value: '12%', included: true },
      { label: 'Ưu đãi F&B', value: '15%', included: true },
      { label: 'Đặt lịch trước', value: '30 ngày', included: true },
      { label: 'Ưu tiên khung giờ cao điểm', value: 'Toàn bộ', included: true },
      { label: 'Vé sự kiện mỗi năm', value: '8 vé', included: true },
      { label: 'Quà sinh nhật', value: 'Private Bay + bento', included: true },
      { label: 'Concierge riêng', value: 'Có', included: true },
      { label: 'Thời hạn', value: '18 tháng', included: true },
    ],
  },
  {
    id: 'founder',
    name: 'Founder Membership',
    tagline: 'Số lượng giới hạn trong giai đoạn khai trương',
    topUpAmount: 80000000,
    bonusPercent: 25,
    courtDiscountPercent: 25,
    coachDiscountPercent: 20,
    fnbDiscountPercent: 20,
    advanceBookingDays: 60,
    priorityWindow: 'Ưu tiên tuyệt đối, giữ chỗ khung cố định hàng tuần',
    eventInvites: 20,
    birthdayGift: 'Buổi Private VIP Golf cho 4 khách',
    concierge: true,
    cancellationPolicy: 'Huỷ linh hoạt, không giới hạn số lần',
    validityMonths: 24,
    image: membershipImage('founder'),
    highlight: 'Giới hạn 120 suất',
    limited: {
      total: 120,
      remaining: 37,
      endsAt: '2026-09-30T23:59:59+07:00',
    },
    benefits: [
      { label: 'Bonus khi nạp', value: '+25%', included: true },
      { label: 'Ưu đãi giá sân', value: '25%', included: true },
      { label: 'Ưu đãi huấn luyện viên', value: '20%', included: true },
      { label: 'Ưu đãi F&B', value: '20%', included: true },
      { label: 'Đặt lịch trước', value: '60 ngày', included: true },
      { label: 'Ưu tiên khung giờ cao điểm', value: 'Giữ chỗ cố định', included: true },
      { label: 'Vé sự kiện mỗi năm', value: '20 vé', included: true },
      { label: 'Quà sinh nhật', value: 'Private VIP Golf 4 khách', included: true },
      { label: 'Concierge riêng', value: 'Có', included: true },
      { label: 'Thời hạn', value: '24 tháng', included: true },
    ],
  },
];

export const MEMBERSHIP_BY_ID: Record<MembershipTierId, MembershipTier> = MEMBERSHIP_TIERS.reduce(
  (acc, tier) => ({ ...acc, [tier.id]: tier }),
  {} as Record<MembershipTierId, MembershipTier>,
);

export const MEMBERSHIP_ORDER: MembershipTierId[] = ['starter', 'member', 'premium', 'founder'];

export const MEMBERSHIP_FAQS = [
  {
    id: 'ms-faq-1',
    question: 'Số dư Top-up có bị mất khi hết hạn hội viên không?',
    answer:
      'Không. Số dư còn lại vẫn dùng được thêm 6 tháng sau khi hạng hội viên hết hiệu lực. Các ưu đãi theo hạng thì ngừng áp dụng.',
    group: 'membership' as const,
  },
  {
    id: 'ms-faq-2',
    question: 'Tôi có thể nâng hạng giữa chừng không?',
    answer:
      'Có. Bạn chỉ cần bù phần chênh lệch giữa hai hạng, thời hạn được tính lại từ ngày nâng cấp và bonus áp dụng trên phần bù.',
    group: 'membership' as const,
  },
  {
    id: 'ms-faq-3',
    question: 'Người thân có dùng chung số dư của tôi được không?',
    answer:
      'Bạn có thể dùng số dư để thanh toán cho khách đi cùng trong cùng một booking. Việc chuyển số dư sang tài khoản khác chưa được hỗ trợ.',
    group: 'membership' as const,
  },
  {
    id: 'ms-faq-4',
    question: 'Founder Membership khác gì Premium?',
    answer:
      'Founder có bonus và ưu đãi cao hơn, thời hạn 24 tháng, quyền giữ chỗ khung giờ cố định hàng tuần và số lượng giới hạn trong giai đoạn khai trương.',
    group: 'membership' as const,
  },
  {
    id: 'ms-faq-5',
    question: 'Tôi có được hoàn tiền nếu không dùng hết không?',
    answer:
      'Số dư Top-up không hoàn tiền mặt, nhưng dùng được cho toàn bộ dịch vụ tại Lotus: giờ tập, buổi học, F&B, sự kiện và voucher.',
    group: 'membership' as const,
  },
  {
    id: 'ms-faq-6',
    question: 'Đăng ký hội viên có cần đến trực tiếp không?',
    answer:
      'Không. Bạn chọn hạng trên website, xác nhận và hoàn tất — thẻ hội viên điện tử xuất hiện ngay trong Dashboard.',
    group: 'membership' as const,
  },
];
