'use client';

import { Gift, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/disclosure';
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
import { VOUCHER_CATEGORY_LABELS } from '@/data/vouchers';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDate } from '@/lib/format';
import { useAccountStore } from '@/store/useAccountStore';
import type { OwnedVoucher, OwnedVoucherStatus } from '@/types';

const TABS: { value: OwnedVoucherStatus; label: string }[] = [
  { value: 'active', label: 'Đang dùng được' },
  { value: 'used', label: 'Đã sử dụng' },
  { value: 'expired', label: 'Hết hạn' },
  { value: 'gifted', label: 'Đã tặng' },
];

export function VouchersManager() {
  const hydrated = useHydrated();
  const vouchers = useAccountStore((state) => state.vouchers);
  const giftVoucher = useAccountStore((state) => state.giftVoucher);

  const [gifting, setGifting] = useState<OwnedVoucher | null>(null);
  const [recipient, setRecipient] = useState('');

  if (!hydrated) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const confirmGift = () => {
    if (!gifting) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient.trim())) {
      toast.error('Email chưa hợp lệ', { description: 'Nhập email của người bạn muốn tặng voucher.' });
      return;
    }
    giftVoucher(gifting.id, recipient.trim());
    toast.success('Đã chuyển tặng voucher', {
      description: `${gifting.code} đã được chuyển tới ${recipient.trim()} (tính năng demo).`,
    });
    setGifting(null);
    setRecipient('');
  };

  return (
    <div>
      <PortalHeader
        title="Voucher của tôi"
        description="Voucher đang có sẽ tự động xuất hiện ở bước thanh toán khi bạn đặt lịch."
        action={
          <Button asChild variant="accent">
            <Link href="/vouchers">Xem thêm ưu đãi</Link>
          </Button>
        }
      />

      <Tabs defaultValue="active">
        <TabsList className="self-start">
          {TABS.map((tab) => {
            const count = vouchers.filter((voucher) => voucher.status === tab.value).length;
            return (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label} ({count})
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((tab) => {
          const items = vouchers.filter((voucher) => voucher.status === tab.value);

          return (
            <TabsContent key={tab.value} value={tab.value}>
              {items.length === 0 ? (
                <EmptyState
                  title={`Không có voucher ${tab.label.toLowerCase()}`}
                  description={
                    tab.value === 'active'
                      ? 'Lưu hoặc mua voucher từ trang ưu đãi để dùng khi đặt lịch.'
                      : 'Các voucher thuộc trạng thái này sẽ hiển thị ở đây.'
                  }
                  icon={Ticket}
                  action={
                    tab.value === 'active' ? (
                      <Button asChild variant="accent">
                        <Link href="/vouchers">Xem kho voucher</Link>
                      </Button>
                    ) : undefined
                  }
                />
              ) : (
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.map((voucher) => (
                    <li
                      key={voucher.id}
                      className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-[var(--color-golf-50)] text-[var(--color-accent)]">
                          <Ticket className="size-4" aria-hidden />
                        </span>
                        <Badge variant="neutral" size="sm">
                          {VOUCHER_CATEGORY_LABELS[voucher.category]}
                        </Badge>
                      </div>

                      <h3 className="text-base leading-snug">{voucher.name}</h3>
                      <p className="mt-1.5 font-mono text-sm text-[var(--color-muted)]">{voucher.code}</p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                        <span className="font-medium text-[var(--color-accent)]">{voucher.discountLabel}</span>
                        <span className="text-[var(--color-muted)]">
                          Giá trị {formatCurrency(voucher.faceValue, { compact: true })}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-[var(--color-muted)]">
                        {voucher.status === 'gifted' && voucher.giftedTo
                          ? `Đã tặng cho ${voucher.giftedTo}`
                          : `Hạn dùng đến ${formatDate(voucher.expiresAt)}`}
                      </p>

                      {voucher.status === 'active' ? (
                        <div className="mt-auto flex gap-2 pt-4">
                          <Button asChild variant="accent" size="sm" className="flex-1">
                            <Link href="/booking">Dùng ngay</Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setGifting(voucher)}
                          >
                            <Gift aria-hidden />
                            Tặng
                          </Button>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Modal chuyển tặng */}
      <Dialog
        open={gifting !== null}
        onOpenChange={(open) => {
          if (!open) {
            setGifting(null);
            setRecipient('');
          }
        }}
      >
        <DialogContent size="sm">
          {gifting ? (
            <>
              <DialogHeader>
                <DialogTitle>Chuyển tặng voucher</DialogTitle>
                <DialogDescription>
                  Nhập email tài khoản Lotus của người nhận. Sau khi tặng, voucher sẽ không còn dùng được
                  trong tài khoản của bạn.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] p-4">
                <p className="text-sm font-medium">{gifting.name}</p>
                <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">{gifting.code}</p>
                <p className="mt-1.5 text-sm text-[var(--color-accent)]">{gifting.discountLabel}</p>
              </div>

              <Field
                label="Email người nhận"
                htmlFor="gift-recipient"
                required
                className="mt-4"
                helper="Người nhận cần có tài khoản Lotus với email này."
              >
                <Input
                  id="gift-recipient"
                  type="email"
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  placeholder="nguoi-nhan@email.com"
                />
              </Field>

              <p className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-champagne-50)] p-3 text-xs leading-relaxed text-[var(--color-champagne-800)]">
                Đây là tính năng demo phục vụ trình diễn giao diện. Lotus không vận hành thị trường mua bán
                lại voucher bằng tiền mặt.
              </p>

              <DialogFooter>
                <Button variant="ghost" onClick={() => setGifting(null)}>
                  Huỷ
                </Button>
                <Button variant="accent" onClick={confirmGift}>
                  Xác nhận tặng
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
