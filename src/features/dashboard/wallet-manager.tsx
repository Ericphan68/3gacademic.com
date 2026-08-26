'use client';

import { ArrowLeft, BadgeCheck, Building2, CheckCircle2, Clock, Copy, Wallet, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';
import { EmptyState } from '@/components/ui/states';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { BankSettings } from '@/server/services/settingsService';
import type { TopupView, TxView, WalletData } from '@/server/services/topupService';

const PRESETS = [500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000];
const MIN_TOPUP = 100_000;

const TOPUP_STATUS: Record<TopupView['status'], { label: string; variant: 'warning' | 'success' | 'danger'; icon: typeof Clock }> = {
  PENDING: { label: 'Chờ xác nhận', variant: 'warning', icon: Clock },
  CONFIRMED: { label: 'Đã cộng ví', variant: 'success', icon: CheckCircle2 },
  REJECTED: { label: 'Bị từ chối', variant: 'danger', icon: XCircle },
};

const TX_LABEL: Record<string, { label: string; positive: boolean }> = {
  TOPUP: { label: 'Nạp ví', positive: true },
  BONUS: { label: 'Bonus', positive: true },
  PAYMENT: { label: 'Thanh toán', positive: false },
  REFUND: { label: 'Hoàn tiền', positive: true },
  VOUCHER_PURCHASE: { label: 'Mua voucher', positive: false },
  COMMISSION: { label: 'Hoa hồng', positive: true },
};

export function WalletManager({
  wallet,
  bank,
  phone,
}: {
  wallet: WalletData;
  bank: BankSettings;
  phone: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState<'idle' | 'bank' | 'done'>('idle');
  const [amount, setAmount] = useState<number>(PRESETS[1]);
  const [custom, setCustom] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const bankReady = Boolean(bank.bankName && bank.accountNumber);
  const effectiveAmount = custom ? Number(custom.replace(/\D/g, '')) : amount;

  const copy = async (text: string, msg = 'Đã sao chép') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(msg);
    } catch {
      toast.message(text);
    }
  };

  const goToBank = () => {
    if (!Number.isFinite(effectiveAmount) || effectiveAmount < MIN_TOPUP) {
      toast.error('Số tiền chưa hợp lệ', { description: `Mức nạp tối thiểu ${formatCurrency(MIN_TOPUP)}.` });
      return;
    }
    setStep('bank');
  };

  const confirmTransferred = async () => {
    setSubmitting(true);
    const res = await fetch('/api/wallet/topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: effectiveAmount }),
    });
    setSubmitting(false);
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      toast.error('Chưa gửi được yêu cầu', { description: body?.error });
      return;
    }
    setStep('done');
    setCustom('');
    toast.success('Đã ghi nhận yêu cầu nạp', { description: 'Lotus sẽ xác nhận sau khi nhận được tiền.' });
    router.refresh();
  };

  return (
    <div>
      <PortalHeader
        title="Ví Lotus"
        description="Số dư trả trước dùng cho mọi dịch vụ. Tiền vào ví sau khi Lotus xác nhận đã nhận chuyển khoản."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
        {/* Cột trái: số dư + nạp tiền */}
        <div className="space-y-6">
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-navy-800)] p-6 text-[var(--color-champagne-50)]">
            <div className="flex items-center gap-2 text-sm text-[var(--color-navy-200)]">
              <Wallet className="size-4" aria-hidden />
              Số dư hiện tại
            </div>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white">
              {formatCurrency(wallet.balance)}
            </p>
          </div>

          {/* Khối nạp tiền theo bước */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
            {step === 'idle' ? (
              <>
                <h3 className="text-base">Nạp tiền vào ví</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">Chọn số tiền muốn nạp.</p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setAmount(p);
                        setCustom('');
                      }}
                      className={cn(
                        'rounded-[var(--radius-md)] border px-3 py-2 text-sm font-medium transition-colors',
                        !custom && amount === p
                          ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)] text-[var(--color-accent)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]',
                      )}
                    >
                      {formatCurrency(p, { compact: true })}
                    </button>
                  ))}
                </div>
                <Field label="Hoặc nhập số khác" htmlFor="custom-amount" className="mt-4">
                  <Input
                    id="custom-amount"
                    inputMode="numeric"
                    placeholder="Ví dụ: 3.000.000"
                    value={custom ? Number(custom.replace(/\D/g, '')).toLocaleString('vi-VN') : ''}
                    onChange={(e) => setCustom(e.target.value)}
                  />
                </Field>
                <Button variant="accent" block className="mt-5" onClick={goToBank}>
                  Tiếp tục
                </Button>
              </>
            ) : null}

            {step === 'bank' ? (
              <>
                <button
                  type="button"
                  onClick={() => setStep('idle')}
                  className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Chọn lại số tiền
                </button>
                <h3 className="text-base">Chuyển khoản {formatCurrency(effectiveAmount)}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">
                  Chuyển đúng số tiền tới tài khoản dưới đây, rồi bấm “Tôi đã chuyển khoản”.
                </p>

                {bankReady ? (
                  <dl className="mt-4 space-y-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm">
                    <Row label="Ngân hàng" value={bank.bankName} />
                    <Row label="Số tài khoản" value={bank.accountNumber} onCopy={() => copy(bank.accountNumber, 'Đã sao chép số TK')} strong />
                    <Row label="Chủ tài khoản" value={bank.accountHolder} />
                    {bank.branch ? <Row label="Chi nhánh" value={bank.branch} /> : null}
                    <Row
                      label="Số tiền"
                      value={formatCurrency(effectiveAmount)}
                      onCopy={() => copy(String(effectiveAmount), 'Đã sao chép số tiền')}
                      strong
                    />
                    <Row
                      label="Nội dung CK"
                      value={phone || 'Ghi SĐT của bạn'}
                      onCopy={phone ? () => copy(phone, 'Đã sao chép nội dung') : undefined}
                      strong
                    />
                  </dl>
                ) : (
                  <p className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning)]/10 p-3 text-sm">
                    Chưa cấu hình tài khoản ngân hàng. Vui lòng liên hệ Lotus để nhận thông tin chuyển khoản.
                  </p>
                )}

                <p className="mt-3 text-xs text-[var(--color-muted)]">
                  Ghi <span className="font-medium text-[var(--color-foreground)]">số điện thoại của bạn</span> vào nội dung chuyển khoản để Lotus đối soát nhanh.
                </p>

                <Button variant="accent" block className="mt-5" loading={submitting} onClick={confirmTransferred}>
                  <BadgeCheck aria-hidden />
                  Tôi đã chuyển khoản
                </Button>
              </>
            ) : null}

            {step === 'done' ? (
              <div className="text-center">
                <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
                  <Clock className="size-7" aria-hidden />
                </span>
                <h3 className="text-lg">Đang chờ Lotus xác nhận</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Yêu cầu nạp đã được ghi nhận. Sau khi Lotus nhận được tiền và xác nhận, số dư sẽ được cộng vào ví của bạn.
                </p>
                <Button variant="outline" className="mt-5" onClick={() => setStep('idle')}>
                  Nạp thêm lần nữa
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Cột phải: yêu cầu nạp + lịch sử */}
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-base">Yêu cầu nạp gần đây</h3>
            {wallet.topups.length === 0 ? (
              <EmptyState title="Chưa có yêu cầu nạp" description="Các lần nạp của bạn sẽ hiển thị tại đây." icon={Wallet} />
            ) : (
              <ul className="space-y-2.5">
                {wallet.topups.map((t) => {
                  const s = TOPUP_STATUS[t.status];
                  const Icon = s.icon;
                  return (
                    <li
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">{formatCurrency(t.amount)}</p>
                        <p className="truncate text-xs text-[var(--color-muted)]">{formatDateTime(t.createdAt)}</p>
                      </div>
                      <Badge variant={s.variant} size="sm" className="shrink-0 gap-1">
                        <Icon className="size-3.5" aria-hidden />
                        {s.label}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-base">Lịch sử giao dịch</h3>
            {wallet.transactions.length === 0 ? (
              <EmptyState title="Chưa có giao dịch" description="Giao dịch ví sẽ hiển thị tại đây." icon={Building2} />
            ) : (
              <ul className="divide-y divide-[var(--color-border)] rounded-[var(--radius-lg)] border border-[var(--color-border)]">
                {wallet.transactions.map((tx) => (
                  <TxRow key={tx.id} tx={tx} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onCopy,
  strong,
}: {
  label: string;
  value: string;
  onCopy?: () => void;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--color-muted)]">{label}</dt>
      <dd className="flex items-center gap-2">
        <span className={cn(strong && 'font-semibold text-[var(--color-foreground)]')}>{value}</span>
        {onCopy ? (
          <button type="button" onClick={onCopy} aria-label={`Sao chép ${label}`} className="text-[var(--color-muted)] hover:text-[var(--color-accent)]">
            <Copy className="size-3.5" aria-hidden />
          </button>
        ) : null}
      </dd>
    </div>
  );
}

function TxRow({ tx }: { tx: TxView }) {
  const meta = TX_LABEL[tx.type] ?? { label: tx.label, positive: tx.amount >= 0 };
  const positive = tx.amount >= 0;
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{tx.label || meta.label}</p>
        <p className="text-xs text-[var(--color-muted)]">{formatDateTime(tx.createdAt)}</p>
      </div>
      <span className={cn('shrink-0 text-sm font-semibold', positive ? 'text-[var(--color-success)]' : 'text-[var(--color-foreground)]')}>
        {positive ? '+' : '−'}
        {formatCurrency(Math.abs(tx.amount), { compact: true })}
      </span>
    </li>
  );
}
