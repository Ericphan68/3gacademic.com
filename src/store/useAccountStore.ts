'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/site';
import { generateCode, generateId } from '@/lib/utils';
import type {
  Booking,
  EventRegistration,
  FnbOrder,
  LeadRequest,
  LessonRecord,
  MembershipRecord,
  MembershipTierId,
  OwnedVoucher,
  WalletTransaction,
} from '@/types';

/**
 * Kho dữ liệu tài khoản phía client (localStorage).
 *
 * Tất cả booking, giao dịch ví, voucher, đăng ký sự kiện, đơn F&B và
 * yêu cầu doanh nghiệp đều đi qua đây, nên Dashboard luôn phản ánh đúng
 * những gì người dùng vừa thao tác.
 */

interface AccountState {
  bookings: Booking[];
  transactions: WalletTransaction[];
  vouchers: OwnedVoucher[];
  membership: MembershipRecord | null;
  eventRegistrations: EventRegistration[];
  lessons: LessonRecord[];
  fnbOrders: FnbOrder[];
  favoriteCoaches: string[];
  leads: LeadRequest[];
  seeded: boolean;
  /** Chủ sở hữu dữ liệu client hiện tại (id khách đăng nhập). Đổi chủ -> xoá sạch. */
  ownerId: string | null;

  addBooking: (booking: Booking) => void;
  /** Gộp đơn THẬT từ server (ưu tiên server, giữ đơn client chưa đồng bộ theo mã). */
  mergeServerBookings: (server: Booking[]) => void;
  cancelBooking: (id: string) => void;
  rescheduleBooking: (id: string, date: string, time: string) => void;
  markBookingPaid: (id: string) => void;
  addTransaction: (tx: Omit<WalletTransaction, 'id' | 'createdAt'>) => void;
  addVoucher: (voucher: Omit<OwnedVoucher, 'id' | 'acquiredAt'>) => void;
  useVoucher: (code: string) => void;
  giftVoucher: (id: string, recipient: string) => void;
  setMembership: (record: MembershipRecord) => void;
  registerEvent: (registration: Omit<EventRegistration, 'id' | 'registeredAt' | 'qrPayload'>) => EventRegistration;
  addFnbOrder: (order: Omit<FnbOrder, 'id' | 'code' | 'createdAt' | 'status'>) => FnbOrder;
  toggleFavoriteCoach: (coachId: string) => void;
  addLead: (lead: Omit<LeadRequest, 'id' | 'createdAt' | 'status'>) => void;
  /** Gắn dữ liệu cho khách đang đăng nhập; nếu khác chủ cũ -> xoá sạch (chống lẫn khách). */
  claimFor: (userId: string | null) => void;
  seedDemoData: (payload: {
    bookings: Booking[];
    transactions: WalletTransaction[];
    vouchers: OwnedVoucher[];
    lessons: LessonRecord[];
    eventRegistrations: EventRegistration[];
    membership: MembershipRecord | null;
  }) => void;
  resetAccount: () => void;
}

const EMPTY = {
  bookings: [],
  transactions: [],
  vouchers: [],
  membership: null,
  eventRegistrations: [],
  lessons: [],
  fnbOrders: [],
  favoriteCoaches: [],
  leads: [],
  seeded: false,
  ownerId: null,
} satisfies Omit<
  AccountState,
  | 'addBooking'
  | 'mergeServerBookings'
  | 'cancelBooking'
  | 'rescheduleBooking'
  | 'markBookingPaid'
  | 'addTransaction'
  | 'addVoucher'
  | 'useVoucher'
  | 'giftVoucher'
  | 'setMembership'
  | 'registerEvent'
  | 'addFnbOrder'
  | 'toggleFavoriteCoach'
  | 'addLead'
  | 'claimFor'
  | 'seedDemoData'
  | 'resetAccount'
