'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Building, Check, Send, Users } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/disclosure';
import { Field, Input, Select, Textarea } from '@/components/ui/form-fields';
import { sanitizeText } from '@/lib/utils';
import { TOUR_PACKAGES } from '@/data/tours';
import { useAccountStore } from '@/store/useAccountStore';

/* ---------------- Form đặt đoàn ---------------- */

const groupSchema = z.object({
  contactName: z.string().min(2, 'Vui lòng nhập họ tên'),
  organization: z.string().min(2, 'Vui lòng nhập tên đơn vị hoặc đoàn'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0'),
  packageSlug: z.string().min(1, 'Vui lòng chọn gói tour'),
  // Giữ kiểu string để tương thích với input HTML, kiểm tra khoảng giá trị bằng refine.
  pax: z
    .string()
    .min(1, 'Vui lòng nhập số khách')
    .refine((value) => Number(value) >= 2 && Number(value) <= 200, 'Số khách từ 2 đến 200'),
  travelDate: z.string().min(1, 'Vui lòng chọn ngày dự kiến'),
  note: z.string().max(1000, 'Ghi chú tối đa 1000 ký tự').optional(),
});

type GroupValues = z.infer<typeof groupSchema>;

/* ---------------- Form đăng ký đại lý ---------------- */

const agencySchema = z.object({
  company: z.string().min(2, 'Vui lòng nhập tên công ty'),
  taxCode: z.string().min(8, 'Mã số thuế không hợp lệ').max(20, 'Mã số thuế không hợp lệ'),
  contactName: z.string().min(2, 'Vui lòng nhập họ tên người liên hệ'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại gồm 10 chữ số, bắt đầu bằng 0'),
  marketFocus: z.string().min(1, 'Vui lòng chọn thị trường chính'),
  monthlyVolume: z.string().min(1, 'Vui lòng chọn quy mô dự kiến'),
  note: z.string().max(1000, 'Ghi chú tối đa 1000 ký tự').optional(),
});

type AgencyValues = z.infer<typeof agencySchema>;

const MARKETS = ['Khách nội địa', 'Khách quốc tế inbound', 'Khách doanh nghiệp', 'Kết hợp nhiều nhóm'];
const VOLUMES = ['Dưới 50 khách/tháng', '50 – 150 khách/tháng', '150 – 400 khách/tháng', 'Trên 400 khách/tháng'];

export function TourForms() {
  const addLead = useAccountStore((state) => state.addLead);
  const [groupDone, setGroupDone] = useState(false);
  const [agencyDone, setAgencyDone] = useState(false);

  const groupForm = useForm<GroupValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: { pax: '10', packageSlug: '', note: '' },
  });

  const agencyForm = useForm<AgencyValues>({
    resolver: zodResolver(agencySchema),
    defaultValues: { marketFocus: '', monthlyVolume: '', note: '' },
  });

  const submitGroup = async (values: GroupValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const pkg = TOUR_PACKAGES.find((item) => item.slug === values.packageSlug);

    addLead({
      type: 'tour-group',
      summary: `${values.organization} — ${Number(values.pax)} khách, ${pkg?.name ?? values.packageSlug}`,
      payload: {
        contactName: sanitizeText(values.contactName, 120),
        organization: sanitizeText(values.organization, 120),
        email: values.email,
        phone: values.phone,
        packageName: pkg?.name ?? values.packageSlug,
        pax: Number(values.pax),
        travelDate: values.travelDate,
        note: sanitizeText(values.note ?? '', 1000),
      },
    });

    setGroupDone(true);
    groupForm.reset();
    toast.success('Đã gửi yêu cầu đặt đoàn', {
      description: 'Lotus sẽ liên hệ trong 24 giờ làm việc để xác nhận lịch và báo giá đoàn.',
    });
  };

  const submitAgency = async (values: AgencyValues) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    addLead({
      type: 'agency',
      summary: `${values.company} — đăng ký đối tác đại lý`,
      payload: {
        company: sanitizeText(values.company, 120),
        taxCode: sanitizeText(values.taxCode, 20),
        contactName: sanitizeText(values.contactName, 120),
        email: values.email,
        phone: values.phone,
        marketFocus: values.marketFocus,
        monthlyVolume: values.monthlyVolume,
        note: sanitizeText(values.note ?? '', 1000),
      },
    });

    setAgencyDone(true);
    agencyForm.reset();
    toast.success('Đã gửi hồ sơ đối tác', {
      description: 'Bộ phận đối tác của Lotus sẽ liên hệ để trao đổi điều khoản hợp tác.',
    });
  };

  return (
    <Tabs defaultValue="group">
      <TabsList className="mx-auto max-w-md">
        <TabsTrigger value="group" className="flex-1">
          <Users className="mr-1.5 inline size-4" aria-hidden />
          Đặt đoàn
        </TabsTrigger>
        <TabsTrigger value="agency" className="flex-1">
          <Building className="mr-1.5 inline size-4" aria-hidden />
          Đăng ký đại lý
        </TabsTrigger>
      </TabsList>

      {/* Đặt đoàn */}
      <TabsContent value="group">
        {groupDone ? (
          <SuccessPanel
            title="Đã nhận yêu cầu đặt đoàn"
            description="Lotus sẽ liên hệ trong 24 giờ làm việc để xác nhận khung giờ, số khách cuối cùng và gửi báo giá đoàn."
            onReset={() => setGroupDone(false)}
          />
        ) : (
          <form
            onSubmit={groupForm.handleSubmit(submitGroup)}
            noValidate
            className="mx-auto max-w-3xl space-y-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Họ tên người liên hệ"
                htmlFor="tour-name"
                required
                error={groupForm.formState.errors.contactName?.message}
              >
                <Input id="tour-name" placeholder="Nguyễn Văn A" {...groupForm.register('contactName')} />
              </Field>

              <Field
                label="Đơn vị / tên đoàn"
                htmlFor="tour-org"
                required
                error={groupForm.formState.errors.organization?.message}
              >
                <Input id="tour-org" placeholder="Công ty du lịch ABC" {...groupForm.register('organization')} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" htmlFor="tour-email" required error={groupForm.formState.errors.email?.message}>
                <Input id="tour-email" type="email" placeholder="ten@congty.com" {...groupForm.register('email')} />
              </Field>

              <Field label="Số điện thoại" htmlFor="tour-phone" required error={groupForm.formState.errors.phone?.message}>
                <Input id="tour-phone" type="tel" inputMode="numeric" placeholder="0901234567" {...groupForm.register('phone')} />
              </Field>
            </div>

            <Field label="Gói tour" htmlFor="tour-package" required error={groupForm.formState.errors.packageSlug?.message}>
              <Select id="tour-package" {...groupForm.register('packageSlug')}>
                <option value="">Chọn gói tour</option>
                {TOUR_PACKAGES.map((pkg) => (
                  <option key={pkg.slug} value={pkg.slug}>
                    {pkg.name} — {pkg.durationLabel}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Số khách" htmlFor="tour-pax" required error={groupForm.formState.errors.pax?.message}>
                <Input id="tour-pax" type="number" min={2} max={200} {...groupForm.register('pax')} />
              </Field>

              <Field label="Ngày dự kiến" htmlFor="tour-date" required error={groupForm.formState.errors.travelDate?.message}>
                <Input id="tour-date" type="date" {...groupForm.register('travelDate')} />
              </Field>
            </div>

            <Field
              label="Ghi chú"
              htmlFor="tour-note"
              error={groupForm.formState.errors.note?.message}
              helper="Ví dụ: đoàn có khách nước ngoài, cần hướng dẫn viên tiếng Anh, yêu cầu suất ăn chay…"
            >
              <Textarea id="tour-note" rows={4} placeholder="Yêu cầu riêng của đoàn" {...groupForm.register('note')} />
            </Field>

            <Button type="submit" variant="accent" size="lg" block loading={groupForm.formState.isSubmitting}>
              <Send aria-hidden />
              Gửi yêu cầu đặt đoàn
            </Button>
          </form>
        )}
      </TabsContent>

      {/* Đăng ký đại lý */}
      <TabsContent value="agency">
        {agencyDone ? (
          <SuccessPanel
            title="Đã nhận hồ sơ đối tác"
            description="Bộ phận đối tác của Lotus sẽ liên hệ để trao đổi mức giá đối tác, quy trình đặt đoàn và bộ tài liệu bán hàng."
            onReset={() => setAgencyDone(false)}
          />
        ) : (
          <form
            onSubmit={agencyForm.handleSubmit(submitAgency)}
            noValidate
            className="mx-auto max-w-3xl space-y-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-6 md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Tên công ty" htmlFor="agency-company" required error={agencyForm.formState.errors.company?.message}>
                <Input id="agency-company" placeholder="Công ty du lịch ABC" {...agencyForm.register('company')} />
              </Field>

              <Field label="Mã số thuế" htmlFor="agency-tax" required error={agencyForm.formState.errors.taxCode?.message}>
                <Input id="agency-tax" placeholder="0312345678" {...agencyForm.register('taxCode')} />
              </Field>
            </div>

            <Field
              label="Người liên hệ"
              htmlFor="agency-name"
              required
              error={agencyForm.formState.errors.contactName?.message}
            >
              <Input id="agency-name" placeholder="Nguyễn Văn A" {...agencyForm.register('contactName')} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" htmlFor="agency-email" required error={agencyForm.formState.errors.email?.message}>
                <Input id="agency-email" type="email" placeholder="ten@congty.com" {...agencyForm.register('email')} />
              </Field>

              <Field label="Số điện thoại" htmlFor="agency-phone" required error={agencyForm.formState.errors.phone?.message}>
                <Input id="agency-phone" type="tel" inputMode="numeric" placeholder="0901234567" {...agencyForm.register('phone')} />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Thị trường chính" htmlFor="agency-market" required error={agencyForm.formState.errors.marketFocus?.message}>
                <Select id="agency-market" {...agencyForm.register('marketFocus')}>
                  <option value="">Chọn thị trường</option>
                  {MARKETS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Quy mô dự kiến" htmlFor="agency-volume" required error={agencyForm.formState.errors.monthlyVolume?.message}>
                <Select id="agency-volume" {...agencyForm.register('monthlyVolume')}>
                  <option value="">Chọn quy mô</option>
                  {VOLUMES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field label="Ghi chú" htmlFor="agency-note" error={agencyForm.formState.errors.note?.message}>
              <Textarea
                id="agency-note"
                rows={4}
                placeholder="Thông tin thêm về công ty và nhu cầu hợp tác"
                {...agencyForm.register('note')}
              />
            </Field>

            <Button type="submit" variant="accent" size="lg" block loading={agencyForm.formState.isSubmitting}>
              <Send aria-hidden />
              Gửi hồ sơ đối tác
            </Button>
          </form>
        )}
      </TabsContent>
    </Tabs>
  );
}

function SuccessPanel({
  title,
  description,
  onReset,
}: {
  title: string;
  description: string;
  onReset: () => void;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-[var(--radius-lg)] border border-[var(--color-golf-200)] bg-[var(--color-golf-50)] p-8 text-center">
      <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--color-accent)] text-white">
        <Check className="size-7" strokeWidth={3} aria-hidden />
      </span>
      <h3 className="text-xl">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--color-golf-800)]">{description}</p>
      <Button variant="outline" className="mt-6" onClick={onReset}>
        Gửi thêm một yêu cầu khác
      </Button>
    </div>
  );
}
