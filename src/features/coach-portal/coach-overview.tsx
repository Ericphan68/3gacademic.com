'use client';

import {
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  Copy,
  Sparkles,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DemoQrCode, InitialsAvatar, Rating } from '@/components/ui/misc';
import { COACH_LEADERBOARD, COACH_PORTAL_METRICS, COACH_STUDENTS } from '@/data/coach-portal';
import { useHydrated } from '@/hooks/useHydrated';
import { getCoachAvailability } from '@/lib/availability';
import { formatCurrency, formatDateLong, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { coachService } from '@/services/catalogService';
import { useAuthStore } from '@/store/useAuthStore';

export function CoachOverview() {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);

  if (!hydrated || !user) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const coach = user.coachSlug ? coachService.getBySlug(user.coachSlug) : undefined;
  const metrics = COACH_PORTAL_METRICS;
  const referralCode = coach?.referralCode ?? 'LOTUS-COACH01';
  const referralLink = `https://lotusgolf.vn/dang-ky?ref=${referralCode}`;

  // Lấy ngày dạy gần nhất còn khung giờ — nếu hôm nay là ngày nghỉ thì hiển thị ngày kế tiếp.
  const nextWorkingDay = coach ? getCoachAvailability(coach.id, 7)[0] : undefined;
  const todaySchedule = nextWorkingDay?.times ?? [];
  const newStudents = COACH_STUDENTS.filter((student) => student.sessionsRemaining >= student.sessionsTotal - 1);

  const copyReferral = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Đã sao chép liên kết giới thiệu');
    } catch {
      toast.error('Không sao chép được', { description: 'Bạn có thể chọn và sao chép thủ công.' });
    }
  };

  return (
    <div>
      <PortalHeader
        title={`Chào ${user.fullName.split(' ').slice(-1)[0]}`}
        description={`Tổng quan hoạt động huấn luyện của bạn — ${formatDateLong(new Date())}.`}
        action={
          <Button asChild variant="accent">
            <Link href="/coach-portal/schedule">
              Xem lịch dạy
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      {/* Chỉ số */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Users className="size-5" />}
          label="Tổng học viên"
          value={formatNumber(metrics.totalStudents)}
          hint={`+${metrics.newStudentsThisMonth} học viên mới tháng này`}
        />
        <MetricCard
          icon={<CalendarDays className="size-5" />}
          label="Buổi dạy hôm nay"
          value={`${metrics.lessonsToday} buổi`}
          hint={todaySchedule.length > 0 ? `Khung giờ: ${todaySchedule.slice(0, 3).join(', ')}` : 'Chưa có lịch'}
          tone="accent"
        />
        <MetricCard
          icon={<TrendingUp className="size-5" />}
          label="Doanh thu tháng này"
          value={formatCurrency(metrics.revenueThisMonth, { compact: true })}
          hint="Tổng giá trị các buổi dạy đã thực hiện"
        />
        <MetricCard
          icon={<BadgeDollarSign className="size-5" />}
          label="Hoa hồng tháng này"
          value={formatCurrency(metrics.commissionThisMonth, { compact: true })}
          hint={`Chờ xác nhận ${formatCurrency(metrics.commissionPending, { compact: true })}`}
          tone="gold"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Học viên mới */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg">
                <UserPlus className="size-4 text-[var(--color-accent)]" aria-hidden />
                Học viên mới cần theo sát
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/coach-portal/students">
                  Xem tất cả
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>

            <ul className="divide-y divide-[var(--color-border)]">
              {newStudents.slice(0, 4).map((student) => (
                <li key={student.id} className="flex items-center gap-4 py-3.5 first:pt-0">
                  <InitialsAvatar initials={student.initials} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{student.name}</p>
                    <p className="mt-0.5 truncate text-xs text-[var(--color-muted)]">{student.programName}</p>
                  </div>
                  <Badge variant="accent" size="sm">
                    Còn {student.sessionsRemaining} buổi
                  </Badge>
                </li>
              ))}
            </ul>
          </section>

          {/* Bảng xếp hạng */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="size-4 text-[var(--color-gold)]" aria-hidden />
              <h2 className="text-lg">Bảng xếp hạng tháng này</h2>
              <Badge variant="neutral" size="sm" className="ml-auto">
                Demo
              </Badge>
            </div>

            <ul className="space-y-2">
              {COACH_LEADERBOARD.map((entry) => {
                const isSelf = entry.name === user.fullName;
                return (
                  <li
                    key={entry.rank}
                    className={cn(
                      'flex items-center gap-4 rounded-[var(--radius-md)] p-3',
                      isSelf ? 'bg-[var(--color-golf-50)]' : 'bg-[var(--color-surface)]',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-display)] text-sm',
                        entry.rank === 1
                          ? 'bg-[var(--color-champagne-300)] text-[var(--color-navy-800)]'
                          : 'bg-[var(--color-muted-surface)] text-[var(--color-muted)]',
                      )}
                    >
                      {entry.rank}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">
                        {entry.name}
                        {isSelf ? ' (bạn)' : ''}
                      </span>
                      <span className="mt-0.5 block text-xs text-[var(--color-muted)]">
                        {entry.lessons} buổi dạy
                      </span>
                    </span>

                    <Rating value={entry.rating} size="sm" />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div className="space-y-6">
          {/* Referral */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-5 md:p-6">
            <h2 className="text-lg">Mã giới thiệu của bạn</h2>
            <p className="mt-1 text-sm text-[var(--color-champagne-800)]">
              Học viên đăng ký qua mã này sẽ được ghi nhận cho bạn.
            </p>

            <div className="mt-5 flex flex-col items-center gap-4 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] p-5">
              <DemoQrCode payload={referralLink} size={128} className="border border-[var(--color-border)]" />
              <div className="text-center">
                <p className="font-mono text-lg font-semibold">{referralCode}</p>
                <p className="mt-1 text-xs break-all text-[var(--color-muted)]">{referralLink}</p>
              </div>
            </div>

            <Button variant="primary" block className="mt-4" onClick={copyReferral}>
              <Copy aria-hidden />
              Sao chép liên kết
            </Button>

            <Button asChild variant="ghost" block className="mt-2">
              <Link href="/coach-portal/referrals">
                Xem chi tiết giới thiệu
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </section>

          {/* Nhận định hiệu suất */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-[var(--color-accent)]" aria-hidden />
              <h2 className="text-lg">Nhận định tháng này</h2>
              <Badge variant="neutral" size="sm" className="ml-auto">
                Demo
              </Badge>
            </div>

            <ul className="space-y-3 text-sm text-[var(--color-muted)]">
              <li>
                • Doanh thu tăng{' '}
                <span className="font-medium text-[var(--color-foreground)]">
                  {Math.round(
                    ((metrics.monthlySeries[5].revenue - metrics.monthlySeries[4].revenue) /
                      metrics.monthlySeries[4].revenue) *
                      100,
                  )}
                  %
                </span>{' '}
                so với tháng trước.
              </li>
              <li>
                • Bạn đang xếp hạng{' '}
                <span className="font-medium text-[var(--color-foreground)]">
                  {metrics.rankThisMonth}/{metrics.rankTotal}
                </span>{' '}
                về số buổi dạy.
              </li>
              <li>
                • Có{' '}
                <span className="font-medium text-[var(--color-foreground)]">
                  {COACH_STUDENTS.filter((s) => s.sessionsRemaining <= 2).length} học viên
                </span>{' '}
                sắp hết buổi — nên trao đổi về lộ trình tiếp theo.
              </li>
              <li>
                • Điểm đánh giá trung bình:{' '}
                <span className="font-medium text-[var(--color-foreground)]">{metrics.rating}/5</span>.
              </li>
            </ul>

            <p className="mt-4 text-xs leading-relaxed text-[var(--color-muted)]">
              Nhận định được tính từ dữ liệu demo trong bản trình diễn, chưa kết nối hệ thống phân tích thật.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  hint,
  tone = 'default',
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone?: 'default' | 'accent' | 'gold';
}) {
  const toneClass = {
    default: 'border-[var(--color-border)] bg-[var(--color-background)]',
    accent: 'border-[var(--color-golf-200)] bg-[var(--color-golf-50)]',
    gold: 'border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)]',
  }[tone];

  return (
    <div className={cn('rounded-[var(--radius-lg)] border p-5', toneClass)}>
      <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-[var(--color-surface-raised)] text-[var(--color-accent)]">
        {icon}
      </span>
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-xl">{value}</p>
      <p className="mt-1.5 text-xs text-[var(--color-muted)]">{hint}</p>
    </div>
  );
}
