'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarPlus, Check, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Label, QuantityStepper, Textarea } from '@/components/ui/form-fields';
import { DemoQrCode, ProgressBar, Separator } from '@/components/ui/misc';
import { PAYMENT_METHODS } from '@/data/booking-options';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency, formatDateLong, formatTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { EventRegistration, GolfEvent, PaymentMethod } from '@/types';

const schema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên đầy đủ'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
  note: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
  accepted: z.literal(true, { message: 'Bạn cần đồng ý điều lệ sự kiện' }),
});

type FormValues = z.infer<typeof schema>;

export function EventRegistrationForm({ event }: { event: GolfEvent }) {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const setWalletBalance = useAuthStore((state) => state.setWalletBalance);
  const registerEvent = useAccountStore((state) => state.registerEvent);
  const addTransaction = useAccountStore((state) => state.addTransaction);
  const registrations = useAccountStore((state) => state.eventRegistrations);

  const [attendees, setAttendees] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('at-center');
  const [result, setResult] = useState<EventRegistration | null>(null);

  const alreadyRegistered =
    hydrated && registrations.some((item) => item.eventId === event.id);
  const seatsLeft = event.capacity - event.registered;
  const soldOut = seatsLeft <= 0;
  const total = event.fee * attendees;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? '',
      phone: user?.phone ?? '',
      email: user?.email ?? '',
      note: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (alreadyRegistered) {
      toast.info('Bạn đã đăng ký sự kiện này rồi.');
      return;
    }
    if (paymentMethod === 'wallet' && total > 0) {
      if (!user) {
        toast.error('Bạn cần đăng nhập', { description: 'Đăng nhập để thanh toán bằng ví.' });
        return;
      }
      if (user.walletBalance < total) {
        toast.error('Số dư ví không đủ', {
          description: `Bạn cần thêm ${formatCurrency(total - user.walletBalance)}. Hãy nạp ví trước.`,
        });
        return;
      }
    }

    // Đăng ký lưu THẬT ở server (đếm chỗ + chống trùng + trừ ví nếu trả ví).
    const res = await fetch('/api/events/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug: event.slug,
        attendees,
        paymentMethod,
        contact: { fullName: values.fullName, phone: values.phone, email: values.email },
      }),
    });
    const body = (await res.json().catch(() => null)) as { balance?: number; error?: string } | null;
    if (!res.ok) {
      toast.error('Chưa đăng ký được', { description: body?.error });
      return;
    }

    if (typeof body?.balance === 'number') {
      setWalletBalance(body.balance);
      addTransaction({
        type: 'payment',
        label: `Phí sự kiện · ${event.title}`,
        amount: -total,
        balanceAfter: body.balance,
      });
    }

    const entry = registerEvent({
      eventId: event.id,
      eventSlug: event.slug,
      eventTitle: event.title,
      startsAt: event.startsAt,
      location: event.location,
      attendees,
      fee: total,
    });

    setResult(entry);
    toast.success('Đăng ký sự kiện thành công', {
      description: `${event.title} — Lotus sẽ liên hệ xác nhận với bạn.`,
    });
  };

  if (result) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-6">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
            <Check className="size-5" strokeWidth={3} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg">Đã ghi nhận đăng ký</h3>
            <p className="mt-1 text-sm text-[var(--color-golf-800)]">
              {event.title} · {formatDateLong(event.startsAt)} lúc {formatTime(event.startsAt)}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center gap-5 rounded-[var(--radius-md)] bg-[var(--color-surface-raised)] p-5 sm:flex-row">
          <DemoQrCode payload={result.qrPayload} size={120} className="shrink-0 border border-[var(--color-border)]" />
          <div className="text-center sm:text-left">
            <p className="text-xs tracking-widest text-[var(--color-muted)] uppercase">Mã check-in sự kiện</p>
            <p className="mt-1 font-mono text-sm font-medium break-all">{result.qrPayload}</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {result.attendees} người tham dự · {result.fee === 0 ? 'Miễn phí' : formatCurrency(result.fee)}
            </p>
            <Badge variant="neutral" size="sm" className="mt-2">
              Mã QR check-in sự kiện
            </Badge>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button asChild variant="outline">
            <a href={buildCalendarUrl(event)} target="_blank" rel="noopener noreferrer">
              <CalendarPlus aria-hidden />
              Thêm vào lịch
            </a>
          </Button>
          <Button asChild variant="accent">
            <Link href="/dashboard/events">Xem trong tài khoản</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6">
      <h3 className="text-lg">Đăng ký tham dự</h3>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 text-[var(--color-muted)]">
            <Users className="size-4" aria-hidden />
            {event.registered}/{event.capacity} đã đăng ký
          </span>
          <span className={cn('font-medium', seatsLeft <= 10 && 'text-[var(--color-warning)]')}>
            {soldOut ? 'Hết chỗ' : `Còn ${seatsLeft} chỗ`}
          </span>
        </div>
        <ProgressBar
          value={event.registered}
          max={event.capacity}
          tone={seatsLeft <= 10 ? 'gold' : 'accent'}
          label={`Đã đăng ký ${event.registered} trên ${event.capacity} chỗ`}
        />
      </div>

      {alreadyRegistered ? (
        <div className="mt-5 rounded-[var(--radius-md)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-4 text-sm text-[var(--color-golf-800)]">
          Bạn đã đăng ký sự kiện này. Xem lại trong{' '}
          <Link href="/dashboard/events" className="font-medium underline underline-offset-4">
            mục Sự kiện
          </Link>{' '}
          của tài khoản.
        </div>
      ) : null}

      <Separator className="my-6" />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        <Field label="Họ và tên" htmlFor="event-name" required error={errors.fullName?.message}>
          <Input
            id="event-name"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            invalid={Boolean(errors.fullName)}
            {...register('fullName')}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Số điện thoại" htmlFor="event-phone" required error={errors.phone?.message}>
            <Input
              id="event-phone"
              type="tel"
              inputMode="numeric"
              placeholder="0901234567"
              autoComplete="tel"
              invalid={Boolean(errors.phone)}
              {...register('phone')}
            />
          </Field>

          <Field label="Email" htmlFor="event-email" required error={errors.email?.message}>
            <Input
              id="event-email"
              type="email"
              placeholder="email@cua-ban.com"
              autoComplete="email"
              invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] p-4">
          <div>
            <p className="text-sm font-medium">Số người tham dự</p>
            <p className="mt-0.5 text-xs text-[var(--color-muted)]">
              Phí tính theo số người đăng ký.
            </p>
          </div>
          <QuantityStepper
            value={attendees}
            onChange={setAttendees}
            min={1}
            max={Math.max(1, Math.min(10, seatsLeft))}
            label="số người tham dự"
          />
        </div>

        <Field label="Ghi chú" htmlFor="event-note" error={errors.note?.message}>
          <Textarea
            id="event-note"
            rows={3}
            placeholder="Yêu cầu về suất ăn, dị ứng, cần hỗ trợ đặc biệt…"
            {...register('note')}
          />
        </Field>

        <fieldset>
          <legend className="mb-3 text-sm font-medium">Phương thức thanh toán</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                aria-pressed={paymentMethod === method.id}
                className={cn(
                  'cursor-pointer rounded-[var(--radius-md)] border px-4 py-3 text-left text-sm transition-colors',
                  paymentMethod === method.id
                    ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                    : 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]',
                )}
              >
                {method.name}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="flex items-start gap-3">
          <Checkbox
            id="event-accept"
            onCheckedChange={(checked) =>
              setValue('accepted', (checked === true) as true, { shouldValidate: true })
            }
          />
          <div>
            <Label htmlFor="event-accept" required>
              Tôi đã đọc và đồng ý điều lệ sự kiện
            </Label>
            {errors.accepted ? (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.accepted.message}</p>
            ) : null}
          </div>
        </div>

        <div className="flex items-baseline justify-between gap-3 border-t border-[var(--color-border)] pt-4">
          <span className="text-sm text-[var(--color-muted)]">Tổng phí tham dự</span>
          <span className="font-[family-name:var(--font-display)] text-2xl">
            {total === 0 ? 'Miễn phí' : formatCurrency(total)}
          </span>
        </div>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting} disabled={soldOut}>
          {soldOut ? 'Sự kiện đã hết chỗ' : 'Hoàn tất đăng ký'}
        </Button>

        <p className="text-center text-xs text-[var(--color-muted)]">
          Đăng ký được ghi nhận ngay. Lotus sẽ liên hệ xác nhận với bạn.
        </p>
      </form>
    </div>
  );
}

function buildCalendarUrl(event: GolfEvent): string {
  const stamp = (value: string) => format(new Date(value), "yyyyMMdd'T'HHmmss");
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Lotus Golf Center — ${event.title}`,
    dates: `${stamp(event.startsAt)}/${stamp(event.endsAt)}`,
    details: event.summary,
    location: `Lotus Golf Center — ${event.location}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
