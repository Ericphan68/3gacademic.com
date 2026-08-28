import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCustomerSession } from '@/server/auth/current-customer';
import { createFoodOrder, FoodOrderError } from '@/server/services/foodOrderService';

const schema = z.object({
  items: z
    .array(z.object({ name: z.string().trim().min(1).max(160), quantity: z.number().int().min(1).max(99), price: z.number().int().min(0) }))
    .min(1)
    .max(50),
  total: z.number().int().min(0),
  deliveryTarget: z.string().trim().max(40).nullish(),
  bayNumber: z.string().trim().max(20).nullish(),
  scheduledTime: z.string().trim().max(40).nullish(),
  note: z.string().trim().max(500).nullish(),
  payByWallet: z.boolean(),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Dữ liệu chưa hợp lệ.' }, { status: 400 });

  const session = await getCustomerSession();
  try {
    const { code, balance } = await createFoodOrder(session?.sub ?? null, parsed.data);
    return NextResponse.json({ ok: true, code, balance });
  } catch (e) {
    if (e instanceof FoodOrderError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: 'Lỗi đặt món.' }, { status: 500 });
  }
}
