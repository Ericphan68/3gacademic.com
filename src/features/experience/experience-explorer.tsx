'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { ExperienceCard } from '@/components/cards/experience-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/form-fields';
import { EmptyState } from '@/components/ui/states';
import { AUDIENCE_LABELS, AUDIENCE_ORDER } from '@/data/experiences';
import { experienceService } from '@/services/catalogService';
import type { AudienceTag, ExperiencePackage } from '@/types';
import { cn, matchesQuery } from '@/lib/utils';

export function ExperienceExplorer({ catalog }: { catalog?: ExperiencePackage[] }) {
  const [audience, setAudience] = useState<AudienceTag | 'all'>('all');
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    // Không có dữ liệu server → dùng mock (giữ tương thích ngược).
    if (!catalog) return experienceService.filter({ audience, query });
    return catalog.filter((item) => {
      const audienceOk = audience === 'all' || item.audiences.includes(audience);
      return audienceOk && matchesQuery(query, item.name, item.tagline, item.description);
    });
  }, [audience, query, catalog]);
  const hasFilters = audience !== 'all' || query.trim().length > 0;

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <label htmlFor="experience-search" className="sr-only">
              Tìm gói trải nghiệm
            </label>
            <Input
              id="experience-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm theo tên gói, ví dụ “discovery”, “VIP”, “gia đình”…"
            />
          </div>
          {hasFilters ? (
            <Button
              variant="ghost"
              onClick={() => {
                setAudience('all');
                setQuery('');
              }}
            >
              <X aria-hidden />
              Xoá bộ lọc
            </Button>
          ) : null}
        </div>

        <div>
          <p className="mb-3 flex items-center gap-2 text-sm font-medium">
            <SlidersHorizontal className="size-4 text-[var(--color-muted)]" aria-hidden />
            Bạn đi cùng ai?
          </p>
          <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
            <FilterChip active={audience === 'all'} onClick={() => setAudience('all')}>
              Tất cả
            </FilterChip>
            {AUDIENCE_ORDER.map((tag) => (
              <FilterChip key={tag} active={audience === tag} onClick={() => setAudience(tag)}>
                {AUDIENCE_LABELS[tag]}
              </FilterChip>
            ))}
          </div>
        </div>

        <p className="text-sm text-[var(--color-muted)]" aria-live="polite">
          Hiển thị <strong className="font-medium text-[var(--color-foreground)]">{items.length}</strong> gói
          trải nghiệm
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Không tìm thấy gói phù hợp"
          description="Thử bỏ bớt bộ lọc hoặc dùng từ khoá khác. Bạn cũng có thể gọi hotline để Lotus tư vấn gói riêng."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setAudience('all');
                setQuery('');
              }}
            >
              Xoá toàn bộ bộ lọc
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <ExperienceCard key={item.id} item={item} className="h-full" priority={index < 3} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200',
        active
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
          : 'border-[var(--color-border-strong)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]',
      )}
    >
      {children}
    </button>
  );
}
