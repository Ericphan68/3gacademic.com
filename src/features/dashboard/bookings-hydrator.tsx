'use client';

import { useEffect } from 'react';

import { useAccountStore } from '@/store/useAccountStore';
import type { Booking } from '@/types';

/** Nạp đơn đặt lịch THẬT (từ DB) vào store client để dashboard hiển thị đúng. */
export function BookingsHydrator({ bookings }: { bookings: Booking[] }) {
  const mergeServerBookings = useAccountStore((state) => state.mergeServerBookings);

  useEffect(() => {
    mergeServerBookings(bookings);
  }, [bookings, mergeServerBookings]);

  return null;
}
