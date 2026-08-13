import 'server-only';

import { prisma } from '@/server/db';

/**
 * Lưu đơn đặt lịch thật vào database + đọc cho Admin.
 *
 * Nguyên tắc AN TOÀN: createBooking chỉ được gọi "ghi thêm" song song với luồng
 * localStorage sẵn có. Đơn luôn lưu được nhờ các trường denormalized (contactName,
 * experienceLabel, zoneName...) — KHÔNG phụ thuộc khoá ngoại (customer/experience/
 * zone/coach đều để trống nếu chưa có bản ghi tương ứng). Việc gắn customer là
 * best-effort: lỗi thì đơn vẫn lưu, chỉ là chưa liên kết khách.
 */

type DbPayMethod = 'WALLET' | 'MOMO' | 'VNPAY' | 'CARD' | 'TRANSFER' | 'AT_CENTER';
type DbPayStatus = 'UNPAID' | 'PAID_AT_COUNTER' | 'PAID' | 'REFUNDED';
type DbStatus = 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

const PAY_METHOD: Record<string, DbPayMethod> = {
  wallet: 'WALLET',
  momo: 'MOMO',
  vnpay: 'VNPAY',
  card: 'CARD',
  transfer: 'TRANSFER',
  'at-center': 'AT_CENTER',
};
const PAY_STATUS: Record<string, DbPayStatus> = {
  paid: 'PAID',
  pending: 'UNPAID',
  'pay-later': 'UNPAID',
};
const STATUS: Record<string, DbStatus> = {
  upcoming: 'CONFIRMED',
  completed: 'COMPLETED',
  cancelled: 'CANCELLED',
};

export interface CreateBookingInput {
  code: string;
  experienceLabel: string;
  date: string; // YYYY-MM-DD
  time: string;
  durationMinutes: number;
  zoneName?: string | null;
  coachName?: string | null;
  guests: number;
  voucherCode?: string | null;
  contact: { fullName: string; phone: string; email?: string | null; note?: string | null };
  paymentMethod: string;
  paymentStatus: string;
  status?: string;
  qrPayload?: string | null;
  addOns?: { name: string; quantity?: number; unitPrice: number }[];
  price: {
    base?: number;
    zoneSurcharge?: number;
    coachFee?: number;
    addOns?: number;
    subtotal?: number;
    membershipDiscount?: number;
    voucherDiscount?: number;
    walletApplied?: number;
    total: number;
  };
}

const n = (v: number | undefined) => Math.max(0, Math.round(v ?? 0));

/** Ghi đơn vào DB. Trả về id, hoặc ném lỗi (caller tự nuốt để không phá UX khách). */
export async function createBooking(input: CreateBookingInput): Promise<{ id: string }> {
  const { contact } = input;

  // Best-effort: gắn/khởi tạo khách theo số điện thoại.
  let customerId: string | null = null;
  try {
    const customer = await prisma.customer.upsert({
      where: { phone: contact.phone },
      update: { fullName: contact.fullName, lastVisitAt: new Date() },
      create: {
        fullName: contact.fullName,
        phone: contact.phone,
        email: contact.email || null,
      },
    });
    customerId = customer.id;
  } catch {
    customerId = null; // vd trùng email @unique — bỏ qua, đơn vẫn lưu.
  }

  const note = [contact.note, input.coachName ? `HLV: ${input.coachName}` : null]
    .filter(Boolean)
    .join(' · ') || null;

  const p = input.price;
  const booking = await prisma.booking.create({
    data: {
      code: input.code,
      customerId,
      contactName: contact.fullName,
      contactPhone: contact.phone,
      contactEmail: contact.email || null,
      note,
      experienceLabel: input.experienceLabel,
      zoneName: input.zoneName || null,
      // Cột @db.Date chỉ lưu ngày; parse 'YYYY-MM-DD' theo UTC để giữ đúng ngày lịch.
      date: new Date(input.date),
      time: input.time,
      durationMinutes: input.durationMinutes,
      guests: input.guests,
      voucherCode: input.voucherCode || null,
      source: 'ONLINE',
      status: STATUS[input.status ?? 'upcoming'] ?? 'CONFIRMED',
      paymentMethod: PAY_METHOD[input.paymentMethod] ?? 'AT_CENTER',
      paymentStatus: PAY_STATUS[input.paymentStatus] ?? 'UNPAID',
      basePriceAmount: n(p.base),
      zoneSurchargeAmount: n(p.zoneSurcharge),
      coachFeeAmount: n(p.coachFee),
      addOnsAmount: n(p.addOns),
      subtotalAmount: n(p.subtotal),
      membershipDiscount: n(p.membershipDiscount),
      voucherDiscount: n(p.voucherDiscount),
      walletApplied: n(p.walletApplied),
      totalAmount: n(p.total),
      qrPayload: input.qrPayload || null,
      items: {
        create: (input.addOns ?? []).map((a) => ({
          name: a.name,
          quantity: Math.max(1, Math.round(a.quantity ?? 1)),
          unitPrice: n(a.unitPrice),
        })),
      },
    },
    select: { id: true },
  });
  return booking;
}

