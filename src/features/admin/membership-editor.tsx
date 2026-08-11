'use client';

import { Check, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Switch } from '@/components/ui/form-fields';
import { formatCurrency } from '@/lib/format';

export interface MembershipRow {
  key: string;
  name: string;
  tagline: string;
  price: number;
  bonusPercent: number;
  courtDiscountPercent: number;
  coachDiscountPercent: number;
  fnbDiscountPercent: number;
  isFeatured: boolean;
}

export function MembershipEditor({ plans }: { plans: MembershipRow[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {plans.map((plan) => (
        <PlanCard key={plan.key} plan={plan} />
      ))}
    </div>
  );
}

function PlanCard({ plan }: { plan: MembershipRow }) {
  const [saved, setSaved] = useState<MembershipRow>(plan);
  const [form, setForm] = useState<MembershipRow>(plan);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const num = (v: string) => Math.max(0, Math.round(Number(v) || 0));

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/memberships', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: form.key,
        name: form.name.trim(),
        tagline: form.tagline.trim(),
        price: form.price,
        bonusPercent: form.bonusPercent,
        courtDiscountPercent: form.courtDiscountPercent,
        coachDiscountPercent: form.coachDiscountPercent,
        fnbDiscountPercent: form.fnbDiscountPercent,
        isFeatured: form.isFeatured,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error('Lưu chưa thành công', { description: body?.error });
      return;
    }
    toast.success('Đã lưu', {
      description: `Gói "${form.name}" đã cập nhật. Trang /membership hiển thị giá mới.`,
    });
    setSaved(form);
  };

  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest text-[var(--color-muted)] uppercase">{form.key}</p>
          <p className="font-[family-name:var(--font-display)] text-xl text-[var(--color-accent)]">
            {formatCurrency(form.price)}
          </p>
        </div>
        {form.isFeatured ? (
          <Badge variant="gold" size="sm">
            Nổi bật
          </Badge>
        ) : null}
      </div>

      <div className="space-y-4">
        <Field label="Tên gói" htmlFor={`name-${plan.key}`}>
          <Input
            id={`name-${plan.key}`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        <Field label="Mô tả ngắn" htmlFor={`tagline-${plan.key}`}>
          <Input
            id={`tagline-${plan.key}`}
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
          />
        </Field>

        <Field label="Giá / Số dư Top-up (VND)" htmlFor={`price-${plan.key}`}>
          <Input
            id={`price-${plan.key}`}
            type="number"
            inputMode="numeric"
            value={String(form.price)}
            onChange={(e) => setForm({ ...form, price: num(e.target.value) })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Bonus nạp (%)" htmlFor={`bonus-${plan.key}`}>
            <Input
              id={`bonus-${plan.key}`}
              type="number"
              inputMode="numeric"
              value={String(form.bonusPercent)}
              onChange={(e) => setForm({ ...form, bonusPercent: num(e.target.value) })}
            />
          </Field>
          <Field label="Ưu đãi sân (%)" htmlFor={`court-${plan.key}`}>
            <Input
              id={`court-${plan.key}`}
              type="number"
              inputMode="numeric"
              value={String(form.courtDiscountPercent)}
              onChange={(e) => setForm({ ...form, courtDiscountPercent: num(e.target.value) })}
            />
          </Field>
          <Field label="Ưu đãi HLV (%)" htmlFor={`coach-${plan.key}`}>
            <Input
              id={`coach-${plan.key}`}
              type="number"
              inputMode="numeric"
              value={String(form.coachDiscountPercent)}
              onChange={(e) => setForm({ ...form, coachDiscountPercent: num(e.target.value) })}
            />
          </Field>
          <Field label="Ưu đãi F&B (%)" htmlFor={`fnb-${plan.key}`}>
            <Input
              id={`fnb-${plan.key}`}
              type="number"
              inputMode="numeric"
              value={String(form.fnbDiscountPercent)}
              onChange={(e) => setForm({ ...form, fnbDiscountPercent: num(e.target.value) })}
            />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3">
          <Label htmlFor={`featured-${plan.key}`} className="font-normal">
            Đánh dấu gói nổi bật
          </Label>
          <Switch
            id={`featured-${plan.key}`}
            checked={form.isFeatured}
            onCheckedChange={(checked) => setForm({ ...form, isFeatured: checked })}
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
