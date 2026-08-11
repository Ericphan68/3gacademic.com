'use client';

import { Megaphone, Save, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Field, Input, Label, Switch, Textarea } from '@/components/ui/form-fields';

interface Announcement {
  enabled: boolean;
  text: string;
  ctaText: string;
  ctaLink: string;
}
interface Hero {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export function ContentEditor({ initial }: { initial: { announcement: Announcement; hero: Hero } }) {
  const [saved, setSaved] = useState(initial);
  const [ann, setAnn] = useState<Announcement>(initial.announcement);
  const [hero, setHero] = useState<Hero>(initial.hero);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify({ announcement: ann, hero }) !== JSON.stringify(saved);

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ announcement: ann, hero }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error('Lưu chưa thành công', { description: body?.error });
      return;
    }
    toast.success('Đã lưu', { description: 'Trang chủ đã cập nhật nội dung mới.' });
    setSaved({ announcement: ann, hero });
  };

  return (
    <div className="max-w-2xl space-y-8">
      {/* Thanh thông báo */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
        <h2 className="mb-4 flex items-center gap-2 text-lg">
          <Megaphone className="size-5 text-[var(--color-accent)]" aria-hidden />
          Thanh thông báo (trên cùng)
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3">
            <Label htmlFor="ann-enabled" className="font-normal">
              Hiển thị thanh thông báo
            </Label>
            <Switch
              id="ann-enabled"
              checked={ann.enabled}
              onCheckedChange={(v) => setAnn({ ...ann, enabled: v })}
            />
          </div>
          <Field label="Nội dung" htmlFor="ann-text">
            <Input id="ann-text" value={ann.text} onChange={(e) => setAnn({ ...ann, text: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Chữ nút" htmlFor="ann-cta">
              <Input id="ann-cta" value={ann.ctaText} onChange={(e) => setAnn({ ...ann, ctaText: e.target.value })} />
            </Field>
            <Field label="Link nút" htmlFor="ann-link" helper="Ví dụ: /membership">
              <Input id="ann-link" value={ann.ctaLink} onChange={(e) => setAnn({ ...ann, ctaLink: e.target.value })} />
            </Field>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
        <h2 className="mb-4 flex items-center gap-2 text-lg">
          <Sparkles className="size-5 text-[var(--color-accent)]" aria-hidden />
          Đầu trang chủ (Hero)
        </h2>
        <div className="space-y-4">
          <Field label="Dòng nhỏ phía trên" htmlFor="hero-eyebrow">
            <Input id="hero-eyebrow" value={hero.eyebrow} onChange={(e) => setHero({ ...hero, eyebrow: e.target.value })} />
          </Field>
          <Field label="Tiêu đề lớn" htmlFor="hero-title">
            <Input id="hero-title" value={hero.title} onChange={(e) => setHero({ ...hero, title: e.target.value })} />
          </Field>
          <Field label="Mô tả" htmlFor="hero-subtitle">
            <Textarea
              id="hero-subtitle"
              value={hero.subtitle}
              onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Chữ nút chính" htmlFor="hero-cta">
              <Input id="hero-cta" value={hero.ctaText} onChange={(e) => setHero({ ...hero, ctaText: e.target.value })} />
            </Field>
            <Field label="Link nút chính" htmlFor="hero-link" helper="Ví dụ: /booking">
              <Input id="hero-link" value={hero.ctaLink} onChange={(e) => setHero({ ...hero, ctaLink: e.target.value })} />
            </Field>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-5">
        {dirty ? <span className="text-xs text-[var(--color-warning)]">Có thay đổi chưa lưu</span> : null}
        <Button variant="accent" size="lg" onClick={save} loading={saving} disabled={!dirty}>
          <Save aria-hidden />
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
}
