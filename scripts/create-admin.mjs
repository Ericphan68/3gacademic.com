// ============================================================
// Tạo/cập nhật SUPER ADMIN từ biến môi trường.
// Chạy: npm run create-admin
// Yêu cầu env: SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD, (SUPER_ADMIN_NAME)
// KHÔNG hard-code tài khoản thật vào GitHub.
// ============================================================
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.SUPER_ADMIN_PASSWORD || '';
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin';

  if (!email || !password) {
    console.error('❌ Thiếu SUPER_ADMIN_EMAIL hoặc SUPER_ADMIN_PASSWORD trong môi trường.');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('❌ Mật khẩu Super Admin phải tối thiểu 8 ký tự.');
    process.exit(1);
  }

  // Đảm bảo có role SUPER_ADMIN (seed thường đã tạo).
  const role = await prisma.role.upsert({
    where: { key: 'SUPER_ADMIN' },
    update: {},
    create: { key: 'SUPER_ADMIN', name: 'Super Admin', isSystem: true },
  });

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, fullName: name, roleId: role.id, isActive: true, deletedAt: null },
    create: { email, passwordHash, fullName: name, roleId: role.id },
  });

  console.log(`✅ Super Admin sẵn sàng: ${admin.email}`);
  console.log('   → Đăng nhập tại /admin/login bằng email + mật khẩu vừa đặt.');
  console.log('   → Sau khi đăng nhập, hãy đổi SUPER_ADMIN_PASSWORD trong môi trường.');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error('❌ Lỗi tạo admin:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
