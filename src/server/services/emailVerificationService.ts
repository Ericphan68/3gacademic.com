import 'server-only';

import { addHours } from 'date-fns';

import { sendEmail } from '@/server/email/brevo';
import { prisma } from '@/server/db';
import { newVerifyToken } from '@/server/services/customerAuthService';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://lotusgolfcenter.com';

function verifyEmailHtml(name: string, link: string): string {
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#1a2e22">
    <h2 style="color:#1f6d43">Xác nhận email của bạn</h2>
    <p>Chào ${name},</p>
    <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Lotus Golf Center</strong>. Vui lòng bấm nút bên dưới để xác nhận email và kích hoạt tài khoản:</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${link}" style="background:#1f6d43;color:#fff;text-decoration:none;padding:12px 28px;border-radius:9999px;display:inline-block;font-weight:bold">Xác nhận email</a>
    </p>
    <p style="font-size:13px;color:#5b6b60">Nếu nút không bấm được, hãy sao chép đường link sau vào trình duyệt:<br><a href="${link}">${link}</a></p>
    <p style="font-size:13px;color:#5b6b60">Link có hiệu lực trong 24 giờ. Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
    <p style="margin-top:24px">Lotus Golf Center</p>
  </div>`;
}

/** Gửi email xác nhận cho khách (đọc token trong DB, tạo mới nếu thiếu). */
export async function sendVerificationEmail(customerId: string): Promise<boolean> {
  const c = await prisma.customer.findUnique({
    where: { id: customerId },
    select: { email: true, fullName: true, emailVerified: true, emailVerifyToken: true },
  });
  if (!c || !c.email || c.emailVerified) return false;

  let token = c.emailVerifyToken;
  if (!token) {
    token = newVerifyToken();
    await prisma.customer.update({
      where: { id: customerId },
      data: { emailVerifyToken: token, emailVerifyExpires: addHours(new Date(), 24) },
    });
  }

  const link = `${SITE_URL}/api/auth/verify-email?token=${token}`;
  return sendEmail({
    to: c.email,
    toName: c.fullName,
    subject: 'Xác nhận email — Lotus Golf Center',
    html: verifyEmailHtml(c.fullName, link),
  });
}

/** Xác nhận email từ token. Trả về trạng thái để trang chuyển hướng phù hợp. */
export async function verifyEmailToken(token: string): Promise<'ok' | 'invalid' | 'expired'> {
  const c = await prisma.customer.findFirst({
    where: { emailVerifyToken: token },
    select: { id: true, emailVerifyExpires: true },
  });
  if (!c) return 'invalid';
  if (c.emailVerifyExpires && c.emailVerifyExpires.getTime() < Date.now()) return 'expired';

  await prisma.customer.update({
    where: { id: c.id },
    data: { emailVerified: true, emailVerifyToken: null, emailVerifyExpires: null },
  });
  return 'ok';
}

/** Gửi lại email xác nhận theo email (không tiết lộ email có tồn tại hay không). */
export async function resendVerification(email: string): Promise<void> {
  const c = await prisma.customer.findFirst({
    where: { email: email.trim().toLowerCase(), emailVerified: false },
    select: { id: true },
  });
  if (!c) return;
  await prisma.customer.update({
    where: { id: c.id },
    data: { emailVerifyToken: newVerifyToken(), emailVerifyExpires: addHours(new Date(), 24) },
  });
  await sendVerificationEmail(c.id);
}
