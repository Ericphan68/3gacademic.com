import { addDays, format, subDays } from 'date-fns';

import { COACHES } from '@/data/coaches';
import { EVENTS } from '@/data/events';
import { VOUCHERS } from '@/data/vouchers';
import { generateCode, generateId } from '@/lib/utils';
import type {
  Booking,
  EventRegistration,
  LessonRecord,
  MembershipRecord,
  OwnedVoucher,
  WalletTransaction,
} from '@/types';

/**
 * Sinh dữ liệu demo cho tài khoản khách hàng mẫu.
 *
 * Chạy một lần duy nhất ở client sau khi đăng nhập (xem `DemoDataSeeder`),
 * nên ngày tháng luôn tương đối với hôm nay và không bao giờ bị "hết hạn".
 */

const day = (offset: number) => format(offset >= 0 ? addDays(new Date(), offset) : subDays(new Date(), -offset), 'yyyy-MM-dd');

export function buildDemoBookings(): Booking[] {
  const templates: {
    offset: number;
    time: string;
    status: Booking['status'];
    experienceType: Booking['experienceType'];
    experienceLabel: string;
    zoneId: Booking['zoneId'];
    zoneName: string;
    coachIndex: number | null;
    guests: number;
    total: number;
  }[] = [
    {
      offset: 2,
      time: '18:00',
      status: 'upcoming',
      experienceType: 'coaching',
      experienceLabel: 'Học với huấn luyện viên',
      zoneId: 'driving-range',
      zoneName: 'Driving Range',
      coachIndex: 1,
      guests: 1,
      total: 1275000,
    },
    {
      offset: 5,
      time: '09:00',
      status: 'upcoming',
      experienceType: 'golf-3in1',
      experienceLabel: 'Golf 3-in-1',
      zoneId: 'short-game',
      zoneName: 'Short Game',
      coachIndex: null,
      guests: 2,
      total: 1180000,
    },
    {
      offset: -4,
      time: '19:00',
      status: 'completed',
      experienceType: 'range',
      experienceLabel: 'Tập sân',
      zoneId: 'driving-range',
      zoneName: 'Driving Range',
      coachIndex: null,
      guests: 1,
      total: 400000,
    },
    {
      offset: -11,
      time: '20:00',
      status: 'completed',
      experienceType: 'coaching',
      experienceLabel: 'Học với huấn luyện viên',
      zoneId: 'driving-range',
      zoneName: 'Driving Range',
      coachIndex: 1,
      guests: 1,
      total: 1147500,
    },
    {
      offset: -18,
      time: '10:00',
      status: 'completed',
      experienceType: 'putting',
      experienceLabel: 'Putting',
      zoneId: 'putting-green',
      zoneName: 'Putting Green',
      coachIndex: 2,
      guests: 1,
      total: 1058000,
    },
    {
      offset: -25,
      time: '17:00',
      status: 'cancelled',
      experienceType: 'range',
      experienceLabel: 'Tập sân',
      zoneId: 'driving-range',
      zoneName: 'Driving Range',
      coachIndex: null,
      guests: 3,
      total: 1200000,
    },
  ];

  return templates.map((template) => {
    const coach = template.coachIndex !== null ? COACHES[template.coachIndex] : null;
    const code = generateCode('LG');
    const date = day(template.offset);

    return {
      id: generateId('bk'),
      code,
      experienceType: template.experienceType,
      experienceLabel: template.experienceLabel,
      date,
      time: template.time,
      durationMinutes: template.experienceType === 'golf-3in1' ? 150 : 90,
      zoneId: template.zoneId,
      zoneName: template.zoneName,
      coachId: coach?.id ?? null,
      coachName: coach?.name ?? null,
      guests: template.guests,
      addOns:
        template.guests > 1
          ? [{ id: 'drink', name: 'Nước uống', quantity: template.guests, unitPrice: 35000 }]
          : [],
      voucherCode: template.status === 'completed' && template.offset === -11 ? 'OFFPEAK25' : null,
      contact: {
        fullName: 'Nguyễn Thu Trang',
        phone: '0901234567',
        email: 'customer@lotusgolf.vn',
        note: '',
        isFirstTime: false,
      },
      paymentMethod: 'wallet',
      price: {
        base: Math.round(template.total * 0.62),
        zoneSurcharge: template.zoneId === 'short-game' ? 50000 : 0,
        coachFee: coach?.pricePerSession ?? 0,
        addOns: template.guests > 1 ? 35000 * template.guests : 0,
        subtotal: Math.round(template.total * 1.12),
        membershipDiscount: Math.round(template.total * 0.1),
        voucherDiscount: 0,
        walletApplied: template.total,
        total: 0,
      },
      status: template.status,
      createdAt: new Date(Date.now() - Math.abs(template.offset) * 86400000).toISOString(),
      qrPayload: `LOTUS|BOOKING|${code}|${date}|${template.time}`,
    } satisfies Booking;
  });
}

