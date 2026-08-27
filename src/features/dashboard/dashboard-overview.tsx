'use client';

import {
  ArrowRight,
  CalendarCheck,
  Clock,
  Coins,
  Crown,
  GraduationCap,
  Sparkles,
  Ticket,
  Trophy,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/states';
import { MEMBERSHIP_BY_ID } from '@/data/memberships';
import { useHydrated } from '@/hooks/useHydrated';
import { getDayMeta, getTimeSlots, todayKey } from '@/lib/availability';
import { formatCurrency, formatDateLong, formatDateShort, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import { coachService } from '@/services/catalogService';
import { selectActiveVouchers, selectUpcomingBookings, useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';

export function DashboardOverview() {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const bookings = useAccountStore((state) => state.bookings);
  const vouchers = useAccountStore((state) => state.vouchers);
  const lessons = useAccountStore((state) => state.lessons);
  const events = useAccountStore((state) => state.eventRegistrations);
  const fnbOrders = useAccountStore((state) => state.fnbOrders);

  if (!hydrated || !user) return null;

  const upcoming = selectUpcomingBookings(bookings);
  const activeVouchers = selectActiveVouchers(vouchers);
  const nextLesson = lessons
    .filter((lesson) => lesson.status === 'scheduled')
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))[0];
  const tier = user.membershipTier ? MEMBERSHIP_BY_ID[user.membershipTier] : null;

  /* Gợi ý khung giờ — dựa trên dữ liệu lịch trống, chưa phải mô hình AI. */
  const today = todayKey();
  const suggestedSlots = getTimeSlots(today)
    .filter((slot) => slot.status === 'available' && slot.pricing === 'off-peak')
    .slice(0, 3);
  const recommendedCoach = coachService.recommend('coaching', 1)[0];
  const dayMeta = getDayMeta(today);

  const greeting = getGreeting();

  return (
    <div>
      <PortalHeader
        title={`${greeting}, ${user.fullName.split(' ').slice(-1)[0]}`}
        description={`Hôm nay là ${formatDateLong(today)}. Đây là tổng quan tài khoản của bạn.`}
        action={
          <Button asChild variant="accent">
            <Link href="/booking">
              Đặt lịch mới
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        }
      />

      {/* Thẻ chỉ số */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={<Crown className="size-5" />}
          label="Hạng hội viên"
          value={tier?.name ?? 'Chưa có hạng'}
          hint={
            user.membershipExpiresAt
              ? `Hiệu lực đến ${formatDateShort(user.membershipExpiresAt)}`
              : 'Đăng ký để nhận ưu đãi'
          }
          tone="gold"
          href="/dashboard/membership"
        />
        <MetricCard
          icon={<Wallet className="size-5" />}
          label="Số dư ví Lotus"
          value={formatCurrency(user.walletBalance)}
          hint="Dùng cho mọi dịch vụ tại Lotus"
          tone="accent"
          href="/dashboard/wallet"
        />
        <MetricCard
          icon={<Coins className="size-5" />}
          label="Điểm thưởng"
          value={formatNumber(user.loyaltyPoints)}
          hint="Tích 1 điểm cho mỗi 10.000đ chi tiêu"
        />
        <MetricCard
          icon={<Ticket className="size-5" />}
          label="Voucher đang có"
          value={`${activeVouchers.length} voucher`}
          hint="Tự động áp dụng khi đặt lịch"
          href="/dashboard/vouchers"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          {/* Booking sắp tới */}
          <Panel
            title="Lịch đặt sắp tới"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/bookings">
                  Xem tất cả
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            }
          >
            {upcoming.length === 0 ? (
              <EmptyState
                title="Chưa có lịch nào sắp tới"
                description="Đặt một buổi tập để bắt đầu — chỉ mất chưa tới hai phút."
                icon={CalendarCheck}
                className="border-0"
                action={
                  <Button asChild variant="accent">
                    <Link href="/booking">Đặt lịch ngay</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {upcoming.slice(0, 3).map((booking) => (
                  <li key={booking.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0">
                    <span className="flex size-12 shrink-0 flex-col items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-navy-700)] text-[var(--color-champagne-100)]">
                      <span className="text-base leading-none font-medium">
                        {booking.date.slice(8, 10)}
                      </span>
                      <span className="mt-0.5 text-[10px] leading-none">TH{Number(booking.date.slice(5, 7))}</span>
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{booking.experienceLabel}</p>
                      <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                        {booking.time} · {booking.zoneName}
                        {booking.coachName ? ` · ${booking.coachName}` : ''}
                      </p>
                    </div>

                    <Badge variant="success" size="sm">
                      {booking.code}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Buổi học sắp tới */}
          <Panel
            title="Buổi học sắp tới"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/lessons">
                  Xem lộ trình
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            }
          >
            {!nextLesson ? (
              <EmptyState
                title="Chưa có buổi học nào"
                description="Đặt buổi đánh giá đầu vào để huấn luyện viên xây lộ trình phù hợp với bạn."
                icon={GraduationCap}
                className="border-0"
                action={
                  <Button asChild variant="outline">
                    <Link href="/academy">Xem chương trình học</Link>
                  </Button>
                }
              />
            ) : (
              <div className="rounded-[var(--radius-md)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{nextLesson.programName}</p>
                    <p className="mt-1 text-sm text-[var(--color-golf-800)]">
                      {formatDateLong(nextLesson.date)} · {nextLesson.time} · {nextLesson.coachName}
                    </p>
                  </div>
                  <Badge variant="accent" size="sm">
                    Sắp diễn ra
                  </Badge>
                </div>
                <p className="mt-4 text-sm text-[var(--color-golf-800)]">
                  <span className="font-medium">Trọng tâm buổi này:</span> {nextLesson.focus}
                </p>
                <p className="mt-2 text-sm text-[var(--color-golf-800)]">
                  <span className="font-medium">Bài tập về nhà:</span> {nextLesson.homework}
                </p>
              </div>
            )}
          </Panel>

          {/* Sự kiện đã đăng ký */}
          <Panel
            title="Sự kiện đã đăng ký"
            action={
              <Button asChild variant="ghost" size="sm">
                <Link href="/dashboard/events">
                  Xem tất cả
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            }
          >
            {events.length === 0 ? (
              <EmptyState
                title="Bạn chưa đăng ký sự kiện nào"
                description="Lotus tổ chức giải đấu, workshop và networking hằng tháng."
                icon={Trophy}
                className="border-0"
                action={
                  <Button asChild variant="outline">
                    <Link href="/events">Xem lịch sự kiện</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {events.slice(0, 3).map((registration) => (
                  <li key={registration.id} className="flex flex-wrap items-center gap-4 py-4 first:pt-0">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{registration.eventTitle}</p>
                      <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                        {formatDateLong(registration.startsAt)} · {registration.location}
                      </p>
                    </div>
                    <Badge variant="info" size="sm">
                      {registration.attendees} người
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Gợi ý thông minh */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-[var(--color-gold)]" aria-hidden />
              <p className="text-sm font-medium text-[var(--color-champagne-800)]">Gợi ý cho bạn hôm nay</p>
            </div>

            <ul className="space-y-3 text-sm text-[var(--color-champagne-800)]">
              {suggestedSlots.length > 0 ? (
                <li className="flex gap-2.5">
                  <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    Khung giờ thấp điểm còn trống hôm nay:{' '}
                    <span className="font-medium">{suggestedSlots.map((slot) => slot.time).join(', ')}</span> —
                    giá tốt hơn 20%.
                  </span>
                </li>
              ) : null}

              {dayMeta.hasPromotion ? (
                <li className="flex gap-2.5">
                  <Ticket className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>Hôm nay đang có ưu đãi giờ thấp điểm — dùng mã OFFPEAK25 để giảm thêm 25%.</span>
                </li>
              ) : null}

              {recommendedCoach ? (
                <li className="flex gap-2.5">
                  <GraduationCap className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    Huấn luyện viên phù hợp với mục tiêu của bạn:{' '}
                    <Link
                      href={`/coaches/${recommendedCoach.slug}`}
                      className="font-medium underline underline-offset-4"
                    >
                      {recommendedCoach.name}
                    </Link>
                    .
                  </span>
                </li>
              ) : null}

              {tier && tier.id !== 'founder' ? (
                <li className="flex gap-2.5">
                  <Crown className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    Bạn đang ở hạng {tier.name}. Nâng hạng để tăng bonus nạp ví và mức ưu đãi giá sân.
                  </span>
                </li>
              ) : null}

              {bookings.some((booking) => booking.status === 'completed') ? (
                <li className="flex gap-2.5">
                  <CalendarCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
                  <span>
                    Đã một thời gian từ buổi tập gần nhất. Đặt lịch lại để giữ nhịp luyện tập đều đặn.
                  </span>
                </li>
              ) : null}
            </ul>

            <p className="mt-4 text-xs leading-relaxed text-[var(--color-champagne-800)]/80">
              Gợi ý dựa trên khung giờ trống và các ưu đãi hiện có tại Lotus.
            </p>
          </div>

          {/* Voucher */}
          <Panel title="Voucher của bạn">
            {activeVouchers.length === 0 ? (
              <EmptyState
                title="Chưa có voucher"
                description="Lưu voucher từ trang ưu đãi để dùng khi đặt lịch."
                icon={Ticket}
                className="border-0"
                action={
                  <Button asChild variant="outline" size="sm">
                    <Link href="/vouchers">Xem voucher</Link>
                  </Button>
                }
              />
            ) : (
              <ul className="space-y-3">
                {activeVouchers.slice(0, 3).map((voucher) => (
                  <li
                    key={voucher.id}
                    className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] p-4"
                  >
                    <p className="text-sm font-medium">{voucher.name}</p>
                    <p className="mt-1 font-mono text-xs text-[var(--color-muted)]">{voucher.code}</p>
                    <p className="mt-1.5 text-sm text-[var(--color-accent)]">{voucher.discountLabel}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          {/* Đơn F&B gần đây */}
          {fnbOrders.length > 0 ? (
            <Panel title="Đơn F&B gần đây">
              <ul className="divide-y divide-[var(--color-border)]">
                {fnbOrders.slice(0, 3).map((order) => (
                  <li key={order.id} className="flex items-center justify-between gap-3 py-3 first:pt-0">
                    <div className="min-w-0">
                      <p className="font-mono text-sm font-medium">{order.code}</p>
                      <p className="mt-0.5 truncate text-xs text-[var(--color-muted)]">
                        {order.items.map((item) => `${item.name} ×${item.quantity}`).join(', ')}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium">{formatCurrency(order.total)}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
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
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  tone?: 'default' | 'accent' | 'gold';
  href?: string;
}) {
  const toneClass = {
    default: 'border-[var(--color-border)] bg-[var(--color-background)]',
    accent: 'border-[var(--color-golf-200)] bg-[var(--color-golf-50)]',
    gold: 'border-[var(--color-champagne-200)] bg-[var(--color-champagne-50)]',
  }[tone];

  const content = (
    <>
      <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-[var(--color-surface-raised)] text-[var(--color-accent)]">
        {icon}
      </span>
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-xl">{value}</p>
      <p className="mt-1.5 text-xs text-[var(--color-muted)]">{hint}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href as never}
        className={cn(
          'rounded-[var(--radius-lg)] border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]',
          toneClass,
        )}
      >
        {content}
      </Link>
    );
  }

  return <div className={cn('rounded-[var(--radius-lg)] border p-5', toneClass)}>{content}</div>;
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 11) return 'Chào buổi sáng';
  if (hour < 14) return 'Chào buổi trưa';
  if (hour < 18) return 'Chào buổi chiều';
  return 'Chào buổi tối';
}
