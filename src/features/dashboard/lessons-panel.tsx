'use client';

import { BookOpen, GraduationCap, NotebookPen, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ProgressBar, Rating } from '@/components/ui/misc';
import { EmptyState } from '@/components/ui/states';
import { BLUR_DATA_URL } from '@/constants/media';
import { useHydrated } from '@/hooks/useHydrated';
import { formatDateLong } from '@/lib/format';
import { cn } from '@/lib/utils';
import { coachService } from '@/services/catalogService';
import { useAccountStore } from '@/store/useAccountStore';

export function LessonsPanel() {
  const hydrated = useHydrated();
  const lessons = useAccountStore((state) => state.lessons);

  if (!hydrated) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  if (lessons.length === 0) {
    return (
      <div>
        <PortalHeader title="Buổi học" description="Lộ trình học và ghi chú từ huấn luyện viên của bạn." />
        <EmptyState
          title="Bạn chưa có buổi học nào"
          description="Bắt đầu bằng một buổi đánh giá đầu vào — huấn luyện viên sẽ đo hiện trạng và xây lộ trình phù hợp."
          icon={GraduationCap}
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="accent">
                <Link href={{ pathname: '/booking', query: { experience: 'first-swing' } }}>
                  Đặt buổi đánh giá
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/academy">Xem chương trình học</Link>
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  const sorted = [...lessons].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  const completed = sorted.filter((lesson) => lesson.status === 'completed');
  const upcoming = sorted.filter((lesson) => lesson.status === 'scheduled');
  const coach = coachService.getById(sorted[0].coachId);

  const totalSessions = Number(sorted[0].programName.match(/(\d+)\s*buổi/)?.[1] ?? completed.length);
  const latestScore = completed[0]?.progressScore ?? 0;
  const firstScore = completed[completed.length - 1]?.progressScore ?? 0;

  return (
    <div>
      <PortalHeader
        title="Buổi học"
        description="Lộ trình, ghi chú và bài tập từ huấn luyện viên của bạn."
        action={
          <Button asChild variant="accent">
            <Link href={{ pathname: '/booking', query: { experience: 'first-swing' } }}>
              Đặt buổi học mới
            </Link>
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        {/* Huấn luyện viên & tiến độ */}
        <div className="space-y-6">
          {coach ? (
            <section className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)]">
              <div className="relative aspect-[4/3] bg-[var(--color-navy-800)]">
                <Image
                  src={coach.avatar}
                  alt={`Ảnh huấn luyện viên ${coach.name}`}
                  fill
                  sizes="(min-width: 1024px) 30vw, 92vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p className="text-xs tracking-widest text-[var(--color-muted)] uppercase">
                  Huấn luyện viên của bạn
                </p>
                <h2 className="mt-1 text-xl">{coach.name}</h2>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{coach.title}</p>
                <Rating value={coach.rating} count={coach.reviewCount} size="sm" className="mt-3" />

                <div className="mt-5 flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/coaches/${coach.slug}`}>Xem hồ sơ</Link>
                  </Button>
                  <Button asChild variant="accent" size="sm" className="flex-1">
                    <Link href={{ pathname: '/booking', query: { coach: coach.slug } }}>Đặt buổi</Link>
                  </Button>
                </div>
              </div>
            </section>
          ) : null}

          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="size-4 text-[var(--color-accent)]" aria-hidden />
              <h2 className="text-lg">Tiến độ lộ trình</h2>
            </div>

            <p className="text-sm text-[var(--color-muted)]">{sorted[0].programName}</p>

            <div className="mt-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-[var(--color-muted)]">Buổi đã hoàn thành</span>
                <span className="font-medium">
                  {completed.length}/{totalSessions}
                </span>
              </div>
              <ProgressBar
                value={completed.length}
                max={totalSessions}
                label={`Đã hoàn thành ${completed.length} trên ${totalSessions} buổi`}
              />
            </div>

            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-[var(--color-muted)]">Điểm kỹ thuật gần nhất</span>
                <span className="font-medium">{latestScore}/100</span>
              </div>
              <ProgressBar value={latestScore} tone="gold" label="Điểm kỹ thuật gần nhất" />
              {firstScore > 0 && latestScore > firstScore ? (
                <p className="mt-2 text-xs text-[var(--color-success)]">
                  Tăng {latestScore - firstScore} điểm so với buổi đánh giá đầu vào.
                </p>
              ) : null}
            </div>
          </section>
        </div>

        {/* Danh sách buổi học */}
        <div className="space-y-6">
          {upcoming.length > 0 ? (
            <section>
              <h2 className="mb-4 text-lg">Buổi học sắp tới</h2>
              <ul className="space-y-4">
                {upcoming.map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} highlighted />
                ))}
              </ul>
            </section>
          ) : null}

          <section>
            <h2 className="mb-4 text-lg">Lịch sử buổi học</h2>
            <ul className="space-y-4">
              {sorted
                .filter((lesson) => lesson.status !== 'scheduled')
                .map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

function LessonCard({
  lesson,
  highlighted = false,
}: {
  lesson: ReturnType<typeof useAccountStore.getState>['lessons'][number];
  highlighted?: boolean;
}) {
  return (
    <li
      className={cn(
        'rounded-[var(--radius-lg)] border p-5',
        highlighted
          ? 'border-[var(--color-golf-200)] bg-[var(--color-golf-50)]'
          : 'border-[var(--color-border)] bg-[var(--color-background)]',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">{lesson.focus}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            {formatDateLong(lesson.date)} · {lesson.time} · {lesson.coachName}
          </p>
        </div>
        <Badge
          variant={
            lesson.status === 'scheduled' ? 'accent' : lesson.status === 'completed' ? 'neutral' : 'danger'
          }
          size="sm"
        >
          {lesson.status === 'scheduled'
            ? 'Sắp diễn ra'
            : lesson.status === 'completed'
              ? `Đã học · ${lesson.progressScore}/100`
              : 'Đã huỷ'}
        </Badge>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <p className="flex gap-2.5">
          <NotebookPen className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          <span>
            <span className="font-medium">Ghi chú của huấn luyện viên: </span>
            <span className="text-[var(--color-muted)]">{lesson.coachNote}</span>
          </span>
        </p>
        <p className="flex gap-2.5">
          <BookOpen className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" aria-hidden />
          <span>
            <span className="font-medium">Bài tập về nhà: </span>
            <span className="text-[var(--color-muted)]">{lesson.homework}</span>
          </span>
        </p>
      </div>
    </li>
  );
}
