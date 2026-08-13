'use client';

import { ArrowRight, CalendarClock, Check, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/overlays';
import { MEDIA } from '@/constants/media';
import { BOOKABLE_PACKAGES, type BookablePackage } from '@/data/course-pricing';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { BookingPaymentGateway } from '@/features/booking/booking-payment-gateway';
import type { PaymentMethod } from '@/types';

/** Ảnh minh hoạ theo nhóm gói (trang trí — không ảnh hưởng dữ liệu giá). */
const CATEGORY_IMAGE: Record<string, string> = {
  'Gói bóng tập': MEDIA.facility['driving-range'],
  'Sân Tee dài': MEDIA.hero.home,
  'Sân Tee ngắn (Người mới)': MEDIA.facility['putting-green'],
  'Đào tạo & trải nghiệm': MEDIA.facility.academy,
};
const FALLBACK_IMAGE = MEDIA.hero.home;

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; desc: string; instant: boolean }[] = [
  { id: 'momo', label: 'Ví MoMo', desc: 'Quét QR, thanh toán ngay', instant: true },
  { id: 'vnpay', label: 'VNPay QR', desc: 'App ngân hàng bất kỳ', instant: true },
  { id: 'transfer', label: 'Chuyển khoản', desc: 'Xác nhận sau khi chuyển', instant: false },
  { id: 'at-center', label: 'Trả tại quầy', desc: 'Thanh toán khi đến sân', instant: false },
];

type Phase = 'form' | 'gateway' | 'success';

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  method: PaymentMethod;
}

const emptyForm = (): FormState => ({
  fullName: '',
  phone: '',
  email: '',
  date: '',
  time: '',
  guests: '1',
  method: 'momo',
});

