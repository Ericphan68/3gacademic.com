import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import Link from 'next/link';

import { Logo } from './logo';
import { NewsletterForm } from './newsletter-form';
import { SocialLinks } from './social-links';

import { FOOTER_NAV } from '@/constants/navigation';
import { SITE } from '@/constants/site';
import { getContactSettings } from '@/server/services/settingsService';

export async function Footer() {
  const year = 2026;
  const contact = await getContactSettings();

  return (
    <footer className="border-t border-white/10 bg-[var(--color-navy-900)] text-[var(--color-navy-100)]">
      <div className="container-lotus py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_2fr]">
          {/* Cột thương hiệu */}
          <div>
            <Logo inverse />
            <p className="mt-5 max-w-sm text-sm leading-relaxed">
              {SITE.tagline}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-navy-200)]">
              {SITE.description}
            </p>

            <ul className="mt-7 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[var(--color-champagne-300)]" aria-hidden />
                <span>{contact.address}</span>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-[var(--color-champagne-300)]" aria-hidden />
                <span>Mở cửa hằng ngày {contact.openHours}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-[var(--color-champagne-300)]" aria-hidden />
                <a
                  href={`tel:${contact.hotline.replace(/\s/g, '')}`}
                  className="transition-colors hover:text-white"
                >
                  {contact.hotline}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-[var(--color-champagne-300)]" aria-hidden />
                <a href={`mailto:${contact.email}`} className="transition-colors hover:text-white">
                  {contact.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 size-4 shrink-0 text-[var(--color-champagne-300)]" aria-hidden />
                <a
                  href={contact.zalo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-white"
                >
                  Nhắn tin qua Zalo
                </a>
              </li>
            </ul>

            <div className="mt-7">
              <p className="mb-3 text-[11px] font-semibold tracking-widest text-[var(--color-champagne-300)] uppercase">
                Kết nối với chúng tôi
              </p>
              <SocialLinks facebook={contact.facebook} zalo={contact.zalo} whatsapp={contact.whatsapp} />
            </div>
          </div>

          {/* Các cột điều hướng */}
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {FOOTER_NAV.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="mb-4 text-[11px] font-semibold tracking-widest text-[var(--color-champagne-300)] uppercase">
                  {group.title}
                </p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm transition-colors hover:text-white hover:underline hover:underline-offset-4"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-10">
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-lotus flex flex-col gap-3 py-6 text-xs text-[var(--color-navy-200)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.legalName}. Bảo lưu mọi quyền.
          </p>
          <p className="text-[var(--color-navy-300)]">
            Phiên bản demo giao diện — dữ liệu hiển thị là dữ liệu mẫu.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/chinh-sach-hop-tac" className="transition-colors hover:text-white">
              Chính sách hợp tác
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-white">
              Bảo mật
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Điều khoản
            </Link>
            <Link href="/faq" className="transition-colors hover:text-white">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
