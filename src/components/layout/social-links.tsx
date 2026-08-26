import type { ReactNode } from 'react';

/** Icon thương hiệu (SVG nội tuyến — không phụ thuộc thư viện ngoài). */
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.48 0-1.95.93-1.95 1.87v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function ZaloIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden>
      <path d="M12 2C6.2 2 1.5 5.94 1.5 10.8c0 2.79 1.55 5.28 3.98 6.9-.14.9-.6 2.2-1.35 3.28-.2.28.02.66.36.58 1.86-.44 3.3-1.13 4.2-1.64.86.18 1.77.28 2.71.28 5.8 0 10.5-3.94 10.5-8.8S17.8 2 12 2Zm-4.6 6.62h2.86c.2 0 .36.16.36.36v.28c0 .13-.05.25-.14.34l-2.1 2.5h1.9c.2 0 .36.16.36.36v.3c0 .2-.16.36-.36.36H7.3a.36.36 0 0 1-.36-.36v-.3c0-.13.05-.25.14-.34l2.1-2.5h-1.8a.36.36 0 0 1-.36-.36v-.3c0-.2.16-.34.38-.34Zm9.02 1.03c.2 0 .36.16.36.36v3.16c0 .2-.16.36-.36.36h-.3a.36.36 0 0 1-.35-.28 1.7 1.7 0 0 1-.9.3c-.9 0-1.64-.76-1.64-1.7 0-.94.73-1.7 1.64-1.7.33 0 .64.1.9.3.04-.16.18-.28.35-.28h.3Zm-4.3.02c.2 0 .35.16.35.36v3.14c0 .2-.15.36-.35.36h-.3a.36.36 0 0 1-.36-.36v-3.14c0-.2.16-.36.36-.36h.3Zm3.65.98a.9.9 0 0 0-.9.9c0 .5.4.9.9.9s.9-.4.9-.9-.4-.9-.9-.9Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden>
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.64-2.05-.17-.3-.02-.46.13-.6.14-.14.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35ZM12 22a9.9 9.9 0 0 1-5.03-1.38l-.36-.21-3.73.98 1-3.64-.24-.37A9.86 9.86 0 0 1 2.1 12 9.9 9.9 0 0 1 12 2.1 9.9 9.9 0 0 1 21.9 12 9.9 9.9 0 0 1 12 22Zm8.42-18.42A11.82 11.82 0 0 0 12 .1 11.9 11.9 0 0 0 .1 12c0 2.1.55 4.15 1.6 5.96L0 24l6.18-1.62A11.9 11.9 0 0 0 12 23.9 11.9 11.9 0 0 0 23.9 12c0-3.18-1.24-6.17-3.48-8.42Z" />
    </svg>
  );
}

interface SocialItem {
  href: string;
  label: string;
  color: string;
  icon: ReactNode;
}

/** Hàng nút mạng xã hội — chỉ hiện nút có đường dẫn được cấu hình. */
export function SocialLinks({
  facebook,
  zalo,
  whatsapp,
  className,
}: {
  facebook?: string;
  zalo?: string;
  whatsapp?: string;
  className?: string;
}) {
  const items: (SocialItem | null)[] = [
    facebook ? { href: facebook, label: 'Facebook', color: '#1877F2', icon: <FacebookIcon /> } : null,
    zalo ? { href: zalo, label: 'Zalo', color: '#0068FF', icon: <ZaloIcon /> } : null,
    whatsapp ? { href: whatsapp, label: 'WhatsApp', color: '#25D366', icon: <WhatsAppIcon /> } : null,
  ];
  const shown = items.filter((x): x is SocialItem => x !== null);

  if (shown.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2.5">
        {shown.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-y-0.5 hover:brightness-110"
            style={{ backgroundColor: item.color }}
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
