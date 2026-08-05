'use client';

import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { BookingCustomerStep } from './booking-customer-step';
import { BookingPaymentGateway } from './booking-payment-gateway';
import { BookingReviewStep } from './booking-review-step';
import { BookingScheduleStep } from './booking-schedule-step';
import { BookingStepIndicator } from './booking-step-indicator';
import { BookingSuccess } from './booking-success';
import { BookingSummary } from './booking-summary';

import { Button } from '@/components/ui/button';
import { useHydrated } from '@/hooks/useHydrated';
import { formatCurrency } from '@/lib/format';
import { generateCode, generateId } from '@/lib/utils';
import {
  bookingOptionService,
  coachService,
  experienceService,
  membershipService,
} from '@/services/catalogService';
import { calculateBookingPrice, resolveAddOns } from '@/services/pricingService';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';
import {
  BOOKING_STEPS,
  canAdvance,
  hasDraftProgress,
  TOTAL_BOOKING_STEPS,
  useBookingStore,
} from '@/store/useBookingStore';
import type { Booking, BookingExperienceType, PaymentMethod, PaymentStatus } from '@/types';

/** Phương thức thanh toán trực tuyến (qua cổng mô phỏng) → trả ngay. */
const INSTANT_METHODS: PaymentMethod[] = ['wallet', 'momo', 'vnpay', 'card'];

const STEP_META: Record<number, { title: string; description: string }> = {
  1: {
    title: 'Chọn lịch tập',
    description: 'Xác nhận trải nghiệm, huấn luyện viên và chọn ngày giờ phù hợp với bạn.',
  },
  2: {
    title: 'Thông tin & dịch vụ',
    description: 'Chỉ vài thông tin cần thiết để Lotus chuẩn bị trước và gửi mã check-in.',
  },
  3: {
    title: 'Kiểm tra & xác nhận',
    description: 'Xem lại toàn bộ thông tin trước khi hoàn tất đặt lịch.',
  },
};

const PRIMARY_LABEL: Record<number, string> = {
  1: 'Tiếp tục',
  2: 'Kiểm tra đặt lịch',
  3: 'Xác nhận đặt lịch',
};

