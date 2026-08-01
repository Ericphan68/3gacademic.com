'use client';

import { Check, Info, Sparkles, UserX } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

import { getIcon } from '@/components/common/icon-registry';
import { Badge } from '@/components/ui/badge';
import { Checkbox, Field, Input, Label, QuantityStepper, Select, Textarea } from '@/components/ui/form-fields';
import { Rating } from '@/components/ui/misc';
import { BLUR_DATA_URL } from '@/constants/media';
import { LANGUAGE_LABELS, SPECIALTY_LABELS } from '@/data/coaches';
import { getNextAvailability } from '@/lib/availability';
import { formatCurrency, formatDateShort } from '@/lib/format';
import { cn } from '@/lib/utils';
import { bookingOptionService, coachService } from '@/services/catalogService';
import type { BookingContact, CoachLanguage, CoachSpecialty, ZoneId } from '@/types';

/* ============================================================
   Bước 4 — Chọn khu vực
   ============================================================ */

export function StepZone({ value, onChange }: { value: ZoneId | null; onChange: (zone: ZoneId) => void }) {
  const zones = bookingOptionService.getZones();

  return (
    <fieldset>
      <legend className="sr-only">Chọn khu vực tập luyện</legend>
      <div className="grid gap-4 sm:grid-cols-2">
        {zones.map((zone) => {
          const active = value === zone.id;
          return (
            <button
              key={zone.id}
              type="button"
              onClick={() => onChange(zone.id)}
              aria-pressed={active}
              className={cn(
                'group flex cursor-pointer flex-col overflow-hidden rounded-[var(--radius-lg)] border text-left transition-all duration-200',
                active
                  ? 'border-[var(--color-accent)] shadow-[var(--shadow-subtle)]'
                  : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
              )}
            >
              <span className="relative block aspect-[16/9] overflow-hidden bg-[var(--color-muted-surface)]">
                <Image
                  src={zone.image}
                  alt={`Khu vực ${zone.name}`}
                  fill
                  sizes="(min-width: 640px) 45vw, 92vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                {active ? (
                  <span className="absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
                    <Check className="size-4" strokeWidth={3} aria-hidden />
                  </span>
                ) : null}
              </span>

              <span className="flex flex-1 flex-col p-5">
                <span className="flex items-start justify-between gap-3">
                  <span className="text-base font-medium">{zone.name}</span>
                  <span className="shrink-0 text-sm font-medium">
                    {zone.surcharge === 0 ? 'Không phụ thu' : `+${formatCurrency(zone.surcharge)}`}
                  </span>
                </span>
                <span className="mt-2 flex-1 text-sm text-[var(--color-muted)]">{zone.description}</span>
                <span className="mt-3 text-xs text-[var(--color-muted)]">{zone.capacityNote}</span>
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {zone.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="neutral" size="sm">
                      {feature}
                    </Badge>
                  ))}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ============================================================
   Bước 5 — Chọn huấn luyện viên
   ============================================================ */

export function StepCoach({
  value,
  experienceType,
  onChange,
}: {
  value: string | null;
  experienceType: string | null;
  onChange: (coachId: string | null) => void;
}) {
  const [specialty, setSpecialty] = useState<CoachSpecialty | 'all'>('all');
  const [language, setLanguage] = useState<CoachLanguage | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState('0');

  const recommended = useMemo(
    () => coachService.recommend(experienceType ?? 'range', 3).map((coach) => coach.id),
    [experienceType],
  );

  const coaches = useMemo(
    () =>
      coachService.filter({
        specialty,
        language,
        maxPrice: Number(maxPrice) || undefined,
        sort: 'recommended',
      }),
    [specialty, language, maxPrice],
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={value === null}
        className={cn(
          'mb-6 flex w-full cursor-pointer items-center gap-4 rounded-[var(--radius-lg)] border p-5 text-left transition-all duration-200',
          value === null
            ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
            : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
        )}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted-surface)] text-[var(--color-muted)]">
          <UserX className="size-5" aria-hidden />
        </span>
        <span className="flex-1">
          <span className="block text-base font-medium">Không cần huấn luyện viên</span>
          <span className="mt-0.5 block text-sm text-[var(--color-muted)]">
            Tự tập tại khu vực đã chọn. Nhân viên vẫn hỗ trợ khi bạn cần.
          </span>
        </span>
        {value === null ? (
          <Check className="size-5 shrink-0 text-[var(--color-accent)]" strokeWidth={3} aria-hidden />
        ) : null}
      </button>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Field label="Chuyên môn" htmlFor="booking-coach-specialty">
          <Select
            id="booking-coach-specialty"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value as CoachSpecialty | 'all')}
          >
            <option value="all">Tất cả chuyên môn</option>
            {(Object.keys(SPECIALTY_LABELS) as CoachSpecialty[]).map((key) => (
              <option key={key} value={key}>
                {SPECIALTY_LABELS[key]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Ngôn ngữ" htmlFor="booking-coach-language">
          <Select
            id="booking-coach-language"
            value={language}
            onChange={(event) => setLanguage(event.target.value as CoachLanguage | 'all')}
          >
            <option value="all">Tất cả ngôn ngữ</option>
            {(Object.keys(LANGUAGE_LABELS) as CoachLanguage[]).map((key) => (
              <option key={key} value={key}>
                {LANGUAGE_LABELS[key]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Mức giá" htmlFor="booking-coach-price">
          <Select
            id="booking-coach-price"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          >
            <option value="0">Tất cả mức giá</option>
            <option value="700000">Dưới 700.000đ</option>
            <option value="900000">Dưới 900.000đ</option>
            <option value="1200000">Dưới 1.200.000đ</option>
          </Select>
        </Field>
      </div>

      {coaches.length === 0 ? (
        <p className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] p-6 text-center text-sm text-[var(--color-muted)]">
          Không có huấn luyện viên phù hợp với bộ lọc này. Bạn thử nới rộng điều kiện nhé.
        </p>
      ) : (
        <ul className="grid gap-3">
          {coaches.map((coach) => {
            const active = value === coach.id;
            const next = getNextAvailability(coach.id);
            const isRecommended = recommended.includes(coach.id);

            return (
              <li key={coach.id}>
                <button
                  type="button"
                  onClick={() => onChange(coach.id)}
                  aria-pressed={active}
                  className={cn(
                    'flex w-full cursor-pointer items-start gap-4 rounded-[var(--radius-lg)] border p-4 text-left transition-all duration-200',
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                      : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                  )}
                >
                  <span className="relative block size-16 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-navy-800)]">
                    <Image
                      src={coach.avatar}
                      alt=""
                      fill
                      sizes="4rem"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                      className="object-cover"
                    />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{coach.name}</span>
                      {isRecommended ? (
                        <Badge variant="gold" size="sm">
                          <Sparkles className="size-3" aria-hidden />
                          Đề xuất
                        </Badge>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--color-muted)]">{coach.title}</span>

                    <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[var(--color-muted)]">
                      <Rating value={coach.rating} count={coach.reviewCount} size="sm" />
                      <span>{coach.languages.map((lang) => LANGUAGE_LABELS[lang]).join(' · ')}</span>
                      {next ? (
                        <span>
                          Trống: {formatDateShort(next.date)} · {next.time}
                        </span>
                      ) : null}
                    </span>
                  </span>

                  <span className="shrink-0 text-right">
                    <span className="block font-medium">{formatCurrency(coach.pricePerSession)}</span>
                    <span className="block text-xs text-[var(--color-muted)]">/ buổi</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ============================================================
   Bước 6 — Số khách và dịch vụ bổ sung
   ============================================================ */

export function StepGuests({
  guests,
  addOns,
  onGuestsChange,
  onAddOnChange,
}: {
  guests: number;
  addOns: Record<string, number>;
  onGuestsChange: (guests: number) => void;
  onAddOnChange: (id: string, quantity: number) => void;
}) {
  const items = bookingOptionService.getAddOns();

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
        <div>
          <p className="text-base font-medium">Số khách</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Giá trải nghiệm được tính theo số khách. Dịch vụ bổ sung tính riêng theo số lượng bạn chọn.
          </p>
        </div>
        <QuantityStepper value={guests} onChange={onGuestsChange} min={1} max={20} label="số khách" />
      </div>

      <div>
        <p className="mb-4 text-base font-medium">Dịch vụ bổ sung</p>
        <ul className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const quantity = addOns[item.id] ?? 0;
            const Icon = getIcon(item.icon);

            return (
              <li
                key={item.id}
                className={cn(
                  'flex items-start gap-4 rounded-[var(--radius-lg)] border p-4 transition-colors',
                  quantity > 0 ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]' : 'border-[var(--color-border)]',
                )}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-muted-surface)] text-[var(--color-accent)]">
                  <Icon className="size-4" aria-hidden />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="mt-0.5 text-xs text-[var(--color-muted)]">{item.description}</p>
                  <p className="mt-1.5 text-sm font-medium">
                    {formatCurrency(item.price)}
                    <span className="font-normal text-[var(--color-muted)]"> / {item.unit}</span>
                  </p>
                </div>

                <QuantityStepper
                  value={quantity}
                  onChange={(next) => onAddOnChange(item.id, next)}
                  min={0}
                  max={item.max}
                  label={item.name}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ============================================================
   Bước 8 — Thông tin khách hàng
   ============================================================ */

export function StepContact({
  contact,
  acceptedTerms,
  onContactChange,
  onTermsChange,
}: {
  contact: BookingContact;
  acceptedTerms: boolean;
  onContactChange: (patch: Partial<BookingContact>) => void;
  onTermsChange: (accepted: boolean) => void;
}) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const nameError =
    touched.fullName && contact.fullName.trim().length < 2 ? 'Vui lòng nhập họ tên đầy đủ' : undefined;
  const phoneError =
    touched.phone && !/^0\d{9}$/.test(contact.phone.trim())
      ? 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0'
      : undefined;
  const emailError =
    touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())
      ? 'Email chưa đúng định dạng'
      : undefined;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Họ và tên" htmlFor="booking-name" required error={nameError}>
          <Input
            id="booking-name"
            value={contact.fullName}
            onChange={(event) => onContactChange({ fullName: event.target.value })}
            onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            invalid={Boolean(nameError)}
          />
        </Field>

        <Field label="Số điện thoại" htmlFor="booking-phone" required error={phoneError}>
          <Input
            id="booking-phone"
            type="tel"
            inputMode="numeric"
            value={contact.phone}
            onChange={(event) => onContactChange({ phone: event.target.value })}
            onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
            placeholder="0901234567"
            autoComplete="tel"
            invalid={Boolean(phoneError)}
          />
        </Field>
      </div>

      <Field
        label="Email"
        htmlFor="booking-email"
        required
        error={emailError}
        helper="Lotus gửi xác nhận đặt lịch và mã QR check-in qua email này."
      >
        <Input
          id="booking-email"
          type="email"
          value={contact.email}
          onChange={(event) => onContactChange({ email: event.target.value })}
          onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
          placeholder="email@cua-ban.com"
          autoComplete="email"
          invalid={Boolean(emailError)}
        />
      </Field>

      <Field
        label="Ghi chú cho Lotus"
        htmlFor="booking-note"
        helper="Ví dụ: cần huấn luyện viên nói tiếng Anh, tay thuận trái, đi cùng trẻ nhỏ…"
      >
        <Textarea
          id="booking-note"
          value={contact.note}
          onChange={(event) => onContactChange({ note: event.target.value })}
          placeholder="Điều gì giúp Lotus phục vụ bạn tốt hơn?"
          maxLength={500}
        />
      </Field>

      <div className="space-y-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <div className="flex items-start gap-3">
          <Checkbox
            id="booking-first-time"
            checked={contact.isFirstTime}
            onCheckedChange={(checked) => onContactChange({ isFirstTime: checked === true })}
          />
          <div>
            <Label htmlFor="booking-first-time">Đây là lần đầu tôi đến Lotus</Label>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Chúng tôi sẽ bố trí nhân viên đón và hướng dẫn bạn từ đầu buổi.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="booking-terms"
            checked={acceptedTerms}
            onCheckedChange={(checked) => onTermsChange(checked === true)}
          />
          <div>
            <Label htmlFor="booking-terms" required>
              Tôi đồng ý với điều khoản sử dụng và chính sách đổi lịch
            </Label>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              Đổi lịch miễn phí trước 4 giờ. Huỷ đúng hạn được hoàn vào ví Lotus.
            </p>
          </div>
        </div>
      </div>

      {contact.isFirstTime ? (
        <p className="flex items-start gap-2 rounded-[var(--radius-md)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-4 text-sm text-[var(--color-golf-800)]">
          <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
          Chào mừng bạn đến Lotus lần đầu. Bạn sẽ được đón tại sảnh và có nhân viên đi cùng trong suốt buổi
          tập đầu tiên.
        </p>
      ) : null}
    </div>
  );
}
