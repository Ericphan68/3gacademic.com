'use client';

import { Check, Gift, Share2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

/** Nút chia sẻ + tặng voucher, dùng ở trang chi tiết gói trải nghiệm. */
export function ShareActions({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}${path}` : path;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Người dùng đóng hộp thoại chia sẻ — chuyển sang sao chép link.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Đã sao chép liên kết', { description: url });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Không sao chép được liên kết', {
        description: 'Bạn có thể sao chép thủ công từ thanh địa chỉ.',
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={share}>
        {copied ? <Check aria-hidden /> : <Share2 aria-hidden />}
        {copied ? 'Đã sao chép' : 'Chia sẻ'}
      </Button>
      <Button asChild variant="outline" size="sm">
        <Link href={{ pathname: '/vouchers', query: { category: 'gift' } }}>
          <Gift aria-hidden />
          Tặng voucher
        </Link>
      </Button>
    </div>
  );
}