export function buildDemoTransactions(startingBalance: number): WalletTransaction[] {
  const rows: { type: WalletTransaction['type']; label: string; amount: number; offset: number }[] = [
    { type: 'payment', label: 'Thanh toán buổi học · LG-8F3K2Q', amount: -1147500, offset: -11 },
    { type: 'payment', label: 'Thanh toán Putting · LG-2M7XPD', amount: -1058000, offset: -18 },
    { type: 'bonus', label: 'Bonus hội viên Lotus Member (+10%)', amount: 1500000, offset: -30 },
    { type: 'top-up', label: 'Nạp ví Lotus', amount: 15000000, offset: -30 },
    { type: 'voucher-purchase', label: 'Mua voucher Gift 1.000.000đ', amount: -950000, offset: -22 },
    { type: 'refund', label: 'Hoàn tiền booking đã huỷ · LG-QH4T7B', amount: 1200000, offset: -25 },
    { type: 'payment', label: 'Thanh toán tập sân · LG-R9K3LM', amount: -400000, offset: -4 },
  ];

  // Tính balanceAfter ngược từ số dư hiện tại về quá khứ.
  let running = startingBalance;
  return rows.map((row) => {
    const balanceAfter = running;
    running -= row.amount;
    return {
      id: generateId('tx'),
      type: row.type,
      label: row.label,
      amount: row.amount,
      balanceAfter,
      createdAt: subDays(new Date(), Math.abs(row.offset)).toISOString(),
      reference: row.label.includes('LG-') ? row.label.split('· ')[1] : undefined,
    } satisfies WalletTransaction;
  });
}

export function buildDemoVouchers(): OwnedVoucher[] {
  const picks = ['OFFPEAK25', 'BENTO1', 'COACH8', 'GIFT1000', 'COFFEE20'];
  const statuses: OwnedVoucher['status'][] = ['active', 'active', 'active', 'used', 'expired'];

  return picks
    .map((code, index) => {
      const voucher = VOUCHERS.find((item) => item.code === code);
      if (!voucher) return null;
      return {
        id: generateId('ov'),
        voucherId: voucher.id,
        code: voucher.code,
        name: voucher.name,
        category: voucher.category,
        faceValue: voucher.faceValue,
        discountLabel:
          voucher.discountType === 'percent'
            ? `Giảm ${voucher.discountValue}%`
            : `Giảm ${new Intl.NumberFormat('vi-VN').format(voucher.discountValue)}đ`,
        expiresAt: statuses[index] === 'expired' ? day(-3) : voucher.expiresAt,
        status: statuses[index],
        acquiredAt: subDays(new Date(), 20 - index * 3).toISOString(),
      } satisfies OwnedVoucher;
    })
    .filter((item): item is OwnedVoucher => item !== null);
}

export function buildDemoLessons(): LessonRecord[] {
  const coach = COACHES[1];
  const rows: { offset: number; time: string; status: LessonRecord['status']; focus: string; note: string; homework: string; score: number }[] = [
    {
      offset: 2,
      time: '18:00',
      status: 'scheduled',
      focus: 'Chuyển trọng tâm trong swing',
      note: 'Buổi tới tập trung vào nhịp chuyển trọng tâm từ chân sau sang chân trước.',
      homework: 'Tập 10 phút mỗi ngày với động tác chuyển trọng tâm không gậy.',
      score: 0,
    },
    {
      offset: -5,
      time: '18:00',
      status: 'completed',
      focus: 'Tư thế setup và grip',
      note: 'Grip đã đúng, setup ổn định hơn nhiều so với buổi đầu. Vai phải còn hơi cao.',
      homework: 'Soi gương kiểm tra setup 5 phút trước mỗi buổi tập.',
      score: 72,
    },
    {
      offset: -12,
      time: '20:00',
      status: 'completed',
      focus: 'Nhịp swing và takeaway',
      note: 'Takeaway còn nhanh. Đã tập bài đếm nhịp 1-2-3, cải thiện rõ ở nửa cuối buổi.',
      homework: 'Đánh 20 bóng với nhịp đếm chậm mỗi buổi tập.',
      score: 65,
    },
    {
      offset: -19,
      time: '19:00',
      status: 'completed',
      focus: 'Buổi đánh giá đầu vào',
      note: 'Đo hiện trạng: cự ly trung bình 92m với gậy 7. Đường bóng lệch phải nhiều.',
      homework: 'Chưa có bài tập, tập trung làm quen với cảm giác cầm gậy.',
      score: 48,
    },
    {
      offset: -26,
      time: '17:00',
      status: 'cancelled',
      focus: 'Buổi bị huỷ do lịch cá nhân',
      note: 'Học viên báo trước, buổi được chuyển sang tuần sau, không trừ số buổi.',
      homework: '—',
      score: 0,
    },
  ];

  return rows.map((row) => ({
    id: generateId('ls'),
    coachId: coach.id,
    coachName: coach.name,
    programName: 'Golf căn bản · 8 buổi',
    date: day(row.offset),
    time: row.time,
    status: row.status,
    focus: row.focus,
    coachNote: row.note,
    homework: row.homework,
    progressScore: row.score,
  }));
}

export function buildDemoEventRegistrations(): EventRegistration[] {
  return [EVENTS[3], EVENTS[5]].map((event) => ({
    id: generateId('er'),
    eventId: event.id,
    eventSlug: event.slug,
    eventTitle: event.title,
    startsAt: event.startsAt,
    location: event.location,
    attendees: 1,
    fee: event.fee,
    registeredAt: subDays(new Date(), 8).toISOString(),
    qrPayload: `LOTUS|EVENT|${event.id}|${generateCode('EV', 6)}`,
  }));
}

export function buildDemoMembership(): MembershipRecord {
  return {
    tierId: 'member',
    purchasedAt: subDays(new Date(), 142).toISOString(),
    expiresAt: addDays(new Date(), 223).toISOString(),
    topUpAmount: 15000000,
    bonusAmount: 1500000,
  };
}

/** Gói toàn bộ dữ liệu seed cho tài khoản khách hàng mẫu. */
export function buildCustomerDemoData(walletBalance: number) {
  return {
    bookings: buildDemoBookings(),
    transactions: buildDemoTransactions(walletBalance),
    vouchers: buildDemoVouchers(),
    lessons: buildDemoLessons(),
    eventRegistrations: buildDemoEventRegistrations(),
    membership: buildDemoMembership(),
  };
}
