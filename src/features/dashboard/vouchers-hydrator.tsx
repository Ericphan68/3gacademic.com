'use client';

import { useEffect } from 'react';

import { useAccountStore } from '@/store/useAccountStore';
import type { OwnedVoucher } from '@/types';

/** Nạp voucher THẬT (từ DB) vào store client để dashboard hiển thị đúng. */
export function VouchersHydrator({ vouchers }: { vouchers: OwnedVoucher[] }) {
  const mergeServerVouchers = useAccountStore((state) => state.mergeServerVouchers);

  useEffect(() => {
    mergeServerVouchers(vouchers);
  }, [vouchers, mergeServerVouchers]);

  return null;
}
