'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/site';
import type { FnbDeliveryTarget } from '@/types';

export interface CartLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  lines: CartLine[];
  deliveryTarget: FnbDeliveryTarget;
  bayNumber: string;
  scheduledTime: string;
  note: string;
  add: (line: Omit<CartLine, 'quantity'>, quantity?: number) => void;
  setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  setDeliveryTarget: (target: FnbDeliveryTarget) => void;
  setBayNumber: (bay: string) => void;
  setScheduledTime: (time: string) => void;
  setNote: (note: string) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      deliveryTarget: 'bay',
      bayNumber: '',
      scheduledTime: '',
      note: '',

      add: (line, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((item) => item.id === line.id);
          if (existing) {
            return {
              lines: state.lines.map((item) =>
                item.id === line.id ? { ...item, quantity: Math.min(item.quantity + quantity, 20) } : item,
              ),
            };
          }
          return { lines: [...state.lines, { ...line, quantity }] };
        }),

      setQuantity: (id, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((item) => item.id !== id)
              : state.lines.map((item) =>
                  item.id === id ? { ...item, quantity: Math.min(quantity, 20) } : item,
                ),
        })),

      remove: (id) => set((state) => ({ lines: state.lines.filter((item) => item.id !== id) })),

      clear: () => set({ lines: [], note: '', bayNumber: '', scheduledTime: '' }),

      setDeliveryTarget: (deliveryTarget) => set({ deliveryTarget }),
      setBayNumber: (bayNumber) => set({ bayNumber }),
      setScheduledTime: (scheduledTime) => set({ scheduledTime }),
      setNote: (note) => set({ note }),
    }),
    { name: STORAGE_KEYS.fnbCart, version: 1 },
  ),
);

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}