export interface AdminBookingRow {
  id: string;
  code: string;
  contactName: string;
  contactPhone: string;
  experienceLabel: string;
  zoneName: string | null;
  date: string; // ISO
  time: string;
  guests: number;
  totalAmount: number;
  status: DbStatus;
  paymentStatus: DbPayStatus;
  createdAt: string;
}

export async function listBookings(limit = 200): Promise<AdminBookingRow[]> {
  try {
    return await listBookingsInner(limit);
  } catch {
    return [];
  }
}

async function listBookingsInner(limit: number): Promise<AdminBookingRow[]> {
  const rows = await prisma.booking.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      code: true,
      contactName: true,
      contactPhone: true,
      experienceLabel: true,
      zoneName: true,
      date: true,
      time: true,
      guests: true,
      totalAmount: true,
      status: true,
      paymentStatus: true,
      createdAt: true,
    },
  });
  return rows.map((r) => ({
    ...r,
    date: r.date.toISOString(),
    createdAt: r.createdAt.toISOString(),
  }));
}

export async function markBookingPaid(id: string) {
  return prisma.booking.update({ where: { id }, data: { paymentStatus: 'PAID' } });
}

export async function setBookingStatus(id: string, status: DbStatus) {
  return prisma.booking.update({ where: { id }, data: { status } });
}

export interface AdminCustomerRow {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  status: string;
  bookingCount: number;
  createdAt: string;
  lastVisitAt: string | null;
}

export async function listCustomers(limit = 300): Promise<AdminCustomerRow[]> {
  try {
    return await listCustomersInner(limit);
  } catch {
    return [];
  }
}

async function listCustomersInner(limit: number): Promise<AdminCustomerRow[]> {
  const rows = await prisma.customer.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      status: true,
      createdAt: true,
      lastVisitAt: true,
      _count: { select: { bookings: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    fullName: r.fullName,
    phone: r.phone,
    email: r.email,
    status: r.status,
    bookingCount: r._count.bookings,
    createdAt: r.createdAt.toISOString(),
    lastVisitAt: r.lastVisitAt ? r.lastVisitAt.toISOString() : null,
  }));
}

export interface DashboardStats {
  totalBookings: number;
  paidRevenue: number;
  outstanding: number;
  pendingCount: number;
  customers: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    return await getDashboardStatsInner();
  } catch {
    return { totalBookings: 0, paidRevenue: 0, outstanding: 0, pendingCount: 0, customers: 0 };
  }
}

async function getDashboardStatsInner(): Promise<DashboardStats> {
  const [totalBookings, customers, paidAgg, outstandingAgg, pendingCount] = await Promise.all([
    prisma.booking.count({ where: { deletedAt: null } }),
    prisma.customer.count({ where: { deletedAt: null } }),
    prisma.booking.aggregate({
      where: { deletedAt: null, paymentStatus: { in: ['PAID', 'PAID_AT_COUNTER'] } },
      _sum: { totalAmount: true },
    }),
    prisma.booking.aggregate({
      where: { deletedAt: null, paymentStatus: 'UNPAID', status: { not: 'CANCELLED' } },
      _sum: { totalAmount: true },
    }),
    prisma.booking.count({ where: { deletedAt: null, paymentStatus: 'UNPAID', status: { not: 'CANCELLED' } } }),
  ]);
  return {
    totalBookings,
    customers,
    paidRevenue: paidAgg._sum.totalAmount ?? 0,
    outstanding: outstandingAgg._sum.totalAmount ?? 0,
    pendingCount,
  };
}
