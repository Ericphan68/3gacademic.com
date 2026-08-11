'use client';

import { Gift, Ticket } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { VoucherCard } from '@/components/cards/voucher-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/disclosure';
import { EmptyState } from '@/components/ui/states';
import { VOUCHER_CATEGORY_LABELS, VOUCHER_CATEGORY_ORDER } from '@/data/vouchers';
import { useHydrated } from '@/hooks/useHydrated';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { voucherCatalogService } from '@/services/catalogService';
import { useAccountStore } from '@/store/useAccountStore';
import type { Voucher, VoucherCategory } from '@/types';

const TABS = [
  { value: 'all', label: 'Tất cả' },
  { value: 'hot', label: 'Đang hot' },
  { value: 'ending', label: 'Sắp hết' },
  { value: 'member', label: 'Dành cho hội viên' },
  { value: 'mine', label: 'Voucher của tôi' },
] as const;

type TabValue = (typeof TABS)[number]['value'];

export function VoucherExplorer({ catalog }: { catalog?: Voucher[] }) {
  const hydrated = useHydrated();
  const [tab, setTab] = useState<TabValue>('all');
  const [category, setCategory] = useState<VoucherCategory | 'all'>('all');
  const owned = useAccountStore((state) => state.vouchers);

  const vouchers = useMemo(() => {
    const activeTab = tab === 'mine' ? 'all' : tab;
    // Không có dữ liệu từ server → dùng mock (giữ tương thích ngược).
    if (!catalog) return voucherCatalogService.filter({ category, tab: activeTab });
    return catalog.filter((voucher) => {
      if (category !== 'all' && voucher.category !== category) return false;
      if (activeTab === 'hot' && !voucher.hot) return false;
      if (activeTab === 'ending' && voucher.soldQuantity / voucher.totalQuantity < 0.8) return false;
      if (activeTab === 'member' && !voucher.memberOnly) return false;
      return true;
    });
  }, [category, tab, catalog]);

  return (
    <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)}>
      <div className="flex flex-col gap-5">
        <TabsList className="self-start">
          {TABS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tab !== 'mine' ? (
          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
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
              Tất cả nhóm
            </button>
            {VOUCHER_CATEGORY_ORDER.map((key) => (
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
                {VOUCHER_CATEGORY_LABELS[key]}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {TABS.filter((item) => item.value !== 'mine').map((item) => (
        <TabsContent key={item.value} value={item.value}>
          {vouchers.length === 0 ? (
            <EmptyState
              title="Chưa có voucher trong nhóm này"
              description="Thử chọn nhóm khác hoặc xem tất cả voucher đang mở."
              icon={Ticket}
              action={
                <Button variant="outline" onClick={() => setCategory('all')}>
                  Xem tất cả voucher
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {vouchers.map((voucher) => (
                <VoucherCard key={voucher.id} voucher={voucher} />
              ))}
            </div>
          )}
        </TabsContent>
      ))}

      <TabsContent value="mine">
        {!hydrated ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <div key={index} className="animate-shimmer h-56 rounded-[var(--radius-lg)]" />
            ))}
          </div>
        ) : owned.length === 0 ? (
          <EmptyState
            title="Bạn chưa có voucher nào"
            description="Đăng nhập bằng tài khoản demo rồi lưu hoặc mua voucher — chúng sẽ xuất hiện ở đây và tự động áp dụng khi đặt lịch."
            icon={Gift}
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="accent">
                  <Link href="/login">Đăng nhập tài khoản demo</Link>
                </Button>
                <Button variant="outline" onClick={() => setTab('all')}>
                  Xem voucher đang mở
                </Button>
              </div>
            }
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {owned.map((voucher) => (
              <li
                key={voucher.id}
                className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <Ticket className="size-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
                  <Badge
                    variant={
                      voucher.status === 'active'
                        ? 'success'
                        : voucher.status === 'used'
                          ? 'neutral'
                          : voucher.status === 'gifted'
                            ? 'info'
                            : 'danger'
                    }
                    size="sm"
                  >
                    {voucher.status === 'active'
                      ? 'Đang dùng được'
                      : voucher.status === 'used'
                        ? 'Đã sử dụng'
                        : voucher.status === 'gifted'
                          ? 'Đã tặng'
                          : 'Hết hạn'}
                  </Badge>
                </div>

                <p className="text-base font-medium">{voucher.name}</p>
                <p className="mt-1 font-mono text-sm text-[var(--color-muted)]">{voucher.code}</p>
                <p className="mt-2 text-sm text-[var(--color-accent)]">{voucher.discountLabel}</p>
                <p className="mt-auto pt-4 text-xs text-[var(--color-muted)]">
                  Hạn dùng đến {formatDate(voucher.expiresAt)}
                </p>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/dashboard/vouchers">Quản lý voucher trong tài khoản</Link>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
