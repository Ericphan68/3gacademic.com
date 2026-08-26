'use client';

import { Check, Flame, Minus, Plus, Search, ShoppingBag, Trash2, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/form-fields';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/overlays';
import { EmptyState } from '@/components/ui/states';
import { BLUR_DATA_URL } from '@/constants/media';
import { FNB_CATEGORY_LABELS, FNB_CATEGORY_ORDER } from '@/data/fnb';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { spendWalletServer } from '@/lib/wallet-client';
import { fnbService } from '@/services/catalogService';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';
import { cartCount, cartTotal, useCartStore } from '@/store/useCartStore';
import type { FnbCategory, FnbDeliveryTarget } from '@/types';

const DELIVERY_LABELS: Record<FnbDeliveryTarget, { label: string; hint: string }> = {
  bay: { label: 'Giao tại thảm tập', hint: 'Nhân viên mang đến đúng vị trí bay của bạn' },
  lounge: { label: 'Dùng tại Lounge', hint: 'Bàn được giữ sẵn trong khu Lounge' },
  pickup: { label: 'Tự lấy tại quầy', hint: 'Nhận tại quầy F&B, nhanh nhất' },
};

const TIME_OPTIONS = ['Ngay khi sẵn sàng', 'Sau 15 phút', 'Sau 30 phút', 'Sau 45 phút', 'Sau 60 phút'];

export function FnbMenu() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FnbCategory | 'all'>('all');
  const [popularOnly, setPopularOnly] = useState(false);

  const add = useCartStore((state) => state.add);

  const items = useMemo(
    () => fnbService.filter({ category, query, popularOnly }),
    [category, query, popularOnly],
  );

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field label="Tìm món" htmlFor="fnb-search" className="flex-1">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
                aria-hidden
              />
              <Input
                id="fnb-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cà phê, bento, salad…"
                className="pl-10"
              />
            </div>
          </Field>

          <Button
            variant={popularOnly ? 'accent' : 'outline'}
            onClick={() => setPopularOnly((prev) => !prev)}
            aria-pressed={popularOnly}
            className="sm:w-auto"
          >
            <Flame aria-hidden />
            Món được gọi nhiều
          </Button>
        </div>

        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Lọc theo danh mục">
          <button
            type="button"
            onClick={() => setCategory('all')}
            aria-pressed={category === 'all'}
            className={cn(
              'shrink-0 cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors',
              category === 'all'
                ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)] text-[var(--color-accent)]'
                : 'border-[var(--color-border-strong)] hover:border-[var(--color-accent)]',
            )}
          >
            Tất cả
          </button>
          {FNB_CATEGORY_ORDER.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setCategory(key)}
              aria-pressed={category === key}
              className={cn(
                'shrink-0 cursor-pointer rounded-full border px-3.5 py-2 text-sm whitespace-nowrap transition-colors',
                category === key
                  ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)] text-[var(--color-accent)]'
                  : 'border-[var(--color-border-strong)] hover:border-[var(--color-accent)]',
              )}
            >
              {FNB_CATEGORY_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Không tìm thấy món phù hợp"
          description="Thử từ khoá khác hoặc chọn danh mục khác trong menu."
          icon={UtensilsCrossed}
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery('');
                setCategory('all');
                setPopularOnly(false);
              }}
            >
              Xem toàn bộ menu
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
            >
              <div className="relative size-32 shrink-0 bg-[var(--color-muted-surface)] sm:size-36">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="9rem"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base leading-snug">{item.name}</h3>
                  {item.popular ? (
                    <Badge variant="gold" size="sm" className="shrink-0">
                      Hot
                    </Badge>
                  ) : null}
                </div>

                <p className="mt-1 line-clamp-2 text-xs text-[var(--color-muted)]">{item.description}</p>

                <div className="mt-2 flex flex-wrap gap-1">
                  {item.partner ? (
                    <Badge variant="outline" size="sm">
                      {item.partner}
                    </Badge>
                  ) : null}
                  {item.calories !== undefined ? (
                    <Badge variant="neutral" size="sm">
                      {item.calories} kcal
                    </Badge>
                  ) : null}
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                  <span className="font-medium">{formatCurrency(item.price)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      add({ id: item.id, name: item.name, price: item.price, image: item.image });
                      toast.success('Đã thêm vào giỏ', { description: item.name });
                    }}
                  >
                    <Plus aria-hidden />
                    Thêm
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Nút giỏ hàng nổi + drawer thanh toán demo. */
export function FnbCart() {
  const hydrated = useHydrated();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const {
    lines,
    deliveryTarget,
    bayNumber,
    scheduledTime,
    note,
    setQuantity,
    remove,
    clear,
    setDeliveryTarget,
    setBayNumber,
    setScheduledTime,
    setNote,
  } = useCartStore();

  const user = useAuthStore((state) => state.user);
  const setWalletBalance = useAuthStore((state) => state.setWalletBalance);
  const addFnbOrder = useAccountStore((state) => state.addFnbOrder);
  const addTransaction = useAccountStore((state) => state.addTransaction);

  const total = cartTotal(lines);
  const count = cartCount(lines);

  const checkout = async () => {
    if (lines.length === 0) return;

    // Nếu đủ số dư → trừ ví THẬT ở server trước khi tạo đơn; nếu không → trả tại quầy.
    const payByWallet = Boolean(user && total > 0 && user.walletBalance >= total);
    let nextBalance: number | null = null;
    if (payByWallet) {
      try {
        nextBalance = await spendWalletServer(total, 'Đơn F&B Lotus');
      } catch (e) {
        toast.error('Thanh toán ví chưa thành công', { description: e instanceof Error ? e.message : undefined });
        return;
      }
    }

    const order = addFnbOrder({
      items: lines.map((line) => ({
        id: line.id,
        name: line.name,
        quantity: line.quantity,
        price: line.price,
      })),
      total,
      deliveryTarget,
      bayNumber: deliveryTarget === 'bay' ? bayNumber : undefined,
      scheduledTime: scheduledTime || TIME_OPTIONS[0],
      note,
    });

    if (nextBalance !== null) {
      setWalletBalance(nextBalance);
      addTransaction({
        type: 'payment',
        label: `Đơn F&B · ${order.code}`,
        amount: -total,
        balanceAfter: nextBalance,
        reference: order.code,
      });
    }

    clear();
    setDone(order.code);
    toast.success('Đã đặt món thành công', {
      description: `Mã đơn ${order.code}. Xem lại trong tài khoản của bạn.`,
    });
  };

  if (!hydrated) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setDone(null);
      }}
    >
      <SheetTrigger asChild>
        <button
          type="button"
          className="no-print fixed bottom-4 left-4 z-30 flex cursor-pointer items-center gap-3 rounded-full bg-[var(--color-navy-800)] py-3 pr-5 pl-4 text-white shadow-[var(--shadow-lift)] transition-transform hover:scale-105 md:bottom-6 md:left-6"
          aria-label={`Mở giỏ hàng, ${count} món`}
        >
          <span className="relative">
            <ShoppingBag className="size-5" aria-hidden />
            {count > 0 ? (
              <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-[var(--color-champagne-400)] text-[10px] font-semibold text-[var(--color-navy-900)]">
                {count}
              </span>
            ) : null}
          </span>
          <span className="text-sm font-medium">
            {count > 0 ? formatCurrency(total) : 'Giỏ hàng'}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="p-0">
        <div className="border-b border-[var(--color-border)] p-5 pr-14">
          <SheetTitle>Giỏ hàng F&amp;B</SheetTitle>
          <SheetDescription>
            Đặt món giao đến thảm tập hoặc dùng tại Lounge. Đây là luồng demo, không có thanh toán thật.
          </SheetDescription>
        </div>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
              <Check className="size-7" strokeWidth={3} aria-hidden />
            </span>
            <h3 className="text-lg">Đã nhận đơn của bạn</h3>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              Mã đơn <span className="font-mono font-medium text-[var(--color-foreground)]">{done}</span>. Đồ sẽ
              được chuẩn bị và mang đến theo thời gian bạn chọn.
            </p>
            <div className="mt-6 flex w-full flex-col gap-2">
              <Button asChild variant="accent" block>
                <Link href="/dashboard">Xem lịch sử đơn trong tài khoản</Link>
              </Button>
              <Button variant="ghost" block onClick={() => setDone(null)}>
                Đặt thêm món khác
              </Button>
            </div>
          </div>
        ) : lines.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <EmptyState
              title="Giỏ hàng đang trống"
              description="Chọn món từ menu bên trái để thêm vào giỏ."
              icon={ShoppingBag}
              className="border-0"
            />
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[var(--color-border)] overflow-y-auto p-5">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-3 py-4 first:pt-0">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-muted-surface)]">
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      sizes="4rem"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{line.name}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">{formatCurrency(line.price)}</p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-[var(--color-border-strong)] p-0.5">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          aria-label={`Giảm số lượng ${line.name}`}
                          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[var(--color-muted-surface)]"
                        >
                          <Minus className="size-3.5" aria-hidden />
                        </button>
                        <span className="min-w-6 text-center text-sm tabular-nums">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          aria-label={`Tăng số lượng ${line.name}`}
                          className="flex size-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-[var(--color-muted-surface)]"
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(line.id)}
                        aria-label={`Xoá ${line.name} khỏi giỏ`}
                        className="flex size-8 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)] hover:text-[var(--color-danger)]"
                      >
                        <Trash2 className="size-4" aria-hidden />
                      </button>
                    </div>
                  </div>

                  <span className="shrink-0 text-sm font-medium">
                    {formatCurrency(line.price * line.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-[var(--color-border)] p-5">
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Hình thức phục vụ</legend>
                <div className="grid gap-2">
                  {(Object.keys(DELIVERY_LABELS) as FnbDeliveryTarget[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDeliveryTarget(key)}
                      aria-pressed={deliveryTarget === key}
                      className={cn(
                        'cursor-pointer rounded-[var(--radius-md)] border px-4 py-2.5 text-left text-sm transition-colors',
                        deliveryTarget === key
                          ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                          : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                      )}
                    >
                      <span className="block font-medium">{DELIVERY_LABELS[key].label}</span>
                      <span className="mt-0.5 block text-xs text-[var(--color-muted)]">
                        {DELIVERY_LABELS[key].hint}
                      </span>
                    </button>
                  ))}
                </div>
              </fieldset>

              {deliveryTarget === 'bay' ? (
                <Field label="Số thảm tập / bay" htmlFor="cart-bay">
                  <Input
                    id="cart-bay"
                    value={bayNumber}
                    onChange={(event) => setBayNumber(event.target.value)}
                    placeholder="Ví dụ: A12"
                  />
                </Field>
              ) : null}

              <Field label="Thời gian phục vụ" htmlFor="cart-time">
                <Select
                  id="cart-time"
                  value={scheduledTime || TIME_OPTIONS[0]}
                  onChange={(event) => setScheduledTime(event.target.value)}
                >
                  {TIME_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Ghi chú" htmlFor="cart-note">
                <Textarea
                  id="cart-note"
                  rows={2}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Ít đường, không đá, dị ứng…"
                />
              </Field>

              <div className="flex items-baseline justify-between border-t border-[var(--color-border)] pt-3">
                <span className="text-sm text-[var(--color-muted)]">Tổng cộng</span>
                <span className="font-[family-name:var(--font-display)] text-xl">{formatCurrency(total)}</span>
              </div>

              {user ? (
                <p className="text-xs text-[var(--color-muted)]">
                  {user.walletBalance >= total
                    ? `Thanh toán bằng ví Lotus — số dư hiện có ${formatCurrency(user.walletBalance)}.`
                    : 'Số dư ví không đủ, đơn sẽ được thanh toán tại quầy.'}
                </p>
              ) : (
                <p className="text-xs text-[var(--color-muted)]">
                  Đăng nhập để thanh toán bằng ví Lotus và lưu lịch sử đơn hàng.
                </p>
              )}

              <Button variant="accent" size="lg" block onClick={() => void checkout()}>
                Đặt món ({count})
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
