import { ArrowLeft, CalendarDays, UserRound } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Section } from '@/components/common/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MEDIA } from '@/constants/media';
import { buildMetadata } from '@/lib/seo';
import { getPublishedPost } from '@/server/services/postService';

export const dynamic = 'force-dynamic';

const fmtDate = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString('vi-VN') : '');

const IMG_MD = /^!\[[^\]]*\]\((\S+?)\)$/; // ![alt](url)
const IMG_URL = /^(?:https?:\/\/\S+\.(?:png|jpe?g|webp|gif)|\/api\/media\/\S+)$/i;

/** Render nội dung bài: dòng là ảnh -> hiển thị ảnh; còn lại -> đoạn văn. */
function ArticleBody({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="space-y-5 text-[17px] leading-[1.8] text-[var(--color-foreground)]">
      {lines.map((raw, i) => {
        const line = raw.trim();
        if (!line) return null;
        const md = IMG_MD.exec(line);
        const src = md ? md[1] : IMG_URL.test(line) ? line : null;
        if (src) {
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt={md?.[0]?.replace(/^!\[|\].*$/g, '') || 'Ảnh bài viết'}
              className="mx-auto w-full rounded-[var(--radius-lg)] border border-[var(--color-border)]"
            />
          );
        }
        return (
          <p key={i} className="whitespace-pre-line">
            {raw}
          </p>
        );
      })}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) {
    return buildMetadata({ title: 'Bài viết', description: 'Thư Viện Lotus Golf Center', path: `/thu-vien/${slug}` });
  }
  return buildMetadata({
    title: post.title,
    description: post.summary ?? post.title,
    path: `/thu-vien/${slug}`,
    image: post.coverImage ?? MEDIA.hero.about,
  });
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  return (
    <article>
      {/* Ảnh bìa + tiêu đề */}
      <div
        className="relative flex min-h-[18rem] items-end bg-cover bg-center md:min-h-[24rem]"
        style={{ backgroundImage: `url(${post.coverImage || MEDIA.hero.about})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-black/20" aria-hidden />
        <div className="container-lotus relative py-10 md:py-14">
          {post.category ? (
            <Badge variant="gold" size="sm" className="mb-3">
              {post.category}
            </Badge>
          ) : null}
          <h1 className="max-w-3xl text-3xl text-white md:text-4xl lg:text-5xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/85">
            {post.author ? (
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="size-4" aria-hidden />
                {post.author}
              </span>
            ) : null}
            {post.publishedAt ? (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden />
                {fmtDate(post.publishedAt)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <Section>
        <div className="mx-auto max-w-3xl">
          {post.summary ? (
            <p className="mb-6 border-l-2 border-[var(--color-accent)] pl-4 text-lg leading-relaxed text-[var(--color-muted)]">
              {post.summary}
            </p>
          ) : null}

          <ArticleBody content={post.content} />



          <div className="mt-10 border-t border-[var(--color-border)] pt-6">
            <Button asChild variant="outline">
              <Link href="/thu-vien">
                <ArrowLeft aria-hidden />
                Về Thư Viện
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </article>
  );
}
