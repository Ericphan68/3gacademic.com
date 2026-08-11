import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { MembershipEditor } from '@/features/admin/membership-editor';
import { listMembershipPlans } from '@/server/services/membershipService';

export const dynamic = 'force-dynamic';

export default async function AdminMembershipsPage() {
  const plans = await listMembershipPlans();

  const rows = plans.map((p) => ({
    key: p.key,
    name: p.name,
    tagline: p.tagline ?? '',
    price: p.price,
    bonusPercent: p.bonusPercent,
    courtDiscountPercent: p.courtDiscountPercent,
    coachDiscountPercent: p.coachDiscountPercent,
    fnbDiscountPercent: p.fnbDiscountPercent,
    isFeatured: p.isFeatured,
  }));

  return (
    <div>
      <PortalHeader
        title="Gói hội viên"
        description="Sửa giá (số dư Top-up) và % ưu đãi. Bấm Lưu là trang /membership cập nhật ngay."
        action={
          <Button asChild variant="outline">
            <Link href="/membership" target="_blank" rel="noopener noreferrer">
              Xem trang public
            </Link>
          </Button>
        }
      />
      <MembershipEditor plans={rows} />
    </div>
  );
}
