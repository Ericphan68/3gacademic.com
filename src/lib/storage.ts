/**
 * Bọc localStorage an toàn cho SSR.
 *
 * Toàn bộ dữ liệu demo (booking, ví, voucher, hội viên…) đi qua đây.
 * Khi chuyển sang backend thật, chỉ cần thay phần thân của service layer —
 * component không đọc localStorage trực tiếp.
 */

const isBrowser = () => typeof window !== 'undefined';

export function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Cho phép nhiều tab / nhiều component cùng phản ứng khi dữ liệu đổi.
    window.dispatchEvent(new CustomEvent('lotus:storage', { detail: { key } }));
  } catch {
    // Bỏ qua khi vượt quota hoặc trình duyệt chặn storage.
  }
}

export function removeStorage(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
    window.dispatchEvent(new CustomEvent('lotus:storage', { detail: { key } }));
  } catch {
    // Bỏ qua.
  }
}

/** Thêm một bản ghi vào đầu danh sách lưu trong storage. */
export function prependToList<T>(key: string, item: T, limit = 200): T[] {
  const list = readStorage<T[]>(key, []);
  const next = [item, ...list].slice(0, limit);
  writeStorage(key, next);
  return next;
}

/** Cập nhật một phần tử trong danh sách theo điều kiện. */
export function updateInList<T>(key: string, match: (item: T) => boolean, patch: (item: T) => T): T[] {
  const list = readStorage<T[]>(key, []);
  const next = list.map((item) => (match(item) ? patch(item) : item));
  writeStorage(key, next);
  return next;
}
