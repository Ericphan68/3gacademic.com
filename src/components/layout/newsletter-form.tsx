'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BellRing, MessageCircle, Send, Zap } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';
import { CONTACT } from '@/constants/site';
import { useAccountStore } from '@/store/useAccountStore';

const schema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email chưa đúng định dạng'),
});

type FormValues = z.infer<typeof schema>;

const PERKS = [
  { icon: Zap, label: 'Flash Sale giờ thấp điểm' },
  { icon: BellRing, label: 'Lịch sự kiện hằng tháng' },
  { icon: Send, label: 'Ưu đãi dành riêng cho người đăng ký' },
];

export function NewsletterForm() {
  const addLead = useAccountStore((state) => state.addLead);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = async (values: FormValues) => {
    addLead({
      type: 'contact',
      summary: `Đăng ký nhận tin: ${values.email}`,
      payload: { email: values.email, source: 'footer-newsletter' },
    });
    toast.success('Đã đăng ký nhận tin', {
      description: 'Bạn sẽ nhận ưu đãi và lịch sự kiện của Lotus qua email.',
    });
    reset();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div>
        <h2 className="text-2xl text-white md:text-3xl">Nhận ưu đãi trước tất cả mọi người</h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--color-navy-200)]">
          Flash Sale giờ thấp điểm thường hết trong vài giờ. Đăng ký để nhận thông báo sớm, kèm lịch sự
          kiện và các ưu đãi dành riêng cho người đăng ký.
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5">
          {PERKS.map((perk) => (
            <li key={perk.label} className="flex items-center gap-2 text-sm text-[var(--color-navy-100)]">
              <perk.icon className="size-4 text-[var(--color-champagne-300)]" aria-hidden />
              {perk.label}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <Field htmlFor="newsletter-email" error={errors.email?.message} className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Địa chỉ email
            </label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="email@cua-ban.com"
              autoComplete="email"
              invalid={Boolean(errors.email)}
              className="border-white/20 bg-white/5 text-white placeholder:text-white/45 focus:border-[var(--color-champagne-300)]"
              {...register('email')}
            />
          </Field>
          <Button type="submit" variant="gold" size="md" loading={isSubmitting} className="sm:w-auto">
            Đăng ký nhận tin
          </Button>
        </form>

        <a
          href={CONTACT.zalo}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-champagne-300)] underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          <MessageCircle className="size-4" aria-hidden />
          Hoặc theo dõi kênh Zalo của Lotus
        </a>
      </div>
    </div>
  );
}
