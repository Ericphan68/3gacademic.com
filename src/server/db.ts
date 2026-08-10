import { PrismaClient } from '@prisma/client';

/**
 * Prisma singleton — tránh tạo nhiều connection khi Next.js hot-reload (dev)
 * hoặc khi nhiều route handler cùng import.
 *
 * Chỉ import file này từ code chạy phía server (route handlers, server actions,
 * server components, scripts). KHÔNG import vào client component.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
