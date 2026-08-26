import { PortalHeader } from '@/components/dashboard/portal-shell';
import { SettingsEditor } from '@/features/admin/settings-editor';
import { getBankSettings, getContactSettings } from '@/server/services/settingsService';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
  const [contact, bank] = await Promise.all([getContactSettings(), getBankSettings()]);

  return (
    <div>
      <PortalHeader
        title="Cấu hình website"
        description="Thông tin liên hệ, mạng xã hội và tài khoản ngân hàng. Bấm Lưu là toàn website cập nhật ngay."
      />
      <SettingsEditor initial={{ ...contact, ...bank }} />
    </div>
  );
}
