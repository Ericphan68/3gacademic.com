'use client';

import { Check, CreditCard, Loader2, ShieldCheck, Wallet } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { DemoQrCode } from '@/components/ui/misc';
import { Dialog, DialogContent } from '@/components/ui/overlays';
import { formatCurrency } from '@/lib/format';
import type { PaymentMethod } from '@/types';

type Phase = 'confirm' | 'processing' | 'success';

const GATEWAY: Record<string, { title: string; note: string; showQr: boolean }> = {
  wallet: {
    title: 'Thanh toán bằng Ví Lotus',
    note: 'Số tiền sẽ được trừ trực tiếp từ số dư ví Lotus của bạn.',
    showQr: false,
  },
  momo: {
    title: 'Thanh toán qua Ví MoMo',
    note: 'Mở app MoMo và quét mã QR bên dưới để thanh toán.',
    showQr: true,
  },
  vnpay: {
    title: 'Thanh toán qua VNPay',
    note: 'Quét VNPay QR bằng app ngân hàng bất kỳ để thanh toán.',
    showQr: true,
  },
  card: {
    title: 'Cổng thanh toán thẻ',
    note: 'Kết nối cổng bảo mật. Hỗ trợ thẻ NAPAS, Visa, Mastercard và JCB.',
    showQr: false,
  },
};

/**
 * Cổng thanh toán mô phỏng cho các phương thức trực tuyến (ví, MoMo, VNPay, thẻ).
 * Luồng: xác nhận → đang xử lý → thành công → báo về cho luồng đặt lịch.
 * Đây là bản demo — không có giao dịch thật.
 */
export function BookingPaymentGateway({
  method,
  amount,
  qrPayload,
  onSuccess,
  onCancel,
}: {
  method: PaymentMethod;
  amount: number;
  qrPayload: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [phase, setPhase] = useState<Phase>('confirm');
  const onSuccessRef = useRef(onSuccess);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (phase === 'processing') {
      const timer = setTimeout(() => setPhase('success'), 1700);
      return () => clearTimeout(timer);
    }
    if (phase === 'success') {
      const timer = setTimeout(() => onSuccessRef.current(), 1100);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const info = GATEWAY[method] ?? GATEWAY.card;

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        // Chỉ cho đóng (huỷ) khi chưa bắt đầu xử lý.
        if (!open && phase === 'confirm') onCancel();
      }}
    >
      <DialogContent size="sm" className="text-center">
        {phase === 'confirm' ? (
          <div>
            <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[var(--color-muted-surface)] text-[var(--color-accent)]">
              {method === 'wallet' ? (
                <Wallet className="size-6" aria-hidden />
              ) : method === 'card' ? (
                <CreditCard className="size-6" aria-hidden />
              ) : (
                <ShieldCheck className="size-6" aria-hidden />
              )}
            </span>
            <h2 className="text-xl">{info.title}</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{info.note}</p>

            <p className="mt-5 text-xs tracking-widest text-[var(--color-muted)] uppercase">Số tiền cần trả</p>
            <p className="font-[family-name:var(--font-display)] text-3xl">{formatCurrency(amount)}</p>

            {info.showQr ? (
              <div className="mt-5 flex flex-col items-center gap-2">
                <DemoQrCode payload={qrPayload} size={150} className="border border-[var(--color-border)]" />
                <span className="text-xs text-[var(--color-muted)]">Mã QR minh hoạ cho bản demo</span>
              </div>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
              <Button variant="ghost" onClick={onCancel} className="sm:w-auto">
                Huỷ
              </Button>
              <Button variant="accent" size="lg" onClick={() => setPhase('processing')} className="sm:w-auto">
                Thanh toán {formatCurrency(amount)}
              </Button>
            </div>
            <p className="mt-3 text-xs text-[var(--color-muted)]">
              Bản demo — không có giao dịch thật nào được thực hiện.
            </p>
          </div>
        ) : null}

        {phase === 'processing' ? (
          <div className="py-6">
            <Loader2 className="mx-auto size-10 animate-spin text-[var(--color-accent)]" aria-hidden />
            <h2 className="mt-5 text-xl">Đang xử lý thanh toán…</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Vui lòng không đóng cửa sổ. Đang xác nhận giao dịch {formatCurrency(amount)}.
            </p>
          </div>
        ) : null}

        {phase === 'success' ? (
          <div className="py-6" role="status">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
              <Check className="size-8" strokeWidth={3} aria-hidden />
            </span>
            <h2 className="mt-5 text-xl">Thanh toán thành công</h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Đã nhận {formatCurrency(amount)}. Đang hoàn tất đặt lịch của bạn…
            </p>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
