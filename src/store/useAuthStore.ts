'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/constants/site';
import { initialsOf } from '@/lib/utils';
import type { User, UserPreferences } from '@/types';

/**
 * Xác thực DEMO — không phải authentication thật.
 *
 * Mật khẩu không được lưu ở dạng có thể dùng lại: chỉ giữ một chuỗi băm nhẹ
 * để so khớp trong phiên demo. Khi tích hợp thật, thay toàn bộ store này bằng
 * NextAuth/Auth.js hoặc backend riêng — các component chỉ dùng
 * `user`, `isAuthenticated`, `login`, `logout` nên không cần sửa.
 */

const DEMO_PASSWORD = 'Demo123!';

const DEFAULT_PREFERENCES: UserPreferences = {
  drink: 'Trà sen Lotus Signature',
  handedness: 'right',
  golfLevel: 'beginner',
  goal: 'Chơi được tự tin cùng bạn bè và đối tác',
  language: 'vi',
  notifyEmail: true,
  notifyZalo: true,
  notifyPromotions: true,
};

export const DEMO_CUSTOMER: User = {
  id: 'user-demo-customer',
  role: 'customer',
  fullName: 'Nguyễn Thu Trang',
  email: 'customer@lotusgolf.vn',
  phone: '0901234567',
  avatarInitials: 'NT',
  joinedAt: '2026-03-12',
  membershipTier: 'member',
  membershipExpiresAt: '2027-03-12',
  walletBalance: 8450000,
  loyaltyPoints: 2340,
  preferences: DEFAULT_PREFERENCES,
};

export const DEMO_ADMIN: User = {
  id: 'user-demo-admin',
  role: 'admin',
  fullName: 'Quản trị Lotus',
  email: 'admin@lotusgolf.vn',
  phone: '0900000000',
  avatarInitials: 'QT',
  joinedAt: '2025-10-01',
  membershipTier: null,
  membershipExpiresAt: null,
  walletBalance: 0,
  loyaltyPoints: 0,
  preferences: DEFAULT_PREFERENCES,
};

export const DEMO_COACH: User = {
  id: 'user-demo-coach',
  role: 'coach',
  fullName: 'Trần Thu Hà',
  email: 'coach@lotusgolf.vn',
  phone: '0907654321',
  avatarInitials: 'TH',
  joinedAt: '2025-11-02',
  membershipTier: 'premium',
  membershipExpiresAt: '2027-05-02',
  walletBalance: 3200000,
  loyaltyPoints: 890,
  coachSlug: 'tran-thu-ha',
  preferences: {
    ...DEFAULT_PREFERENCES,
    drink: 'Americano nóng',
    golfLevel: 'advanced',
    goal: 'Đồng hành cùng học viên đạt mục tiêu của họ',
  },
};

export interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  message: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /** Tài khoản do người dùng tự đăng ký trong phiên demo. */
  registeredUsers: (User & { passwordHint: string })[];
  login: (email: string, password: string) => AuthResult;
  loginWithProvider: (provider: 'google' | 'phone') => AuthResult;
  register: (input: RegisterInput) => AuthResult;
  /** Đặt phiên đăng nhập thật (dữ liệu từ server). */
  setUser: (user: User | null) => void;
  logout: () => void;
  updateProfile: (patch: Partial<Pick<User, 'fullName' | 'email' | 'phone'>>) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  setWalletBalance: (balance: number) => void;
  addLoyaltyPoints: (points: number) => void;
  setMembership: (tier: User['membershipTier'], expiresAt: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      registeredUsers: [],

      login: (email, password) => {
        const normalized = email.trim().toLowerCase();

        if (normalized === DEMO_CUSTOMER.email && password === DEMO_PASSWORD) {
          set({ user: { ...DEMO_CUSTOMER }, isAuthenticated: true });
          return { success: true, message: `Chào mừng trở lại, ${DEMO_CUSTOMER.fullName}.` };
        }
        if (normalized === DEMO_COACH.email && password === DEMO_PASSWORD) {
          set({ user: { ...DEMO_COACH }, isAuthenticated: true });
          return { success: true, message: `Chào mừng trở lại, ${DEMO_COACH.fullName}.` };
        }
        if (normalized === DEMO_ADMIN.email && password === DEMO_PASSWORD) {
          set({ user: { ...DEMO_ADMIN }, isAuthenticated: true });
          return { success: true, message: `Chào mừng trở lại, ${DEMO_ADMIN.fullName}.` };
        }

        const registered = get().registeredUsers.find((item) => item.email === normalized);
        if (registered && registered.passwordHint === hashPassword(password)) {
          const { passwordHint: _unused, ...user } = registered;
          void _unused;
          set({ user, isAuthenticated: true });
          return { success: true, message: `Chào mừng trở lại, ${user.fullName}.` };
        }

        return { success: false, message: 'Email hoặc mật khẩu chưa đúng. Bạn có thể dùng tài khoản demo bên dưới.' };
      },

      loginWithProvider: (provider) => {
        set({ user: { ...DEMO_CUSTOMER }, isAuthenticated: true });
        return {
          success: true,
          message:
            provider === 'google'
              ? 'Đăng nhập Google (demo) thành công — đang dùng tài khoản khách hàng mẫu.'
              : 'Đăng nhập bằng số điện thoại (demo) thành công — đang dùng tài khoản khách hàng mẫu.',
        };
      },

      register: (input) => {
        const email = input.email.trim().toLowerCase();
        if (email === DEMO_CUSTOMER.email || email === DEMO_COACH.email) {
          return { success: false, message: 'Email này đã được dùng cho tài khoản demo có sẵn.' };
        }
        if (get().registeredUsers.some((item) => item.email === email)) {
          return { success: false, message: 'Email này đã được đăng ký trong phiên demo.' };
        }

        const user: User = {
          id: `user-${Date.now().toString(36)}`,
          role: 'customer',
          fullName: input.fullName.trim(),
          email,
          phone: input.phone.trim(),
          avatarInitials: initialsOf(input.fullName),
          joinedAt: new Date().toISOString().slice(0, 10),
          membershipTier: null,
          membershipExpiresAt: null,
          walletBalance: 0,
          loyaltyPoints: 0,
          preferences: { ...DEFAULT_PREFERENCES, golfLevel: 'never' },
        };

        set((state) => ({
          registeredUsers: [...state.registeredUsers, { ...user, passwordHint: hashPassword(input.password) }],
          user,
          isAuthenticated: true,
        }));

        return { success: true, message: 'Tạo tài khoản thành công. Chào mừng bạn đến với Lotus.' };
      },

      setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),

      logout: () => {
        void fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (patch) =>
        set((state) =>
          state.user
            ? {
                user: {
                  ...state.user,
                  ...patch,
                  avatarInitials: patch.fullName ? initialsOf(patch.fullName) : state.user.avatarInitials,
                },
              }
            : state,
        ),

      updatePreferences: (patch) =>
        set((state) =>
          state.user
            ? { user: { ...state.user, preferences: { ...state.user.preferences, ...patch } } }
            : state,
        ),

      setWalletBalance: (balance) =>
        set((state) => (state.user ? { user: { ...state.user, walletBalance: Math.max(0, balance) } } : state)),

      addLoyaltyPoints: (points) =>
        set((state) =>
          state.user ? { user: { ...state.user, loyaltyPoints: state.user.loyaltyPoints + points } } : state,
        ),

      setMembership: (tier, expiresAt) =>
        set((state) =>
          state.user ? { user: { ...state.user, membershipTier: tier, membershipExpiresAt: expiresAt } } : state,
        ),
    }),
    {
      name: STORAGE_KEYS.auth,
      version: 1,
    },
  ),
);

/**
 * Băm mật khẩu nhẹ chỉ để so khớp trong phiên demo.
 * KHÔNG dùng cho production — production phải băm ở server bằng bcrypt/argon2.
 */
function hashPassword(password: string): string {
  let h = 2166136261;
  for (let i = 0; i < password.length; i++) {
    h ^= password.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}
