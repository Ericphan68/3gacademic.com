import 'server-only';

import { hashPassword, verifyPassword } from '@/server/auth/password';
import { prisma } from '@/server/db';
import type { User, UserPreferences } from '@/types/account';

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
export async function registerCustomer(input: RegisterCustomerInput): Promise<User> {
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
    },
    select: SELECT,
  });
  return toUser(created);
}

/** Đăng nhập bằng email hoặc SĐT + mật khẩu. Ném AuthError nếu sai. */
export async function loginCustomer(identifier: string, password: string): Promise<User> {
  const id = identifier.trim().toLowerCase();
  const isEmail = id.includes('@');
  const customer = await prisma.customer.findFirst({
    where: isEmail ? { email: id } : { phone: identifier.trim() },
    select: { ...SELECT, passwordHash: true, deletedAt: true },
  });

  const fail = () => new AuthError('Email/SĐT hoặc mật khẩu chưa đúng.', 401);
  if (!customer || customer.deletedAt || !customer.passwordHash) throw fail();

  const ok = await verifyPassword(password, customer.passwordHash);
  if (!ok) throw fail();

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

/** Admin đặt lại mật khẩu cho khách (khi khách cần hỗ trợ). */
export async function adminResetCustomerPassword(customerId: string, newPassword: string): Promise<void> {
  const passwordHash = await hashPassword(newPassword);
  await prisma.customer.update({
    where: { id: customerId },
    data: { passwordHash, passwordUpdatedAt: new Date() },
  });
}
