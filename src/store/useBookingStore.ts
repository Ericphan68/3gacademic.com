'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/site';
import type { BookingContact, BookingDraft, BookingExperienceType, PaymentMethod, ZoneId } from '@/types';

export const BOOKING_STEPS = [
  { id: 1, key: 'experience', label: 'Trải nghiệm' },
  { id: 2, key: 'date', label: 'Ngày' },
  { id: 3, key: 'time', label: 'Giờ' },
  { id: 4, key: 'zone', label: 'Khu vực' },
  { id: 5, key: 'coach', label: 'Huấn luyện viên' },
  { id: 6, key: 'guests', label: 'Khách & dịch vụ' },
  { id: 7, key: 'voucher', label: 'Ưu đãi' },
  { id: 8, key: 'contact', label: 'Thông tin' },
  { id: 9, key: 'review', label: 'Xác nhận' },
  { id: 10, key: 'done', label: 'Hoàn tất' },
] as const;

export const TOTAL_BOOKING_STEPS = BOOKING_STEPS.length;

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
  /** Mã booking vừa tạo, dùng cho bước 10. */
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
            zoneId: state.draft.zoneId ?? suggestedZone,
            coachId: type === 'coaching' ? state.draft.coachId : state.draft.coachId,
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
      setPaymentMethod: (method) => set((state) => ({ draft: { ...state.draft, paymentMethod: method } })),
      setAcceptedTerms: (accepted) => set((state) => ({ draft: { ...state.draft, acceptedTerms: accepted } })),
      setLastBookingCode: (code) => set({ lastBookingCode: code }),

      reset: () => set({ draft: INITIAL_DRAFT, lastBookingCode: null }),
    }),
    {
      name: STORAGE_KEYS.bookingDraft,
      version: 1,
    },
  ),
);

/** Kiểm tra một bước đã đủ dữ liệu để đi tiếp chưa. */
export function canAdvance(draft: BookingDraft): boolean {
  switch (draft.step) {
    case 1:
      return draft.experienceType !== null;
    case 2:
      return draft.date !== null;
    case 3:
      return draft.time !== null;
    case 4:
      return draft.zoneId !== null;
    case 5:
      return true; // "Không cần HLV" là lựa chọn hợp lệ
    case 6:
      return draft.guests >= 1;
    case 7:
      return true;
    case 8:
      return (
        draft.contact.fullName.trim().length >= 2 &&
        /^0\d{9}$/.test(draft.contact.phone.trim()) &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.contact.email.trim()) &&
        draft.acceptedTerms
      );
    case 9:
      return true;
    default:
      return false;
  }
}
