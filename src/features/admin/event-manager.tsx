'use client';

import { CalendarPlus, Check, EyeOff, Plus, Save, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q),
    );
  }, [query, events]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Field label="Tìm sự kiện" htmlFor="event-search" className="max-w-md flex-1">
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
        <Button variant="accent" onClick={() => setCreating((v) => !v)}>
          {creating ? <X aria-hidden /> : <CalendarPlus aria-hidden />}
          {creating ? 'Đóng' : 'Thêm sự kiện'}
        </Button>
      </div>

      {creating ? <CreateEventForm onDone={() => setCreating(false)} /> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((event) => (
          <EventCard key={event.slug} event={event} />
        ))}
      </div>
    </div>
  );
}

function CreateEventForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    location: '',
    fee: 0,
    capacity: 0,
    startsAtLocal: '',
    featured: false,
    published: true,
  });
  const num = (v: string) => Math.max(0, Math.round(Number(v) || 0));

  const create = async () => {
    if (!form.title.trim()) {
      toast.error('Vui lòng nhập tên sự kiện');
      return;
    }
    if (!form.startsAtLocal) {
      toast.error('Vui lòng chọn thời gian bắt đầu');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      toast.error('Tạo chưa thành công', { description: body?.error });
      return;
    }
    toast.success('Đã thêm sự kiện', {
      description: `Sự kiện "${form.title}" đã tạo và hiển thị trên trang /events.`,
    });
    onDone();
    router.refresh();
  };

  return (
    <div className="rounded-[var(--radius-lg)] border-2 border-[var(--color-accent)] bg-[var(--color-golf-50)] p-5">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
        <Plus className="size-5 text-[var(--color-accent)]" aria-hidden />
        Sự kiện mới
      </h3>

      <div className="space-y-4">
        <Field label="Tên sự kiện" htmlFor="ne-title" required>
          <Input
            id="ne-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Giải giao hữu mùa hè 2026"
          />
        </Field>

        <Field label="Mô tả ngắn" htmlFor="ne-summary">
          <Textarea
            id="ne-summary"
            rows={2}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Địa điểm" htmlFor="ne-loc">
            <Input
              id="ne-loc"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Lotus Golf Center"
            />
          </Field>
          <Field label="Thời gian bắt đầu" htmlFor="ne-start" required>
            <Input
              id="ne-start"
              type="datetime-local"
              value={form.startsAtLocal}
              onChange={(e) => setForm({ ...form, startsAtLocal: e.target.value })}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Phí tham gia (đ)"
            htmlFor="ne-fee"
            helper={form.fee > 0 ? formatCurrency(form.fee) : 'Miễn phí'}
          >
            <Input
              id="ne-fee"
              type="number"
              inputMode="numeric"
              value={String(form.fee)}
              onChange={(e) => setForm({ ...form, fee: num(e.target.value) })}
            />
          </Field>
          <Field label="Số chỗ (sức chứa)" htmlFor="ne-cap">
            <Input
              id="ne-cap"
              type="number"
              inputMode="numeric"
              value={String(form.capacity)}
              onChange={(e) => setForm({ ...form, capacity: num(e.target.value) })}
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleRow
            id="ne-pub"
            label="Hiển thị"
            checked={form.published}
            onChange={(v) => setForm({ ...form, published: v })}
          />
          <ToggleRow
            id="ne-feat"
            label="Nổi bật"
            checked={form.featured}
            onChange={(v) => setForm({ ...form, featured: v })}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3 border-t border-[var(--color-golf-200)] pt-4">
        <Button variant="ghost" onClick={onDone}>
          Huỷ
        </Button>
        <Button variant="accent" onClick={create} loading={saving}>
          <CalendarPlus aria-hidden />
          Tạo sự kiện
        </Button>
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
