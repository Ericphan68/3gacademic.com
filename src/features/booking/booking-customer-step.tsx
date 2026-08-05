'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { PackagePlus, Ticket, UserCheck } from 'lucide-react';
import { type ChangeEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { StepVoucher } from './steps/step-payment';

import { getIcon } from '@/components/common/icon-registry';
import { Badge } from '@/components/ui/badge';
import { Field, Input, QuantityStepper, Textarea } from '@/components/ui/form-fields';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';
import { bookingOptionService } from '@/services/catalogService';
import type { BookingContact, BookingDraft, MembershipTierId, OwnedVoucher, User } from '@/types';

const schema = z.object({
  fullName: z.string().trim().min(2, 'Vui lòng nhập họ tên đầy đủ'),
  phone: z.string().trim().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0'),
  email: z.string().trim().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
  note: z.string().max(500, 'Ghi chú tối đa 500 ký tự').optional(),
});

type FormValues = z.infer<typeof schema>;

export function BookingCustomerStep({
  draft,
  user,
  membershipTier,
  membershipName,
  membershipDiscount,
  voucherSubtotal,
  ownedVouchers,
  validateRef,
  onContactChange,
  onAddOnChange,
  onVoucherChange,
}: {
  draft: BookingDraft;
  user: User | null;
  membershipTier: MembershipTierId | null;
  membershipName: string | null;
  membershipDiscount: number;
  voucherSubtotal: number;
  ownedVouchers: OwnedVoucher[];
  validateRef: { current: (() => Promise<boolean>) | null };
  onContactChange: (patch: Partial<BookingContact>) => void;
  onAddOnChange: (id: string, quantity: number) => void;
  onVoucherChange: (code: string | null) => void;
}) {
  const {
    register,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: {
      fullName: draft.contact.fullName || user?.fullName || '',
      phone: draft.contact.phone || user?.phone || '',
      email: draft.contact.email || user?.email || '',
      note: draft.contact.note || '',
    },
  });

  // Cho phép bước cha kích hoạt validate trước khi sang bước xác nhận.
  useEffect(() => {
    validateRef.current = () => trigger();
    return () => {
      validateRef.current = null;
    };
  }, [validateRef, trigger]);

  // Đồng bộ từng trường → store ngay khi gõ để giữ dữ liệu khi quay lại bước trước.
  const syncField =
    (field: 'fullName' | 'phone' | 'email' | 'note') =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onContactChange({ [field]: event.target.value });

  const addOnItems = bookingOptionService.getAddOns();

  return (
    <div className="space-y-8">
      {/* ---------- Thông tin liên hệ ---------- */}
      <section aria-labelledby="cust-contact">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 id="cust-contact" className="text-lg">
            Thông tin liên hệ
          </h2>
          {user ? (
            <Badge variant="accent" size="sm">
              <UserCheck className="size-3.5" aria-hidden />
              Đã điền sẵn từ tài khoản
            </Badge>
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Họ và tên" htmlFor="booking-name" required error={errors.fullName?.message}>
              <Input
                id="booking-name"
                placeholder="Nguyễn Văn A"
                autoComplete="name"
                invalid={Boolean(errors.fullName)}
                {...register('fullName', { onChange: syncField('fullName') })}
              />
            </Field>

            <Field label="Số điện thoại" htmlFor="booking-phone" required error={errors.phone?.message}>
              <Input
                id="booking-phone"
                type="tel"
                inputMode="numeric"
                placeholder="0901234567"
                autoComplete="tel"
                invalid={Boolean(errors.phone)}
                {...register('phone', { onChange: syncField('phone') })}
              />
            </Field>
          </div>

          <Field
            label="Email"
            htmlFor="booking-email"
            required
            error={errors.email?.message}
            helper="Lotus gửi xác nhận đặt lịch và mã QR check-in qua email này."
          >
            <Input
              id="booking-email"
              type="email"
              placeholder="email@cua-ban.com"
              autoComplete="email"
              invalid={Boolean(errors.email)}
              {...register('email', { onChange: syncField('email') })}
            />
          </Field>

          <Field
            label="Ghi chú cho Lotus"
            htmlFor="booking-note"
            error={errors.note?.message}
            helper="Không bắt buộc. Ví dụ: cần HLV nói tiếng Anh, tay thuận trái, đi cùng trẻ nhỏ…"
          >
            <Textarea
              id="booking-note"
              placeholder="Điều gì giúp Lotus phục vụ bạn tốt hơn?"
              maxLength={500}
              invalid={Boolean(errors.note)}
              {...register('note', { onChange: syncField('note') })}
            />
          </Field>
        </div>
      </section>

      {/* ---------- Dịch vụ bổ sung ---------- */}
      <section aria-labelledby="cust-addons">
        <h2 id="cust-addons" className="mb-1 flex items-center gap-2 text-lg">
          <PackagePlus className="size-4 text-[var(--color-accent)]" aria-hidden />
          Dịch vụ bổ sung
        </h2>
        <p className="mb-4 text-sm text-[var(--color-muted)]">
          Không bắt buộc — thêm gậy, bóng, đồ ăn hoặc dịch vụ VIP nếu bạn cần.
        </p>

        <ul className="grid gap-3 sm:grid-cols-2">
          {addOnItems.map((item) => {
            const quantity = draft.addOns[item.id] ?? 0;
            const Icon = getIcon(item.icon);

            return (
              <li
                key={item.id}
                className={cn(
                  'flex items-start gap-4 rounded-[var(--radius-lg)] border p-4 transition-colors',
                  quantity > 0
                    ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                    : 'border-[var(--color-border)]',
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
      </section>

      {/* ---------- Ưu đãi & voucher ---------- */}
      <section aria-labelledby="cust-offers">
        <h2 id="cust-offers" className="mb-4 flex items-center gap-2 text-lg">
          <Ticket className="size-4 text-[var(--color-accent)]" aria-hidden />
          Ưu đãi & voucher
        </h2>
        <StepVoucher
          voucherCode={draft.voucherCode}
          subtotal={voucherSubtotal}
          membershipTier={membershipTier}
          membershipName={membershipName}
          membershipDiscount={membershipDiscount}
          ownedVouchers={ownedVouchers}
          onVoucherChange={onVoucherChange}
        />
      </section>
    </div>
  );
}