export function BookingFlow() {
  const hydrated = useHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const appliedParams = useRef(false);
  const validateRef = useRef<(() => Promise<boolean>) | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gatewayNonce = useRef(0);

  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState<Booking | null>(null);
  const [gateway, setGateway] = useState<{
    method: PaymentMethod;
    amount: number;
    qrPayload: string;
    nonce: number;
  } | null>(null);

  const { draft, ...actions } = useBookingStore();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setWalletBalance = useAuthStore((state) => state.setWalletBalance);
  const addLoyaltyPoints = useAuthStore((state) => state.addLoyaltyPoints);

  const addBooking = useAccountStore((state) => state.addBooking);
  const addTransaction = useAccountStore((state) => state.addTransaction);
  const markVoucherUsed = useAccountStore((state) => state.useVoucher);
  const markBookingPaid = useAccountStore((state) => state.markBookingPaid);
  const ownedVouchers = useAccountStore((state) => state.vouchers);

  const walletBalance = user?.walletBalance ?? 0;
  const membershipTier = user?.membershipTier ?? null;
  const tier = membershipTier ? membershipService.getById(membershipTier) : undefined;

  const price = useMemo(
    () => calculateBookingPrice({ draft, membershipTier, walletBalance }),
    [draft, membershipTier, walletBalance],
  );

  const step = Math.min(Math.max(draft.step, 1), TOTAL_BOOKING_STEPS);

  /* ---- Áp dụng tham số URL (?experience=&coach=&date=&time=) một lần ---- */
  useEffect(() => {
    if (!hydrated || appliedParams.current) return;
    appliedParams.current = true;

    const experienceParam = searchParams.get('experience');
    if (experienceParam) {
      const resolved = resolveExperienceParam(experienceParam);
      if (resolved) {
        const option = bookingOptionService.getExperienceType(resolved);
        if (option) actions.setExperience(option.id, option.suggestedZone);
      }
    }

    const coachParam = searchParams.get('coach');
    if (coachParam) {
      const coach = coachService.getBySlug(coachParam);
      if (coach) {
        actions.setCoach(coach.id);
        // Đi từ trang HLV mà chưa có gói → mặc định gói “Học với HLV”.
        if (!experienceParam) {
          const option = bookingOptionService.getExperienceType('coaching');
          if (option) actions.setExperience(option.id, option.suggestedZone);
        }
      }
    }

    const date = searchParams.get('date');
    if (date) actions.setDate(date);
    const time = searchParams.get('time');
    if (time) actions.setTime(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, searchParams]);

  /* ---- Thông báo nhẹ khi slug trên URL không hợp lệ (dẫn xuất, không dùng state) ---- */
  const notice = useMemo(() => {
    if (!hydrated) return null;
    const missing: string[] = [];
    const experienceParam = searchParams.get('experience');
    if (experienceParam && !resolveExperienceParam(experienceParam)) missing.push('gói trải nghiệm');
    const coachParam = searchParams.get('coach');
    if (coachParam && !coachService.getBySlug(coachParam)) missing.push('huấn luyện viên');
    return missing.length > 0
      ? `Không tìm thấy ${missing.join(' và ')} từ liên kết bạn vừa mở. Bạn chọn lại giúp Lotus bên dưới nhé.`
      : null;
  }, [hydrated, searchParams]);

  /* ---- Điền sẵn thông tin liên hệ từ tài khoản đang đăng nhập ---- */
  useEffect(() => {
    if (!hydrated || !user) return;
    if (draft.contact.fullName || draft.contact.email) return;
    actions.setContact({ fullName: user.fullName, email: user.email, phone: user.phone });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, user]);

  /* ---- Cảnh báo trước khi rời trang khi đang nhập dở ---- */
  const dirty = hasDraftProgress(draft) && completed === null;
  useEffect(() => {
    if (!dirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  /* ---- Đồng bộ URL khi đổi HLV / trải nghiệm (không reload trang) ---- */
  const updateUrl = useCallback(
    (experienceType: BookingExperienceType | null, coachId: string | null) => {
      const params = new URLSearchParams();
      if (experienceType) params.set('experience', experienceType);
      if (coachId) {
        const coach = coachService.getById(coachId);
        if (coach) params.set('coach', coach.slug);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  const scrollToTop = () => contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const goToStep = (next: number) => {
    actions.setStep(next);
    scrollToTop();
  };

  const handleExperienceChange = (type: BookingExperienceType, suggestedZone: Parameters<typeof actions.setExperience>[1]) => {
    actions.setExperience(type, suggestedZone);
    updateUrl(type, draft.coachId);
  };

  const handleCoachChange = (coachId: string | null) => {
    actions.setCoach(coachId);
    updateUrl(draft.experienceType, coachId);
  };

  const handleNext = async () => {
    if (step === 2) {
      const valid = validateRef.current ? await validateRef.current() : canAdvance(draft);
      if (!valid) {
        toast.error('Vui lòng kiểm tra thông tin', {
          description: 'Điền đủ họ tên, số điện thoại và email hợp lệ để tiếp tục.',
        });
        return;
      }
    } else if (!canAdvance(draft)) {
      toast.error('Chưa thể tiếp tục', { description: stepHint(step) });
      return;
    }

    if (step === TOTAL_BOOKING_STEPS) {
      handleConfirm();
      return;
    }
    goToStep(step + 1);
  };

  /**
   * Điều phối thanh toán theo phương thức:
   * - Trực tuyến (ví, MoMo, VNPay, thẻ) → mở cổng thanh toán mô phỏng → trả ngay.
   * - Chuyển khoản → tạo booking trạng thái "chờ thanh toán".
   * - Tại trung tâm → tạo booking trạng thái "trả tại quầy".
   */
  const handleConfirm = () => {
    const method = draft.paymentMethod;

    if (method === 'wallet' && price.total > 0) {
      toast.error('Số dư ví không đủ', {
        description: 'Nạp thêm vào ví Lotus hoặc chọn phương thức thanh toán khác.',
      });
      return;
    }

    if (INSTANT_METHODS.includes(method)) {
      const amount = method === 'wallet' ? price.walletApplied : price.total;
      gatewayNonce.current += 1;
      setGateway({
        method,
        amount,
        qrPayload: `LOTUS|PAY|${method}|${amount}|${draft.date ?? ''}`,
        nonce: gatewayNonce.current,
      });
      return;
    }

    void finalizeBooking(method === 'transfer' ? 'pending' : 'pay-later');
  };

  const handleGatewaySuccess = () => {
    setGateway(null);
    void finalizeBooking('paid');
  };

  const handleGatewayCancel = () => {
    setGateway(null);
    toast('Đã huỷ thanh toán', {
      description: 'Bạn có thể thử lại hoặc chọn phương thức thanh toán khác.',
    });
  };

  /** Khách xác nhận đã chuyển khoản ở màn thành công → chuyển sang "Đã thanh toán". */
  const handleMarkTransferPaid = () => {
    if (!completed) return;
    markBookingPaid(completed.id);
    setCompleted({ ...completed, paymentStatus: 'paid' });
    toast.success('Đã ghi nhận thanh toán', {
      description: 'Cảm ơn bạn! Booking đã chuyển sang trạng thái Đã thanh toán.',
    });
  };

  const finalizeBooking = async (paymentStatus: PaymentStatus) => {
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const experience = draft.experienceType
      ? bookingOptionService.getExperienceType(draft.experienceType)
      : undefined;
    const zone = draft.zoneId ? bookingOptionService.getZone(draft.zoneId) : undefined;
    const coach = draft.coachId ? coachService.getById(draft.coachId) : undefined;
    const code = generateCode('LG');

    const booking: Booking = {
      id: generateId('bk'),
      code,
      experienceType: draft.experienceType ?? 'range',
      experienceLabel: experience?.name ?? 'Tập sân',
      date: draft.date ?? '',
      time: draft.time ?? '',
      durationMinutes: experience?.durationMinutes ?? 60,
      zoneId: draft.zoneId ?? 'driving-range',
      zoneName: zone?.name ?? 'Driving Range',
      coachId: coach?.id ?? null,
      coachName: coach?.name ?? null,
      guests: draft.guests,
      addOns: resolveAddOns(draft.addOns),
      voucherCode: draft.voucherCode,
      contact: draft.contact,
      paymentMethod: draft.paymentMethod,
      paymentStatus,
      price,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      qrPayload: `LOTUS|BOOKING|${code}|${draft.date}|${draft.time}`,
    };

    addBooking(booking);

    // Trừ ví và ghi giao dịch khi thanh toán bằng ví Lotus.
    if (paymentStatus === 'paid' && price.walletApplied > 0 && user) {
      const nextBalance = Math.max(0, walletBalance - price.walletApplied);
      setWalletBalance(nextBalance);
      addTransaction({
        type: 'payment',
        label: `Thanh toán đặt lịch · ${code}`,
        amount: -price.walletApplied,
        balanceAfter: nextBalance,
        reference: code,
      });
    }

    // Đánh dấu voucher đã dùng.
    if (draft.voucherCode) markVoucherUsed(draft.voucherCode);

    // Tích điểm thưởng demo: 1 điểm cho mỗi 10.000đ giá trị đơn.
    if (user) addLoyaltyPoints(Math.round(price.subtotal / 10000));

    setCompleted(booking);
    setSubmitting(false);

    const successMessage: Record<PaymentStatus, string> = {
      paid: 'Đặt lịch & thanh toán thành công',
      pending: 'Đặt lịch thành công — chờ chuyển khoản',
      'pay-later': 'Đặt lịch thành công',
    };
    toast.success(successMessage[paymentStatus], {
      description: `Mã đặt lịch ${code}. Bạn xem lại bất cứ lúc nào trong tài khoản.`,
    });

    // Xoá booking draft sau khi đặt thành công (giữ lại booking đã tạo trên màn success).
    actions.reset();
    scrollToTop();
  };

  /* Tránh lệch giữa server và client: chỉ render luồng sau khi hydrate. */
  if (!hydrated) {
    return (
      <div className="container-lotus py-16">
        <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />
      </div>
    );
  }

  if (completed) {
    return (
      <div ref={contentRef} className="container-lotus scroll-mt-28 py-10 md:py-14">
        <BookingSuccess
          booking={completed}
          isAuthenticated={isAuthenticated}
          onMarkTransferPaid={handleMarkTransferPaid}
        />
      </div>
    );
  }

  const meta = STEP_META[step];
  // Ví Lotus phải đủ trả toàn bộ mới cho xác nhận (total > 0 nghĩa là ví chưa phủ hết).
  const walletInsufficient = draft.paymentMethod === 'wallet' && price.total > 0;
  const canProceed = canAdvance(draft) && !(step === TOTAL_BOOKING_STEPS && walletInsufficient);

  const navButtons = (
    <>
      <Button
        variant="ghost"
        onClick={() => goToStep(step - 1)}
        disabled={step === 1}
        className="max-lg:flex-1"
      >
        <ArrowLeft aria-hidden />
        Quay lại
      </Button>

      <Button
        variant="accent"
        size="lg"
        onClick={handleNext}
        loading={submitting}
        disabled={!canProceed}
        className="max-lg:flex-[2]"
      >
        {step === TOTAL_BOOKING_STEPS ? (
          <>
            <Check aria-hidden />
            {PRIMARY_LABEL[step]}
          </>
        ) : (
          <>
            {PRIMARY_LABEL[step]}
            <ArrowRight aria-hidden />
          </>
        )}
      </Button>
    </>
  );

  return (
    <div ref={contentRef} className="scroll-mt-28 pb-32 lg:pb-0">
      <BookingStepIndicator current={step} onSelect={goToStep} />

      <div className="container-lotus py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
          <div>
            {meta ? (
              <div className="mb-8">
                <p className="eyebrow mb-2">
                  Bước {step} / {TOTAL_BOOKING_STEPS} · {BOOKING_STEPS[step - 1]?.label}
                </p>
                <h1 className="text-2xl md:text-3xl">{meta.title}</h1>
                <p className="mt-2 text-[var(--color-muted)]">{meta.description}</p>
              </div>
            ) : null}

            {step === 1 ? (
              <BookingScheduleStep
                draft={draft}
                notice={notice}
                onExperienceChange={handleExperienceChange}
                onCoachChange={handleCoachChange}
                onDateChange={actions.setDate}
                onTimeChange={actions.setTime}
                onGuestsChange={actions.setGuests}
                onZoneChange={actions.setZone}
              />
            ) : null}

            {step === 2 ? (
              <BookingCustomerStep
                draft={draft}
                user={user}
                membershipTier={membershipTier}
                membershipName={tier?.name ?? null}
                membershipDiscount={price.membershipDiscount}
                voucherSubtotal={price.subtotal - price.membershipDiscount}
                ownedVouchers={ownedVouchers.filter((voucher) => voucher.status === 'active')}
                validateRef={validateRef}
                onContactChange={actions.setContact}
                onAddOnChange={actions.setAddOn}
                onVoucherChange={actions.setVoucher}
              />
            ) : null}

            {step === 3 ? (
              <BookingReviewStep
                draft={draft}
                price={price}
                paymentMethod={draft.paymentMethod}
                walletBalance={walletBalance}
                isAuthenticated={isAuthenticated}
                onEdit={goToStep}
                onPaymentMethodChange={actions.setPaymentMethod}
              />
            ) : null}

            {/* Điều hướng desktop */}
            <div className="mt-10 hidden items-center justify-between gap-3 border-t border-[var(--color-border)] pt-6 lg:flex">
              {navButtons}
            </div>

            {!canProceed && step !== 2 ? (
              <p className="mt-3 hidden text-sm text-[var(--color-muted)] lg:block" role="status">
                {walletInsufficient
                  ? 'Số dư ví không đủ để thanh toán toàn bộ. Nạp thêm vào ví hoặc chọn phương thức khác.'
                  : stepHint(step)}
              </p>
            ) : null}
          </div>

          {/* Tóm tắt — cột phải sticky trên desktop */}
          <div className="hidden lg:block">
            <BookingSummary
              draft={draft}
              price={price}
              membershipTier={membershipTier}
              walletBalance={walletBalance}
            />
          </div>
        </div>
      </div>

      {/* Thanh cố định dưới màn hình cho mobile / tablet */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface-raised)]/95 backdrop-blur lg:hidden">
        <div className="container-lotus py-3">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <span className="text-sm text-[var(--color-muted)]">Cần thanh toán</span>
            <span className="font-[family-name:var(--font-display)] text-xl">{formatCurrency(price.total)}</span>
          </div>
          <div className="flex items-center gap-3">{navButtons}</div>
        </div>
      </div>

      {/* Cổng thanh toán mô phỏng cho phương thức trực tuyến */}
      {gateway ? (
        <BookingPaymentGateway
          key={gateway.nonce}
          method={gateway.method}
          amount={gateway.amount}
          qrPayload={gateway.qrPayload}
          onSuccess={handleGatewaySuccess}
          onCancel={handleGatewayCancel}
        />
      ) : null}
    </div>
  );
}

/** Giải quyết tham số ?experience= — nhận cả id loại booking lẫn slug gói experience. */
function resolveExperienceParam(value: string): BookingExperienceType | null {
  const normalized = value.trim().toLowerCase();

  // 1. Trực tiếp là loại trải nghiệm booking (range, coaching, putting, vip…).
  const direct = bookingOptionService.getExperienceType(normalized);
  if (direct) return direct.id;

  // 2. Là slug của gói experience → ánh xạ sang loại booking phù hợp.
  const pkg = experienceService.getBySlug(normalized);
  if (!pkg) return null;

  if (pkg.audiences.includes('corporate')) return 'corporate';
  switch (pkg.slug) {
    case 'private-vip-golf':
      return 'vip';
    case 'golf-3in1':
      return 'golf-3in1';
    case 'putting-master':
      return 'putting';
    case 'golf-networking':
      return 'event';
    case 'first-swing':
      return 'coaching';
    default:
      return 'range';
  }
}

function stepHint(step: number): string {
  switch (step) {
    case 1:
      return 'Chọn trải nghiệm, một ngày và một khung giờ còn chỗ để tiếp tục.';
    case 2:
      return 'Điền đủ họ tên, số điện thoại và email hợp lệ.';
    default:
      return 'Vui lòng hoàn tất thông tin ở bước này.';
  }
}
