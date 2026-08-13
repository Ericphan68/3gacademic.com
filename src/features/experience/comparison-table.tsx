import { Check } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { AUDIENCE_LABELS, EXPERIENCES } from '@/data/experiences';
import { formatCurrency, formatDuration } from '@/lib/format';
import type { ExperiencePackage } from '@/types';

/** Bảng so sánh các gói trải nghiệm — cuộn ngang trên mobile. */
export function ExperienceComparisonTable({ source }: { source?: ExperiencePackage[] }) {
  const items = (source ?? EXPERIENCES).filter(
    (item) => item.featured || item.audiences.includes('beginner'),
  );

  return (
    <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-raised)]">
      <table className="w-full min-w-[52rem] text-sm">
        <caption className="sr-only">
          So sánh giá, thời lượng, số khách và quyền lợi giữa các gói trải nghiệm nổi bật
        </caption>
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <th scope="col" className="p-4 text-left font-medium">
              Gói trải nghiệm
            </th>
            <th scope="col" className="p-4 text-left font-medium">
              Giá từ
            </th>
            <th scope="col" className="p-4 text-left font-medium">
              Thời lượng
            </th>
            <th scope="col" className="p-4 text-left font-medium">
              Số khách
            </th>
            <th scope="col" className="p-4 text-left font-medium">
              Phù hợp với
            </th>
            <th scope="col" className="p-4 text-left font-medium">
              Có HLV
            </th>
            <th scope="col" className="p-4 text-right font-medium">
              <span className="sr-only">Hành động</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[var(--color-border)] last:border-0">
              <th scope="row" className="p-4 text-left font-medium">
                <Link
                  href={`/experience/${item.slug}`}
                  className="transition-colors hover:text-[var(--color-accent)]"
                >
                  {item.name}
                </Link>
                <span className="mt-0.5 block text-xs font-normal text-[var(--color-muted)]">
                  {item.tagline}
                </span>
              </th>
              <td className="p-4 font-medium tabular-nums">{formatCurrency(item.price)}</td>
              <td className="p-4 whitespace-nowrap text-[var(--color-muted)]">
                {formatDuration(item.durationMinutes)}
              </td>
              <td className="p-4 whitespace-nowrap text-[var(--color-muted)]">
                {item.minGuests === item.maxGuests
                  ? `${item.minGuests}`
                  : `${item.minGuests}–${item.maxGuests}`}
              </td>
              <td className="p-4 text-[var(--color-muted)]">
                {item.audiences.map((tag) => AUDIENCE_LABELS[tag]).join(', ')}
              </td>
              <td className="p-4">
                {item.includes.some((line) => line.toLowerCase().includes('huấn luyện viên')) ? (
                  <Check className="size-4 text-[var(--color-accent)]" aria-label="Có huấn luyện viên" />
                ) : (
                  <span className="text-[var(--color-stone-400)]" aria-label="Không kèm huấn luyện viên">
                    —
                  </span>
                )}
              </td>
              <td className="p-4 text-right">
                <Button asChild size="sm" variant="outline">
                  <Link href={{ pathname: '/booking', query: { experience: item.slug } }}>Đặt</Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
