'use client';

import { Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';

export interface ContactForm {
  name: string;
  hotline: string;
  email: string;
  address: string;
  openHours: string;
  zalo: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

export function SettingsEditor({ initial }: { initial: ContactForm }) {
  const [saved, setSaved] = useState<ContactForm>(initial);
  const [form, setForm] = useState<ContactForm>(initial);
  const [saving, setSaving] = useState(false);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);
  const set = (key: keyof ContactForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error('Lưu chưa thành công', { description: body?.error });
      return;
    }
    toast.success('Đã lưu', { description: 'Thông tin đã cập nhật trên toàn website.' });
    setSaved(form);
  };

  return (
    <div className="max-w-2xl space-y-8">
      <section>
        <h2 className="mb-4 text-lg">Thông tin chung</h2>
        <div className="space-y-4">
          <Field label="Tên website" htmlFor="s-name">
            <Input id="s-name" value={form.name} onChange={set('name')} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Hotline" htmlFor="s-hotline">
              <Input id="s-hotline" value={form.hotline} onChange={set('hotline')} />
            </Field>
            <Field label="Email" htmlFor="s-email">
              <Input id="s-email" type="email" value={form.email} onChange={set('email')} />
            </Field>
          </div>
          <Field label="Địa chỉ" htmlFor="s-address">
            <Input id="s-address" value={form.address} onChange={set('address')} />
          </Field>
          <Field label="Giờ mở cửa" htmlFor="s-hours" helper="Ví dụ: 06:00 – 22:00">
            <Input id="s-hours" value={form.openHours} onChange={set('openHours')} />
          </Field>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg">Mạng xã hội</h2>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Zalo" htmlFor="s-zalo">
              <Input id="s-zalo" value={form.zalo} onChange={set('zalo')} placeholder="https://zalo.me/..." />
            </Field>
            <Field label="WhatsApp" htmlFor="s-wa" helper="Dán link wa.me kèm số (mã VN 84).">
              <Input id="s-wa" value={form.whatsapp} onChange={set('whatsapp')} placeholder="https://wa.me/8490..." />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook" htmlFor="s-fb">
              <Input id="s-fb" value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/..." />
            </Field>
            <Field label="Instagram" htmlFor="s-ig">
              <Input id="s-ig" value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/..." />
            </Field>
            <Field label="YouTube" htmlFor="s-yt">
              <Input id="s-yt" value={form.youtube} onChange={set('youtube')} placeholder="https://youtube.com/..." />
            </Field>
            <Field label="TikTok" htmlFor="s-tt">
              <Input id="s-tt" value={form.tiktok} onChange={set('tiktok')} placeholder="https://tiktok.com/..." />
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
