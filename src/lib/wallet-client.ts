/**
 * Gọi API trừ ví THẬT (server là nguồn số dư duy nhất). Trả về số dư mới.
 * Ném lỗi (kèm thông báo) nếu chưa đăng nhập / số dư không đủ / lỗi mạng.
 */
export async function spendWalletServer(amount: number, label: string, reference?: string): Promise<number> {
  const res = await fetch('/api/wallet/spend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: Math.round(amount), label, reference }),
  });
  const body = (await res.json().catch(() => null)) as { balance?: number; error?: string } | null;
  if (!res.ok || typeof body?.balance !== 'number') {
    throw new Error(body?.error ?? 'Thanh toán bằng ví thất bại.');
  }
  return body.balance;
}
