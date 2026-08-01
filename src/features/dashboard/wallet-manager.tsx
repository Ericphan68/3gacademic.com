'use client';

import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Receipt,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays';
import { EmptyState } from '@/components/ui/states';
import { TOP_UP_PRESETS } from '@/data/booking-options';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { calculateTopUpBonus } from '@/services/pricingService';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { TransactionType } from '@/types';

const TYPE_META: Record<TransactionType, { label: string; positive: boolean }> = {
  'top-up': { label: 'Nạp ví', positive: true },
  bonus: { label: 'Bonus', positive: true },
  payment: { label: 'Thanh toán', positive: false },
  refund: { label: 'Hoàn tiền', positive: true },
  'voucher-purchase': { label: 'Mua voucher', positive: false },
};

export function WalletManager() {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const setWalletBalance = useAuthStore((state) => state.setWalletBalance);
  const transactions = useAccountStore((state) => state.transactions);
  const addTransaction = useAccountStore((state) => state.addTransaction);

  const [selectedAmount, setSelectedAmount] = useState<number>(TOP_UP_PRESETS[1].amount);
  const [customAmount, setCustomAmount] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!hydrated || !user) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const amount = customAmount ? Number(customAmount.replace(/\D/g, '')) : selectedAmount;
  const bonus = calculateTopUpBonus(amount, user.membershipTier);
  const credited = amount + bonus;

  const totalTopUp = transactions
    .filter((tx) => tx.type === 'top-up')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalBonus = transactions
    .filter((tx) => tx.type === 'bonus')
    .reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpent = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  const confirmTopUp = async () => {
    if (amount < 100000) {
      toast.error('Số tiền chưa hợp lệ', { description: 'Mức nạp tối thiểu là 100.000đ.' });
      return;
    }

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 700));

    const afterTopUp = user.walletBalance + amount;
    addTransaction({
      type: 'top-up',
      label: 'Nạp ví Lotus',
      amount,
      balanceAfter: afterTopUp,
    });

    if (bonus > 0) {
      addTransaction({
        type: 'bonus',
        label: `Bonus nạp ví (+${Math.round((bonus / amount) * 100)}%)`,
        amount: bonus,
        balanceAfter: afterTopUp + bonus,
      });
    }

    setWalletBalance(afterTopUp + bonus);
    setProcessing(false);
    setConfirming(false);
    setCustomAmount('');

    toast.success('Nạp ví thành công', {
      description: `Đã cộng ${formatCurrency(credited)} vào ví, trong đó ${formatCurrency(bonus)} là bonus.`,
    });
  };

  return (
    <div>
      <PortalHeader
        title="Ví Lotus"
        description="Số dư trả trước dùng cho mọi dịch vụ tại Lotus: giờ tập, buổi học, F&B, sự kiện và voucher."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        {/* Cột trái: số dư + nạp tiền */}
        <div className="space-y-6">
          <div className="rounded-[var(--radius-lg)] bg-[var(--color-navy-800)] p-6 text-[var(--color-champagne-50)]">
            <div className="flex items-center gap-2 text-sm text-[var(--color-navy-200)]">
              <Wallet className="size-4" aria-hidden />
              Số dư hiện tại
            </div>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl text-white">
              {formatCurrency(user.walletBalance)}
            </p>

            <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-sm">
              <div>
                <dt className="text-xs text-[var(--color-navy-200)]">Đã nạp</dt>
                <dd className="mt-1 font-medium text-white">
                  {formatCurrency(totalTopUp, { compact: true })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-navy-200)]">Bonus nhận</dt>
                <dd className="mt-1 font-medium text-[var(--color-champagne-300)]">
                  {formatCurrency(totalBonus, { compact: true })}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--color-navy-200)]">Đã chi</dt>
                <dd className="mt-1 font-medium text-white">
                  {formatCurrency(totalSpent, { compact: true })}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-6">
            <h2 className="text-lg">Nạp thêm vào ví</h2>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Nạp càng nhiều, mức bonus càng cao. Hội viên nhận thêm bonus theo hạng.
            </p>

            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {TOP_UP_PRESETS.map((preset) => {
                const active = !customAmount && selectedAmount === preset.amount;
                return (
                  <button
                    key={preset.amount}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(preset.amount);
                      setCustomAmount('');
                    }}
                    aria-pressed={active}
                    className={cn(
                      'cursor-pointer rounded-[var(--radius-md)] border p-4 text-left transition-colors',
                      active
                        ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                        : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                    )}
                  >
                    <span className="block font-medium">
                      {formatCurrency(preset.amount, { compact: true })}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--color-accent)]">
                      {preset.bonusPercent > 0 ? `Bonus +${preset.bonusPercent}%` : 'Không có bonus'}
                    </span>
                  </button>
                );
              })}
            </div>

            <Field
              label="Hoặc nhập số tiền khác"
              htmlFor="topup-custom"
              className="mt-4"
              helper="Tối thiểu 100.000đ"
            >
              <Input
                id="topup-custom"
                inputMode="numeric"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value.replace(/\D/g, ''))}
                placeholder="Ví dụ: 3000000"
              />
            </Field>

            <div className="mt-5 space-y-2 rounded-[var(--radius-md)] bg-[var(--color-surface)] p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[var(--color-muted)]">Số tiền nạp</span>
                <span className="font-medium">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-[var(--color-muted)]">Bonus</span>
                <span className="font-medium text-[var(--color-accent)]">+{formatCurrency(bonus)}</span>
              </div>
              <div className="flex justify-between gap-3 border-t border-[var(--color-border)] pt-2">
                <span className="font-medium">Tổng vào ví</span>
                <span className="font-[family-name:var(--font-display)] text-lg">
                  {formatCurrency(credited)}
                </span>
              </div>
            </div>

            <Button variant="accent" size="lg" block className="mt-5" onClick={() => setConfirming(true)}>
              <Sparkles aria-hidden />
              Nạp {formatCurrency(amount, { compact: true })}
            </Button>

            <p className="mt-3 text-center text-xs text-[var(--color-muted)]">
              Luồng nạp tiền demo — không có giao dịch thật nào được thực hiện.
            </p>
          </div>
        </div>

        {/* Cột phải: lịch sử giao dịch */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg">Lịch sử giao dịch</h2>
            <Badge variant="neutral" size="sm">
              {transactions.length} giao dịch
            </Badge>
          </div>

          {transactions.length === 0 ? (
            <EmptyState
              title="Chưa có giao dịch nào"
              description="Nạp ví hoặc đặt lịch để bắt đầu ghi nhận giao dịch."
              icon={Receipt}
              className="border-0"
            />
          ) : (
            <ul className="divide-y divide-[var(--color-border)]">
              {transactions.map((tx) => {
                const meta = TYPE_META[tx.type];
                return (
                  <li key={tx.id} className="flex items-center gap-4 py-4 first:pt-0">
                    <span
                      className={cn(
                        'flex size-10 shrink-0 items-center justify-center rounded-full',
                        meta.positive
                          ? 'bg-[var(--color-golf-50)] text-[var(--color-accent)]'
                          : 'bg-[var(--color-muted-surface)] text-[var(--color-muted)]',
                      )}
                    >
                      {tx.type === 'bonus' ? (
                        <Gift className="size-4" aria-hidden />
                      ) : meta.positive ? (
                        <ArrowDownLeft className="size-4" aria-hidden />
                      ) : (
                        <ArrowUpRight className="size-4" aria-hidden />
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{tx.label}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        {meta.label} · {formatDateTime(tx.createdAt)}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p
                        className={cn(
                          'text-sm font-medium tabular-nums',
                          tx.amount > 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-foreground)]',
                        )}
                      >
                        {tx.amount > 0 ? '+' : ''}
                        {formatCurrency(tx.amount)}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        Còn {formatCurrency(tx.balanceAfter, { compact: true })}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {/* Modal xác nhận nạp */}
      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent size="sm">
          <DialogHeader>
            <DialogTitle>Xác nhận nạp ví</DialogTitle>
            <DialogDescription>
              Đây là luồng demo, không có giao dịch thật. Số dư sẽ được cập nhật ngay trong tài khoản.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 rounded-[var(--radius-md)] bg-[var(--color-surface)] p-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-[var(--color-muted)]">Số tiền nạp</span>
              <span className="font-medium">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-[var(--color-muted)]">Bonus</span>
              <span className="font-medium text-[var(--color-accent)]">+{formatCurrency(bonus)}</span>
            </div>
            <div className="flex justify-between gap-3 border-t border-[var(--color-border)] pt-2">
              <span className="font-medium">Số dư sau khi nạp</span>
              <span className="font-medium">{formatCurrency(user.walletBalance + credited)}</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Để sau
            </Button>
            <Button variant="accent" loading={processing} onClick={confirmTopUp}>
              Xác nhận nạp
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
