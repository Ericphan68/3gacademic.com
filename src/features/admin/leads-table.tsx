'use client';

import { Check, ReceiptText, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/disclosure';
import { EmptyState } from '@/components/ui/states';

export interface LeadRow {
  id: string;
  type: string;
  summary: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  handled: boolean;
  createdAt: string;
}

const TYPE_LABEL: Record<string, string> = {
  contact: 'Liên hệ',
  corporate: 'Doanh nghiệp',
  'tour-group': 'Tour đoàn',
  agency: 'Đại lý',
  intro: 'Khách vào web',
};

const FILTERS = [
  { value: 'new', label: 'Chưa xử lý' },
  { value: 'handled', label: 'Đã xử lý' },
  { value: 'all', label: 'Tất cả' },
] as const;

const fmt = (iso: string) => new Date(iso).toLocaleString('vi-VN');

export function LeadsTable({ leads }: { leads: LeadRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (lead: LeadRow) => {
    setBusy(lead.id);
    const res = await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: lead.id, handled: !lead.handled }),
    });
    setBusy(null);
    if (!res.ok) {
      toast.error('Cập nhật chưa thành công');
      return;
    }
    toast.success(lead.handled ? 'Đã chuyển về chưa xử lý' : 'Đã đánh dấu xử lý');
    router.refresh();
  };

  return (
    <Tabs defaultValue="new">
      <TabsList className="self-start">
        {FILTERS.map((f) => {
          const count =
            f.value === 'all'
              ? leads.length
              : leads.filter((l) => (f.value === 'handled' ? l.handled : !l.handled)).length;
          return (
            <TabsTrigger key={f.value} value={f.value}>
              {f.label} ({count})
            </TabsTrigger>
          );
        })}
      </TabsList>

      {FILTERS.map((f) => {
        const rows =
          f.value === 'all'
            ? leads
            : leads.filter((l) => (f.value === 'handled' ? l.handled : !l.handled));
        return (
          <TabsContent key={f.value} value={f.value}>
            {rows.length === 0 ? (
              <EmptyState
                title="Chưa có yêu cầu nào"
                description="Yêu cầu từ form Liên hệ, Doanh nghiệp, Tour và Đại lý sẽ hiển thị tại đây."
                icon={ReceiptText}
              />
            ) : (
              <ul className="space-y-3">
                {rows.map((lead) => (
                  <li
                    key={lead.id}
                    className={`flex flex-wrap items-start justify-between gap-3 rounded-[var(--radius-lg)] border p-4 ${
                      lead.handled
                        ? 'border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-raised)]'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge variant="neutral" size="sm">
                          {TYPE_LABEL[lead.type] ?? lead.type}
                        </Badge>
                        {lead.handled ? (
                          <Badge variant="success" size="sm">
                            Đã xử lý
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-sm font-medium">{lead.summary}</p>
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
                        {[lead.name, lead.phone, lead.email].filter(Boolean).join(' · ') || '—'}
                      </p>
                      <p className="mt-0.5 text-xs text-[var(--color-muted)]">{fmt(lead.createdAt)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      loading={busy === lead.id}
                      onClick={() => toggle(lead)}
                    >
                      {lead.handled ? (
                        <>
                          <RotateCcw aria-hidden />
                          Mở lại
                        </>
                      ) : (
                        <>
                          <Check aria-hidden />
                          Đã xử lý
                        </>
                      )}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
