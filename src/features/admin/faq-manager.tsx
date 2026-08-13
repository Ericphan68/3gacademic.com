'use client';

import { Check, EyeOff, Save, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Switch, Textarea } from '@/components/ui/form-fields';

/** Trùng khớp FaqAdminRow ở faqService (khai báo lại để không import server-only). */
export interface FaqRow {
  key: string;
  groupLabel: string;
  question: string;
  answer: string;
  active: boolean;
}

export function FaqManager({ faqs }: { faqs: FaqRow[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.groupLabel.toLowerCase().includes(q),
    );
  }, [query, faqs]);

  return (
    <div className="space-y-6">
      <Field label="Tìm câu hỏi" htmlFor="faq-search" className="max-w-md">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
            aria-hidden
          />
          <Input
            id="faq-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Nội dung câu hỏi hoặc nhóm…"
            className="pl-10"
          />
        </div>
      </Field>

      <p className="text-sm text-[var(--color-muted)]">{filtered.length} câu hỏi</p>

      <div className="space-y-4">
        {filtered.map((faq) => (
          <FaqCard key={faq.key} faq={faq} />
        ))}
      </div>
    </div>
  );
}

function FaqCard({ faq }: { faq: FaqRow }) {
  const [saved, setSaved] = useState<FaqRow>(faq);
  const [form, setForm] = useState<FaqRow>(faq);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/faqs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: form.key,
        question: form.question.trim(),
        answer: form.answer.trim(),
        active: form.active,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error('Lưu chưa thành công', { description: body?.error });
      return;
    }
    toast.success('Đã lưu', { description: 'Trang /faq đã cập nhật nội dung mới.' });
    setSaved(form);
  };

  return (
    <div
      className={`rounded-[var(--radius-lg)] border p-5 ${
        form.active
          ? 'border-[var(--color-border)] bg-[var(--color-surface-raised)]'
          : 'border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)]'
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <Badge variant="neutral" size="sm">
          {form.groupLabel}
        </Badge>
        {!form.active ? (
          <Badge variant="neutral" size="sm">
            <EyeOff className="size-3" aria-hidden />
            Đang ẩn
          </Badge>
        ) : null}
      </div>

      <div className="space-y-4">
        <Field label="Câu hỏi" htmlFor={`q-${form.key}`}>
          <Input
            id={`q-${form.key}`}
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />
        </Field>

        <Field label="Câu trả lời" htmlFor={`a-${form.key}`}>
          <Textarea
            id={`a-${form.key}`}
            rows={3}
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
          />
        </Field>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2">
            <Label htmlFor={`act-${form.key}`} className="font-normal">
              Hiển thị
            </Label>
            <Switch
              id={`act-${form.key}`}
              checked={form.active}
              onCheckedChange={(v) => setForm({ ...form, active: v })}
            />
          </div>
          <div className="flex items-center gap-3">
            {dirty ? (
              <span className="text-xs text-[var(--color-warning)]">Chưa lưu</span>
            ) : null}
            <Button variant="accent" onClick={save} loading={saving} disabled={!dirty}>
              {dirty ? <Save aria-hidden /> : <Check aria-hidden />}
              Lưu
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
