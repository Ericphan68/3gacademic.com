'use client';

import { ArrowLeft, BookOpen, ExternalLink, FilePlus2, Pencil, Save, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Switch, Textarea } from '@/components/ui/form-fields';
import { EmptyState } from '@/components/ui/states';

export interface PostRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  isPublished: boolean;
  publishedAt: string | null;
  updatedAt: string;
}

interface FormState {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  coverImage: string;
  summary: string;
  content: string;
  isPublished: boolean;
}

const EMPTY: FormState = {
  id: '',
  title: '',
  slug: '',
  category: '',
  author: '',
  coverImage: '',
  summary: '',
  content: '',
  isPublished: false,
};

const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '—');

export function PostManager({ posts }: { posts: PostRow[] }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const startEdit = (p: PostRow) =>
    setForm({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      author: p.author,
      coverImage: p.coverImage,
      summary: p.summary,
      content: p.content,
      isPublished: p.isPublished,
    });

  const save = async () => {
    if (!form) return;
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Cần có Tiêu đề và Nội dung');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/admin/posts', {
      method: form.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...(form.id ? { id: form.id } : {}),
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category.trim() || null,
        author: form.author.trim() || null,
        coverImage: form.coverImage.trim() || null,
        summary: form.summary.trim() || null,
        content: form.content,
        isPublished: form.isPublished,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const b = (await res.json().catch(() => null)) as { error?: string } | null;
      toast.error('Lưu chưa thành công', { description: b?.error });
      return;
    }
    toast.success(form.isPublished ? 'Đã lưu & xuất bản' : 'Đã lưu (bản nháp)');
    setForm(null);
    router.refresh();
  };

  const remove = async (p: PostRow) => {
    const res = await fetch('/api/admin/posts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id }),
    });
    if (!res.ok) {
      toast.error('Xoá chưa thành công');
      return;
    }
    toast.success('Đã xoá bài viết');
    setConfirmId(null);
    router.refresh();
  };

  /* ------- EDITOR ------- */
  if (form) {
    return (
      <div className="max-w-3xl">
        <button
          type="button"
          onClick={() => setForm(null)}
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Quay lại danh sách
        </button>

        <div className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
          <Field label="Tiêu đề *" htmlFor="p-title">
            <Input id="p-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Tiêu đề bài viết" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Danh mục" htmlFor="p-cat" helper="Vd: Kiến thức, Sự kiện…">
              <Input id="p-cat" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </Field>
            <Field label="Tác giả" htmlFor="p-author">
              <Input id="p-author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Lotus Golf" />
            </Field>
          </div>

          <Field label="Đường dẫn (slug)" htmlFor="p-slug" helper="Để trống sẽ tự tạo từ tiêu đề.">
            <Input id="p-slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="vd: meo-choi-golf-cho-nguoi-moi" />
          </Field>

          <Field label="Ảnh bìa (link)" htmlFor="p-cover" helper="Dán đường dẫn ảnh (https://…). Để trống dùng ảnh mặc định.">
            <Input id="p-cover" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://…" />
          </Field>

          <Field label="Tóm tắt" htmlFor="p-sum" helper="1–2 câu hiển thị ở danh sách.">
            <Textarea id="p-sum" rows={2} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </Field>

          <Field label="Nội dung *" htmlFor="p-content" helper="Xuống dòng để tách đoạn.">
            <Textarea id="p-content" rows={14} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Nội dung bài viết…" />
          </Field>

          <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] p-3">
            <Label htmlFor="p-pub" className="font-normal">
              Xuất bản (hiện trên website)
            </Label>
            <Switch id="p-pub" checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-4">
            <Button variant="ghost" onClick={() => setForm(null)}>
              Huỷ
            </Button>
            <Button variant="accent" onClick={save} loading={saving}>
              <Save aria-hidden />
              Lưu bài viết
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ------- LIST ------- */
  return (
    <div>
      <div className="mb-6 flex justify-end">
        <Button variant="accent" onClick={() => setForm({ ...EMPTY })}>
          <FilePlus2 aria-hidden />
          Bài viết mới
        </Button>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="Chưa có bài viết"
          description='Bấm "Bài viết mới" để đăng bài đầu tiên.'
          icon={BookOpen}
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <table className="w-full min-w-[44rem] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-xs text-[var(--color-muted)]">
                <th className="px-4 py-3 font-medium">Tiêu đề</th>
                <th className="px-4 py-3 font-medium">Danh mục</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Cập nhật</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.title}</p>
                    <p className="font-mono text-xs text-[var(--color-muted)]">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{p.category || '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={p.isPublished ? 'success' : 'neutral'} size="sm">
                      {p.isPublished ? 'Đã xuất bản' : 'Nháp'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-[var(--color-muted)]">{fmt(p.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      {p.isPublished ? (
                        <Button asChild variant="ghost" size="icon-sm" aria-label="Xem bài">
                          <Link href={`/thu-vien/${p.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink aria-hidden />
                          </Link>
                        </Button>
                      ) : null}
                      <Button variant="outline" size="sm" onClick={() => startEdit(p)}>
                        <Pencil aria-hidden />
                        Sửa
                      </Button>
                      {confirmId === p.id ? (
                        <Button variant="ghost" size="sm" className="text-[var(--color-danger)]" onClick={() => remove(p)}>
                          Chắc chắn?
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon-sm" aria-label="Xoá" onClick={() => setConfirmId(p.id)}>
                          <Trash2 aria-hidden />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
