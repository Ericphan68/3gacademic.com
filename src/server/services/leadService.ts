import 'server-only';

import { Prisma } from '@prisma/client';

import { prisma } from '@/server/db';

/**
 * Yêu cầu từ các form public (liên hệ, doanh nghiệp, tour đoàn, đại lý).
 * Ghi thêm vào DB song song với localStorage; đọc cho Admin.
 */

export interface CreateLeadInput {
  type: string;
  summary: string;
  payload?: Record<string, unknown>;
}

const str = (v: unknown): string | null =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, 200) : null;

export async function createLead(input: CreateLeadInput): Promise<{ id: string }> {
  const pl = input.payload ?? {};
  const lead = await prisma.lead.create({
    data: {
      type: input.type.slice(0, 40),
      summary: input.summary.slice(0, 300),
      name: str(pl.contactName ?? pl.fullName ?? pl.name),
      phone: str(pl.phone),
      email: str(pl.email),
      payload: pl as Prisma.InputJsonObject,
    },
    select: { id: true },
  });
  return lead;
}

export interface AdminLeadRow {
  id: string;
  type: string;
  summary: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  handled: boolean;
  createdAt: string;
}

export async function listLeads(limit = 300): Promise<AdminLeadRow[]> {
  try {
    const rows = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        type: true,
        summary: true,
        name: true,
        phone: true,
        email: true,
        handled: true,
        createdAt: true,
      },
    });
    return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
  } catch {
    return [];
  }
}

export async function setLeadHandled(id: string, handled: boolean) {
  return prisma.lead.update({ where: { id }, data: { handled } });
}
