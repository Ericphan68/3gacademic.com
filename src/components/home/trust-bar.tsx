import {
  CalendarCheck,
  Flag,
  Gift,
  GraduationCap,
  HeartHandshake,
  QrCode,
  type LucideIcon,
} from 'lucide-react';

import { TRUST_FEATURES } from '@/data/testimonials';

const ICONS: Record<string, LucideIcon> = {
  CalendarCheck,
  QrCode,
  GraduationCap,
  HeartHandshake,
  Flag,
  Gift,
};

export function TrustBar() {
  return (
    <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container-lotus py-10 md:py-12">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-7 md:grid-cols-3 lg:grid-cols-6">
          {TRUST_FEATURES.map((feature) => {
            const Icon = ICONS[feature.icon] ?? Flag;
            return (
              <li key={feature.title} className="flex flex-col items-center gap-2.5 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-[var(--color-golf-50)] text-[var(--color-accent)]">
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="text-sm font-medium">{feature.title}</span>
                <span className="text-xs leading-relaxed text-[var(--color-muted)]">
                  {feature.description}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