>;

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      ...EMPTY,

      addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),

      mergeServerBookings: (server) =>
        set((state) => {
          const codes = new Set(server.map((b) => b.code));
          const clientOnly = state.bookings.filter((b) => !codes.has(b.code));
          return { bookings: [...server, ...clientOnly] };
        }),

      cancelBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, status: 'cancelled' as const } : booking,
          ),
        })),

      rescheduleBooking: (id, date, time) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, date, time } : booking,
          ),
        })),

      markBookingPaid: (id) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, paymentStatus: 'paid' as const } : booking,
          ),
        })),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            { ...tx, id: generateId('tx'), createdAt: new Date().toISOString() },
            ...state.transactions,
          ],
        })),

      addVoucher: (voucher) =>
        set((state) => ({
          vouchers: [
            { ...voucher, id: generateId('ov'), acquiredAt: new Date().toISOString() },
            ...state.vouchers,
          ],
        })),

      useVoucher: (code) =>
        set((state) => ({
          vouchers: state.vouchers.map((voucher) =>
            voucher.code === code && voucher.status === 'active'
              ? { ...voucher, status: 'used' as const }
              : voucher,
          ),
        })),

      giftVoucher: (id, recipient) =>
        set((state) => ({
          vouchers: state.vouchers.map((voucher) =>
            voucher.id === id ? { ...voucher, status: 'gifted' as const, giftedTo: recipient } : voucher,
          ),
        })),

      setMembership: (record) => set({ membership: record }),

      registerEvent: (registration) => {
        const entry: EventRegistration = {
          ...registration,
          id: generateId('er'),
          registeredAt: new Date().toISOString(),
          qrPayload: `LOTUS|EVENT|${registration.eventId}|${generateCode('EV', 6)}`,
        };
        set((state) => ({ eventRegistrations: [entry, ...state.eventRegistrations] }));
        return entry;
      },

      addFnbOrder: (order) => {
        const entry: FnbOrder = {
          ...order,
          id: generateId('fo'),
          code: generateCode('FB', 6),
          createdAt: new Date().toISOString(),
          status: 'preparing',
        };
        set((state) => ({ fnbOrders: [entry, ...state.fnbOrders] }));
        return entry;
      },

      toggleFavoriteCoach: (coachId) =>
        set((state) => ({
          favoriteCoaches: state.favoriteCoaches.includes(coachId)
            ? state.favoriteCoaches.filter((id) => id !== coachId)
            : [...state.favoriteCoaches, coachId],
        })),

      addLead: (lead) => {
        // Ghi thêm yêu cầu vào database để Admin nhận được (best-effort, không chặn khách).
        if (typeof window !== 'undefined') {
          void fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: lead.type, summary: lead.summary, payload: lead.payload }),
          }).catch(() => {});
        }
        set((state) => ({
          leads: [
            { ...lead, id: generateId('ld'), createdAt: new Date().toISOString(), status: 'received' as const },
            ...state.leads,
          ],
        }));
      },

      seedDemoData: (payload) => {
        if (get().seeded) return;
        set({ ...payload, seeded: true });
      },

      claimFor: (userId) => {
        if (get().ownerId !== userId) set({ ...EMPTY, ownerId: userId });
      },

      resetAccount: () => set({ ...EMPTY }),
    }),
    {
      name: STORAGE_KEYS.bookings,
      version: 1,
    },
  ),
);

/** Selector tiện dụng — booking sắp tới, sắp xếp theo thời gian gần nhất. */
export function selectUpcomingBookings(bookings: Booking[]): Booking[] {
  return bookings
    .filter((booking) => booking.status === 'upcoming')
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
}

export function selectActiveVouchers(vouchers: OwnedVoucher[]): OwnedVoucher[] {
  return vouchers.filter((voucher) => voucher.status === 'active');
}

export function selectWalletBalance(transactions: WalletTransaction[], fallback: number): number {
  return transactions.length > 0 ? transactions[0].balanceAfter : fallback;
}

export type { MembershipTierId };
