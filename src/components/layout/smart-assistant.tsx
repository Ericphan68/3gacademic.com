'use client';

import { Bot, Info, MessageSquare, Send, X } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CONTACT } from '@/constants/site';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/useUiStore';

/**
 * Lotus Smart Assistant.
 *
 * Đây là trợ lý tra cứu theo kịch bản cố định, KHÔNG phải AI. Toàn bộ câu trả lời
 * lấy từ bảng `TOPICS` bên dưới. Giao diện được ghi rõ điều này để không gây hiểu nhầm.
 * Khi tích hợp mô hình thật: thay hàm `answer()` bằng lời gọi API.
 */

interface Topic {
  id: string;
  question: string;
  answer: string;
  links?: { label: string; href: Route }[];
}

const TOPICS: Topic[] = [
  {
    id: 'beginner',
    question: 'Tôi chưa từng chơi golf, nên bắt đầu từ đâu?',
    answer:
      'Bạn nên bắt đầu bằng gói Lotus Discovery — 60 phút, có nhân viên hướng dẫn đi cùng từ đầu đến cuối, đã bao gồm gậy và bóng. Giá 390.000đ. Nếu muốn học bài bản ngay, chọn First Swing Experience 90 phút với huấn luyện viên.',
    links: [
      { label: 'Xem gói cho người mới', href: '/experience' },
      { label: 'Đặt lịch ngay', href: '/booking' },
    ],
  },
  {
    id: 'slots',
    question: 'Khung giờ nào còn trống và rẻ nhất?',
    answer:
      'Trung tâm mở cửa 06:00 – 22:00. Khung 09:00 – 15:00 các ngày trong tuần là giờ thấp điểm, giá tốt nhất và thường còn nhiều chỗ. Khung 17:00 – 21:00 là cao điểm, nên đặt trước. Tình trạng chỗ hiển thị trực tiếp ở bước chọn giờ.',
    links: [{ label: 'Xem lịch còn trống', href: '/booking' }],
  },
  {
    id: 'coach',
    question: 'Tìm huấn luyện viên phù hợp với tôi',
    answer:
      'Lotus có 12 huấn luyện viên, lọc được theo chuyên môn (người mới, trẻ em, putting, swing, thi đấu), ngôn ngữ (Việt, Anh, Hàn, Nhật), mức giá và đánh giá. Với người mới, hai HLV được chọn nhiều nhất là Trần Thu Hà và Đặng Mỹ Linh.',
    links: [{ label: 'Xem danh sách huấn luyện viên', href: '/coaches' }],
  },
  {
    id: 'price',
    question: 'Bảng giá dịch vụ như thế nào?',
    answer:
      'Tập sân từ 320.000đ/giờ, Putting từ 260.000đ/giờ, học với HLV từ 450.000đ/buổi cộng phí huấn luyện viên, Private Bay phụ thu 350.000đ và khu VIP phụ thu 800.000đ. Giá thay đổi theo khung giờ: thấp điểm −20%, cao điểm +25%.',
    links: [
      { label: 'Xem các gói trải nghiệm', href: '/experience' },
      { label: 'Xem ưu đãi hội viên', href: '/membership' },
    ],
  },
  {
    id: 'membership',
    question: 'Hội viên có những quyền lợi gì?',
    answer:
      'Có 4 hạng: Starter (bonus 5%), Member (bonus 10%, ưu đãi sân 10%), Premium (bonus 15%, ưu đãi 18%, có concierge) và Founder (bonus 25%, ưu đãi 25%, giữ chỗ khung giờ cố định — giới hạn 120 suất).',
    links: [{ label: 'So sánh các hạng hội viên', href: '/membership' }],
  },
  {
    id: 'events',
    question: 'Sắp tới có sự kiện gì?',
    answer:
      'Các sự kiện gần nhất gồm Demo Day công nghệ Golf 3D (miễn phí), Workshop luật golf căn bản, Coach Invitational Cup và Golf Networking Quý 3. Lịch chi tiết và số chỗ còn lại có trong trang Sự kiện.',
    links: [{ label: 'Xem lịch sự kiện', href: '/events' }],
  },
  {
    id: 'direction',
    question: 'Hướng dẫn đường đi và chỗ đỗ xe',
    answer: `Lotus Golf Center ở ${CONTACT.addressLine}. Bãi xe riêng trong khuôn viên, miễn phí cho khách đặt lịch. Ô tô vào cổng số 2, xe máy vào cổng số 1. Hotline hỗ trợ: ${CONTACT.hotline}.`,
    links: [{ label: 'Xem trang liên hệ', href: '/contact' }],
  },
];

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  links?: { label: string; href: Route }[];
}

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  content:
    'Xin chào, tôi là Lotus Smart Assistant. Tôi trả lời dựa trên bộ thông tin có sẵn của trung tâm. Bạn chọn một câu hỏi bên dưới nhé.',
};

