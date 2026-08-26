import 'server-only';

import { CONTACT, SITE } from '@/constants/site';
import { prisma } from '@/server/db';

/**
 * Cấu hình website (thông tin liên hệ, mạng xã hội...) lưu ở bảng SiteSetting.
 * Public đọc qua getContactSettings() — luôn có fallback về hằng số nên
 * không bao giờ vỡ nếu DB lỗi.
 */

export interface ContactSettings {
  name: string;
  hotline: string;
  email: string;
  address: string;
  openHours: string;
  zalo: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
}

const asString = (value: unknown, fallback: string): string =>
  typeof value === 'string' && value.length > 0 ? value : fallback;

export async function getContactSettings(): Promise<ContactSettings> {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: [
        'site.name', 'site.hotline', 'site.email', 'site.address', 'site.openHours',
        'social.zalo', 'social.whatsapp', 'social.facebook', 'social.instagram', 'social.youtube', 'social.tiktok',
      ] } },
    });
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return {
      name: asString(map.get('site.name'), SITE.name),
      hotline: asString(map.get('site.hotline'), CONTACT.hotline),
      email: asString(map.get('site.email'), CONTACT.email),
      address: asString(map.get('site.address'), CONTACT.addressLine),
      openHours: asString(map.get('site.openHours'), CONTACT.openHours),
      zalo: asString(map.get('social.zalo'), CONTACT.zalo),
      whatsapp: asString(map.get('social.whatsapp'), ''),
      facebook: asString(map.get('social.facebook'), ''),
      instagram: asString(map.get('social.instagram'), ''),
      youtube: asString(map.get('social.youtube'), ''),
      tiktok: asString(map.get('social.tiktok'), ''),
    };
  } catch {
    return {
      name: SITE.name,
      hotline: CONTACT.hotline,
      email: CONTACT.email,
      address: CONTACT.addressLine,
      openHours: CONTACT.openHours,
      zalo: CONTACT.zalo,
      whatsapp: '',
      facebook: '',
      instagram: '',
      youtube: '',
      tiktok: '',
    };
  }
}

/** Đọc toàn bộ cấu hình (cho trang Admin). */
export async function getSettingsMap(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const out: Record<string, string> = {};
  for (const row of rows) out[row.key] = typeof row.value === 'string' ? row.value : String(row.value ?? '');
  return out;
}

/** Cập nhật nhiều cấu hình (upsert theo key). */
export async function updateSettings(entries: { key: string; group: string; value: string }[]) {
  await prisma.$transaction(
    entries.map((e) =>
      prisma.siteSetting.upsert({
        where: { key: e.key },
        update: { value: e.value },
        create: { key: e.key, group: e.group, value: e.value },
      }),
    ),
  );
}
