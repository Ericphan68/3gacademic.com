import { ArrowRight, BookOpen } from 'lucide-react';
import Link from 'next/link';

import { PageHero } from '@/components/common/page-hero';
import { Section } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/states';
import { MEDIA } from '@/constants/media';
import { buildMetadata } from '@/lib/seo';
import { listPublishedPosts } from '@/server/services/postService';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Thư Viện',
  description:
    'Thư Viện Lotus Golf Center: bài viết, kiến thức, mẹo chơi golf, tin tức sự kiện và câu chuyện từ cộng đồng golf.',
  path: '/thu-vien',
  image: MEDIA.hero.about,
  keywords: ['blog golf', 'kiến thức golf', 'tin tức golf', 'mẹo chơi golf'],
});

const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '');

export default async function ThuVienPage() {
  const posts = await listPublishedPosts();

  return (
    <>
      <PageHero
        eyebrow="Thư Viện"
        title="Kiến thức & câu chuyện golf"
        description="Bài viết, mẹo chơi golf, tin tức và câu chuyện từ Lotus Golf Center."
        image={MEDIA.hero.about}
        breadcrumbs={[{ label: 'Thư Viện' }]}
        size="sm"
      />

      <Section>
        {posts.length === 0 ? (
          <EmptyState
            title="Chưa có bài viết"
            description="Các bài viết sẽ được cập nhật tại đây. Hãy quay lại sau nhé!"
            icon={BookOpen}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/thu-vien/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] transition-shadow hover:shadow-[var(--shadow-lift)]"
              >
                <span
                  className="block aspect-[16/9] bg-cover bg-center transition-transform duration-300 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url(${post.coverImage || MEDIA.hero.about})` }}
                  aria-hidden
                />
                <span className="flex flex-1 flex-col p-5">
                  <span className="mb-2 flex items-center gap-2">
                    {post.category ? (
                      <Badge variant="accent" size="sm">
                        {post.category}
                      </Badge>
                    ) : null}
                    {post.publishedAt ? (
                      <span className="text-xs text-[var(--color-muted)]">{fmtDate(post.publishedAt)}</span>
                    ) : null}
                  </span>
                  <span className="text-lg font-medium leading-snug">{post.title}</span>
                  {post.summary ? (
                    <span className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--color-muted)]">
                      {post.summary}
                    </span>
                  ) : null}
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-accent)]">
                    Đọc bài viết
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
