import { Breadcrumbs } from './breadcrumbs';

import { Section } from '@/components/common/section';
import { CONTACT } from '@/constants/site';

export interface LegalSubsection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: LegalSubsection[];
}

/** Bố cục dùng chung cho trang Chính sách bảo mật và Điều khoản sử dụng. */
export function LegalPage({
  title,
  intro,
  updatedAt,
  sections,
  breadcrumbLabel,
}: {
  title: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
  breadcrumbLabel: string;
}) {
  return (
    <>
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container-lotus py-5">
          <Breadcrumbs items={[{ label: breadcrumbLabel }]} />
        </div>
      </div>

      <Section className="!pt-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl">{title}</h1>
          <p className="mt-4 leading-relaxed text-[var(--color-muted)]">{intro}</p>
          <p className="mt-3 text-sm text-[var(--color-muted)]">Cập nhật lần cuối: {updatedAt}</p>

          {/* Mục lục */}
          <nav aria-label="Mục lục" className="mt-10 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <p className="mb-3 text-sm font-medium">Nội dung chính</p>
            <ol className="space-y-2 text-sm">
              {sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#muc-${index + 1}`}
                    className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
                  >
                    {index + 1}. {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 space-y-10">
            {sections.map((section, index) => (
              <section key={section.heading} id={`muc-${index + 1}`} className="scroll-mt-28">
                <h2 className="text-xl md:text-2xl">
                  {index + 1}. {section.heading}
                </h2>

                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-relaxed text-[var(--color-muted)]">
                    {paragraph}
                  </p>
                ))}

                {section.bullets ? (
                  <ul className="mt-4 space-y-2">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 leading-relaxed text-[var(--color-muted)]">
                        <span
                          className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--color-champagne-400)]"
                          aria-hidden
                        />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.subsections?.map((sub, subIndex) => (
                  <div key={sub.heading} className="mt-7">
                    <h3 className="text-base font-medium text-[var(--color-foreground)] md:text-lg">
                      {index + 1}.{subIndex + 1}. {sub.heading}
                    </h3>

                    {sub.paragraphs?.map((paragraph) => (
                      <p key={paragraph} className="mt-3 leading-relaxed text-[var(--color-muted)]">
                        {paragraph}
                      </p>
                    ))}

                    {sub.bullets ? (
                      <ul className="mt-3 space-y-2">
                        {sub.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-3 leading-relaxed text-[var(--color-muted)]">
                            <span
                              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-[var(--color-champagne-400)]"
                              aria-hidden
                            />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h2 className="text-lg">Liên hệ về nội dung này</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
              Nếu bạn có câu hỏi về tài liệu này, liên hệ Lotus qua hotline{' '}
              <a
                href={`tel:${CONTACT.hotline.replace(/\s/g, '')}`}
                className="font-medium text-[var(--color-accent)] hover:underline"
              >
                {CONTACT.hotline}
              </a>{' '}
              hoặc email{' '}
              <a
                href={`mailto:${CONTACT.email}`}
                className="font-medium text-[var(--color-accent)] hover:underline"
              >
                {CONTACT.email}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
