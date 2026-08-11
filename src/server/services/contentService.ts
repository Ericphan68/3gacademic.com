import 'server-only';

import { Prisma } from '@prisma/client';

import { SITE } from '@/constants/site';
import { prisma } from '@/server/db';

/**
 * Nội dung có thể quản trị của trang chủ (thanh thông báo + hero).
 * Đọc từ bảng ContentSection (page HOME). Luôn fallback về hằng số nên
 * public không bao giờ vỡ nếu DB lỗi/thiếu.
 */

export interface AnnouncementContent {
  enabled: boolean;
  text: string;
  ctaText: string;
  ctaLink: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

export interface HomeContent {
  announcement: AnnouncementContent;
  hero: HeroContent;
}

const FALLBACK: HomeContent = {
  announcement: {
    enabled: true,
    text: 'Founder Membership đang mở bán với số lượng giới hạn.',
    ctaText: 'Xem ưu đãi',
    ctaLink: '/membership',
  },
  hero: {
    eyebrow: SITE.taglineEn,
    title: SITE.heroHeadline,
    subtitle: SITE.description,
    ctaText: 'Đặt lịch trải nghiệm',
    ctaLink: '/booking',
  },
};

const str = (v: unknown, fallback: string): string =>
  typeof v === 'string' && v.length > 0 ? v : fallback;

export async function getHomeContent(): Promise<HomeContent> {
  try {
    const page = await prisma.contentPage.findUnique({
      where: { key: 'HOME' },
      include: { sections: { where: { key: { in: ['announcement', 'hero'] } } } },
    });
    const byKey = new Map((page?.sections ?? []).map((s) => [s.key, (s.data ?? {}) as Record<string, unknown>]));
    const a = byKey.get('announcement') ?? {};
    const h = byKey.get('hero') ?? {};

    return {
      announcement: {
        enabled: a.enabled === undefined ? true : Boolean(a.enabled),
        text: str(a.text, FALLBACK.announcement.text),
        ctaText: str(a.ctaText, FALLBACK.announcement.ctaText),
        ctaLink: str(a.ctaLink, FALLBACK.announcement.ctaLink),
      },
      hero: {
        eyebrow: str(h.eyebrow, FALLBACK.hero.eyebrow),
        title: str(h.title, FALLBACK.hero.title),
        subtitle: str(h.subtitle, FALLBACK.hero.subtitle),
        ctaText: str(h.ctaText, FALLBACK.hero.ctaText),
        ctaLink: str(h.ctaLink, FALLBACK.hero.ctaLink),
      },
    };
  } catch {
    return FALLBACK;
  }
}

/** Ghi đè nội dung 1 section của trang chủ (hero | announcement). */
export async function updateHomeSection(
  key: 'hero' | 'announcement',
  data: Record<string, unknown>,
) {
  const page = await prisma.contentPage.upsert({
    where: { key: 'HOME' },
    update: {},
    create: { key: 'HOME', title: 'Trang chủ' },
  });

  const existing = await prisma.contentSection.findUnique({
    where: { pageId_key: { pageId: page.id, key } },
  });
  const base = (existing?.data ?? {}) as Record<string, unknown>;
  const merged = { ...base, ...data } as Prisma.InputJsonObject;

  await prisma.contentSection.upsert({
    where: { pageId_key: { pageId: page.id, key } },
    update: { data: merged },
    create: {
      pageId: page.id,
      key,
      label: key === 'hero' ? 'Hero' : 'Announcement bar',
      data: merged,
    },
  });
}
