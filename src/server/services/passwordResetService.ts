import 'server-only';

import { addHours } from 'date-fns';

import { hashPassword } from '@/server/auth/password';
import { sendEmail } from '@/server/email/brevo';
import { prisma } from '@/server/db';
import { newVerifyToken } from '@/server/services/customerAuthService';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lotusgolfcenter.com';

function resetHtml(name: string, link: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1a2e22">
    <h2 style="color:#1f6d43">Đặt lại mật khẩu</h2>
    <p>Chào ${name},</p>
    <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại <strong>Lotus Golf Center</strong>. Bấm nút bên dưới để tạo mật khẩu mới:</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${link}" style="background:#1f6d43;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9999px;display:inline-block;font-weight:bold">Đặt lại mật khẩu</a>
    </p>
    <p style="font-size:13px;color:#5b6b60">Nếu nút không bấm được, hãy sao chép đường link sau vào trình duyệt:<br><a href="${link}">${link}</a></p>
    <p style="font-size:13px;color:#5b6b60">Link có hiệu lực trong 1 giờ. Nếu bạn không yêu cầu, hãy bỏ qua email này — mật khẩu của bạn vẫn an toàn.</p>
    <p style="margin-top:24px">Lotus Golf Center</p>
  </div>`;
}

/**
 * Gửi email đặt lại mật khẩu theo email khách nhập.
 * Luôn xử lý âm thầm: không tiết lộ email có tồn tại hay không.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const c = await prisma.customer.findFirst({
    where: { email: email.trim().toLowerCase(), deletedAt: null },
    select: { id: true, email: true, fullName: true },
  });
  if (!c || !c.email) return;

  const token = newVerifyToken();
  await prisma.customer.update({
    where: { id: c.id },
    data: { passwordResetToken: token, passwordResetExpires: addHours(new Date(), 1) },
  });

  const link = `${SITE_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: c.email,
    toName: c.fullName,
    subject: 'Đặt lại mật khẩu — Lotus Golf Center',
    html: resetHtml(c.fullName, link),
  });
}

/** Kiểm tra token còn hợp lệ không (dùng khi mở trang đặt lại). */
export async function checkResetToken(token: string): Promise<'ok' | 'invalid' | 'expired'> {
  const c = await prisma.customer.findFirst({
    where: { passwordResetToken: token },
    select: { passwordResetExpires: true },
  });
  if (!c) return 'invalid';
  if (c.passwordResetExpires && c.passwordResetExpires.getTime() < Date.now()) return 'expired';
  return 'ok';
}

/** Đặt mật khẩu mới từ token. Token dùng một lần (xoá sau khi đổi). */
export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<'ok' | 'invalid' | 'expired'> {
  const c = await prisma.customer.findFirst({
    where: { passwordResetToken: token },
    select: { id: true, passwordResetExpires: true },
  });
  if (!c) return 'invalid';
  if (c.passwordResetExpires && c.passwordResetExpires.getTime() < Date.now()) return 'expired';

  const passwordHash = await hashPassword(newPassword);
  await prisma.customer.update({
    where: { id: c.id },
    data: {
      passwordHash,
      passwordUpdatedAt: new Date(),
      passwordResetToken: null,
      passwordResetExpires: null,
      // Đặt lại mật khẩu qua email cũng đồng nghĩa email đã hoạt động -> coi như đã xác nhận.
      emailVerified: true,
    },
  });
  return 'ok';
}
