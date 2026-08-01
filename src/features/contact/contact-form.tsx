'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/form-fields';
import { sanitizeText } from '@/lib/utils';
import { useAccountStore } from '@/store/useAccountStore';

const schema = z.object({
  fullName: z.string().min(2, 'Vui lòng nhập họ tên'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0'),
  topic: z.string().min(1, 'Vui lòng chọn chủ đề'),
  message: z.string().min(10, 'Nội dung tối thiểu 10 ký tự').max(1000, 'Nội dung tối đa 1000 ký tự'),
});

type FormValues = z.infer<typeof schema>;

const TOPICS = [
  'Đặt lịch và giờ mở cửa',
  'Học golf và huấn luyện viên',
  'Hội viên và ví Lotus',
  'Sự kiện và giải đấu',
  'Doanh nghiệp và đoàn khách',
  'Góp ý về dịch vụ',
  'Nội dung khác',
];

export function ContactForm() {
  const addLead = useAccountStore((state) => state.addLead);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { topic: '', message: '' } });

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    addLead({
      type: 'contact',
      summary: `${values.fullName} — ${values.topic}`,
      payload: {
        fullName: sanitizeText(values.fullName, 120),
        email: values.email,
        phone: values.phone,
        topic: values.topic,
        message: sanitizeText(values.message, 1000),
      },
    });

    setSubmitted(true);
    reset();
    toast.success('Đã gửi liên hệ', {
      description: 'Lotus phản hồi trong giờ làm việc, thường dưới 30 phút.',
    });
  };

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-8 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
          <Check className="size-7" strokeWidth={3} aria-hidden />
        </span>
        <h3 className="text-xl">Cảm ơn bạn đã liên hệ</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--color-golf-800)]">
          Lotus đã nhận được tin nhắn của bạn và sẽ phản hồi trong giờ làm việc, thường dưới 30 phút. Nếu cần
          gấp, bạn gọi hotline để được hỗ trợ ngay.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
          Gửi tin nhắn khác
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 md:p-8"
    >
      <div>
        <h3 className="text-xl">Gửi tin nhắn cho Lotus</h3>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Điền thông tin bên dưới, đội chăm sóc khách hàng sẽ liên hệ lại.
        </p>
      </div>

      <Field label="Họ và tên" htmlFor="contact-name" required error={errors.fullName?.message}>
        <Input
          id="contact-name"
          placeholder="Nguyễn Văn A"
          autoComplete="name"
          invalid={Boolean(errors.fullName)}
          {...register('fullName')}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="contact-email" required error={errors.email?.message}>
          <Input
            id="contact-email"
            type="email"
            placeholder="email@cua-ban.com"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </Field>

        <Field label="Số điện thoại" htmlFor="contact-phone" required error={errors.phone?.message}>
          <Input
            id="contact-phone"
            type="tel"
            inputMode="numeric"
            placeholder="0901234567"
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
            {...register('phone')}
          />
        </Field>
      </div>

      <Field label="Chủ đề" htmlFor="contact-topic" required error={errors.topic?.message}>
        <Select id="contact-topic" invalid={Boolean(errors.topic)} {...register('topic')}>
          <option value="">Chọn chủ đề bạn quan tâm</option>
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Nội dung" htmlFor="contact-message" required error={errors.message?.message}>
        <Textarea
          id="contact-message"
          rows={5}
          placeholder="Bạn cần Lotus hỗ trợ điều gì?"
          invalid={Boolean(errors.message)}
          {...register('message')}
        />
      </Field>

      <p className="text-xs leading-relaxed text-[var(--color-muted)]">
        Thông tin bạn gửi chỉ được lưu trong trình duyệt của bạn ở phiên bản demo này và không được truyền đi
        bất kỳ đâu.
      </p>

      <Button type="submit" variant="accent" size="lg" block loading={isSubmitting}>
        <Send aria-hidden />
        Gửi tin nhắn
      </Button>
    </form>
  );
}
