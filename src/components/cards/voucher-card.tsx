'use client';

import { BookmarkPlus, Clock3, Gift, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/misc';
import { BLUR_DATA_URL } from '@/constants/media';
import { VOUCHER_CATEGORY_LABELS } from '@/data/vouchers';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { Voucher } from '@/types';

export function VoucherCard({ voucher, className }: { voucher: Voucher; className?: string }) {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const setWalletBalance = useAuthStore((state) => state.setWalletBalance);
  const owned = useAccountStore((state) => state.vouchers);
  const addVoucher = useAccountStore((state) => state.addVoucher);
  const addTransaction = useAccountStore((state) => state.addTransaction);

  const alreadyOwned = hydrated && owned.some((item) => item.voucherId === voucher.id);
  const soldOut = voucher.soldQuantity >= voucher.totalQuantity;
  const remaining = voucher.totalQuantity - voucher.soldQuantity;
  const soldPercent = (voucher.soldQuantity / voucher.totalQuantity) * 100;

  const discountLabel =
    voucher.discountType === 'percent'
      ? `Giảm ${voucher.discountValue}%`
      : `Giảm ${formatCurrency(voucher.discountValue, { compact: true })}`;

  const acquire = (mode: 'buy' | 'save' | 'gift') => {
    if (!user) {
      toast.error('Bạn cần đăng nhập', {
        description: 'Đăng nhập bằng tài khoản demo để lưu voucher vào tài khoản.',
      });
      return;
    }
    if (alreadyOwned) {
      toast.info('Voucher này đã có trong tài khoản của bạn.');
      return;
    }
    if (voucher.memberOnly && user.membershipTier !== 'premium' && user.membershipTier !== 'founder') {
      toast.error('Voucher dành riêng cho hội viên', {
        description: 'Chỉ hội viên Premium và Founder mới sử dụng được voucher này.',
      });
      return;
    }

    if (mode === 'buy' && voucher.price > 0) {
      if (user.walletBalance < voucher.price) {
        toast.error('Số dư ví không đủ', {
          description: `Bạn cần thêm ${formatCurrency(voucher.price - user.walletBalance)}. Hãy nạp ví trước.`,
        });
        return;
      }
      const nextBalance = user.walletBalance - voucher.price;
      setWalletBalance(nextBalance);
      addTransaction({
        type: 'voucher-purchase',
        label: `Mua voucher ${voucher.name}`,
        amount: -voucher.price,
        balanceAfter: nextBalance,
        reference: voucher.code,
      });
    }

    addVoucher({
      voucherId: voucher.id,
      code: voucher.code,
      name: voucher.name,
      category: voucher.category,
      faceValue: voucher.faceValue,
      discountLabel,
      expiresAt: voucher.expiresAt,
      status: 'active',
    });

    toast.success(
      mode === 'gift' ? 'Đã thêm voucher quà tặng' : mode === 'save' ? 'Đã lưu voucher' : 'Mua voucher thành công',
      {
        description:
          mode === 'gift'
            ? 'Vào Dashboard → Voucher để chuyển tặng cho người khác (tính năng demo).'
            : 'Voucher đã xuất hiện trong Dashboard → Voucher của bạn.',
      },
    );
  };

  return (
    <article
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-all duration-300 hover:shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-muted-surface)]">
        <Image
          src={voucher.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-navy-950)]/60 to-transparent" aria-hidden />
        <div className="absolute inset-4 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="glass" size="sm">
              {VOUCHER_CATEGORY_LABELS[voucher.category]}
            </Badge>
            {voucher.hot ? (
              <Badge variant="gold" size="sm">
                Đang hot
              </Badge>
            ) : null}
          </div>
          <p className="font-[family-name:var(--font-display)] text-2xl text-white">{discountLabel}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base leading-snug font-medium">{voucher.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-[var(--color-muted)]">{voucher.description}</p>

        <dl className="mt-4 space-y-1.5 text-xs">
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--color-muted)]">Giá trị</dt>
            <dd className="font-medium">{formatCurrency(voucher.faceValue)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-[var(--color-muted)]">Đơn tối thiểu</dt>
            <dd className="font-medium">{formatCurrency(voucher.minOrder)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="inline-flex items-center gap-1.5 text-[var(--color-muted)]">
              <Clock3 className="size-3.5" aria-hidden />
              Hạn dùng
            </dt>
            <dd className="font-medium">{formatDate(voucher.expiresAt)}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--color-muted)]">
            <span>Đã phát {voucher.soldQuantity}</span>
            <span className={cn(remaining <= voucher.totalQuantity * 0.2 && 'font-medium text-[var(--color-warning)]')}>
              {soldOut ? 'Đã hết' : `Còn ${remaining}`}
            </span>
          </div>
          <ProgressBar
            value={soldPercent}
            tone={soldPercent >= 80 ? 'gold' : 'accent'}
            label={`Đã phát ${voucher.soldQuantity} trên ${voucher.totalQuantity}`}
          />
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-xs text-[var(--color-muted)]">Giá mua</span>
            <span className="font-[family-name:var(--font-display)] text-lg">
              {voucher.price === 0 ? 'Miễn phí' : formatCurrency(voucher.price)}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="accent"
              size="sm"
              className="flex-1"
              disabled={soldOut || alreadyOwned}
              onClick={() => acquire(voucher.price === 0 ? 'save' : 'buy')}
            >
              {voucher.price === 0 ? <BookmarkPlus aria-hidden /> : <ShoppingCart aria-hidden />}
              {alreadyOwned ? 'Đã có' : voucher.price === 0 ? 'Lưu voucher' : 'Mua ngay'}
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={`Tặng voucher ${voucher.name}`}
              disabled={soldOut || alreadyOwned}
              onClick={() => acquire('gift')}
            >
              <Gift aria-hidden />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
