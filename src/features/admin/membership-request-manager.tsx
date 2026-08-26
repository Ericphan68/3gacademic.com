'use client';

import { Check, Clock, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateTime } from '@/lib/format';
import type { AdminMembershipRequestRow } from '@/server/services/membershipJoinService';

const STATUS: Record<string, { label: string; variant: 'warning' | 'success' | 'danger' }> = {
  PENDING: { label: 'Chờ xác nhận', variant: 'warning' },
  CONFIRMED: { label: 'Đã kích hoạt', variant: 'success' },
  REJECTED: { label: 'Đã từ chối', variant: 'danger' },
};

export function MembershipRequestManager({ rows }: { rows: AdminMembershipRequestRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const act = async (id: string, action: 'confirm' | 'reject') => {
    setBusy(id);
    const res = await fetch('/api/admin/memberships/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action }),
    });
    setBusy(null);
    setConfirmId(null);
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      toast.error('Không thực hiện được', { description: body?.error });
      return;
    }
    toast.success(action === 'confirm' ? 'Đã kích hoạt hội viên & cộng ví' : 'Đã từ chối yêu cầu');
    router.refresh();
  };

  const pending = rows.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
        <Clock className="size-4" aria-hidden />
        {pending > 0 ? `${pending} yêu cầu đăng ký (chuyển khoản) đang chờ xác nhận` : 'Không có yêu cầu đăng ký nào đang chờ'}
      </div>

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <table className="w-full min-w-[52rem] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
              <th className="px-4 py-3 font-medium">Khách</th>
              <th className="px-4 py-3 font-medium">Gói</th>
              <th className="px-4 py-3 font-medium">Số tiền</th>
              <th className="px-4 py-3 font-medium">Nội dung CK</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const s = STATUS[r.status];
              return (
                <tr key={r.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{r.customerName}</p>
                    <p className="text-xs text-[var(--color-muted)]">{r.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{r.planName}</td>
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">{formatCurrency(r.amount)}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[var(--color-muted)]">{r.transferNote}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.variant} size="sm">
                      {s.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {r.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        {confirmId === r.id ? (
                          <>
                            <span className="text-xs text-[var(--color-muted)]">Đã nhận tiền?</span>
                            <Button variant="accent" size="sm" loading={busy === r.id} onClick={() => act(r.id, 'confirm')}>
                              <Check aria-hidden />
                              Xác nhận
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)}>
                              Huỷ
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="accent" size="sm" onClick={() => setConfirmId(r.id)}>
                              <Check aria-hidden />
                              Xác nhận
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label="Từ chối" disabled={busy === r.id} onClick={() => act(r.id, 'reject')}>
                              <X aria-hidden />
                            </Button>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="block text-right text-xs text-[var(--color-muted)]">{r.reviewedAt ? formatDateTime(r.reviewedAt) : '—'}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
