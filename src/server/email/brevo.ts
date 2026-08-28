import 'server-only';

/**
 * Gửi email giao dịch qua Brevo (Sendinblue) API v3.
 * Cần biến môi trường:
 *   BREVO_API_KEY      — API key (xkeysib-...)
 *   BREVO_SENDER_EMAIL — email người gửi ĐÃ xác thực trong Brevo
 *   BREVO_SENDER_NAME  — tên hiển thị (tuỳ chọn, mặc định 'Lotus Golf Center')
 */

export function isEmailConfigured(): boolean {
  return Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL);
}

export interface SendEmailInput {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}

/** Trả về true nếu gửi thành công; false nếu chưa cấu hình hoặc lỗi (không ném). */
export async function sendEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || 'Lotus Golf Center';
  if (!apiKey || !senderEmail) {
    console.warn('[brevo] Chưa cấu hình BREVO_API_KEY / BREVO_SENDER_EMAIL — bỏ qua gửi email.');
    return false;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: input.to, name: input.toName || input.to }],
        subject: input.subject,
        htmlContent: input.html,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[brevo] Gửi email thất bại:', res.status, body.slice(0, 300));
      return false;
    }
    return true;
  } catch (e) {
    console.error('[brevo] Lỗi mạng khi gửi email:', e);
    return false;
  }
}
