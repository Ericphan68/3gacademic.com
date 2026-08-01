import { format, formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

/** Định dạng tiền VND. */
export function formatCurrency(value: number, options?: { compact?: boolean }): string {
  if (options?.compact && value >= 1_000_000) {
    const millions = value / 1_000_000;
    const text = millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1);
    return `${text} triệu`;
  }
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Số có phân tách hàng nghìn. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value);
}

function toDate(value: string | Date): Date | null {
  const date = typeof value === 'string' ? parseISO(value) : value;
  return isValid(date) ? date : null;
}

/** dd/MM/yyyy */
export function formatDate(value: string | Date): string {
  const date = toDate(value);
  return date ? format(date, 'dd/MM/yyyy') : '—';
}

/** Thứ Hai, 12 tháng 5, 2026 */
export function formatDateLong(value: string | Date): string {
  const date = toDate(value);
  return date ? format(date, "EEEE, d 'tháng' M, yyyy", { locale: vi }) : '—';
}

/** 12 thg 5 */
export function formatDateShort(value: string | Date): string {
  const date = toDate(value);
  return date ? format(date, 'd MMM', { locale: vi }) : '—';
}

/** dd/MM/yyyy • HH:mm */
export function formatDateTime(value: string | Date): string {
  const date = toDate(value);
  return date ? format(date, "dd/MM/yyyy '•' HH:mm") : '—';
}

/** HH:mm */
export function formatTime(value: string | Date): string {
  const date = toDate(value);
  return date ? format(date, 'HH:mm') : '—';
}

/** "3 ngày trước" */
export function formatRelative(value: string | Date): string {
  const date = toDate(value);
  if (!date) return '—';
  return formatDistanceToNowStrict(date, { addSuffix: true, locale: vi });
}

/** Đổi phút sang "1 giờ 30 phút". */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} phút`;
  if (m === 0) return `${h} giờ`;
  return `${h} giờ ${m} phút`;
}

/** Rút gọn số điện thoại hiển thị: 0901 234 567 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  return phone;
}

/** Phần trăm hiển thị. */
export function formatPercent(value: number): string {
  return `${value}%`;
}
