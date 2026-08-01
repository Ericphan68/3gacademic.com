'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building2, Check, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Label, Select, Textarea } from '@/components/ui/form-fields';
import { sanitizeText } from '@/lib/utils';
import { useAccountStore } from '@/store/useAccountStore';

const schema = z.object({
  company: z.string().min(2, 'Vui lòng nhập tên doanh nghiệp'),
  contactName: z.string().min(2, 'Vui lòng nhập họ tên người liên hệ'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0'),
  // Giữ kiểu string để tương thích với input HTML, kiểm tra khoảng giá trị bằng refine.
  headcount: z
    .string()
    .min(1, 'Vui lòng nhập số người')
    .refine((value) => Number(value) >= 5 && Number(value) <= 500, 'Số người từ 5 đến 500'),
  preferredDate: z.string().min(1, 'Vui lòng chọn ngày dự kiến'),
  budget: z.string().min(1, 'Vui lòng chọn khoảng ngân sách'),
  objective: z.string().min(1, 'Vui lòng chọn mục tiêu chính'),
  note: z.string().max(1000, 'Ghi chú tối đa 1000 ký tự').optional(),
});

type FormValues = z.infer<typeof schema>;

const BUDGET_OPTIONS = [
  'Dưới 20 triệu',
  '20 – 50 triệu',
  '50 – 100 triệu',
  '100 – 200 triệu',
  'Trên 200 triệu',
  'Chưa xác định',
];

const OBJECTIVES = [
  'Gắn kết nội bộ',
  'Tiếp khách hàng và đối tác',
  'Phúc lợi cho nhân viên',
  'Giải đấu nội bộ',
  'Hoạt động cho trường học',
  'Khác',
];

export function CorporateQuoteForm() {
  const addLead = useAccountStore((state) => state.addLead);
  const [services, setServices] = useState({ fnb: true, branding: false, coach: true });
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { headcount: '30', budget: '', objective: '', note: '' },
  });

  const onSubmit = async (values: FormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 700));

    addLead({
      type: 'corporate',
      summary: `${values.company} — ${Number(values.headcount)} người, ${values.objective}`,
      payload: {
        company: sanitizeText(values.company, 120),
        contactName: sanitizeText(values.contactName, 120),
        email: values.email,
        phone: values.phone,
        headcount: Number(values.headcount),
        preferredDate: values.preferredDate,
        budget: values.budget,
        objective: values.objective,
        fnb: services.fnb,
        branding: services.branding,
        coach: services.coach,
        note: sanitizeText(values.note ?? '', 1000),
      },
    });

    setSubmitted(true);
    reset();
    toast.success('Đã gửi yêu cầu báo giá', {
      description: 'Lotus sẽ liên hệ trong 24 giờ làm việc. Yêu cầu đã được lưu ở phiên demo này.',
    });
  };

  if (submitted) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-8 text-center">
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
          <Check className="size-7" strokeWidth={3} aria-hidden />
        </span>
        <h3 className="text-xl">Đã nhận yêu cầu của bạn</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--color-golf-800)]">
          Bộ phận doanh nghiệp của Lotus sẽ liên hệ trong vòng 24 giờ làm việc để làm rõ yêu cầu và gửi báo giá
          chi tiết kèm 2–3 phương án.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
          Gửi thêm một yêu cầu khác
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 md:p-8"
    >
      <div className="mb-6 flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-golf-50)] text-[var(--color-accent)]">
          <Building2 className="size-5" aria-hidden />
        </span>
        <div>
          <h3 className="text-xl">Yêu cầu báo giá</h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Điền thông tin bên dưới, Lotus phản hồi trong 24 giờ làm việc.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Tên doanh nghiệp" htmlFor="corp-company" required error={errors.company?.message}>
            <Input
              id="corp-company"
              placeholder="Công ty TNHH ABC"
              autoComplete="organization"
              invalid={Boolean(errors.company)}
              {...register('company')}
            />
          </Field>

          <Field label="Người liên hệ" htmlFor="corp-name" required error={errors.contactName?.message}>
            <Input
              id="corp-name"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
              invalid={Boolean(errors.contactName)}
              {...register('contactName')}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email công việc" htmlFor="corp-email" required error={errors.email?.message}>
            <Input
              id="corp-email"
              type="email"
              placeholder="ten@congty.com"
              autoComplete="email"
              invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </Field>

          <Field label="Số điện thoại" htmlFor="corp-phone" required error={errors.phone?.message}>
            <Input
              id="corp-phone"
              type="tel"
              inputMode="numeric"
              placeholder="0901234567"
              autoComplete="tel"
              invalid={Boolean(errors.phone)}
              {...register('phone')}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Số người dự kiến"
            htmlFor="corp-headcount"
            required
            error={errors.headcount?.message}
            helper="Từ 5 đến 500 người"
          >
            <Input
              id="corp-headcount"
              type="number"
              min={5}
              max={500}
              invalid={Boolean(errors.headcount)}
              {...register('headcount')}
            />
          </Field>

          <Field label="Ngày dự kiến" htmlFor="corp-date" required error={errors.preferredDate?.message}>
            <Input
              id="corp-date"
              type="date"
              invalid={Boolean(errors.preferredDate)}
              {...register('preferredDate')}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Khoảng ngân sách" htmlFor="corp-budget" required error={errors.budget?.message}>
            <Select id="corp-budget" invalid={Boolean(errors.budget)} {...register('budget')}>
              <option value="">Chọn khoảng ngân sách</option>
              {BUDGET_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Mục tiêu chính" htmlFor="corp-objective" required error={errors.objective?.message}>
            <Select id="corp-objective" invalid={Boolean(errors.objective)} {...register('objective')}>
              <option value="">Chọn mục tiêu</option>
              {OBJECTIVES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-medium">Hạng mục cần Lotus chuẩn bị</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { key: 'fnb' as const, label: 'F&B cho sự kiện', hint: 'Buffet, bento, đồ uống' },
              { key: 'branding' as const, label: 'Branding tại chỗ', hint: 'Backdrop, standee, cờ tee' },
              { key: 'coach' as const, label: 'Huấn luyện viên hỗ trợ', hint: 'Kèm nhóm chưa biết chơi' },
            ].map((item) => (
              <label
                key={item.key}
                htmlFor={`corp-${item.key}`}
                className={`flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-4 transition-colors ${
                  services[item.key]
                    ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)]'
                    : 'border-[var(--color-border)]'
                }`}
              >
                <Checkbox
                  id={`corp-${item.key}`}
                  checked={services[item.key]}
                  onCheckedChange={(checked) =>
                    setServices((prev) => ({ ...prev, [item.key]: checked === true }))
                  }
                />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-[var(--color-muted)]">{item.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          label="Ghi chú thêm"
          htmlFor="corp-note"
          error={errors.note?.message}
          helper="Ví dụ: cần xuất hoá đơn VAT, có khách nước ngoài, muốn kết hợp phòng họp…"
        >
          <Textarea id="corp-note" rows={4} placeholder="Mô tả thêm về sự kiện bạn muốn tổ chức" {...register('note')} />
        </Field>

        <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-dashed border-[var(--color-border-strong)] p-4">
          <Label className="text-xs leading-relaxed font-normal text-[var(--color-muted)]">
            Thông tin bạn gửi chỉ được lưu trong trình duyệt của bạn ở phiên bản demo này và không được truyền
            đi bất kỳ đâu.
          </Label>
        </div>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting}>
          <Send aria-hidden />
          Gửi yêu cầu báo giá
        </Button>
      </div>
    </form>
  );
}
