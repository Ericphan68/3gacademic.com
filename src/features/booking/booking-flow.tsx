'use client';

import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { BookingProgress } from './booking-progress';
import { BookingSummary } from './booking-summary';
import { StepContact, StepCoach, StepGuests, StepZone } from './steps/step-details';
import { StepReview, StepSuccess, StepVoucher } from './steps/step-payment';
import { StepDate, StepExperience, StepTime } from './steps/step-schedule';

import { Button } from '@/components/ui/button';
import { useHydrated } from '@/hooks/useHydrated';
import { generateCode, generateId } from '@/lib/utils';
import { bookingOptionService, coachService, membershipService, experienceService } from '@/services/catalogService';
import { calculateBookingPrice, resolveAddOns } from '@/services/pricingService';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';
import { BOOKING_STEPS, canAdvance, TOTAL_BOOKING_STEPS, useBookingStore } from '@/store/useBookingStore';
import type { Booking } from '@/types';

const STEP_TITLES: Record<number, { title: string; description: string }> = {
  1: {
    title: 'Bạn muốn trải nghiệm gì hôm nay?',
    description: 'Chọn loại hình phù hợp. Bạn có thể đổi lại ở các bước sau nếu muốn.',
  },
  2: {
    title: 'Chọn ngày',
    description: 'Ngày cao điểm và ngày có ưu đãi được đánh dấu ngay trên lịch.',
  },
  3: {
    title: 'Chọn khung giờ',
    description: 'Trung tâm mở cửa 06:00 – 22:00. Giá thay đổi theo khung giờ.',
  },
  4: {
    title: 'Chọn khu vực tập luyện',
    description: 'Mỗi khu có đặc điểm riêng. Một số khu có phụ thu.',
  },
  5: {
    title: 'Bạn có muốn học cùng huấn luyện viên?',
    description: 'Không bắt buộc. Nếu tự tập, chọn “Không cần huấn luyện viên”.',
  },
  6: {
    title: 'Số khách và dịch vụ bổ sung',
    description: 'Thêm bóng, gậy, đồ ăn hoặc dịch vụ VIP nếu bạn cần.',
  },
  7: {
    title: 'Voucher và ưu đãi',
    description: 'Áp dụng mã giảm giá, dùng số dư ví và xem quyền lợi hội viên.',
  },
  8: {
    title: 'Thông tin của bạn',
    description: 'Lotus dùng thông tin này để chuẩn bị trước và gửi mã check-in.',
  },
  9: {
    title: 'Kiểm tra và xác nhận',
    description: 'Xem lại toàn bộ thông tin trước khi hoàn tất đặt lịch.',
  },
};

