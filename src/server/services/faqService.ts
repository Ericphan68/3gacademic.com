import 'server-only';

import { FAQS } from '@/data/faqs';
import { prisma } from '@/server/db';
import type { FaqItem } from '@/types';

/**
 * Nguồn dữ liệu FAQ cho public. DB (bảng Faq, khớp qua cột `key` = id mock)
 * ghi đè câu hỏi/câu trả lời lên mock; FAQ tắt (isActive=false) bị ẩn.
 * DB lỗi/trống → mock. Public không bao giờ vỡ.
 */

export interface FaqManagedInput {
  key: string;
  question: string;
  answer: string;
  active: boolean;
}

export interface FaqAdminRow {
  key: string;
  groupLabel: string;
  question: string;
  answer: string;
  active: boolean;
}

interface DbFaqRow {
  key: string | null;
  question: string;
  answer: string;
  isActive: boolean;
}

async function loadRows(): Promise<Map<string, DbFaqRow>> {
  const rows = await prisma.faq.findMany({
    where: { key: { not: null } },
    select: { key: true, question: true, answer: true, isActive: true },
  });
  return new Map(rows.map((r) => [r.key as string, r]));
}

/** Danh sách FAQ hiển thị cho public (ẩn FAQ đã tắt). */
export async function getManagedFaqs(): Promise<FaqItem[]> {
  try {
    const byKey = await loadRows();
    if (byKey.size === 0) return FAQS;
    return FAQS.map((f) => {
      const row = byKey.get(f.id);
      return row ? { ...f, question: row.question, answer: row.answer } : f;
    }).filter((f) => {
      const row = byKey.get(f.id);
      return row ? row.isActive : true;
    });
  } catch {
    return FAQS;
  }
}

/** Danh sách đầy đủ cho Admin. */
export async function listFaqsForAdmin(): Promise<FaqAdminRow[]> {
  const { FAQ_GROUP_LABELS } = await import('@/data/faqs');
  let byKey = new Map<string, DbFaqRow>();
  try {
    byKey = await loadRows();
  } catch {
    byKey = new Map();
  }
  return FAQS.map((f) => {
    const row = byKey.get(f.id);
    return {
      key: f.id,
      groupLabel: FAQ_GROUP_LABELS[f.group],
      question: row ? row.question : f.question,
      answer: row ? row.answer : f.answer,
      active: row ? row.isActive : true,
    } satisfies FaqAdminRow;
  });
}

/** Cập nhật (hoặc tạo) 1 FAQ theo key (= id mock). */
export async function updateFaq(input: FaqManagedInput) {
  const base = FAQS.find((f) => f.id === input.key);
  return prisma.faq.upsert({
    where: { key: input.key },
    update: {
      question: input.question,
      answer: input.answer,
      isActive: input.active,
    },
    create: {
      key: input.key,
      category: base?.group ?? null,
      question: input.question,
      answer: input.answer,
      isActive: input.active,
    },
  });
}
