import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Gộp class Tailwind an toàn (clsx + tailwind-merge). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Tạo slug thân thiện URL, hỗ trợ tiếng Việt có dấu. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/** Chữ cái viết tắt cho avatar. */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Sinh mã ngẫu nhiên dạng LG-XXXXXX (dùng cho booking/order demo). */
export function generateCode(prefix: string, length = 6): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${out}`;
}

/** ID duy nhất cho bản ghi demo. */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** Giới hạn số trong khoảng. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Làm tròn tiền về bội số 1.000đ cho gọn khi hiển thị. */
export function roundMoney(value: number): number {
  return Math.round(value / 1000) * 1000;
}

/** Loại bỏ ký tự có thể gây XSS khi echo lại dữ liệu người dùng nhập. */
export function sanitizeText(input: string, maxLength = 500): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

/** Trì hoãn — mô phỏng độ trễ mạng của service layer. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Chia mảng thành các nhóm nhỏ. */
export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Sắp xếp ổn định theo khoá số. */
export function sortBy<T>(items: T[], key: (item: T) => number, dir: 'asc' | 'desc' = 'asc'): T[] {
  return [...items].sort((a, b) => (dir === 'asc' ? key(a) - key(b) : key(b) - key(a)));
}

/** Bỏ dấu để so khớp tìm kiếm tiếng Việt. */
export function normalizeSearch(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase()
    .trim();
}

/** Kiểm tra chuỗi tìm kiếm có khớp với bất kỳ trường nào không. */
export function matchesQuery(query: string, ...fields: (string | undefined)[]): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;
  return fields.some((field) => field && normalizeSearch(field).includes(q));
}