export function BookingFlow() {
  const hydrated = useHydrated();
  const searchParams = useSearchParams();
  const appliedParams = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState<Booking | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { draft, ...actions } = useBookingStore();
  const user = useAuthStore((state) => state.user);
  const setWalletBalance = useAuthStore((state) => state.setWalletBalance);
  const addLoyaltyPoints = useAuthStore((state) => state.addLoyaltyPoints);

  const addBooking = useAccountStore((state) => state.addBooking);
  const addTransaction = useAccountStore((state) => state.addTransaction);
  const markVoucherUsed = useAccountStore((state) => state.useVoucher);
  const ownedVouchers = useAccountStore((state) => state.vouchers);

  const walletBalance = user?.walletBalance ?? 0;
  const membershipTier = user?.membershipTier ?? null;
  const tier = membershipTier ? membershipService.getById(membershipTier) : undefined;

  const price = useMemo(
    () => calculateBookingPrice({ draft, membershipTier, walletBalance }),
    [draft, membershipTier, walletBalance],
  );

  /* Áp dụng tham số URL (?experience=&coach=&date=&time=) một lần sau khi hydrate. */
  useEffect(() => {
    if (!hydrated || appliedParams.current) return;
    appliedParams.current = true;

    const experienceSlug = searchParams.get('experience');
    if (experienceSlug) {
      const pkg = experienceService.getBySlug(experienceSlug);
      const mapped = pkg?.audiences.includes('corporate')
        ? 'corporate'
        : pkg?.slug === 'private-vip-golf'
          ? 'vip'
          : pkg?.slug === 'golf-3in1'
            ? 'golf-3in1'
            : pkg?.slug === 'putting-master'
              ? 'putting'
              : pkg?.slug === 'first-swing'
                ? 'coaching'
                : 'range';
      const option = bookingOptionService.getExperienceType(mapped);
      if (option) actions.setExperience(option.id, option.suggestedZone);
    }

    const coachSlug = searchParams.get('coach');
    if (coachSlug) {
      const coach = coachService.getBySlug(coachSlug);
      if (coach) {
        actions.setCoach(coach.id);
        const option = bookingOptionService.getExperienceType('coaching');
        if (option && !experienceSlug) actions.setExperience(option.id, option.suggestedZone);
      }
    }

    const date = searchParams.get('date');
    if (date) actions.setDate(date);
    const time = searchParams.get('time');
    if (time) actions.setTime(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, searchParams]);

  /* Điền sẵn thông tin liên hệ từ tài khoản đang đăng nhập. */
  useEffect(() => {
    if (!hydrated || !user) return;
    if (draft.contact.fullName || draft.contact.email) return;
    actions.setContact({ fullName: user.fullName, email: user.email, phone: user.phone });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, user]);

  const goToStep = (step: number) => {
    actions.setStep(step);
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNext = () => {
    if (!canAdvance(draft)) {
      toast.error('Chưa thể tiếp tục', { description: stepHint(draft.step) });
      return;
    }
    if (draft.step === 9) {
      void confirmBooking();
      return;
    }
    goToStep(draft.step + 1);
  };

  const confirmBooking = async () => {
    setSubmitting(true);
    // Mô phỏng độ trễ gọi API để giao diện có trạng thái chờ thật.
    await new Promise((resolve) => setTimeout(resolve, 700));

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
      price,
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      qrPayload: `LOTUS|BOOKING|${code}|${draft.date}|${draft.time}`,
    };

    addBooking(booking);

    // Trừ ví và ghi giao dịch nếu có dùng số dư.
    if (price.walletApplied > 0 && user) {
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

    actions.setLastBookingCode(code);
    setCompleted(booking);
    actions.setStep(TOTAL_BOOKING_STEPS);
    setSubmitting(false);

    toast.success('Đặt lịch thành công', {
      description: `Mã đặt lịch ${code}. Bạn xem lại bất cứ lúc nào trong tài khoản.`,
    });

    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const resetFlow = () => {
    actions.reset();
    setCompleted(null);
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* Tránh lệch giữa server và client: chỉ render luồng sau khi hydrate. */
  if (!hydrated) {
    return (
      <div className="container-lotus py-16">
        <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />
      </div>
    );
  }

  const isSuccess = draft.step === TOTAL_BOOKING_STEPS && completed !== null;
  const meta = STEP_TITLES[draft.step];

  return (
    <div ref={contentRef} className="scroll-mt-28">
      {!isSuccess ? <BookingProgress current={draft.step} onSelect={goToStep} /> : null}

      <div className="container-lotus py-10 md:py-14">
        {isSuccess && completed ? (
          <StepSuccess booking={completed} onReset={resetFlow} />
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
            <div>
              {meta ? (
                <div className="mb-8">
                  <p className="eyebrow mb-2">
                    Bước {draft.step} / {TOTAL_BOOKING_STEPS - 1} · {BOOKING_STEPS[draft.step - 1]?.label}
                  </p>
                  <h1 className="text-2xl md:text-3xl">{meta.title}</h1>
                  <p className="mt-2 text-[var(--color-muted)]">{meta.description}</p>
                </div>
              ) : null}

              {draft.step === 1 ? (
                <StepExperience value={draft.experienceType} onChange={actions.setExperience} />
              ) : null}

              {draft.step === 2 ? <StepDate value={draft.date} onChange={actions.setDate} /> : null}

              {draft.step === 3 && draft.date ? (
                <StepTime
                  date={draft.date}
                  value={draft.time}
                  basePrice={
                    (draft.experienceType
                      ? bookingOptionService.getExperienceType(draft.experienceType)?.basePrice
                      : 0) ?? 0
                  }
                  onChange={actions.setTime}
                />
              ) : null}

              {draft.step === 4 ? <StepZone value={draft.zoneId} onChange={actions.setZone} /> : null}

              {draft.step === 5 ? (
                <StepCoach
                  value={draft.coachId}
                  experienceType={draft.experienceType}
                  onChange={actions.setCoach}
                />
              ) : null}

              {draft.step === 6 ? (
                <StepGuests
                  guests={draft.guests}
                  addOns={draft.addOns}
                  onGuestsChange={actions.setGuests}
                  onAddOnChange={actions.setAddOn}
                />
              ) : null}

              {draft.step === 7 ? (
                <StepVoucher
                  voucherCode={draft.voucherCode}
                  useWallet={draft.useWallet}
                  walletBalance={walletBalance}
                  subtotal={price.subtotal - price.membershipDiscount}
                  membershipTier={membershipTier}
                  membershipName={tier?.name ?? null}
                  membershipDiscount={price.membershipDiscount}
                  ownedVouchers={ownedVouchers.filter((voucher) => voucher.status === 'active')}
                  onVoucherChange={actions.setVoucher}
                  onWalletChange={actions.setUseWallet}
                />
              ) : null}

              {draft.step === 8 ? (
                <StepContact
                  contact={draft.contact}
                  acceptedTerms={draft.acceptedTerms}
                  onContactChange={actions.setContact}
                  onTermsChange={actions.setAcceptedTerms}
                />
              ) : null}

              {draft.step === 9 ? (
                <StepReview
                  paymentMethod={draft.paymentMethod}
                  total={price.total}
                  onPaymentMethodChange={actions.setPaymentMethod}
                />
              ) : null}

              <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[var(--color-border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="ghost"
                  onClick={() => goToStep(draft.step - 1)}
                  disabled={draft.step === 1}
                  className="sm:w-auto"
                >
                  <ArrowLeft aria-hidden />
                  Quay lại
                </Button>

                <Button
                  variant="accent"
                  size="lg"
                  onClick={handleNext}
                  loading={submitting}
                  disabled={!canAdvance(draft)}
                  className="sm:w-auto"
                >
                  {draft.step === 9 ? (
                    <>
                      <Check aria-hidden />
                      Xác nhận đặt lịch
                    </>
                  ) : (
                    <>
                      Tiếp tục
                      <ArrowRight aria-hidden />
                    </>
                  )}
                </Button>
              </div>

              {!canAdvance(draft) ? (
                <p className="mt-3 text-sm text-[var(--color-muted)]" role="status">
                  {stepHint(draft.step)}
                </p>
              ) : null}
            </div>

            <BookingSummary
              draft={draft}
              price={price}
              membershipTier={membershipTier}
              walletBalance={walletBalance}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function stepHint(step: number): string {
  switch (step) {
    case 1:
      return 'Chọn một loại trải nghiệm để tiếp tục.';
    case 2:
      return 'Chọn một ngày trong lịch. Không thể chọn ngày đã qua.';
    case 3:
      return 'Chọn một khung giờ còn chỗ.';
    case 4:
      return 'Chọn khu vực bạn muốn tập.';
    case 8:
      return 'Điền họ tên, số điện thoại, email hợp lệ và đồng ý điều khoản để tiếp tục.';
    default:
      return 'Vui lòng hoàn tất thông tin ở bước này.';
  }
}
