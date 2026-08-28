import Link from 'next/link';

import { PortalHeader } from '@/components/dashboard/portal-shell';
import { Button } from '@/components/ui/button';
import { MembershipEditor } from '@/features/admin/membership-editor';
import { MembershipRequestManager } from '@/features/admin/membership-request-manager';
import { listMembershipRequestsForAdmin } from '@/server/services/membershipJoinService';
import { listMembershipPlans } from '@/server/services/membershipService';

export const dynamic = 'force-dynamic';

export default async function AdminMembershipsPage() {
  const [plans, requests] = await Promise.all([listMembershipPlans(), listMembershipRequestsForAdmin()]);

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
    isActive: p.isActive,
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
      {requests.length > 0 ? (
        <section className="mb-10">
          <h2 className="mb-3 text-lg">Yêu cầu đăng ký hội viên (chuyển khoản)</h2>
          <MembershipRequestManager rows={requests} />
        </section>
      ) : null}

      <h2 className="mb-3 text-lg">Gói hội viên</h2>
      <MembershipEditor plans={rows} />
    </div>
  );
}
