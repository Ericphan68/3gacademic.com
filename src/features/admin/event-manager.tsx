'use client';

import { Check, EyeOff, Save, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Switch, Textarea } from '@/components/ui/form-fields';
import { formatCurrency } from '@/lib/format';

/** Trùng khớp EventAdminRow ở eventService (khai báo lại để không import server-only). */
export interface EventRow {
  slug: string;
  title: string;
  summary: string;
  typeLabel: string;
  location: string;
  fee: number;
  capacity: number;
  startsAtLocal: string;
  featured: boolean;
  published: boolean;
}

export function EventManager({ events }: { events: EventRow[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q),
    );
  }, [query, events]);

  return (
    <div className="space-y-6">
      <Field label="Tìm sự kiện" htmlFor="event-search" className="max-w-md">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
            aria-hidden
          />
          <Input
            id="event-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tên hoặc địa điểm…"
            className="pl-10"
          />
        </div>
      </Field>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: EventRow }) {
  const [saved, setSaved] = useState<EventRow>(event);
  const [form, setForm] = useState<EventRow>(event);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const num = (v: string) => Math.max(0, Math.round(Number(v) || 0));

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/events', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: form.slug,
        title: form.title.trim(),
        summary: form.summary.trim(),
        location: form.location.trim(),
        fee: form.fee,
        capacity: form.capacity,
        startsAtLocal: form.startsAtLocal,
        featured: form.featured,
        published: form.published,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error('Lưu chưa thành công', { description: body?.error });
      return;
    }
    toast.success('Đã lưu', {
      description: `Sự kiện "${form.title}" đã cập nhật. Trang /events hiển thị nội dung mới.`,
    });
    setSaved(form);
  };

  return (
    <div
      className={`flex flex-col rounded-[var(--radius-lg)] border p-5 ${
        form.published
          ? 'border-[var(--color-border)] bg-[var(--color-surface-raised)]'
          : 'border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]'
      }`}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--color-muted)]">{form.typeLabel}</p>
        <div className="flex shrink-0 items-center gap-2">
          {form.featured ? (
            <Badge variant="gold" size="sm">
              Nổi bật
            </Badge>
          ) : null}
          {!form.published ? (
            <Badge variant="neutral" size="sm">
              <EyeOff className="size-3" aria-hidden />
              Đang ẩn
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="space-y-4">
        <Field label="Tên sự kiện" htmlFor={`title-${form.slug}`}>
          <Input
            id={`title-${form.slug}`}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>

        <Field label="Mô tả ngắn" htmlFor={`sum-${form.slug}`}>
          <Textarea
            id={`sum-${form.slug}`}
            rows={2}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </Field>

        <Field label="Thời gian bắt đầu" htmlFor={`start-${form.slug}`}>
          <Input
            id={`start-${form.slug}`}
            type="datetime-local"
            value={form.startsAtLocal}
            onChange={(e) => setForm({ ...form, startsAtLocal: e.target.value })}
          />
        </Field>

        <Field label="Địa điểm" htmlFor={`loc-${form.slug}`}>
          <Input
            id={`loc-${form.slug}`}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Phí tham dự (đ)"
            htmlFor={`fee-${form.slug}`}
            helper={form.fee > 0 ? formatCurrency(form.fee) : 'Miễn phí'}
          >
            <Input
              id={`fee-${form.slug}`}
              type="number"
              inputMode="numeric"
              value={String(form.fee)}
              onChange={(e) => setForm({ ...form, fee: num(e.target.value) })}
            />
          </Field>
          <Field label="Sức chứa (người)" htmlFor={`cap-${form.slug}`}>
            <Input
              id={`cap-${form.slug}`}
              type="number"
              inputMode="numeric"
              value={String(form.capacity)}
              onChange={(e) => setForm({ ...form, capacity: num(e.target.value) })}
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleRow
            id={`pub-${form.slug}`}
            label="Hiển thị"
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
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
