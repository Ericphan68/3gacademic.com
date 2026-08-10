'use client';

import { Users } from 'lucide-react';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/states';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDateLong } from '@/lib/format';
import { membershipService } from '@/services/catalogService';
import { DEMO_ADMIN, DEMO_COACH, DEMO_CUSTOMER, useAuthStore } from '@/store/useAuthStore';
import type { User, UserRole } from '@/types';

const ROLE_META: Record<UserRole, { label: string; variant: 'accent' | 'gold' | 'neutral' }> = {
  customer: { label: 'Khách hàng', variant: 'neutral' },
  coach: { label: 'Huấn luyện viên', variant: 'accent' },
  admin: { label: 'Quản trị viên', variant: 'gold' },
};

interface Row {
  user: User;
  source: 'demo' | 'registered';
}

export default function AdminCustomersPage() {
  const hydrated = useHydrated();
  const registeredUsers = useAuthStore((state) => state.registeredUsers);

  if (!hydrated) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const rows: Row[] = [
    ...[DEMO_CUSTOMER, DEMO_COACH, DEMO_ADMIN].map((user) => ({ user, source: 'demo' as const })),
    ...registeredUsers.map(({ passwordHint: _pw, ...user }) => {
      void _pw;
      return { user: user as User, source: 'registered' as const };
    }),
  ];

  return (
    <div>
      <PortalHeader
        title="Khách hàng & tài khoản"
        description="Các tài khoản demo có sẵn và tài khoản khách tự đăng ký trên thiết bị này."
      />

      {rows.length === 0 ? (
        <EmptyState title="Chưa có tài khoản" description="Danh sách tài khoản sẽ hiển thị tại đây." icon={Users} />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <table className="w-full min-w-[52rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
                <th className="px-4 py-3 font-medium">Họ và tên</th>
                <th className="px-4 py-3 font-medium">Liên hệ</th>
                <th className="px-4 py-3 font-medium">Vai trò</th>
                <th className="px-4 py-3 font-medium">Hội viên</th>
                <th className="px-4 py-3 text-right font-medium">Số dư ví</th>
                <th className="px-4 py-3 font-medium">Tham gia</th>
                <th className="px-4 py-3 font-medium">Nguồn</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ user, source }) => {
                const tier = user.membershipTier ? membershipService.getById(user.membershipTier) : undefined;
                return (
                  <tr key={user.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-4 py-3 font-medium">{user.fullName}</td>
                    <td className="px-4 py-3">
                      <p className="break-all">{user.email}</p>
                      <p className="text-xs text-[var(--color-muted)]">{user.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_META[user.role].variant} size="sm">
                        {ROLE_META[user.role].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">{tier?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                      {formatCurrency(user.walletBalance)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">
                      {formatDateLong(user.joinedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={source === 'demo' ? 'neutral' : 'success'} size="sm">
                        {source === 'demo' ? 'Demo' : 'Tự đăng ký'}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
