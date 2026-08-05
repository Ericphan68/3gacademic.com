'use client';

import { CalendarDays, Clock, Info, MapPin, Sparkles, User, Users } from 'lucide-react';
import Image from 'next/image';
import { type ReactNode, useState } from 'react';

import { StepCoach, StepZone } from './steps/step-details';
import { StepDate, StepExperience, StepTime } from './steps/step-schedule';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/form-fields';
import { Rating } from '@/components/ui/misc';
import { BLUR_DATA_URL } from '@/constants/media';
import { formatCurrency, formatDateLong, formatDuration } from '@/lib/format';
import { bookingOptionService, coachService } from '@/services/catalogService';
import type { BookingDraft, BookingExperienceType, ZoneId } from '@/types';

type Panel = 'experience' | 'coach' | 'zone' | null;

export function BookingScheduleStep({
  draft,
  notice,
  onExperienceChange,
  onCoachChange,
  onDateChange,
  onTimeChange,
  onGuestsChange,
  onZoneChange,
}: {
  draft: BookingDraft;
  notice?: string | null;
  onExperienceChange: (type: BookingExperienceType, suggestedZone: ZoneId) => void;
  onCoachChange: (coachId: string | null) => void;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onGuestsChange: (guests: number) => void;
  onZoneChange: (zone: ZoneId) => void;
}) {
  // Khi chưa chọn trải nghiệm, bộ chọn tự hiện (nhánh render bên dưới); không cần mở panel.
  const [panel, setPanel] = useState<Panel>(null);

  const experience = draft.experienceType
    ? bookingOptionService.getExperienceType(draft.experienceType)
    : undefined;
  const zone = draft.zoneId ? bookingOptionService.getZone(draft.zoneId) : undefined;
  const coach = draft.coachId ? coachService.getById(draft.coachId) : undefined;

  const togglePanel = (next: Panel) => setPanel((prev) => (prev === next ? null : next));

  const handleExperience = (type: BookingExperienceType, suggestedZone: ZoneId) => {
    onExperienceChange(type, suggestedZone);
    setPanel(null);
  };
  const handleCoach = (coachId: string | null) => {
    onCoachChange(coachId);
    setPanel(null);
  };
  const handleZone = (zoneId: ZoneId) => {
    onZoneChange(zoneId);
    setPanel(null);
  };

  return (
    <div className="space-y-8">
      {notice ? (
        <p
          className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-champagne-300)] bg-[var(--color-champagne-50)] p-4 text-sm text-[var(--color-champagne-800)]"
          role="status"
        >
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          {notice}
        </p>
      ) : null}

      {/* ---------- Trải nghiệm ---------- */}
      <section aria-labelledby="sched-experience">
        <SectionHead
          id="sched-experience"
          icon={<Sparkles className="size-4" aria-hidden />}
          title="Trải nghiệm"
          action={
            experience ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePanel('experience')}
                aria-expanded={panel === 'experience'}
              >
                {panel === 'experience' ? 'Đóng' : 'Thay đổi'}
              </Button>
            ) : null
          }
        />

        {experience && panel !== 'experience' ? (
          <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-golf-50)] p-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
              <Sparkles className="size-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{experience.name}</p>
              <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                {formatDuration(experience.durationMinutes)} · Từ {formatCurrency(experience.basePrice)}
              </p>
            </div>
          </div>
        ) : (
          <StepExperience value={draft.experienceType} onChange={handleExperience} />
        )}
      </section>

      {/* ---------- Huấn luyện viên ---------- */}
      <section aria-labelledby="sched-coach">
        <SectionHead
          id="sched-coach"
          icon={<User className="size-4" aria-hidden />}
          title="Huấn luyện viên"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => togglePanel('coach')}
              aria-expanded={panel === 'coach'}
            >
              {panel === 'coach' ? 'Đóng' : coach ? 'Thay đổi' : 'Chọn huấn luyện viên'}
            </Button>
          }
        />

        {panel === 'coach' ? (
          <StepCoach value={draft.coachId} experienceType={draft.experienceType} onChange={handleCoach} />
        ) : coach ? (
          <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-accent)] bg-[var(--color-golf-50)] p-4">
            <span className="relative block size-14 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-navy-800)]">
              <Image
                src={coach.avatar}
                alt=""
                fill
                sizes="3.5rem"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{coach.name}</p>
              <p className="mt-0.5 truncate text-sm text-[var(--color-muted)]">{coach.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted)]">
                <Rating value={coach.rating} count={coach.reviewCount} size="sm" />
                <span className="font-medium text-[var(--color-foreground)]">
                  {formatCurrency(coach.pricePerSession)} / buổi
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border-strong)] p-4 text-sm text-[var(--color-muted)]">
            <User className="size-4 shrink-0" aria-hidden />
            Tự tập, không cần huấn luyện viên. Bạn có thể thêm HLV bất cứ lúc nào.
          </div>
        )}
      </section>

      {/* ---------- Ngày ---------- */}
      <section aria-labelledby="sched-date">
        <SectionHead
          id="sched-date"
          icon={<CalendarDays className="size-4" aria-hidden />}
          title="Chọn ngày"
        />
        <StepDate value={draft.date} onChange={onDateChange} />
      </section>

      {/* ---------- Giờ ---------- */}
      {draft.date ? (
        <section aria-labelledby="sched-time">
          <SectionHead id="sched-time" icon={<Clock className="size-4" aria-hidden />} title="Chọn khung giờ" />
          <StepTime
            date={draft.date}
            value={draft.time}
            basePrice={experience?.basePrice ?? 0}
            onChange={onTimeChange}
          />
        </section>
      ) : null}

      {/* ---------- Số khách ---------- */}
      <section aria-labelledby="sched-guests">
        <SectionHead id="sched-guests" icon={<Users className="size-4" aria-hidden />} title="Số khách" />
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
          <p className="text-sm text-[var(--color-muted)]">
            Giá trải nghiệm được tính theo số khách. Dịch vụ bổ sung tính riêng ở bước sau.
          </p>
          <QuantityStepper value={draft.guests} onChange={onGuestsChange} min={1} max={20} label="số khách" />
        </div>
      </section>

      {/* ---------- Khu vực ---------- */}
      <section aria-labelledby="sched-zone">
        <SectionHead
          id="sched-zone"
          icon={<MapPin className="size-4" aria-hidden />}
          title="Khu vực tập"
          action={
            zone ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePanel('zone')}
                aria-expanded={panel === 'zone'}
              >
                {panel === 'zone' ? 'Đóng' : 'Thay đổi'}
              </Button>
            ) : null
          }
        />

        {zone && panel !== 'zone' ? (
          <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-4">
            <MapPin className="size-5 shrink-0 text-[var(--color-accent)]" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{zone.name}</p>
              <p className="mt-0.5 text-sm text-[var(--color-muted)]">{zone.capacityNote}</p>
            </div>
            <Badge variant="neutral" size="sm">
              {zone.surcharge === 0 ? 'Không phụ thu' : `+${formatCurrency(zone.surcharge)}`}
            </Badge>
          </div>
        ) : (
          <StepZone value={draft.zoneId} onChange={handleZone} />
        )}
      </section>

      {draft.date && !draft.time ? (
        <p className="text-sm text-[var(--color-muted)]" role="status">
          Chọn thêm một khung giờ còn chỗ cho ngày {formatDateLong(draft.date)} để tiếp tục.
        </p>
      ) : null}
    </div>
  );
}

function SectionHead({
  id,
  icon,
  title,
  action,
}: {
  id: string;
  icon: ReactNode;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 id={id} className="flex items-center gap-2 text-lg">
        <span className="text-[var(--color-accent)]">{icon}</span>
        {title}
      </h2>
      {action}
    </div>
  );
}
