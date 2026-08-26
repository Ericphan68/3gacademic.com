'use client';

import { Check, Copy, KeyRound, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-fields';

export interface AdminCustomerRow {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  status: string;
  bookingCount: number;
  createdAt: string;
  lastVisitAt: string | null;
  hasAccount: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  NEW: 'Mới',
  ACTIVE: 'Đang hoạt động',
  VIP: 'VIP',
  INACTIVE: 'Ngưng',
  AT_RISK: 'Nguy cơ rời',
};

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '—');

/** Tạo mật khẩu ngẫu nhiên đủ mạnh (có chữ hoa + chữ số). */
function randomPassword(): string {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnpqrstuvwxyz';
  const digit = '23456789';
  const all = upper + lower + digit;
  const pick = (set: string) => set[Math.floor(Math.random() * set.length)];
  let out = pick(upper) + pick(lower) + pick(digit);
  for (let i = 0; i < 6; i++) out += pick(all);
  return out;
}

export function CustomerManager({ customers }: { customers: AdminCustomerRow[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pwd, setPwd] = useState('');
  const [saving, setSaving] = useState(false);
  const [issued, setIssued] = useState<{ name: string; password: string } | null>(null);

  const openReset = (id: string) => {
    setOpenId(id);
    setPwd(randomPassword());
    setIssued(null);
  };

  const submit = async (row: AdminCustomerRow) => {
    if (pwd.trim().length < 8) {
      toast.error('Mật khẩu tối thiểu 8 ký tự (có chữ hoa + số)');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/admin/customers/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: row.id, newPassword: pwd.trim() }),
    });
    setSaving(false);
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      toast.error('Chưa đặt lại được', { description: body?.error });
      return;
    }
    setIssued({ name: row.fullName, password: pwd.trim() });
    setOpenId(null);
    toast.success('Đã đặt lại mật khẩu');
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Đã sao chép mật khẩu');
    } catch {
      toast.message('Hãy chép thủ công: ' + text);
    }
  };

  return (
    <div className="space-y-4">
      {issued ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-golf-50)] p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-[var(--color-foreground)]">
                Mật khẩu mới cho {issued.name}
              </p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Đưa mật khẩu này cho khách để đăng nhập. Nhắc khách đổi lại sau khi vào được.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <code className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-mono text-base">
                  {issued.password}
                </code>
                <Button variant="outline" size="sm" onClick={() => copy(issued.password)}>
                  <Copy aria-hidden />
                  Sao chép
                </Button>
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" aria-label="Đóng" onClick={() => setIssued(null)}>
              <X aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
        <table className="w-full min-w-[52rem] text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
              <th className="px-4 py-3 font-medium">Khách</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 text-center font-medium">Số đơn</th>
              <th className="px-4 py-3 font-medium">Tài khoản</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Tạo lúc</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-[var(--color-border)] align-top last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium">{c.fullName}</p>
                  <p className="text-xs text-[var(--color-muted)]">{c.phone}</p>
                </td>
                <td className="px-4 py-3 text-[var(--color-muted)]">{c.email || '—'}</td>
                <td className="px-4 py-3 text-center tabular-nums">{c.bookingCount}</td>
                <td className="px-4 py-3">
                  {c.hasAccount ? (
                    <Badge variant="success" size="sm">
                      Có tài khoản
                    </Badge>
                  ) : (
                    <span className="text-xs text-[var(--color-muted)]">Chưa có</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="neutral" size="sm">
                    {STATUS_LABEL[c.status] ?? c.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">{fmt(c.createdAt)}</td>
                <td className="px-4 py-3">
                  {openId === c.id ? (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={pwd}
                          onChange={(e) => setPwd(e.target.value)}
                          className="h-9 w-40 font-mono text-sm"
                          aria-label="Mật khẩu mới"
                        />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Tạo ngẫu nhiên"
                          onClick={() => setPwd(randomPassword())}
                        >
                          <RefreshCw aria-hidden />
                        </Button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Button variant="ghost" size="sm" onClick={() => setOpenId(null)}>
                          Huỷ
                        </Button>
                        <Button variant="accent" size="sm" loading={saving} onClick={() => submit(c)}>
                          <Check aria-hidden />
                          Lưu mật khẩu
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => openReset(c.id)}>
                        <KeyRound aria-hidden />
                        {c.hasAccount ? 'Đặt lại mật khẩu' : 'Tạo mật khẩu'}
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
