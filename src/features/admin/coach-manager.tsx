'use client';

import { Check, EyeOff, ImagePlus, Plus, Save, Search, Star, UserPlus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Switch, Textarea } from '@/components/ui/form-fields';
import { formatCurrency } from '@/lib/format';
import { uploadAdminImage } from '@/lib/image-upload';

/** Trùng khớp CoachAdminRow ở coachService (khai báo lại để không import server-only). */
export interface CoachRow {
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  yearsExperience: number;
  pricePerSession: number;
  rating: number;
  featured: boolean;
  active: boolean;
  custom: boolean;
}

const num = (v: string) => Math.max(0, Math.round(Number(v) || 0));

/** Ô tải ảnh dùng chung: xem trước + nút tải, tự nén ảnh xuống < 200KB. */
function AvatarUploader({
  value,
  onChange,
  idPrefix,
}: {
  value: string;
  onChange: (url: string) => void;
  idPrefix: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAdminImage(file);
      onChange(url);
      toast.success('Đã tải ảnh');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Tải ảnh thất bại');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Ảnh HLV" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center text-[var(--color-muted)]">
            <ImagePlus className="size-6" aria-hidden />
          </span>
        )}
      </div>
      <div className="min-w-0">
        <input
          ref={inputRef}
          id={`${idPrefix}-avatar`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFile(e.target.files?.[0])}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus aria-hidden />
          {value ? 'Đổi ảnh' : 'Tải ảnh'}
        </Button>
        <p className="mt-1.5 text-xs text-[var(--color-muted)]">
          Khuyến nghị dưới 200KB, tối đa 1MB. Ảnh lớn sẽ tự động được nén nhỏ lại.
        </p>
      </div>
    </div>
  );
}

export function CoachManager({ coaches }: { coaches: CoachRow[] }) {
  const [query, setQuery] = useState('');
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return coaches;
    return coaches.filter(
      (c) => c.name.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
    );
  }, [query, coaches]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <Field label="Tìm huấn luyện viên" htmlFor="coach-search" className="max-w-md flex-1">
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
        <Button variant="accent" onClick={() => setCreating((v) => !v)}>
          {creating ? <X aria-hidden /> : <UserPlus aria-hidden />}
          {creating ? 'Đóng' : 'Thêm HLV mới'}
        </Button>
      </div>

      {creating ? <CreateCoachForm onDone={() => setCreating(false)} /> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((coach) => (
          <CoachCard key={coach.slug} coach={coach} />
        ))}
      </div>
    </div>
  );
}

function CreateCoachForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    avatar: '',
    yearsExperience: 0,
    pricePerSession: 0,
    featured: false,
    active: true,
  });

  const create = async () => {
    if (!form.name.trim() || !form.title.trim()) {
      toast.error('Vui lòng nhập tên và chức danh');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/admin/coaches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name.trim(),
        title: form.title.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar,
        yearsExperience: form.yearsExperience,
        pricePerSession: form.pricePerSession,
        featured: form.featured,
        active: form.active,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error('Tạo chưa thành công', { description: body?.error });
      return;
    }
    toast.success('Đã thêm huấn luyện viên', {
      description: `HLV "${form.name}" đã được tạo và hiển thị trên trang /coaches.`,
    });
    onDone();
    router.refresh();
  };

  return (
    <div className="rounded-[var(--radius-lg)] border-2 border-[var(--color-accent)] bg-[var(--color-golf-50)] p-5">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
        <Plus className="size-5 text-[var(--color-accent)]" aria-hidden />
        Huấn luyện viên mới
      </h3>

      <div className="space-y-4">
        <Field label="Ảnh huấn luyện viên" htmlFor="new-avatar">
          <AvatarUploader
            idPrefix="new"
            value={form.avatar}
            onChange={(url) => setForm({ ...form, avatar: url })}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tên huấn luyện viên" htmlFor="new-name" required>
            <Input
              id="new-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nguyễn Văn A"
            />
          </Field>
          <Field label="Chức danh" htmlFor="new-title" required>
            <Input
              id="new-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Senior Coach · Chuyên gia người mới"
            />
          </Field>
        </div>

        <Field label="Giới thiệu" htmlFor="new-bio">
          <Textarea
            id="new-bio"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Vài dòng giới thiệu về huấn luyện viên…"
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Số năm kinh nghiệm" htmlFor="new-yrs">
            <Input
              id="new-yrs"
              type="number"
              inputMode="numeric"
              value={String(form.yearsExperience)}
              onChange={(e) => setForm({ ...form, yearsExperience: num(e.target.value) })}
            />
          </Field>
          <Field
            label="Học phí / buổi (đ)"
            htmlFor="new-price"
            helper={form.pricePerSession > 0 ? formatCurrency(form.pricePerSession) : '—'}
          >
            <Input
              id="new-price"
              type="number"
              inputMode="numeric"
              value={String(form.pricePerSession)}
              onChange={(e) => setForm({ ...form, pricePerSession: num(e.target.value) })}
            />
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ToggleRow
            id="new-active"
            label="Hiển thị"
            checked={form.active}
            onChange={(v) => setForm({ ...form, active: v })}
          />
          <ToggleRow
            id="new-featured"
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
          <UserPlus aria-hidden />
          Tạo huấn luyện viên
        </Button>
      </div>
    </div>
  );
}

function CoachCard({ coach }: { coach: CoachRow }) {
  const [saved, setSaved] = useState<CoachRow>(coach);
  const [form, setForm] = useState<CoachRow>(coach);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

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
        avatar: form.avatar,
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
          {coach.custom ? (
            <Badge variant="accent" size="sm">
              Tự thêm
            </Badge>
          ) : null}
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
        <AvatarUploader
          idPrefix={form.slug}
          value={form.avatar}
          onChange={(url) => setForm({ ...form, avatar: url })}
        />

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
