import { PAYMENT_METHODS } from '@/data/booking-options';
import type { Booking, BookingStatus, LeadType, PaymentStatus } from '@/types';

type BadgeVariant = 'success' | 'warning' | 'neutral' | 'danger' | 'accent';

/** Số tiền đã tính cho một booking (ví trừ walletApplied, còn lại theo total). */
export function bookingCharged(booking: Booking): number {
  return booking.paymentMethod === 'wallet' ? booking.price.walletApplied : booking.price.total;
}

export const PAYMENT_STATUS_META: Record<PaymentStatus, { label: string; variant: BadgeVariant }> = {
  paid: { label: 'Đã thanh toán', variant: 'success' },
  pending: { label: 'Chờ thanh toán', variant: 'warning' },
  'pay-later': { label: 'Thanh toán tại quầy', variant: 'neutral' },
};

export const BOOKING_STATUS_META: Record<BookingStatus, { label: string; variant: BadgeVariant }> = {
  upcoming: { label: 'Sắp tới', variant: 'success' },
  completed: { label: 'Đã hoàn thành', variant: 'neutral' },
  cancelled: { label: 'Đã huỷ', variant: 'danger' },
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = Object.fromEntries(
  PAYMENT_METHODS.map((method) => [method.id, method.name]),
);

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  contact: 'Liên hệ',
  corporate: 'Doanh nghiệp',
  'tour-group': 'Đoàn tour',
  agency: 'Đại lý',
};
