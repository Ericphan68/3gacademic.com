'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CoachCard } from '@/components/cards/coach-card';
import { Button } from '@/components/ui/button';
import { Field, Input, Select } from '@/components/ui/form-fields';
import { EmptyState } from '@/components/ui/states';
import { LANGUAGE_LABELS, SPECIALTY_LABELS } from '@/data/coaches';
import { matchesQuery } from '@/lib/utils';
import { coachService, type CoachFilters } from '@/services/catalogService';
import type { Coach, CoachLanguage, CoachSpecialty } from '@/types';

/** Lọc + sắp xếp HLV client-side khi dữ liệu đến từ server (giống coachService.filter). */
function filterCoaches(source: Coach[], filters: CoachFilters): Coach[] {
  const result = source.filter((coach) => {
    if (!matchesQuery(filters.query ?? '', coach.name, coach.title, coach.bio)) return false;
    if (filters.specialty && filters.specialty !== 'all' && !coach.specialties.includes(filters.specialty))
      return false;
    if (filters.language && filters.language !== 'all' && !coach.languages.includes(filters.language))
      return false;
    if (filters.maxPrice && coach.pricePerSession > filters.maxPrice) return false;
    if (filters.minRating && coach.rating < filters.minRating) return false;
    return true;
  });
  switch (filters.sort) {
    case 'price-asc':
      return [...result].sort((a, b) => a.pricePerSession - b.pricePerSession);
    case 'price-desc':
      return [...result].sort((a, b) => b.pricePerSession - a.pricePerSession);
    case 'rating':
      return [...result].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case 'experience':
      return [...result].sort((a, b) => b.yearsExperience - a.yearsExperience);
    default:
      return [...result].sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating);
  }
}

const PRICE_OPTIONS = [
  { value: '0', label: 'Tất cả mức giá' },
  { value: '700000', label: 'Dưới 700.000đ' },
  { value: '900000', label: 'Dưới 900.000đ' },
  { value: '1200000', label: 'Dưới 1.200.000đ' },
];

const RATING_OPTIONS = [
  { value: '0', label: 'Tất cả đánh giá' },
  { value: '4.5', label: 'Từ 4,5 sao' },
  { value: '4.8', label: 'Từ 4,8 sao' },
  { value: '4.9', label: 'Từ 4,9 sao' },
];

const SORT_OPTIONS: { value: NonNullable<CoachFilters['sort']>; label: string }[] = [
  { value: 'recommended', label: 'Đề xuất của Lotus' },
  { value: 'rating', label: 'Đánh giá cao nhất' },
  { value: 'price-asc', label: 'Giá thấp đến cao' },
  { value: 'price-desc', label: 'Giá cao đến thấp' },
  { value: 'experience', label: 'Nhiều kinh nghiệm nhất' },
];

export function CoachExplorer({ catalog }: { catalog?: Coach[] }) {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState<CoachSpecialty | 'all'>('all');
  const [language, setLanguage] = useState<CoachLanguage | 'all'>('all');
  const [maxPrice, setMaxPrice] = useState('0');
  const [minRating, setMinRating] = useState('0');
  const [sort, setSort] = useState<NonNullable<CoachFilters['sort']>>('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const coaches = useMemo(() => {
    const filters: CoachFilters = {
      query,
      specialty,
      language,
      maxPrice: Number(maxPrice) || undefined,
      minRating: Number(minRating) || undefined,
      sort,
    };
    // Không có dữ liệu server → dùng mock (giữ tương thích ngược).
    return catalog ? filterCoaches(catalog, filters) : coachService.filter(filters);
  }, [query, specialty, language, maxPrice, minRating, sort, catalog]);

  const hasFilters =
    query !== '' || specialty !== 'all' || language !== 'all' || maxPrice !== '0' || minRating !== '0';

  const reset = () => {
    setQuery('');
    setSpecialty('all');
    setLanguage('all');
    setMaxPrice('0');
    setMinRating('0');
    setSort('recommended');
  };

  return (
    <div>
      <div className="mb-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <Field label="Tìm huấn luyện viên" htmlFor="coach-search" className="flex-1">
            <div className="relative">
              <Search
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[var(--color-muted)]"
                aria-hidden
              />
              <Input
                id="coach-search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Nhập tên hoặc chuyên môn…"
                className="pl-10"
              />
            </div>
          </Field>

          <Field label="Sắp xếp" htmlFor="coach-sort" className="lg:w-56">
            <Select
              id="coach-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as NonNullable<CoachFilters['sort']>)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>

          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal aria-hidden />
            {filtersOpen ? 'Ẩn bộ lọc' : 'Bộ lọc'}
          </Button>
        </div>

        <div className={`${filtersOpen ? 'grid' : 'hidden'} mt-4 gap-4 sm:grid-cols-2 lg:grid lg:grid-cols-4`}>
          <Field label="Chuyên môn" htmlFor="coach-specialty">
            <Select
              id="coach-specialty"
              value={specialty}
              onChange={(event) => setSpecialty(event.target.value as CoachSpecialty | 'all')}
            >
              <option value="all">Tất cả chuyên môn</option>
              {(Object.keys(SPECIALTY_LABELS) as CoachSpecialty[]).map((key) => (
                <option key={key} value={key}>
                  {SPECIALTY_LABELS[key]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Ngôn ngữ" htmlFor="coach-language">
            <Select
              id="coach-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value as CoachLanguage | 'all')}
            >
              <option value="all">Tất cả ngôn ngữ</option>
              {(Object.keys(LANGUAGE_LABELS) as CoachLanguage[]).map((key) => (
                <option key={key} value={key}>
                  {LANGUAGE_LABELS[key]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Mức giá mỗi buổi" htmlFor="coach-price">
            <Select id="coach-price" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}>
              {PRICE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Đánh giá" htmlFor="coach-rating">
            <Select id="coach-rating" value={minRating} onChange={(event) => setMinRating(event.target.value)}>
              {RATING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--color-muted)]" aria-live="polite">
          Tìm thấy <span className="font-medium text-[var(--color-foreground)]">{coaches.length}</span> huấn
          luyện viên
        </p>
        {hasFilters ? (
          <Button variant="ghost" size="sm" onClick={reset}>
            <X aria-hidden />
            Xoá bộ lọc
          </Button>
        ) : null}
      </div>

      {coaches.length === 0 ? (
        <EmptyState
          title="Chưa có huấn luyện viên phù hợp"
          description="Thử nới rộng bộ lọc hoặc xoá bớt điều kiện tìm kiếm để xem thêm lựa chọn."
          action={
            <Button variant="outline" onClick={reset}>
              Xoá toàn bộ bộ lọc
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} />
          ))}
        </div>
      )}
    </div>
  );
}
