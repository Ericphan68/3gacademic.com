'use client';

import { Check, EyeOff, Save, Search, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Switch, Textarea } from '@/components/ui/form-fields';
import { formatCurrency } from '@/lib/format';

/** Trùng khớp CoachAdminRow ở coachService (khai báo lại để không import server-only). */
export interface CoachRow {
  slug: string;
  name: string;
  title: string;
  bio: string;
  yearsExperience: number;
  pricePerSession: number;
  rating: number;
  featured: boolean;
  active: boolean;
}

export function CoachManager({ coaches }: { coaches: CoachRow[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coaches;
    return coaches.filter(
      (c) => c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
    );
  }, [query, coaches]);

  return (
    <div className="space-y-6">
      <Field label="Tìm huấn luyện viên" htmlFor="coach-search" className="max-w-md">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
            aria-hidden
          />
          <Input
            id="coach-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên hoặc chức danh…"
            className="pl-10"
          />
        </div>
      </Field>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((coach) => (
          <CoachCard key={coach.slug} coach={coach} />
        ))}
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: CoachRow }) {
  const [saved, setSaved] = useState<CoachRow>(coach);
  const [form, setForm] = useState<CoachRow>(coach);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const num = (v: string) => Math.max(0, Math.round(Number(v) || 0));

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/coaches', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: form.slug,
        name: form.name.trim(),
        title: form.title.trim(),
        bio: form.bio.trim(),
        yearsExperience: form.yearsExperience,
        pricePerSession: form.pricePerSession,
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
      description: `HLV "${form.name}" đã cập nhật. Trang /coaches hiển thị nội dung mới.`,
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
        <span className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)]">
          <Star className="size-3.5 text-[var(--color-accent)]" aria-hidden />
          {form.rating.toFixed(1)}
        </span>
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
        <Field label="Tên huấn luyện viên" htmlFor={`name-${form.slug}`}>
          <Input
            id={`name-${form.slug}`}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>

        <Field label="Chức danh" htmlFor={`title-${form.slug}`}>
          <Input
            id={`title-${form.slug}`}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>

        <Field label="Giới thiệu" htmlFor={`bio-${form.slug}`}>
          <Textarea
            id={`bio-${form.slug}`}
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Số năm kinh nghiệm" htmlFor={`yrs-${form.slug}`}>
            <Input
              id={`yrs-${form.slug}`}
              type="number"
              inputMode="numeric"
              value={String(form.yearsExperience)}
              onChange={(e) => setForm({ ...form, yearsExperience: num(e.target.value) })}
            />
          </Field>
          <Field
            label="Học phí / buổi (đ)"
            htmlFor={`price-${form.slug}`}
            helper={form.pricePerSession > 0 ? formatCurrency(form.pricePerSession) : '—'}
          >
            <Input
              id={`price-${form.slug}`}
              type="number"
              inputMode="numeric"
              value={String(form.pricePerSession)}
              onChange={(e) => setForm({ ...form, pricePerSession: num(e.target.value) })}
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
