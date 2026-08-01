'use client';

import { HelpCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FaqAccordion } from '@/components/common/faq-accordion';
import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';
import { EmptyState } from '@/components/ui/states';
import { FAQ_GROUP_LABELS, FAQ_GROUP_ORDER, FAQS } from '@/data/faqs';
import { matchesQuery } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { FaqGroup } from '@/types';

export function FaqBrowser() {
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<FaqGroup | 'all'>('all');

  const results = useMemo(
    () =>
      FAQS.filter((faq) => {
        if (group !== 'all' && faq.group !== group) return false;
        return matchesQuery(query, faq.question, faq.answer);
      }),
    [query, group],
  );

  const grouped = useMemo(() => {
    return FAQ_GROUP_ORDER.map((key) => ({
      key,
      label: FAQ_GROUP_LABELS[key],
      items: results.filter((faq) => faq.group === key),
    })).filter((section) => section.items.length > 0);
  }, [results]);

  return (
    <div className="grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-14">
      {/* Bộ lọc nhóm */}
      <aside className="lg:sticky lg:top-28 lg:self-start">
        <Field label="Tìm câu hỏi" htmlFor="faq-search">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
              aria-hidden
            />
            <Input
              id="faq-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nhập từ khoá…"
              className="pl-10"
            />
          </div>
        </Field>

        <nav className="mt-6" aria-label="Nhóm câu hỏi">
          <p className="mb-3 text-[11px] font-semibold tracking-widest text-[var(--color-muted)] uppercase">
            Nhóm chủ đề
          </p>
          <ul className="scrollbar-none flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
            <li className="shrink-0">
              <button
                type="button"
                onClick={() => setGroup('all')}
                aria-pressed={group === 'all'}
                className={cn(
                  'w-full cursor-pointer rounded-[var(--radius-md)] px-3.5 py-2 text-left text-sm whitespace-nowrap transition-colors',
                  group === 'all'
                    ? 'bg-[var(--color-golf-50)] font-medium text-[var(--color-accent)]'
                    : 'hover:bg-[var(--color-muted-surface)]',
                )}
              >
                Tất cả ({FAQS.length})
              </button>
            </li>
            {FAQ_GROUP_ORDER.map((key) => {
              const count = FAQS.filter((faq) => faq.group === key).length;
              return (
                <li key={key} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setGroup(key)}
                    aria-pressed={group === key}
                    className={cn(
                      'w-full cursor-pointer rounded-[var(--radius-md)] px-3.5 py-2 text-left text-sm whitespace-nowrap transition-colors',
                      group === key
                        ? 'bg-[var(--color-golf-50)] font-medium text-[var(--color-accent)]'
                        : 'hover:bg-[var(--color-muted-surface)]',
                    )}
                  >
                    {FAQ_GROUP_LABELS[key]} ({count})
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Kết quả */}
      <div>
        <p className="mb-6 text-sm text-[var(--color-muted)]" aria-live="polite">
          Hiển thị <span className="font-medium text-[var(--color-foreground)]">{results.length}</span> câu hỏi
        </p>

        {results.length === 0 ? (
          <EmptyState
            title="Không tìm thấy câu hỏi phù hợp"
            description="Thử từ khoá khác, hoặc liên hệ hotline để được nhân viên Lotus giải đáp trực tiếp."
            icon={HelpCircle}
            action={
              <Button
                variant="outline"
                onClick={() => {
                  setQuery('');
                  setGroup('all');
                }}
              >
                Xem toàn bộ câu hỏi
              </Button>
            }
          />
        ) : (
          <div className="space-y-10">
            {grouped.map((section) => (
              <section key={section.key} aria-labelledby={`faq-${section.key}`}>
                <h2 id={`faq-${section.key}`} className="rule-gold text-xl">
                  {section.label}
                </h2>
                <FaqAccordion items={section.items} className="mt-4" />
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
