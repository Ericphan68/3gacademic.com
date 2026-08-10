/**
 * RBAC — nguồn sự thật DUY NHẤT về quyền (server-side).
 *
 * Dùng cho: kiểm tra quyền ở API/route handler (server), và seed bảng
 * Role/Permission/RolePermission. Frontend chỉ ẩn/hiện UI; quyết định
 * cuối cùng luôn kiểm tra ở server bằng các hàm ở đây.
 */

export const ADMIN_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'MANAGER',
  'RECEPTION',
  'COACH_MANAGER',
  'MARKETING',
  'ACCOUNTING',
] as const;

export type AdminRoleKey = (typeof ADMIN_ROLES)[number];

export const ROLE_LABELS: Record<AdminRoleKey, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  RECEPTION: 'Reception / CX',
  COACH_MANAGER: 'Coach Manager',
  MARKETING: 'Marketing',
  ACCOUNTING: 'Accounting / Report',
};

export interface PermissionDef {
  key: string;
  group: string;
  description: string;
}

/** Danh mục quyền theo resource.action. */
export const PERMISSIONS: PermissionDef[] = [
  { key: 'dashboard.view', group: 'dashboard', description: 'Xem dashboard tổng quan' },
  { key: 'operations.view', group: 'operations', description: 'Xem Live Operations' },

  { key: 'booking.read', group: 'booking', description: 'Xem booking' },
  { key: 'booking.create', group: 'booking', description: 'Tạo booking' },
  { key: 'booking.update', group: 'booking', description: 'Sửa booking' },
  { key: 'booking.checkin', group: 'booking', description: 'Check-in booking' },
  { key: 'booking.cancel', group: 'booking', description: 'Huỷ booking' },
  { key: 'booking.delete', group: 'booking', description: 'Archive booking' },
  { key: 'booking.export', group: 'booking', description: 'Export booking' },

  { key: 'customer.read', group: 'customer', description: 'Xem khách hàng' },
  { key: 'customer.update', group: 'customer', description: 'Sửa khách hàng' },
  { key: 'customer.note', group: 'customer', description: 'Ghi chú khách hàng' },
  { key: 'customer.delete', group: 'customer', description: 'Archive khách hàng' },
  { key: 'customer.export', group: 'customer', description: 'Export khách hàng' },

  { key: 'membership.read', group: 'membership', description: 'Xem gói hội viên' },
  { key: 'membership.update', group: 'membership', description: 'Sửa gói hội viên' },
  { key: 'membership.assign', group: 'membership', description: 'Gán hội viên cho khách' },
  { key: 'membership.export', group: 'membership', description: 'Export hội viên' },

  { key: 'coach.read', group: 'coach', description: 'Xem HLV' },
  { key: 'coach.create', group: 'coach', description: 'Tạo HLV' },
  { key: 'coach.update', group: 'coach', description: 'Sửa HLV' },
  { key: 'coach.delete', group: 'coach', description: 'Archive HLV' },
  { key: 'coach.schedule', group: 'coach', description: 'Quản lý lịch HLV' },

  { key: 'academy.read', group: 'academy', description: 'Xem chương trình academy' },
  { key: 'academy.update', group: 'academy', description: 'Sửa chương trình academy' },

  { key: 'experience.read', group: 'experience', description: 'Xem trải nghiệm' },
  { key: 'experience.update', group: 'experience', description: 'Sửa trải nghiệm' },

  { key: 'voucher.read', group: 'voucher', description: 'Xem voucher' },
  { key: 'voucher.create', group: 'voucher', description: 'Tạo voucher' },
  { key: 'voucher.update', group: 'voucher', description: 'Sửa voucher' },
  { key: 'voucher.delete', group: 'voucher', description: 'Archive voucher' },
  { key: 'voucher.export', group: 'voucher', description: 'Export voucher' },

  { key: 'event.read', group: 'event', description: 'Xem sự kiện' },
  { key: 'event.create', group: 'event', description: 'Tạo sự kiện' },
  { key: 'event.update', group: 'event', description: 'Sửa sự kiện' },
  { key: 'event.delete', group: 'event', description: 'Archive sự kiện' },
  { key: 'event.checkin', group: 'event', description: 'Check-in sự kiện' },

  { key: 'fnb.read', group: 'fnb', description: 'Xem F&B' },
  { key: 'fnb.update', group: 'fnb', description: 'Sửa F&B' },

  { key: 'corporate.read', group: 'corporate', description: 'Xem lead doanh nghiệp' },
  { key: 'corporate.update', group: 'corporate', description: 'Sửa lead doanh nghiệp' },

  { key: 'tour.read', group: 'tour', description: 'Xem lead tour' },
  { key: 'tour.update', group: 'tour', description: 'Sửa lead tour' },

  { key: 'partner.read', group: 'partner', description: 'Xem đối tác' },
  { key: 'partner.update', group: 'partner', description: 'Sửa đối tác' },

  { key: 'content.read', group: 'content', description: 'Xem nội dung CMS' },
  { key: 'content.update', group: 'content', description: 'Sửa nội dung CMS' },

  { key: 'media.read', group: 'media', description: 'Xem media' },
  { key: 'media.upload', group: 'media', description: 'Upload media' },
  { key: 'media.delete', group: 'media', description: 'Xoá media' },

  { key: 'testimonial.read', group: 'testimonial', description: 'Xem testimonial' },
  { key: 'testimonial.update', group: 'testimonial', description: 'Sửa testimonial' },

  { key: 'faq.read', group: 'faq', description: 'Xem FAQ' },
  { key: 'faq.update', group: 'faq', description: 'Sửa FAQ' },

  { key: 'navigation.read', group: 'navigation', description: 'Xem menu' },
  { key: 'navigation.update', group: 'navigation', description: 'Sửa menu' },

  { key: 'seo.read', group: 'seo', description: 'Xem SEO' },
  { key: 'seo.update', group: 'seo', description: 'Sửa SEO' },

  { key: 'report.view', group: 'report', description: 'Xem báo cáo' },
  { key: 'report.export', group: 'report', description: 'Export báo cáo' },

  { key: 'notification.read', group: 'notification', description: 'Xem thông báo' },

  { key: 'adminUser.read', group: 'system', description: 'Xem tài khoản admin' },
  { key: 'adminUser.manage', group: 'system', description: 'Tạo/khoá tài khoản admin' },
  { key: 'role.read', group: 'system', description: 'Xem role & quyền' },
  { key: 'role.manage', group: 'system', description: 'Sửa role & quyền' },
  { key: 'audit.read', group: 'system', description: 'Xem audit log' },
  { key: 'setting.read', group: 'system', description: 'Xem cấu hình' },
  { key: 'setting.update', group: 'system', description: 'Sửa cấu hình' },
];

