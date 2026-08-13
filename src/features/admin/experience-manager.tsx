'use client';

import { Check, EyeOff, Save, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Switch, Textarea } from '@/components/ui/form-fields';
import { formatCurrency } from '@/lib/format';

/** Trùng khớp ExperienceAdminRow ở experienceService (khai báo lại để không import server-only). */
export interface ExperienceRow {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  durationMinutes: number;
  minGuests: number;
  maxGuests: number;
  featured: boolean;
  active: boolean;
}

export function ExperienceManager({ experiences }: { experiences: ExperienceRow[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return experiences;
    return experiences.filter(
      (e) => e.name.toLowerCase().includes(q) || e.tagline.toLowerCase().includes(q),
    );
  }, [query, experiences]);

  return (
    <div className="space-y-6">
      <Field label="Tìm gói trải nghiệm" htmlFor="exp-search" className="max-w-md">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
            aria-hidden
          />
          <Input
            id="exp-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên gói…"
            className="pl-10"
          />
        </div>
      </Field>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((exp) => (
          <ExperienceCard key={exp.slug} experience={exp} />
        ))}
      </div>
    </div>
  );
}

function ExperienceCard({ experience }: { experience: ExperienceRow }) {
  const [saved, setSaved] = useState<ExperienceRow>(experience);
  const [form, setForm] = useState<ExperienceRow>(experience);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const num = (v: string) => Math.max(0, Math.round(Number(v) || 0));

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/experiences', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: form.slug,
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price,
        durationMinutes: form.durationMinutes,
        minGuests: Math.max(1, form.minGuests),
        maxGuests: Math.max(1, form.maxGuests),
        featured: form.featured,
        active: form.active,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error('Lưu chưa thành công', { description: body?.error });
      return;
    }
    toast.success('Đã lưu', {
      description: `Gói "${form.name}" đã cập nhật. Trang /experience hiển thị nội dung mới.`,
    });
    setSaved(form);
  };

  return (
    <div
      className={`flex flex-col rounded-[var(--radius-lg)] border p-5 ${
        form.active
          ? 'border-[var(--color-border)] bg-[var(--color-surface-raised)]'
          : 'border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--color-muted)]">{form.tagline}</p>
        <div className="flex shrink-0 items-center gap-2">
          {form.featured ? (
            <Badge variant="gold" size="sm">
              Nổi bật
            </Badge>
          ) : null}
          {!form.active ? (
            <Badge variant="neutral" size="sm">
              <EyeOff className="size-3" aria-hidden />
              Đang ẩn
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <Field label="Tên gói" htmlFor={`name-${form.slug}`}>
          <Input
            id={`name-${form.slug}`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        <Field label="Mô tả" htmlFor={`desc-${form.slug}`}>
          <Textarea
            id={`desc-${form.slug}`}
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Giá (đ)"
            htmlFor={`price-${form.slug}`}
            helper={form.price > 0 ? formatCurrency(form.price) : 'Miễn phí'}
          >
            <Input
              id={`price-${form.slug}`}
              type="number"
              inputMode="numeric"
              value={String(form.price)}
              onChange={(e) => setForm({ ...form, price: num(e.target.value) })}
            />
          </Field>
          <Field label="Thời lượng (phút)" htmlFor={`dur-${form.slug}`}>
            <Input
              id={`dur-${form.slug}`}
              type="number"
              inputMode="numeric"
              value={String(form.durationMinutes)}
              onChange={(e) => setForm({ ...form, durationMinutes: num(e.target.value) })}
            />
          </Field>
          <Field label="Số khách tối thiểu" htmlFor={`min-${form.slug}`}>
            <Input
              id={`min-${form.slug}`}
              type="number"
              inputMode="numeric"
              value={String(form.minGuests)}
              onChange={(e) => setForm({ ...form, minGuests: num(e.target.value) })}
            />
          </Field>
          <Field label="Số khách tối đa" htmlFor={`max-${form.slug}`}>
            <Input
              id={`max-${form.slug}`}
              type="number"
              inputMode="numeric"
              value={String(form.maxGuests)}
              onChange={(e) => setForm({ ...form, maxGuests: num(e.target.value) })}
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleRow
            id={`act-${form.slug}`}
            label="Hiển thị"
            checked={form.active}
            onChange={(v) => setForm({ ...form, active: v })}
          />
          <ToggleRow
            id={`feat-${form.slug}`}
            label="Nổi bật"
            checked={form.featured}
            onChange={(v) => setForm({ ...form, featured: v })}
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