const genCode = () => `LG-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
const todayStr = () => new Date().toISOString().slice(0, 10);

export function PackageBooking() {
  const [selected, setSelected] = useState<BookablePackage | null>(null);
  const [phase, setPhase] = useState<Phase>('form');
  const [form, setForm] = useState<FormState>(emptyForm());
  const [pending, setPending] = useState<{ code: string; total: number } | null>(null);
  const [result, setResult] = useState<{ code: string; paid: boolean; method: PaymentMethod } | null>(null);

  const groups = useMemo(() => {
    const map = new Map<string, BookablePackage[]>();
    for (const pkg of BOOKABLE_PACKAGES) {
      const list = map.get(pkg.category) ?? [];
      list.push(pkg);
      map.set(pkg.category, list);
    }
    return [...map.entries()];
  }, []);

  const guests = Math.max(1, Number(form.guests) || 1);
  const total = selected ? selected.price * guests : 0;

  const open = (pkg: BookablePackage) => {
    setSelected(pkg);
    setForm(emptyForm());
    setPending(null);
    setResult(null);
    setPhase('form');
  };
  const close = () => {
    setSelected(null);
    setPhase('form');
  };

  const finalize = async (paid: boolean) => {
    if (!selected || !pending) return;
    const method = form.method;
    void fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: pending.code,
        experienceLabel: `Sân Golf An Phú Lotus · ${selected.name}`,
        date: form.date,
        time: form.time,
        durationMinutes: 0,
        zoneName: 'Sân Golf An Phú Lotus',
        guests,
        contact: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          note: null,
        },
        paymentMethod: method,
        paymentStatus: paid ? 'paid' : method === 'at-center' ? 'pay-later' : 'pending',
        status: 'upcoming',
        qrPayload: `LOTUS|COURSE|${pending.code}`,
        addOns: [],
        price: { total: pending.total },
      }),
    }).catch(() => {});
    setResult({ code: pending.code, paid, method });
    setPhase('success');
  };

  const submit = () => {
    if (!form.fullName.trim() || !form.phone.trim() || !form.date || !form.time) {
      toast.error('Vui lòng điền đủ họ tên, số điện thoại, ngày và giờ.');
      return;
    }
    const p = { code: genCode(), total };
    setPending(p);
    const opt = PAYMENT_OPTIONS.find((o) => o.id === form.method);
    if (opt?.instant) setPhase('gateway');
    else void finalizeAfter(p, false);
  };

  // finalize khi biết pending ngay (tránh phụ thuộc setState bất đồng bộ)
  const finalizeAfter = async (p: { code: string; total: number }, paid: boolean) => {
    const method = form.method;
    void fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: p.code,
        experienceLabel: `Sân Golf An Phú Lotus · ${selected?.name ?? ''}`,
        date: form.date,
        time: form.time,
        durationMinutes: 0,
        zoneName: 'Sân Golf An Phú Lotus',
        guests,
        contact: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || null,
          note: null,
        },
        paymentMethod: method,
        paymentStatus: paid ? 'paid' : method === 'at-center' ? 'pay-later' : 'pending',
        status: 'upcoming',
        qrPayload: `LOTUS|COURSE|${p.code}`,
        addOns: [],
        price: { total: p.total },
      }),
    }).catch(() => {});
    setResult({ code: p.code, paid, method });
    setPhase('success');
  };

  return (
    <>
      {groups.map(([category, packages]) => (
        <section key={category} className="mb-16 last:mb-0">
          <div className="mb-8 flex items-center gap-5">
            <p className="eyebrow shrink-0 text-[var(--color-accent)]">{category}</p>
            <span className="h-px flex-1 bg-[var(--color-border)]" aria-hidden />
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {packages.map((pkg) => (
              <article
                key={pkg.id}
                className={cn(
                  'group relative flex flex-col overflow-hidden rounded-[var(--radius-xl)] border bg-[var(--color-surface-raised)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]',
                  pkg.featured
                    ? 'border-[var(--color-accent)] ring-1 ring-[var(--color-accent)]'
                    : 'border-[var(--color-border)]',
                )}
              >
                {/* Ảnh lớn */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={CATEGORY_IMAGE[category] ?? FALLBACK_IMAGE}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" aria-hidden />
                  {pkg.featured ? (
                    <span className="absolute top-4 left-4">
                      <Badge variant="gold" size="sm">
                        Nổi bật
                      </Badge>
                    </span>
                  ) : null}
                  {pkg.duration ? (
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
                      <CalendarClock className="size-3.5" aria-hidden />
                      {pkg.duration}
                    </span>
                  ) : null}
                </div>

                {/* Nội dung */}
                <div className="flex flex-1 flex-col p-6">
                  <h4 className="text-lg leading-snug">{pkg.name}</h4>

                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-[family-name:var(--font-display)] text-[2rem] leading-none text-[var(--color-accent)]">
                      {formatCurrency(pkg.price)}
                    </span>
                    <span className="text-sm text-[var(--color-muted)]">/ {pkg.unit}</span>
                  </p>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">{pkg.desc}</p>

                  <Button
                    variant={pkg.featured ? 'accent' : 'outline'}
                    block
                    className="mt-6"
                    onClick={() => open(pkg)}
                  >
                    Đặt &amp; thanh toán
                    <ArrowRight aria-hidden />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {/* Cổng thanh toán mô phỏng (MoMo/VNPay) */}
      {selected && phase === 'gateway' && pending ? (
        <BookingPaymentGateway
          method={form.method}
          amount={pending.total}
          qrPayload={`LOTUS|COURSE|${pending.code}`}
          onSuccess={() => finalize(true)}
          onCancel={() => setPhase('form')}
        />
      ) : null}

      {/* Dialog đặt gói */}
      <Dialog open={Boolean(selected) && phase !== 'gateway'} onOpenChange={(o) => (o ? null : close())}>
        <DialogContent className="max-w-lg">
          {selected && phase === 'form' ? (
            <>
              <DialogHeader>
                <DialogTitle>Đặt gói · {selected.name}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                  <span className="text-sm text-[var(--color-muted)]">Đơn giá</span>
                  <span className="font-medium text-[var(--color-accent)]">
                    {formatCurrency(selected.price)} / {selected.unit}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Họ và tên" htmlFor="pb-name" required>
                    <Input id="pb-name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                  </Field>
                  <Field label="Số điện thoại" htmlFor="pb-phone" required>
                    <Input id="pb-phone" inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </Field>
                </div>

                <Field label="Email (không bắt buộc)" htmlFor="pb-email">
                  <Input id="pb-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>

                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Ngày chơi" htmlFor="pb-date" required>
                    <Input id="pb-date" type="date" min={todayStr()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                  </Field>
                  <Field label="Giờ" htmlFor="pb-time" required>
                    <Input id="pb-time" type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                  </Field>
                  <Field label="Số golfer" htmlFor="pb-guests">
                    <Input id="pb-guests" type="number" min={1} inputMode="numeric" value={form.guests} onChange={(e) => setForm({ ...form, guests: e.target.value })} />
                  </Field>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Phương thức thanh toán</p>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setForm({ ...form, method: opt.id })}
                        className={`rounded-[var(--radius-md)] border p-3 text-left transition-colors ${
                          form.method === opt.id
                            ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                            : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
                        }`}
                      >
                        <span className="block text-sm font-medium">{opt.label}</span>
                        <span className="block text-xs text-[var(--color-muted)]">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                  <div>
                    <p className="text-xs text-[var(--color-muted)]">Tổng cộng ({guests} golfer)</p>
                    <p className="font-[family-name:var(--font-display)] text-xl text-[var(--color-accent)]">
                      {formatCurrency(total)}
                    </p>
                  </div>
                  <Button variant="accent" size="lg" onClick={submit}>
                    <CreditCard aria-hidden />
                    Xác nhận &amp; thanh toán
                  </Button>
                </div>
              </div>
            </>
          ) : null}

          {selected && phase === 'success' && result ? (
            <div className="py-2 text-center">
              <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
                <Check className="size-7" aria-hidden />
              </span>
              <DialogTitle className="text-xl">Đặt gói thành công!</DialogTitle>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Mã đơn của bạn: <span className="font-mono font-medium text-[var(--color-foreground)]">{result.code}</span>
              </p>
              <div className="mt-4">
                <Badge variant={result.paid ? 'success' : 'warning'} size="md">
                  {result.paid
                    ? 'Đã thanh toán'
                    : result.method === 'at-center'
                      ? 'Thanh toán tại quầy khi đến sân'
                      : 'Chờ xác nhận chuyển khoản'}
                </Badge>
              </div>
              <p className="mt-4 text-sm text-[var(--color-muted)]">
                Lotus đã nhận đơn và sẽ liên hệ xác nhận lịch với bạn. Cảm ơn bạn!
              </p>
              <Button variant="accent" className="mt-6" onClick={close}>
                Hoàn tất
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
