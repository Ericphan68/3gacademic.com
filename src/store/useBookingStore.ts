'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/site';
import type { BookingContact, BookingDraft, BookingExperienceType, PaymentMethod, ZoneId } from '@/types';

/* ============================================================
   LUỒNG ĐẶT LỊCH — 3 BƯỚC
   1. Chọn lịch (trải nghiệm, HLV, ngày, giờ, khách, khu vực)
   2. Thông tin & dịch vụ (liên hệ, add-on, voucher)
   3. Kiểm tra & xác nhận
   ============================================================ */

export const BOOKING_STEPS = [
  { id: 1, key: 'schedule', label: 'Chọn lịch' },
  { id: 2, key: 'customer', label: 'Thông tin' },
  { id: 3, key: 'review', label: 'Xác nhận' },
] as const;

export const TOTAL_BOOKING_STEPS = BOOKING_STEPS.length;

/** Nhóm thông tin → bước cần quay lại khi bấm “Chỉnh sửa” ở màn xác nhận. */
export const EDIT_STEP: Record<
  'experience' | 'coach' | 'date' | 'time' | 'zone' | 'guests' | 'addOns' | 'contact' | 'voucher',
  number
> = {
  experience: 1,
  coach: 1,
  date: 1,
  time: 1,
  zone: 1,
  guests: 1,
  addOns: 2,
  contact: 2,
  voucher: 2,
};

const EMPTY_CONTACT: BookingContact = {
  fullName: '',
  phone: '',
  email: '',
  note: '',
  isFirstTime: false,
};

export const INITIAL_DRAFT: BookingDraft = {
  step: 1,
  experienceType: null,
  date: null,
  time: null,
  zoneId: null,
  coachId: null,
  guests: 1,
  addOns: {},
  voucherCode: null,
  useWallet: false,
  contact: EMPTY_CONTACT,
  paymentMethod: 'at-center',
  acceptedTerms: false,
};

interface BookingState {
  draft: BookingDraft;
  /** Mã booking vừa tạo, dùng cho màn thành công. */
  lastBookingCode: string | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setExperience: (type: BookingExperienceType, suggestedZone: ZoneId) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setZone: (zoneId: ZoneId) => void;
  setCoach: (coachId: string | null) => void;
  setGuests: (guests: number) => void;
  setAddOn: (id: string, quantity: number) => void;
  setVoucher: (code: string | null) => void;
  setUseWallet: (use: boolean) => void;
  setContact: (patch: Partial<BookingContact>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  setLastBookingCode: (code: string | null) => void;
  reset: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      draft: INITIAL_DRAFT,
      lastBookingCode: null,

      setStep: (step) =>
        set((state) => ({ draft: { ...state.draft, step: Math.min(Math.max(step, 1), TOTAL_BOOKING_STEPS) } })),
      nextStep: () =>
        set((state) => ({
          draft: { ...state.draft, step: Math.min(state.draft.step + 1, TOTAL_BOOKING_STEPS) },
        })),
      prevStep: () => set((state) => ({ draft: { ...state.draft, step: Math.max(state.draft.step - 1, 1) } })),

      setExperience: (type, suggestedZone) =>
        set((state) => ({
          draft: {
            ...state.draft,
            experienceType: type,
            // Gợi ý khu vực phù hợp nếu khách chưa tự chọn khu vực khác.
            zoneId: state.draft.zoneId ?? suggestedZone,
          },
        })),

      setDate: (date) => set((state) => ({ draft: { ...state.draft, date, time: null } })),
      setTime: (time) => set((state) => ({ draft: { ...state.draft, time } })),
      setZone: (zoneId) => set((state) => ({ draft: { ...state.draft, zoneId } })),
      setCoach: (coachId) => set((state) => ({ draft: { ...state.draft, coachId } })),
      setGuests: (guests) =>
        set((state) => ({ draft: { ...state.draft, guests: Math.min(Math.max(guests, 1), 20) } })),

      setAddOn: (id, quantity) =>
        set((state) => {
          const addOns = { ...state.draft.addOns };
          if (quantity <= 0) delete addOns[id];
          else addOns[id] = quantity;
          return { draft: { ...state.draft, addOns } };
        }),

      setVoucher: (code) => set((state) => ({ draft: { ...state.draft, voucherCode: code } })),
      setUseWallet: (use) => set((state) => ({ draft: { ...state.draft, useWallet: use } })),
      setContact: (patch) =>
        set((state) => ({ draft: { ...state.draft, contact: { ...state.draft.contact, ...patch } } })),
      // Chọn ví Lotus đồng nghĩa dùng số dư ví để trừ vào tổng.
      setPaymentMethod: (method) =>
        set((state) => ({ draft: { ...state.draft, paymentMethod: method, useWallet: method === 'wallet' } })),
      setAcceptedTerms: (accepted) => set((state) => ({ draft: { ...state.draft, acceptedTerms: accepted } })),
      setLastBookingCode: (code) => set({ lastBookingCode: code }),

      reset: () => set({ draft: INITIAL_DRAFT, lastBookingCode: null }),
    }),
    {
      name: STORAGE_KEYS.bookingDraft,
      // v2: rút gọn từ 10 bước xuống 3 bước — reset con trỏ bước của draft cũ.
      version: 2,
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as Partial<Pick<BookingState, 'draft' | 'lastBookingCode'>>;
        if (version < 2 && state.draft) {
          state.draft = { ...INITIAL_DRAFT, ...state.draft, step: 1 };
        }
        return state as Pick<BookingState, 'draft' | 'lastBookingCode'>;
      },
    },
  ),
);

/** Kiểm tra một bước đã đủ dữ liệu để đi tiếp chưa. */
export function canAdvance(draft: BookingDraft): boolean {
  switch (draft.step) {
    case 1:
      // Cần có trải nghiệm, ngày và giờ. Khu vực & số khách luôn có giá trị mặc định.
      return draft.experienceType !== null && draft.date !== null && draft.time !== null;
    case 2:
      return isContactValid(draft.contact);
    case 3:
      return true;
    default:
      return false;
  }
}

/** Thông tin liên hệ hợp lệ: họ tên, số điện thoại VN, email. */
export function isContactValid(contact: BookingContact): boolean {
  return (
    contact.fullName.trim().length >= 2 &&
    /^0\d{9}$/.test(contact.phone.trim()) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())
  );
}

/** Khách đã nhập dữ liệu đáng kể chưa — dùng để cảnh báo trước khi rời trang. */
export function hasDraftProgress(draft: BookingDraft): boolean {
  return Boolean(
    draft.date ||
      draft.time ||
      draft.coachId ||
      draft.contact.fullName.trim() ||
      draft.contact.phone.trim() ||
      draft.contact.email.trim() ||
      Object.keys(draft.addOns).length > 0,
  );
}
