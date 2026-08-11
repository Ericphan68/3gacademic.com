import { PortalHeader } from '@/components/dashboard/portal-shell';
import { SettingsEditor } from '@/features/admin/settings-editor';
import { getContactSettings } from '@/server/services/settingsService';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const contact = await getContactSettings();

  return (
    <div>
      <PortalHeader
        title="Cấu hình website"
        description="Thông tin liên hệ và mạng xã hội. Bấm Lưu là chân trang toàn website cập nhật ngay."
      />
      <SettingsEditor initial={contact} />
    </div>
  );
}
