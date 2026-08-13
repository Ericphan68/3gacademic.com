import { ArrowRight, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

import { FaqJsonLd } from '@/components/common/faq-accordion';
import { PageHero } from '@/components/common/page-hero';
import { Section } from '@/components/common/section';
import { Button } from '@/components/ui/button';
import { MEDIA } from '@/constants/media';
import { CONTACT } from '@/constants/site';
import { FaqBrowser } from '@/features/faq/faq-browser';
import { buildMetadata } from '@/lib/seo';
import { getManagedFaqs } from '@/server/services/faqService';

export const metadata = buildMetadata({
  title: 'Câu hỏi thường gặp',
  description:
    'Giải đáp về đặt lịch, học golf, hội viên, huấn luyện viên, trẻ em, doanh nghiệp, voucher, đổi lịch, trang phục, dụng cụ và thanh toán tại Lotus Golf Center.',
  path: '/faq',
  image: MEDIA.hero.about,
  keywords: ['câu hỏi thường gặp golf', 'hướng dẫn chơi golf cho người mới', 'quy định sân tập golf'],
});

export default async function FaqPage() {
  const faqs = await getManagedFaqs();

  return (
    <>
      <PageHero
        eyebrow="Hỗ trợ"
        title="Câu hỏi thường gặp"
        description="Tổng hợp những điều khách hàng hay hỏi nhất, chia theo 11 nhóm chủ đề. Không tìm thấy câu trả lời? Gọi hotline hoặc nhắn Zalo cho Lotus."
        image={MEDIA.hero.about}
        breadcrumbs={[{ label: 'FAQ' }]}
        size="sm"
      />

      <Section>
        <FaqBrowser catalog={faqs} />
        <FaqJsonLd items={faqs} />
      </Section>

      <Section tone="surface" className="!py-14">
        <div className="mx-auto max-w-3xl rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-8 text-center">
          <h2 className="text-2xl">Vẫn chưa tìm được câu trả lời?</h2>
          <p className="mx-auto mt-3 max-w-lg text-[var(--color-muted)]">
            Đội chăm sóc khách hàng của Lotus trực từ {CONTACT.openHours} mỗi ngày và phản hồi trong vòng 30
            phút trong giờ làm việc.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild variant="accent">
              <a href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}>
                <Phone aria-hidden />
                Gọi {CONTACT.hotline}
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={CONTACT.zalo} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden />
                Nhắn Zalo
              </a>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">
                Gửi biểu mẫu liên hệ
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
