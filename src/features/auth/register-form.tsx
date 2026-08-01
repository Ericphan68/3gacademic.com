'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Eye, EyeOff, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Label } from '@/components/ui/form-fields';
import { useAuthStore } from '@/store/useAuthStore';

const schema = z
  .object({
    fullName: z.string().min(2, 'Vui lòng nhập họ tên đầy đủ'),
    email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
    phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0'),
    password: z
      .string()
      .min(8, 'Mật khẩu tối thiểu 8 ký tự')
      .regex(/[A-Z]/, 'Cần ít nhất một chữ hoa')
      .regex(/[0-9]/, 'Cần ít nhất một chữ số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    accepted: z.literal(true, { message: 'Bạn cần đồng ý điều khoản để tiếp tục' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận chưa khớp',
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

const PASSWORD_RULES = [
  { label: 'Tối thiểu 8 ký tự', test: (value: string) => value.length >= 8 },
  { label: 'Có chữ hoa', test: (value: string) => /[A-Z]/.test(value) },
  { label: 'Có chữ số', test: (value: string) => /[0-9]/.test(value) },
];

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const password = useWatch({ control, name: 'password' }) ?? '';

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const result = registerUser({
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      password: values.password,
    });

    if (!result.success) {
      toast.error('Chưa tạo được tài khoản', { description: result.message });
      return;
    }

    toast.success('Tạo tài khoản thành công', { description: result.message });
    router.push('/dashboard');
  };

  return (
    <div>
      <h1 className="text-3xl">Tạo tài khoản</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Tài khoản giúp bạn quản lý lịch đặt, ví Lotus, voucher và theo dõi tiến độ học.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <Field label="Họ và tên" htmlFor="reg-name" required error={errors.fullName?.message}>
          <Input
            id="reg-name"
            placeholder="Nguyễn Văn A"
            autoComplete="name"
            invalid={Boolean(errors.fullName)}
            {...register('fullName')}
          />
        </Field>

        <Field label="Email" htmlFor="reg-email" required error={errors.email?.message}>
          <Input
            id="reg-email"
            type="email"
            placeholder="email@cua-ban.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <Field label="Số điện thoại" htmlFor="reg-phone" required error={errors.phone?.message}>
          <Input
            id="reg-phone"
            type="tel"
            inputMode="numeric"
            placeholder="0901234567"
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
            {...register('phone')}
          />
        </Field>

        <Field label="Mật khẩu" htmlFor="reg-password" required error={errors.password?.message}>
          <div className="relative">
            <Input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tạo mật khẩu"
              autoComplete="new-password"
              invalid={Boolean(errors.password)}
              className="pr-12"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="absolute top-1/2 right-1 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-muted-surface)]"
            >
              {showPassword ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
            </button>
          </div>
        </Field>

        <ul className="flex flex-wrap gap-x-5 gap-y-2" aria-label="Yêu cầu mật khẩu">
          {PASSWORD_RULES.map((rule) => {
            const passed = rule.test(password);
            return (
              <li
                key={rule.label}
                className={`inline-flex items-center gap-1.5 text-xs ${
                  passed ? 'text-[var(--color-success)]' : 'text-[var(--color-muted)]'
                }`}
              >
                <Check className="size-3.5" strokeWidth={passed ? 3 : 2} aria-hidden />
                {rule.label}
              </li>
            );
          })}
        </ul>

        <Field
          label="Xác nhận mật khẩu"
          htmlFor="reg-confirm"
          required
          error={errors.confirmPassword?.message}
        >
          <Input
            id="reg-confirm"
            type="password"
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
        </Field>

        <div className="flex items-start gap-3">
          <Checkbox
            id="reg-accept"
            onCheckedChange={(checked) =>
              setValue('accepted', (checked === true) as true, { shouldValidate: true })
            }
          />
          <div>
            <Label htmlFor="reg-accept" required className="font-normal">
              Tôi đồng ý với{' '}
              <Link href="/terms" className="font-medium text-[var(--color-accent)] hover:underline">
                Điều khoản sử dụng
              </Link>{' '}
              và{' '}
              <Link href="/privacy" className="font-medium text-[var(--color-accent)] hover:underline">
                Chính sách bảo mật
              </Link>
            </Label>
            {errors.accepted ? (
              <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.accepted.message}</p>
            ) : null}
          </div>
        </div>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting}>
          <UserPlus aria-hidden />
          Tạo tài khoản
        </Button>
      </form>

      <p className="mt-6 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] p-4 text-xs leading-relaxed text-[var(--color-muted)]">
        Đây là hệ thống đăng ký minh hoạ. Tài khoản chỉ được lưu trong trình duyệt của bạn và không gửi tới bất
        kỳ máy chủ nào. Vui lòng không dùng mật khẩu thật.
      </p>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Đã có tài khoản?{' '}
        <Link href="/login" className="font-medium text-[var(--color-accent)] hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