export function SmartAssistant() {
  const open = useUiStore((state) => state.assistantOpen);
  const setOpen = useUiStore((state) => state.setAssistantOpen);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const ask = (topic: Topic) => {
    setMessages((prev) => [
      ...prev,
      { id: `u-${prev.length}`, role: 'user', content: topic.question },
      { id: `a-${prev.length}`, role: 'assistant', content: topic.answer, links: topic.links },
    ]);
  };

  const askFreeText = (text: string) => {
    const normalized = text.toLowerCase();
    const matched = TOPICS.find((topic) =>
      [topic.id, topic.question.toLowerCase()].some((key) =>
        normalized.split(/\s+/).some((word) => word.length > 2 && key.includes(word)),
      ),
    );

    setMessages((prev) => [
      ...prev,
      { id: `u-${prev.length}`, role: 'user', content: text },
      matched
        ? { id: `a-${prev.length}`, role: 'assistant', content: matched.answer, links: matched.links }
        : {
            id: `a-${prev.length}`,
            role: 'assistant',
            content: `Câu hỏi này nằm ngoài bộ thông tin tôi có sẵn. Bạn gọi hotline ${CONTACT.hotline} hoặc nhắn Zalo để được nhân viên hỗ trợ trực tiếp nhé. Bạn cũng có thể chọn một trong các chủ đề bên dưới.`,
            links: [{ label: 'Trang liên hệ', href: '/contact' }],
          },
    ]);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Đóng Lotus Smart Assistant' : 'Mở Lotus Smart Assistant'}
        aria-expanded={open}
        className={cn(
          'no-print fixed right-4 bottom-4 z-40 flex size-14 cursor-pointer items-center justify-center rounded-full shadow-[var(--shadow-lift)] transition-all duration-300 md:right-6 md:bottom-6',
          open
            ? 'bg-[var(--color-navy-700)] text-white'
            : 'bg-[var(--color-accent)] text-white hover:scale-105',
        )}
      >
        {open ? <X className="size-6" aria-hidden /> : <MessageSquare className="size-6" aria-hidden />}
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Lotus Smart Assistant"
          className="no-print fixed right-4 bottom-20 z-40 flex max-h-[min(32rem,75dvh)] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] shadow-[var(--shadow-overlay)] md:right-6 md:bottom-24"
        >
          <div className="flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-navy-800)] p-4 text-white">
            <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
              <Bot className="size-5 text-[var(--color-champagne-300)]" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Lotus Smart Assistant</p>
              <p className="truncate text-xs text-white/65">Tra cứu nhanh thông tin trung tâm</p>
            </div>
            <Badge variant="glass" size="sm">
              Demo
            </Badge>
          </div>

          <div className="flex items-start gap-2 border-b border-[var(--color-border)] bg-[var(--color-champagne-50)] px-4 py-2.5 text-[11px] leading-relaxed text-[var(--color-champagne-800)]">
            <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            <p>
              Trợ lý này trả lời bằng bộ thông tin cố định của trung tâm, không phải hệ thống AI đang
              hoạt động.
            </p>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex', message.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-[var(--radius-lg)] px-3.5 py-2.5 text-[13px] leading-relaxed',
                    message.role === 'user'
                      ? 'bg-[var(--color-accent)] text-white'
                      : 'bg-[var(--color-muted-surface)] text-[var(--color-foreground)]',
                  )}
                >
                  <p>{message.content}</p>
                  {message.links ? (
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {message.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="rounded-full bg-[var(--color-surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-accent)] transition-colors hover:bg-[var(--color-golf-50)]"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[var(--color-border)] p-3">
            <div className="scrollbar-none mb-3 flex gap-2 overflow-x-auto pb-1">
              {TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => ask(topic)}
                  className="shrink-0 cursor-pointer rounded-full border border-[var(--color-border-strong)] px-3 py-1.5 text-xs whitespace-nowrap transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {topic.question}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (!input.trim()) return;
                askFreeText(input.trim());
                setInput('');
              }}
              className="flex gap-2"
            >
              <label htmlFor="assistant-input" className="sr-only">
                Nhập câu hỏi
              </label>
              <input
                id="assistant-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Nhập câu hỏi của bạn…"
                className="h-10 min-w-0 flex-1 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-background)] px-3 text-sm outline-none focus:border-[var(--color-accent)]"
              />
              <Button type="submit" size="icon-sm" variant="accent" aria-label="Gửi câu hỏi" className="size-10">
                <Send aria-hidden />
              </Button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
