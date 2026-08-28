import 'server-only';

import { randomBytes } from 'crypto';

import { addHours } from 'date-fns';

import { hashPassword, verifyPassword } from '@/server/auth/password';
import { isEmailConfigured } from '@/server/email/brevo';
import { prisma } from '@/server/db';
import type { User, UserPreferences } from '@/types/account';

/** Token xác nhận email (ngẫu nhiên, an toàn). */
export function newVerifyToken(): string {
  return randomBytes(32).toString('hex');
}

/** Lỗi email chưa xác nhận (client dùng code này để mời gửi lại). */
export const EMAIL_UNVERIFIED = 'EMAIL_UNVERIFIED';

/**
 * Tài khoản KHÁCH HÀNG thật (lưu DB). Mật khẩu luôn băm bằng bcrypt.
 * Chưa gửi email — khi khách quên mật khẩu, admin đặt lại giúp trong trang quản trị.
 */

const DEFAULT_PREFERENCES: UserPreferences = {
  drink: 'Trà sen Lotus Signature',
  handedness: 'right',
  golfLevel: 'never',
  goal: 'Chơi được tự tin cùng bạn bè và đối tác',
  language: 'vi',
  notifyEmail: true,
  notifyZalo: true,
  notifyPromotions: true,
};

function initials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'LG';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}

type CustomerRecord = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string;
  avatarInitials: string | null;
  loyaltyPoints: number;
  walletBalance: number;
  joinedAt: Date;
};

/** Chuyển bản ghi Customer -> đối tượng User cho giao diện (không kèm mật khẩu). */
function toUser(c: CustomerRecord, membership?: { tier: string; expiresAt: Date } | null): User {
  return {
    id: c.id,
    role: 'customer',
    fullName: c.fullName,
    email: c.email ?? '',
    phone: c.phone,
    avatarInitials: c.avatarInitials || initials(c.fullName),
    joinedAt: c.joinedAt.toISOString().slice(0, 10),
    membershipTier: (membership?.tier as User['membershipTier']) ?? null,
    membershipExpiresAt: membership?.expiresAt.toISOString() ?? null,
    walletBalance: c.walletBalance,
    loyaltyPoints: c.loyaltyPoints,
    preferences: DEFAULT_PREFERENCES,
  };
}

const SELECT = {
  id: true,
  fullName: true,
  email: true,
  phone: true,
  avatarInitials: true,
  loyaltyPoints: true,
  walletBalance: true,
  joinedAt: true,
} as const;

export class AuthError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

export interface RegisterCustomerInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

/** Đăng ký khách mới. Ném AuthError nếu email/SĐT đã tồn tại. */
export async function registerCustomer(
  input: RegisterCustomerInput,
): Promise<{ user: User; verifyToken: string | null }> {
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const fullName = input.fullName.trim();

  const existing = await prisma.customer.findFirst({
    where: { OR: [{ email }, { phone }] },
    select: { id: true, email: true, phone: true },
  });
  if (existing) {
    if (existing.email === email) throw new AuthError('Email này đã được đăng ký.', 409);
    throw new AuthError('Số điện thoại này đã được đăng ký.', 409);
  }

  // Chỉ yêu cầu xác nhận email khi đã cấu hình dịch vụ gửi email (Brevo).
  // Chưa cấu hình -> tự động xác nhận (không khoá khách).
  const requireVerify = isEmailConfigured();
  const verifyToken = requireVerify ? newVerifyToken() : null;

  const passwordHash = await hashPassword(input.password);
  const created = await prisma.customer.create({
    data: {
      fullName,
      email,
      phone,
      avatarInitials: initials(fullName),
      passwordHash,
      passwordUpdatedAt: new Date(),
      status: 'NEW',
      emailVerified: !requireVerify,
      emailVerifyToken: verifyToken,
      emailVerifyExpires: requireVerify ? addHours(new Date(), 24) : null,
    },
    select: SELECT,
  });
  return { user: toUser(created), verifyToken };
}

/** Đăng nhập bằng email hoặc SĐT + mật khẩu. Ném AuthError nếu sai. */
export async function loginCustomer(identifier: string, password: string): Promise<User> {
  const id = identifier.trim().toLowerCase();
  const isEmail = id.includes('@');
  const customer = await prisma.customer.findFirst({
    where: isEmail ? { email: id } : { phone: identifier.trim() },
    select: { ...SELECT, passwordHash: true, deletedAt: true, emailVerified: true },
  });

  const fail = () => new AuthError('Email/SĐT hoặc mật khẩu chưa đúng.', 401);
  if (!customer || customer.deletedAt || !customer.passwordHash) throw fail();

  const ok = await verifyPassword(password, customer.passwordHash);
  if (!ok) throw fail();

  if (!customer.emailVerified) {
    throw new AuthError(EMAIL_UNVERIFIED, 403);
  }

  await prisma.customer.update({ where: { id: customer.id }, data: { lastVisitAt: new Date() } }).catch(() => {});
  return toUser(customer);
}

/** Lấy thông tin khách theo id (để nạp lại phiên). Trả null nếu không có. */
export async function getCustomerAccount(id: string): Promise<User | null> {
  const c = await prisma.customer.findUnique({ where: { id }, select: { ...SELECT, deletedAt: true } });
  if (!c || c.deletedAt) return null;

  const membership = await prisma.customerMembership.findFirst({
    where: { customerId: id, isActive: true, expiresAt: { gt: new Date() } },
    orderBy: { purchasedAt: 'desc' },
    select: { expiresAt: true, plan: { select: { key: true } } },
  });
  return toUser(c, membership ? { tier: membership.plan.key, expiresAt: membership.expiresAt } : null);
}

export interface UpdateProfileInput {
  fullName: string;
  email: string;
  phone: string;
  drink?: string | null;
}

/** Khách tự cập nhật hồ sơ. Ném AuthError nếu email/SĐT trùng người khác. */
export async function updateCustomerProfile(customerId: string, input: UpdateProfileInput): Promise<User> {
  const email = input.email.trim().toLowerCase();
  const phone = input.phone.trim();
  const fullName = input.fullName.trim();

  const clash = await prisma.customer.findFirst({
    where: { id: { not: customerId }, OR: [{ email }, { phone }] },
    select: { email: true, phone: true },
  });
  if (clash) {
    if (clash.email === email) throw new AuthError('Email này đã được người khác sử dụng.', 409);
    throw new AuthError('Số điện thoại này đã được người khác sử dụng.', 409);
  }

  try {
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        fullName,
        email,
        phone,
        avatarInitials: initials(fullName),
        ...(input.drink !== undefined ? { preferredDrink: input.drink } : {}),
      },
    });
  } catch {
    throw new AuthError('Không cập nhật được hồ sơ.', 500);
  }

  const updated = await getCustomerAccount(customerId);
  if (!updated) throw new AuthError('Không tìm thấy khách hàng.', 404);
  return updated;
}

/** Admin đặt lại mật khẩu cho khách (khi khách cần hỗ trợ). */
export async function adminResetCustomerPassword(customerId: string, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword);
  await prisma.customer.update({
    where: { id: customerId },
    data: { passwordHash, passwordUpdatedAt: new Date() },
  });
}
