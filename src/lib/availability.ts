import { addDays, format, getDay, isBefore, parseISO, startOfDay } from 'date-fns';

import { OPERATING_HOURS } from '@/constants/site';
import type { DayMeta, SlotPricing, SlotStatus, TimeSlot } from '@/types';

/**
 * Sinh lịch trống theo thuật toán xác định (deterministic).
 *
 * Vì sao không lưu tĩnh trong mock data: dữ liệu ngày giờ cố định sẽ hết hạn
 * theo thời gian và luôn hiển thị "quá khứ". Hàm băm dưới đây cho ra kết quả
 * giống hệt nhau với cùng một (ngày, giờ, khoá) — nên mọi lần render đều nhất quán.
 *
 * Khi nối backend thật: thay hàm này bằng `GET /api/availability?date=…`.
 */

function hash(...parts: (string | number)[]): number {
  const input = parts.join('|');
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

/** yyyy-MM-dd của hôm nay theo giờ máy người dùng. */
export function todayKey(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function dateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** Thứ Bảy / Chủ Nhật được coi là cao điểm. */
export function isWeekend(dateStr: string): boolean {
  const day = getDay(parseISO(dateStr));
  return day === 0 || day === 6;
}

export function isPastDate(dateStr: string): boolean {
  return isBefore(parseISO(dateStr), startOfDay(new Date()));
}

/** Mô tả một ngày: cao điểm hay có ưu đãi. */
export function getDayMeta(dateStr: string): DayMeta {
  const weekend = isWeekend(dateStr);
  const promoRoll = hash('promo', dateStr);
  const hasPromotion = !weekend && promoRoll > 0.62;

  return {
    date: dateStr,
    isPeak: weekend,
    hasPromotion,
    promotionLabel: hasPromotion ? 'Ưu đãi giờ thấp điểm −25%' : undefined,
  };
}

/** Lấy meta cho một dải ngày, dùng cho calendar. */
export function getMonthMeta(days: string[]): Record<string, DayMeta> {
  return days.reduce<Record<string, DayMeta>>((acc, day) => {
    acc[day] = getDayMeta(day);
    return acc;
  }, {});
}

function pricingForHour(hour: number, weekend: boolean): { pricing: SlotPricing; multiplier: number } {
  if (hour >= 9 && hour < 15 && !weekend) return { pricing: 'off-peak', multiplier: 0.8 };
  if (hour >= 17 && hour < 21) return { pricing: 'peak', multiplier: 1.25 };
  if (weekend && hour >= 7 && hour < 12) return { pricing: 'peak', multiplier: 1.2 };
  return { pricing: 'standard', multiplier: 1 };
}

/** Danh sách khung giờ 06:00 – 22:00 của một ngày. */
export function getTimeSlots(dateStr: string): TimeSlot[] {
  const weekend = isWeekend(dateStr);
  const slots: TimeSlot[] = [];

  for (let hour = OPERATING_HOURS.start; hour < OPERATING_HOURS.end; hour++) {
    const time = `${String(hour).padStart(2, '0')}:00`;
    const { pricing, multiplier } = pricingForHour(hour, weekend);

    const roll = hash('slot', dateStr, time);
    const pressure = pricing === 'peak' ? 0.42 : pricing === 'standard' ? 0.2 : 0.08;

    let status: SlotStatus;
    let seatsLeft: number;

    if (roll < pressure * 0.35) {
      status = 'full';
      seatsLeft = 0;
    } else if (roll < pressure) {
      status = 'filling';
      seatsLeft = 1 + Math.floor(hash('seats', dateStr, time) * 3);
    } else {
      status = 'available';
      seatsLeft = 6 + Math.floor(hash('seats', dateStr, time) * 18);
    }

    slots.push({ time, status, pricing, priceMultiplier: multiplier, seatsLeft });
  }

  return slots;
}

/** Lịch trống của một huấn luyện viên trong `days` ngày tới. */
export function getCoachAvailability(
  coachId: string,
  days = 14,
): { date: string; times: string[] }[] {
  const start = startOfDay(new Date());
  const result: { date: string; times: string[] }[] = [];

  for (let i = 0; i < days; i++) {
    const date = dateKey(addDays(start, i));
    // Mỗi HLV nghỉ 1 ngày cố định trong tuần.
    if (getDay(addDays(start, i)) === Math.floor(hash('dayoff', coachId) * 7)) continue;

    const times: string[] = [];
    for (let hour = OPERATING_HOURS.start + 1; hour < OPERATING_HOURS.end; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00`;
      if (hash('coach', coachId, date, time) > 0.62) times.push(time);
    }
    if (times.length > 0) result.push({ date, times: times.slice(0, 6) });
  }

  return result;
}

/** Khung giờ trống gần nhất của HLV, dùng cho coach card. */
export function getNextAvailability(coachId: string): { date: string; time: string } | null {
  const availability = getCoachAvailability(coachId, 10);
  const first = availability[0];
  if (!first || first.times.length === 0) return null;
  return { date: first.date, time: first.times[0] };
}

/** Sinh dải ngày cho calendar của một tháng (bao gồm ô đệm đầu tuần). */
export function buildCalendarGrid(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Tuần bắt đầu từ Thứ Hai.
  const leading = (getDay(first) + 6) % 7;

  const cells: (string | null)[] = Array.from({ length: leading }, () => null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(dateKey(new Date(year, month, day)));
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}
