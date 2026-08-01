/** Kiểu dùng chung cho toàn hệ thống Lotus Golf Center. */

export type Locale = 'vi' | 'en';

/** Chuỗi song ngữ. Giai đoạn hiện tại hiển thị mặc định `vi`. */
export interface I18nText {
  vi: string;
  en: string;
}

export type ID = string;

/** Trạng thái tải dữ liệu dùng cho hook/service. */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: string | null;
}

/** Kết quả trả về chuẩn của service layer — giữ nguyên khi thay bằng API thật. */
export interface ServiceResult<T> {
  success: boolean;
  data: T | null;
  message: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  description?: string;
}

export interface FaqItem {
  id: ID;
  question: string;
  answer: string;
  group: FaqGroup;
}

export type FaqGroup =
  | 'beginner'
  | 'booking'
  | 'membership'
  | 'coach'
  | 'junior'
  | 'corporate'
  | 'voucher'
  | 'reschedule'
  | 'dresscode'
  | 'equipment'
  | 'payment';

export interface Testimonial {
  id: ID;
  name: string;
  role: string;
  segment: 'newcomer' | 'member' | 'coach' | 'corporate' | 'vip';
  quote: string;
  rating: number;
  initials: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
