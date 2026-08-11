'use client';

import { Check, EyeOff, Save, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Switch, Textarea } from '@/components/ui/form-fields';
import { formatCurrency } from '@/lib/format';

/** Trùng khớp VoucherAdminRow ở voucherService (khai báo lại để không import server-only). */
export interface VoucherRow {
  code: string;
  name: string;
  description: string;
  categoryLabel: string;
  discountType: 'percent' | 'amount';
  discountValue: number;
  minOrder: number;
  maxDiscount: number | null;
  expiresAt: string;
  memberOnly: boolean;
  hot: boolean;
  visible: boolean;
}

export function VoucherManager({ vouchers }: { vouchers: VoucherRow[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vouchers;
    return vouchers.filter(
      (v) => v.name.toLowerCase().includes(q) || v.code.toLowerCase().includes(q),
    );
  }, [query, vouchers]);

  return (
    <div className="space-y-6">
      <Field label="Tìm voucher" htmlFor="voucher-search" className="max-w-md">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
            aria-hidden
          />
          <Input
            id="voucher-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên hoặc mã voucher…"
            className="pl-10"
          />
        </div>
      </Field>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((voucher) => (
          <VoucherCard key={voucher.code} voucher={voucher} />
        ))}
      </div>
    </div>
  );
}

function VoucherCard({ voucher }: { voucher: VoucherRow }) {
  const [saved, setSaved] = useState<VoucherRow>(voucher);
  const [form, setForm] = useState<VoucherRow>(voucher);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const num = (v: string) => Math.max(0, Math.round(Number(v) || 0));
  const unit = form.discountType === 'percent' ? '%' : 'đ';

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/vouchers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: form.code,
        name: form.name.trim(),
        description: form.description.trim(),
        discountValue: form.discountValue,
        minOrder: form.minOrder,
        maxDiscount: form.maxDiscount,
        expiresAt: form.expiresAt,
        memberOnly: form.memberOnly,
        hot: form.hot,
        visible: form.visible,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error('Lưu chưa thành công', { description: body?.error });
      return;
    }
    toast.success('Đã lưu', {
      description: `Voucher "${form.name}" đã cập nhật. Trang /vouchers hiển thị nội dung mới.`,
    });
    setSaved(form);
  };

  return (
    <div
      className={`flex flex-col rounded-[var(--radius-lg)] border p-5 ${
        form.visible
          ? 'border-[var(--color-border)] bg-[var(--color-surface-raised)]'
          : 'border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-xs tracking-widest text-[var(--color-muted)] uppercase">
            {form.code}
          </p>
          <p className="text-xs text-[var(--color-muted)]">{form.categoryLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {form.hot ? (
            <Badge variant="gold" size="sm">
              Hot
            </Badge>
          ) : null}
          {!form.visible ? (
            <Badge variant="neutral" size="sm">
              <EyeOff className="size-3" aria-hidden />
              Đang ẩn
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <Field label="Tên voucher" htmlFor={`name-${form.code}`}>
          <Input
            id={`name-${form.code}`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        <Field label="Mô tả" htmlFor={`desc-${form.code}`}>
          <Textarea
            id={`desc-${form.code}`}
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label={`Giá trị giảm (${unit})`} htmlFor={`disc-${form.code}`}>
            <Input
              id={`disc-${form.code}`}
              type="number"
              inputMode="numeric"
              value={String(form.discountValue)}
              onChange={(e) => setForm({ ...form, discountValue: num(e.target.value) })}
            />
          </Field>
          <Field
            label="Đơn tối thiểu (đ)"
            htmlFor={`min-${form.code}`}
            helper={form.minOrder > 0 ? formatCurrency(form.minOrder) : 'Không yêu cầu'}
          >
            <Input
              id={`min-${form.code}`}
              type="number"
              inputMode="numeric"
              value={String(form.minOrder)}
              onChange={(e) => setForm({ ...form, minOrder: num(e.target.value) })}
            />
          </Field>
        </div>

        <Field label="Hạn dùng đến" htmlFor={`exp-${form.code}`}>
          <Input
            id={`exp-${form.code}`}
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
          />
        </Field>

        <div className="grid gap-3 sm:grid-cols-3">
          <ToggleRow
            id={`vis-${form.code}`}
            label="Hiển thị"
            checked={form.visible}
            onChange={(v) => setForm({ ...form, visible: v })}
          />
          <ToggleRow
            id={`hot-${form.code}`}
            label="Đang hot"
            checked={form.hot}
            onChange={(v) => setForm({ ...form, hot: v })}
          />
          <ToggleRow
            id={`mem-${form.code}`}
            label="Hội viên"
            checked={form.memberOnly}
            onChange={(v) => setForm({ ...form, memberOnly: v })}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-4">
        {dirty ? <span className="text-xs text-[var(--color-warning)]">Có thay đổi chưa lưu</span> : null}
        <Button variant="accent" onClick={save} loading={saving} disabled={!dirty}>
          {dirty ? <Save aria-hidden /> : <Check aria-hidden />}
          Lưu
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2">
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
