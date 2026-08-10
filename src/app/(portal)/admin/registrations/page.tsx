'use client';

import { CalendarClock, MapPin, ReceiptText, Ticket, Users } from 'lucide-react';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/states';
import { LEAD_TYPE_LABELS } from '@/features/admin/shared';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDateLong } from '@/lib/format';
import { useAccountStore } from '@/store/useAccountStore';

export default function AdminRegistrationsPage() {
  const hydrated = useHydrated();
  const eventRegistrations = useAccountStore((state) => state.eventRegistrations);
  const leads = useAccountStore((state) => state.leads);

  if (!hydrated) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const sortedEvents = [...eventRegistrations].sort((a, b) =>
    b.registeredAt.localeCompare(a.registeredAt),
  );
  const sortedLeads = [...leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <PortalHeader
        title="Đăng ký & yêu cầu"
        description="Đăng ký sự kiện và các yêu cầu từ form liên hệ, doanh nghiệp, tour và đại lý."
      />

      {/* Đăng ký sự kiện */}
      <section aria-labelledby="admin-events">
        <h2 id="admin-events" className="mb-4 flex items-center gap-2 text-xl">
          <Ticket className="size-5 text-[var(--color-accent)]" aria-hidden />
          Đăng ký sự kiện ({sortedEvents.length})
        </h2>

        {sortedEvents.length === 0 ? (
          <EmptyState
            title="Chưa có đăng ký sự kiện"
            description="Lượt đăng ký sự kiện sẽ hiển thị tại đây."
            icon={Ticket}
          />
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {sortedEvents.map((registration) => (
              <li
                key={registration.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5"
              >
                <p className="font-medium">{registration.eventTitle}</p>
                <ul className="mt-2 space-y-1.5 text-sm text-[var(--color-muted)]">
                  <li className="inline-flex items-center gap-1.5">
                    <CalendarClock className="size-4" aria-hidden />
                    {formatDateLong(registration.startsAt.slice(0, 10))}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <MapPin className="size-4" aria-hidden />
                    {registration.location}
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Users className="size-4" aria-hidden />
                    {registration.attendees} người · {formatCurrency(registration.fee)}
                  </li>
                </ul>
                <p className="mt-3 text-xs text-[var(--color-muted)]">
                  Đăng ký ngày {formatDateLong(registration.registeredAt.slice(0, 10))}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Yêu cầu & liên hệ */}
      <section aria-labelledby="admin-leads" className="mt-12">
        <h2 id="admin-leads" className="mb-4 flex items-center gap-2 text-xl">
          <ReceiptText className="size-5 text-[var(--color-accent)]" aria-hidden />
          Yêu cầu & liên hệ ({sortedLeads.length})
        </h2>

        {sortedLeads.length === 0 ? (
          <EmptyState
            title="Chưa có yêu cầu nào"
            description="Yêu cầu từ form liên hệ, doanh nghiệp, tour và đại lý sẽ hiển thị tại đây."
            icon={ReceiptText}
          />
        ) : (
          <ul className="space-y-3">
            {sortedLeads.map((lead) => (
              <li
                key={lead.id}
                className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium">{lead.summary}</p>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">
                      {formatDateLong(lead.createdAt.slice(0, 10))}
                    </p>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {LEAD_TYPE_LABELS[lead.type]}
                  </Badge>
                </div>

                <dl className="mt-3 grid gap-x-6 gap-y-1.5 border-t border-[var(--color-border)] pt-3 text-sm sm:grid-cols-2">
                  {Object.entries(lead.payload).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-3">
                      <dt className="text-[var(--color-muted)]">{key}</dt>
                      <dd className="text-right font-medium break-all">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
