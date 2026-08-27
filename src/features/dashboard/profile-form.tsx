'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { Field, Input, Label, Select, Switch, Textarea } from '@/components/ui/form-fields';
import { InitialsAvatar } from '@/components/ui/misc';
import { useHydrated } from '@/hooks/useHydrated';
import { formatDate } from '@/lib/format';
import { useAccountStore } from '@/store/useAccountStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { GolfLevel, Handedness } from '@/types';

const schema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên đầy đủ'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0'),
  drink: z.string().max(80, 'Tối đa 80 ký tự'),
  goal: z.string().max(300, 'Tối đa 300 ký tự'),
});

type FormValues = z.infer<typeof schema>;

const LEVEL_OPTIONS: { value: GolfLevel; label: string }[] = [
  { value: 'never', label: 'Chưa từng chơi' },
  { value: 'beginner', label: 'Mới bắt đầu' },
  { value: 'intermediate', label: 'Chơi được, đang cải thiện' },
  { value: 'advanced', label: 'Nâng cao / thi đấu' },
];

const HAND_OPTIONS: { value: Handedness; label: string }[] = [
  { value: 'right', label: 'Tay phải' },
  { value: 'left', label: 'Tay trái' },
];

export function ProfileForm() {
  const hydrated = useHydrated();
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const updatePreferences = useAuthStore((state) => state.updatePreferences);
  const resetAccount = useAccountStore((state) => state.resetAccount);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
      drink: user?.preferences.drink ?? '',
      goal: user?.preferences.goal ?? '',
    },
  });

  if (!hydrated || !user) {
    return <div className="animate-shimmer h-96 rounded-[var(--radius-lg)]" />;
  }

  const onSubmit = async (values: FormValues) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        drink: values.drink,
      }),
    });
    const body = (await res.json().catch(() => null)) as { user?: unknown; error?: string } | null;
    if (!res.ok) {
      toast.error('Chưa lưu được hồ sơ', { description: body?.error });
      return;
    }
    // Cập nhật hiển thị ngay (server là nguồn thật; goal chỉ lưu ở client).
    updateProfile({ fullName: values.fullName, email: values.email, phone: values.phone });
    updatePreferences({ drink: values.drink, goal: values.goal });
    toast.success('Đã lưu thay đổi', { description: 'Thông tin hồ sơ của bạn đã được cập nhật.' });
  };

  return (
    <div>
      <PortalHeader
        title="Hồ sơ của tôi"
        description="Thông tin này giúp Lotus chuẩn bị trước và phục vụ bạn tốt hơn ở mỗi lần đến."
      />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
          {/* Thông tin cá nhân */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <div className="mb-5 flex items-center gap-4">
              <InitialsAvatar initials={user.avatarInitials} size="lg" />
              <div>
                <h2 className="text-lg">Thông tin cá nhân</h2>
                <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                  Thành viên từ {formatDate(user.joinedAt)}
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <Field label="Họ và tên" htmlFor="profile-name" required error={errors.fullName?.message}>
                <Input id="profile-name" autoComplete="name" invalid={Boolean(errors.fullName)} {...register('fullName')} />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Email" htmlFor="profile-email" required error={errors.email?.message}>
                  <Input
                    id="profile-email"
                    type="email"
                    autoComplete="email"
                    invalid={Boolean(errors.email)}
                    {...register('email')}
                  />
                </Field>

                <Field label="Số điện thoại" htmlFor="profile-phone" required error={errors.phone?.message}>
                  <Input
                    id="profile-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    invalid={Boolean(errors.phone)}
                    {...register('phone')}
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* Sở thích golf */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <h2 className="mb-5 text-lg">Sở thích và trình độ</h2>

            <div className="space-y-5">
              <Field
                label="Đồ uống ưa thích"
                htmlFor="profile-drink"
                error={errors.drink?.message}
                helper="Nhân viên sẽ chuẩn bị sẵn khi bạn đến."
              >
                <Input id="profile-drink" placeholder="Ví dụ: Trà sen Lotus Signature" {...register('drink')} />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Tay thuận" htmlFor="profile-hand">
                  <Select
                    id="profile-hand"
                    value={user.preferences.handedness}
                    onChange={(event) => updatePreferences({ handedness: event.target.value as Handedness })}
                  >
                    {HAND_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Trình độ golf" htmlFor="profile-level">
                  <Select
                    id="profile-level"
                    value={user.preferences.golfLevel}
                    onChange={(event) => updatePreferences({ golfLevel: event.target.value as GolfLevel })}
                  >
                    {LEVEL_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>

              <Field
                label="Mục tiêu của bạn"
                htmlFor="profile-goal"
                error={errors.goal?.message}
                helper="Huấn luyện viên dùng thông tin này để đề xuất lộ trình phù hợp."
              >
                <Textarea
                  id="profile-goal"
                  rows={3}
                  placeholder="Ví dụ: chơi được tự tin cùng đối tác trong 3 tháng"
                  {...register('goal')}
                />
              </Field>

              <Field label="Ngôn ngữ hiển thị" htmlFor="profile-language">
                <Select
                  id="profile-language"
                  value={user.preferences.language}
                  onChange={(event) =>
                    updatePreferences({ language: event.target.value as 'vi' | 'en' })
                  }
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </Select>
              </Field>
            </div>
          </section>

          <Button type="submit" variant="accent" size="lg" loading={isSubmitting}>
            <Save aria-hidden />
            Lưu thay đổi
          </Button>
        </form>

        <div className="space-y-6">
          {/* Thông báo */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <h2 className="mb-5 text-lg">Thông báo</h2>

            <ul className="space-y-4">
              {[
                {
                  key: 'notifyEmail' as const,
                  label: 'Email xác nhận đặt lịch',
                  hint: 'Nhận email khi đặt, đổi hoặc huỷ lịch.',
                },
                {
                  key: 'notifyZalo' as const,
                  label: 'Nhắc lịch qua Zalo',
                  hint: 'Nhắc trước buổi tập 2 giờ.',
                },
                {
                  key: 'notifyPromotions' as const,
                  label: 'Ưu đãi và Flash Sale',
                  hint: 'Nhận thông báo khi có ưu đãi giờ thấp điểm.',
                },
              ].map((item) => (
                <li key={item.key} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Label htmlFor={`notify-${item.key}`} className="font-normal">
                      {item.label}
                    </Label>
                    <p className="mt-0.5 text-xs text-[var(--color-muted)]">{item.hint}</p>
                  </div>
                  <Switch
                    id={`notify-${item.key}`}
                    checked={user.preferences[item.key]}
                    onCheckedChange={(checked) => {
                      updatePreferences({ [item.key]: checked });
                      toast.success('Đã cập nhật tuỳ chọn thông báo');
                    }}
                  />
                </li>
              ))}
            </ul>
          </section>

          {/* Bảo mật */}
          <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-background)] p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="size-4 text-[var(--color-accent)]" aria-hidden />
              <h2 className="text-lg">Bảo mật</h2>
            </div>

            <p className="text-sm leading-relaxed text-[var(--color-muted)]">
              Tài khoản và hồ sơ của bạn được lưu an toàn. Nếu cần đổi mật khẩu, vui lòng liên hệ Lotus để được
              hỗ trợ đặt lại.
            </p>

            <div className="mt-5 space-y-2">
              <Button
                variant="outline"
                block
                onClick={() =>
                  toast.info('Đổi mật khẩu', {
                    description: 'Vui lòng liên hệ hotline/Zalo Lotus để được hỗ trợ đặt lại mật khẩu.',
                  })
                }
              >
                <KeyRound aria-hidden />
                Đổi mật khẩu
              </Button>

              <Button
                variant="ghost"
                block
                onClick={() => {
                  resetAccount();
                  toast.success('Đã xoá dữ liệu tạm trên thiết bị này');
                }}
              >
                <Trash2 aria-hidden />
                Xoá dữ liệu tạm trên thiết bị này
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
