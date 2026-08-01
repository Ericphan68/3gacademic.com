'use client';

import { Copy, Info, Share2, TrendingUp, UserCheck, Users } from 'lucide-react';
import { toast } from 'sonner';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DemoQrCode, InitialsAvatar } from '@/components/ui/misc';
import { COACH_REFERRALS, REFERRAL_ATTRIBUTION_NOTE } from '@/data/coach-portal';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDate } from '@/lib/format';
import { initialsOf } from '@/lib/utils';
import { coachService } from '@/services/catalogService';
import { useAuthStore } from '@/store/useAuthStore';

export function ReferralsPanel() {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);

  if (!hydrated || !user) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const coach = user.coachSlug ? coachService.getBySlug(user.coachSlug) : undefined;
  const referralCode = coach?.referralCode ?? 'LOTUS-COACH01';
  const referralLink = `https://lotusgolf.vn/dang-ky?ref=${referralCode}`;

  const active = COACH_REFERRALS.filter((row) => row.status === 'active');
  const totalValue = COACH_REFERRALS.reduce((sum, row) => sum + row.lifetimeValue, 0);
  const converted = COACH_REFERRALS.filter((row) => row.firstBookingAt !== null).length;

  const copy = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(message);
    } catch {
      toast.error('Không sao chép được', { description: 'Bạn có thể chọn và sao chép thủ công.' });
    }
  };

  return (
    <div>
      <PortalHeader
        title="Giới thiệu học viên"
        description="Học viên đăng ký qua liên kết hoặc mã của bạn sẽ được ghi nhận minh bạch tại đây."
      />

      {/* Chỉ số */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <Users className="size-4" aria-hidden />
            Tổng lượt giới thiệu
          </div>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">{COACH_REFERRALS.length}</p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-5">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <UserCheck className="size-4" aria-hidden />
            Đã đặt lịch lần đầu
          </div>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">
            {converted}/{COACH_REFERRALS.length}
          </p>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-5">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <TrendingUp className="size-4" aria-hidden />
            Tổng giá trị mang lại
          </div>
          <p className="mt-2 font-[family-name:var(--font-display)] text-2xl">
            {formatCurrency(totalValue, { compact: true })}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Mã và QR */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Share2 className="size-4 text-[var(--color-accent)]" aria-hidden />
            <h2 className="text-lg">Liên kết giới thiệu</h2>
          </div>

          <div className="flex flex-col items-center gap-4 rounded-[var(--radius-md)] bg-[var(--color-surface)] p-5">
            <DemoQrCode payload={referralLink} size={148} className="border border-[var(--color-border)]" />
            <Badge variant="neutral" size="sm">
              Mã QR minh hoạ cho bản demo
            </Badge>
          </div>

          <div className="mt-5 space-y-3">
            <div>
              <p className="mb-1.5 text-xs tracking-widest text-[var(--color-muted)] uppercase">
                Mã giới thiệu
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 font-mono text-sm">
                  {referralCode}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Sao chép mã giới thiệu"
                  onClick={() => copy(referralCode, 'Đã sao chép mã giới thiệu')}
                >
                  <Copy aria-hidden />
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-1.5 text-xs tracking-widest text-[var(--color-muted)] uppercase">
                Liên kết đăng ký
              </p>
              <div className="flex items-center gap-2">
                <code className="min-w-0 flex-1 truncate rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 font-mono text-xs">
                  {referralLink}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Sao chép liên kết giới thiệu"
                  onClick={() => copy(referralLink, 'Đã sao chép liên kết giới thiệu')}
                >
                  <Copy aria-hidden />
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-5 flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--color-champagne-50)] p-4 text-xs leading-relaxed text-[var(--color-champagne-800)]">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            {REFERRAL_ATTRIBUTION_NOTE}
          </p>
        </section>

        {/* Danh sách học viên được giới thiệu */}
        <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg">Học viên bạn đã giới thiệu</h2>
            <Badge variant="accent" size="sm">
              {active.length} đang hoạt động
            </Badge>
          </div>

          <ul className="divide-y divide-[var(--color-border)]">
            {COACH_REFERRALS.map((referral) => (
              <li key={referral.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0">
                <InitialsAvatar initials={initialsOf(referral.studentName)} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{referral.studentName}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                    Đăng ký {formatDate(referral.joinedAt)}
                    {referral.firstBookingAt
                      ? ` · Đặt lịch đầu tiên ${formatDate(referral.firstBookingAt)}`
                      : ' · Chưa đặt lịch lần nào'}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums">
                    {formatCurrency(referral.lifetimeValue, { compact: true })}
                  </p>
                  <Badge
                    variant={referral.status === 'active' ? 'success' : 'neutral'}
                    size="sm"
                    className="mt-1"
                  >
                    {referral.status === 'active' ? 'Đang hoạt động' : 'Chưa hoạt động'}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
