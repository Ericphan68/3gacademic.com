'use client';

import { addMonths } from 'date-fns';
import { ArrowLeft, BadgeCheck, Check, Copy, Crown, Minus, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/overlays';
import { BLUR_DATA_URL } from '@/constants/media';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { BankSettings } from '@/server/services/settingsService';
import type { MembershipTier } from '@/types';

type Step = 'choose' | 'bank' | 'done-wallet' | 'done-transfer';

export function MembershipPricing({
  tiers,
  isLoggedIn,
  walletBalance,
  currentTier,
  bank,
  phone,
}: {
  tiers: MembershipTier[];
  isLoggedIn: boolean;
  walletBalance: number;
  currentTier: string | null;
  bank: BankSettings;
  phone: string;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<MembershipTier | null>(null);
  const [step, setStep] = useState<Step>('choose');
  const [busy, setBusy] = useState(false);

  const bankReady = Boolean(bank.bankName && bank.accountNumber);

  const open = (tier: MembershipTier) => {
    setSelected(tier);
    setStep('choose');
  };
  const close = () => setSelected(null);

  const bonusOf = (t: MembershipTier) => Math.round((t.topUpAmount * t.bonusPercent) / 100);

  const payWallet = async () => {
    if (!selected) return;
    setBusy(true);
    const res = await fetch('/api/membership/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planKey: selected.id, method: 'wallet' }),
    });
    setBusy(false);
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      toast.error('Chưa đăng ký được', { description: body?.error });
      return;
    }
    setStep('done-wallet');
    toast.success(`Đã kích hoạt ${selected.name}`);
    router.refresh();
  };

  const submitTransfer = async () => {
    if (!selected) return;
    setBusy(true);
    const res = await fetch('/api/membership/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ planKey: selected.id, method: 'transfer' }),
    });
    setBusy(false);
    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    if (!res.ok) {
      toast.error('Chưa gửi được yêu cầu', { description: body?.error });
      return;
    }
    setStep('done-transfer');
    toast.success('Đã ghi nhận yêu cầu', { description: 'Lotus sẽ xác nhận sau khi nhận được tiền.' });
    router.refresh();
  };

  const copy = async (text: string, msg = 'Đã sao chép') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(msg);
    } catch {
      toast.message(text);
    }
  };

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {tiers.map((tier) => {
          const isFounder = tier.id === 'founder';
          const isCurrent = currentTier === tier.id;
          return (
            <article
              key={tier.id}
              className={cn(
                'flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border transition-all duration-300',
                isFounder
                  ? 'border-[var(--color-champagne-300)] bg-[var(--color-navy-800)] text-[var(--color-champagne-50)]'
                  : 'border-[var(--color-border)] bg-[var(--color-surface-raised)] hover:-translate-y-1 hover:shadow-[var(--shadow-card)]',
                isCurrent && !isFounder && 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]',
              )}
            >
              <div className="relative aspect-[16/7] overflow-hidden bg-[var(--color-muted-surface)]">
                <Image
                  src={tier.image}
                  alt={`Hạng hội viên ${tier.name}`}
                  fill
                  sizes="(min-width: 1280px) 24vw, (min-width: 768px) 45vw, 92vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
                <div
                  className={cn(
                    'absolute inset-0',
                    isFounder
                      ? 'bg-gradient-to-t from-[var(--color-navy-800)] via-[var(--color-navy-800)]/45 to-transparent'
                      : 'bg-gradient-to-t from-[var(--color-surface-raised)] via-[var(--color-surface-raised)]/35 to-transparent',
                  )}
                  aria-hidden
                />
              </div>

              <div className="flex flex-1 flex-col p-6 pt-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className={cn('font-[family-name:var(--font-display)] text-xl', isFounder && 'text-white')}>
                      {tier.name}
                    </h3>
                    <p className={cn('mt-1 text-sm', isFounder ? 'text-[var(--color-navy-100)]' : 'text-[var(--color-muted)]')}>
                      {tier.tagline}
                    </p>
                  </div>
                  {isFounder ? <Crown className="size-5 shrink-0 text-[var(--color-champagne-300)]" aria-hidden /> : null}
                </div>

                {tier.highlight ? (
                  <Badge variant={isFounder ? 'gold' : 'accent'} size="sm" className="mb-4 self-start">
                    {tier.highlight}
                  </Badge>
                ) : null}
                {isCurrent ? (
                  <Badge variant="success" size="sm" className="mb-4 self-start">
                    Hạng hiện tại của bạn
                  </Badge>
                ) : null}

                <div className="mb-5">
                  <p className={cn('text-xs', isFounder ? 'text-[var(--color-navy-200)]' : 'text-[var(--color-muted)]')}>
                    Mức nạp ví
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-3xl">
                    {formatCurrency(tier.topUpAmount, { compact: true })}
                  </p>
                  <p className={cn('mt-1 text-sm', isFounder ? 'text-[var(--color-champagne-300)]' : 'text-[var(--color-accent)]')}>
                    Nhận thêm {formatCurrency(bonusOf(tier), { compact: true })} bonus (+{tier.bonusPercent}%)
                  </p>
                </div>

                <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit.label} className="flex items-start gap-2.5">
                      {benefit.included ? (
                        <Check className={cn('mt-0.5 size-4 shrink-0', isFounder ? 'text-[var(--color-champagne-300)]' : 'text-[var(--color-accent)]')} aria-hidden />
                      ) : (
                        <Minus className="mt-0.5 size-4 shrink-0 text-[var(--color-stone-400)]" aria-hidden />
                      )}
                      <span className={cn(!benefit.included && 'text-[var(--color-stone-400)]')}>
                        <span className={cn(isFounder ? 'text-[var(--color-navy-100)]' : 'text-[var(--color-muted)]')}>
                          {benefit.label}:{' '}
                        </span>
                        <span className={cn('font-medium', isFounder && benefit.included && 'text-white')}>
                          {benefit.value}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isFounder ? 'gold' : isCurrent ? 'outline' : 'accent'}
                  block
                  disabled={isCurrent}
                  onClick={() => open(tier)}
                >
                  {isCurrent ? 'Đang sử dụng' : `Chọn ${tier.name}`}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent>
          {selected ? (
            <MembershipDialog
              tier={selected}
              bonus={bonusOf(selected)}
              step={step}
              setStep={setStep}
              isLoggedIn={isLoggedIn}
              walletBalance={walletBalance}
              bank={bank}
              bankReady={bankReady}
              phone={phone}
              busy={busy}
              onPayWallet={payWallet}
              onSubmitTransfer={submitTransfer}
              onClose={close}
              onCopy={copy}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

function MembershipDialog(props: {
  tier: MembershipTier;
  bonus: number;
  step: Step;
  setStep: (s: Step) => void;
  isLoggedIn: boolean;
  walletBalance: number;
  bank: BankSettings;
  bankReady: boolean;
  phone: string;
  busy: boolean;
  onPayWallet: () => void;
  onSubmitTransfer: () => void;
  onClose: () => void;
  onCopy: (t: string, m?: string) => void;
}) {
  const { tier, bonus, step, setStep, isLoggedIn, walletBalance, bank, bankReady, phone, busy } = props;
  const price = tier.topUpAmount;
  const enough = walletBalance >= price;
  const expiresAt = addMonths(new Date(), tier.validityMonths);

  if (!isLoggedIn) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>Đăng ký {tier.name}</DialogTitle>
          <DialogDescription>Bạn cần đăng nhập để đăng ký hội viên và lưu vào tài khoản.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 flex flex-col gap-3">
          <Button asChild variant="accent" block>
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button asChild variant="outline" block>
            <Link href="/register">Tạo tài khoản mới</Link>
          </Button>
        </div>
      </>
    );
  }

  if (step === 'done-wallet') {
    return (
      <div className="py-2 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
          <BadgeCheck className="size-7" aria-hidden />
        </span>
        <DialogTitle className="text-lg">Đã kích hoạt {tier.name}</DialogTitle>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Hạng hội viên có hiệu lực đến {formatDate(expiresAt)}. Ưu đãi sẽ tự áp dụng khi bạn đặt lịch.
        </p>
        <Button variant="accent" className="mt-5" onClick={props.onClose}>
          Xong
        </Button>
      </div>
    );
  }

  if (step === 'done-transfer') {
    return (
      <div className="py-2 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
          <BadgeCheck className="size-7" aria-hidden />
        </span>
        <DialogTitle className="text-lg">Đang chờ Lotus xác nhận</DialogTitle>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Yêu cầu đăng ký {tier.name} đã được ghi nhận. Sau khi Lotus nhận được tiền và xác nhận, hạng hội viên sẽ được kích hoạt.
        </p>
        <Button variant="accent" className="mt-5" onClick={props.onClose}>
          Đã hiểu
        </Button>
      </div>
    );
  }

  if (step === 'bank') {
    return (
      <>
        <button
          type="button"
          onClick={() => setStep('choose')}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Chọn lại phương án
        </button>
        <DialogHeader>
          <DialogTitle>Chuyển khoản {formatCurrency(price)}</DialogTitle>
          <DialogDescription>Chuyển đúng số tiền tới tài khoản dưới đây, rồi bấm “Tôi đã chuyển khoản”.</DialogDescription>
        </DialogHeader>

        {bankReady ? (
          <dl className="mt-4 space-y-2.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm">
            <BankRow label="Ngân hàng" value={bank.bankName} />
            <BankRow label="Số tài khoản" value={bank.accountNumber} onCopy={() => props.onCopy(bank.accountNumber, 'Đã sao chép số TK')} strong />
            <BankRow label="Chủ tài khoản" value={bank.accountHolder} />
            {bank.branch ? <BankRow label="Chi nhánh" value={bank.branch} /> : null}
            <BankRow label="Số tiền" value={formatCurrency(price)} onCopy={() => props.onCopy(String(price), 'Đã sao chép số tiền')} strong />
            <BankRow label="Nội dung CK" value={phone || 'Ghi SĐT của bạn'} onCopy={phone ? () => props.onCopy(phone, 'Đã sao chép') : undefined} strong />
          </dl>
        ) : (
          <p className="mt-4 rounded-[var(--radius-md)] border border-[var(--color-warning)] bg-[var(--color-warning)]/10 p-3 text-sm">
            Chưa cấu hình tài khoản ngân hàng. Vui lòng liên hệ Lotus để nhận thông tin chuyển khoản.
          </p>
        )}

        <Button variant="accent" block className="mt-5" loading={busy} onClick={props.onSubmitTransfer}>
          <BadgeCheck aria-hidden />
          Tôi đã chuyển khoản
        </Button>
      </>
    );
  }

  // step === 'choose'
  return (
    <>
      <DialogHeader>
        <DialogTitle>Đăng ký {tier.name}</DialogTitle>
        <DialogDescription>
          Mức nạp {formatCurrency(price)} · nhận thêm {formatCurrency(bonus)} bonus (+{tier.bonusPercent}%) · hiệu lực {tier.validityMonths} tháng.
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 space-y-3">
        {/* Phương án 1: trừ ví */}
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 font-medium">
                <Wallet className="size-4 text-[var(--color-accent)]" aria-hidden />
                Trừ từ ví
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-muted)]">Số dư ví: {formatCurrency(walletBalance)}</p>
            </div>
            <Button variant="accent" size="sm" disabled={!enough} loading={busy} onClick={props.onPayWallet}>
              Dùng ví
            </Button>
          </div>
          {!enough ? (
            <p className="mt-2 text-xs text-[var(--color-danger)]">
              Số dư thiếu {formatCurrency(price - walletBalance)}.{' '}
              <Link href="/dashboard/wallet" className="font-medium underline">
                Nạp thêm ví
              </Link>
            </p>
          ) : (
            <p className="mt-2 text-xs text-[var(--color-muted)]">Trừ {formatCurrency(price)}, cộng lại {formatCurrency(bonus)} bonus. Kích hoạt ngay.</p>
          )}
        </div>

        {/* Phương án 2: chuyển khoản */}
        <div className="rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">Chuyển khoản ngân hàng</p>
              <p className="mt-0.5 text-xs text-[var(--color-muted)]">Chuyển {formatCurrency(price)}, Lotus xác nhận rồi kích hoạt.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setStep('bank')}>
              Chuyển khoản
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

function BankRow({ label, value, onCopy, strong }: { label: string; value: string; onCopy?: () => void; strong?: boolean }) {
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