export const ALL_PERMISSION_KEYS = PERMISSIONS.map((p) => p.key);

/** '*' = toàn quyền. Ngược lại là danh sách permission key. */
export const ROLE_PERMISSIONS: Record<AdminRoleKey, '*' | string[]> = {
  SUPER_ADMIN: '*',

  ADMIN: ALL_PERMISSION_KEYS.filter(
    (k) => !['adminUser.manage', 'role.manage'].includes(k),
  ),

  MANAGER: [
    'dashboard.view',
    'operations.view',
    'booking.read',
    'booking.create',
    'booking.update',
    'booking.checkin',
    'booking.cancel',
    'booking.export',
    'customer.read',
    'customer.update',
    'customer.note',
    'membership.read',
    'membership.assign',
    'coach.read',
    'coach.update',
    'coach.schedule',
    'event.read',
    'event.create',
    'event.update',
    'event.checkin',
    'report.view',
    'notification.read',
  ],

  RECEPTION: [
    'dashboard.view',
    'operations.view',
    'booking.read',
    'booking.create',
    'booking.update',
    'booking.checkin',
    'booking.cancel',
    'customer.read',
    'customer.note',
    'notification.read',
  ],

  COACH_MANAGER: [
    'dashboard.view',
    'coach.read',
    'coach.create',
    'coach.update',
    'coach.schedule',
    'academy.read',
    'academy.update',
    'customer.read',
    'report.view',
    'notification.read',
  ],

  MARKETING: [
    'dashboard.view',
    'content.read',
    'content.update',
    'media.read',
    'media.upload',
    'media.delete',
    'voucher.read',
    'voucher.create',
    'voucher.update',
    'voucher.delete',
    'event.read',
    'event.create',
    'event.update',
    'experience.read',
    'experience.update',
    'academy.read',
    'academy.update',
    'testimonial.read',
    'testimonial.update',
    'faq.read',
    'faq.update',
    'navigation.read',
    'navigation.update',
    'seo.read',
    'seo.update',
    'report.view',
    'notification.read',
  ],

  ACCOUNTING: [
    'dashboard.view',
    'report.view',
    'report.export',
    'booking.read',
    'membership.read',
    'voucher.read',
    'notification.read',
  ],
};

/** Kiểm tra một role có quyền cụ thể không. */
export function roleHasPermission(role: AdminRoleKey, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (perms === '*') return true;
  return perms.includes(permission);
}

/** Lấy toàn bộ permission key hiệu lực của một role. */
export function permissionsForRole(role: AdminRoleKey): string[] {
  const perms = ROLE_PERMISSIONS[role];
  return perms === '*' ? [...ALL_PERMISSION_KEYS] : [...perms];
}
