'use client';

import { BadgeDollarSign, Clock, FileText, Wallet } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/disclosure';
import { COACH_COMMISSIONS, COACH_PORTAL_METRICS, COMMISSION_POLICY } from '@/data/coach-portal';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDate } from '@/lib/format';
import type { CommissionRecord } from '@/types';

const SOURCE_LABELS: Record<CommissionRecord['source'], string> = {
  lesson: 'Buổi học',
  referral: 'Giới thiệu',
  package: 'Gói học',
  event: 'Sự kiện',
};

export function CommissionPanel() {
  const hydrated = useHydrated();
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all');

  const metrics = COACH_PORTAL_METRICS;

  const confirmed = COACH_COMMISSIONS.filter((row) => row.status === 'confirmed');
  const pending = COACH_COMMISSIONS.filter((row) => row.status === 'pending');
  const totalConfirmed = confirmed.reduce((sum, row) => sum + row.commissionAmount, 0);
  const totalPending = pending.reduce((sum, row) => sum + row.commissionAmount, 0);

  const rows =
    filter === 'all' ? COACH_COMMISSIONS : filter === 'confirmed' ? confirmed : pending;

  return (
    <div>
      <PortalHeader
        title="Hoa hồng"
        description="Theo dõi hoa hồng theo từng nguồn thu, trạng thái xác nhận và lịch sử giao dịch."
      />

      {/* Chỉ số */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-lg)] bg-[var(--color-navy-800)] p-5 text-[var(--color-champagne-50)]">
          <div className="flex items-center gap-2 text-sm text-[var(--color-navy-200)]">
            <Wallet className="size-4" aria-hidden />
            Tổng hoa hồng tháng này
          </div>
          <p className="mt-2 font-[family-name:var(--font-display)] text-3xl text-white">
            {formatCurrency(metrics.commissionThisMonth, { compact: true })}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-5">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <BadgeDollarSign className="size-4" aria-hidden />
            Đã xác nhận
          </div>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">
            {formatCurrency(totalConfirmed, { compact: true })}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">{confirmed.length} giao dịch</p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-5">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Clock className="size-4" aria-hidden />
            Chờ xử lý
          </div>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">
            {formatCurrency(totalPending, { compact: true })}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">{pending.length} giao dịch</p>
        </div>
      </div>

      {/* Biểu đồ */}
      <section className="mt-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
        <h2 className="mb-1 text-lg">Doanh thu và hoa hồng 6 tháng gần nhất</h2>
        <p className="mb-6 text-sm text-[var(--color-muted)]">
          Số liệu demo dùng để trình diễn giao diện báo cáo.
        </p>

        <div className="h-72 w-full">
          {hydrated ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.monthlySeries} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'var(--color-muted)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value: number) => `${Math.round(value / 1_000_000)}tr`}
                  width={44}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(Number(value)),
                    name === 'revenue' ? 'Doanh thu' : 'Hoa hồng',
                  ]}
                  labelFormatter={(label) => `Tháng ${String(label).replace('T', '')}`}
                  contentStyle={{
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)',
                    background: 'var(--color-surface-raised)',
                    fontSize: 13,
                  }}
                />
                <Legend
                  formatter={(value: string) => (value === 'revenue' ? 'Doanh thu' : 'Hoa hồng')}
                  wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
                />
                <Bar dataKey="revenue" fill="var(--color-navy-400)" radius={[4, 4, 0, 0]} maxBarSize={36} />
                <Bar dataKey="commission" fill="var(--color-golf-400)" radius={[4, 4, 0, 0]} maxBarSize={36} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="animate-shimmer size-full rounded-[var(--radius-md)]" />
          )}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Lịch sử giao dịch */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
          <h2 className="mb-4 text-lg">Lịch sử giao dịch</h2>

          <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
            <TabsList className="self-start">
              <TabsTrigger value="all">Tất cả ({COACH_COMMISSIONS.length})</TabsTrigger>
              <TabsTrigger value="confirmed">Đã xác nhận ({confirmed.length})</TabsTrigger>
              <TabsTrigger value="pending">Chờ xử lý ({pending.length})</TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="!mt-5">
              <ul className="divide-y divide-[var(--color-border)]">
                {rows.map((row) => (
                  <li key={row.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{row.label}</p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                        {formatDate(row.date)} · {SOURCE_LABELS[row.source]} · Giá trị{' '}
                        {formatCurrency(row.grossAmount)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium tabular-nums">
                        {formatCurrency(row.commissionAmount)}
                      </p>
                      <Badge
                        variant={row.status === 'confirmed' ? 'success' : 'warning'}
                        size="sm"
                        className="mt-1"
                      >
                        {row.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ xử lý'}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </section>

        {/* Chính sách */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="size-4 text-[var(--color-accent)]" aria-hidden />
            <h2 className="text-lg">Chính sách hoa hồng</h2>
            <Badge variant="neutral" size="sm" className="ml-auto">
              Demo
            </Badge>
          </div>

          <ul className="space-y-4">
            {COMMISSION_POLICY.map((policy) => (
              <li key={policy.title} className="border-b border-[var(--color-border)] pb-4 last:border-0 last:pb-0">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-medium">{policy.title}</p>
                  <span className="font-[family-name:var(--font-display)] text-lg text-[var(--color-accent)]">
                    {policy.rate}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">{policy.detail}</p>
              </li>
            ))}
          </ul>

          <p className="mt-5 rounded-[var(--radius-md)] bg-[var(--color-surface)] p-4 text-xs leading-relaxed text-[var(--color-muted)]">
            Đây là bảng tỷ lệ minh hoạ cho bản demo. Tỷ lệ chính thức được thống nhất trong hợp đồng giữa
            Lotus và từng huấn luyện viên.
          </p>
        </section>
      </div>
    </div>
  );
}
