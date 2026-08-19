'use client';

import { ArrowRight, BookOpenCheck, Crown, PlayCircle, ReceiptText, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/form-fields';
import { MEDIA } from '@/constants/media';
import { cn } from '@/lib/utils';

/**
 * Cổng chào khi mở website (hiển thị 1 lần / trình duyệt, có thể Bỏ qua):
 * video giới thiệu → nút XEM TIẾP → form thu thập thông tin (tùy chọn) →
 * lời cảm ơn → 1 cửa sổ chào mừng (Chính sách · Bảng giá · Hội viên).
 * Thông tin form được lưu vào Database (Admin → Đăng ký & yêu cầu).
 */

const SEEN_KEY = 'lotus_intro_seen_v1';

// Video giới thiệu (YouTube). Đổi ID trong link nếu muốn video khác.
// Để trống ('') = dùng ảnh golf làm nền thay cho video.
const INTRO_VIDEO: string =
  'https://www.youtube-nocookie.com/embed/tew1tkYci7Y?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1';

const LEVELS = ['Huấn luyện viên', 'Pro Tour', 'Amateur', 'Mới bắt đầu'];

type Phase = 'idle' | 'video' | 'form' | 'thanks' | 'welcome' | 'done';

export function IntroExperience() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [form, setForm] = useState({ fullName: '', phone: '', occupation: '', level: '' });
  const [saving, setSaving] = useState(false);

  // Chỉ hiện lần đầu (dựa vào localStorage) — tránh chặn khách quay lại.
  // Hoãn 1 nhịp để không setState đồng bộ trong effect.
  useEffect(() => {
    const id = setTimeout(() => {
      let seen = true;
      try {
        seen = Boolean(localStorage.getItem(SEEN_KEY));
      } catch {
        seen = true;
      }
      setPhase(seen ? 'done' : 'video');
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // Khoá cuộn nền khi cổng chào đang mở.
  useEffect(() => {
    const open = phase !== 'idle' && phase !== 'done';
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  const markSeen = () => {
    try {
      localStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* ignore */
    }
  };
  const skip = () => {
    markSeen();
    setPhase('done');
  };

  const submit = async () => {
    setSaving(true);
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'intro',
          summary: `${form.fullName.trim() || 'Khách mới'}${form.level ? ` · ${form.level}` : ''}${
            form.occupation.trim() ? ` · ${form.occupation.trim()}` : ''
          }`,
          payload: {
            fullName: form.fullName.trim(),
            phone: form.phone.trim(),
            occupation: form.occupation.trim(),
            level: form.level,
          },
        }),
      });
    } catch {
      /* best-effort — không chặn khách */
    }
    setSaving(false);
    markSeen();
    setPhase('thanks');
    setTimeout(() => setPhase('welcome'), 2400);
  };

  if (phase === 'idle' || phase === 'done') return null;

  // VIDEO — trải nghiệm xem video toàn màn hình (cinematic).
  if (phase === 'video') {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col bg-black"
        role="dialog"
        aria-modal="true"
        aria-label="Video giới thiệu Lotus Golf Center"
      >
        <div className="flex items-center justify-between px-5 py-4 md:px-8">
          <span className="text-xs font-medium tracking-[0.2em] text-white/85 uppercase">Lotus Golf Center</span>
          <button
            type="button"
            onClick={skip}
            aria-label="Bỏ qua"
            className="text-white/70 transition-colors hover:text-white"
          >
            <X className="size-6" aria-hidden />
          </button>
        </div>

        <div className="relative flex-1">
          <div className="absolute inset-0 flex items-center justify-center px-3 md:px-8">
            <div className="relative aspect-video max-h-full w-full max-w-6xl overflow-hidden rounded-[var(--radius-lg)] bg-black shadow-2xl">
              {INTRO_VIDEO ? (
                <iframe
                  src={INTRO_VIDEO}
                  title="Giới thiệu Lotus Golf Center"
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <span
                  className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(rgba(8,28,42,0.25), rgba(8,28,42,0.35)), url(${MEDIA.hero.home})`,
                  }}
                >
                  <PlayCircle className="size-16 text-white/90" aria-hidden />
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 px-5 py-4 md:px-8 md:py-6">
          <button
            type="button"
            onClick={skip}
            className="text-sm text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            Bỏ qua
          </button>
          <Button variant="accent" size="lg" onClick={() => setPhase('form')}>
            Xem tiếp
            <ArrowRight aria-hidden />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[var(--color-navy-900,#081c2a)]/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Chào mừng đến Lotus Golf Center"
    >

      {/* FORM */}
      {phase === 'form' ? (
        <Card>
          <button
            type="button"
            onClick={skip}
            className="absolute top-4 right-4 z-10 text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
            aria-label="Bỏ qua"
          >
            <X className="size-5" aria-hidden />
          </button>
          <p className="eyebrow text-[var(--color-accent)]">Chào mừng</p>
          <h2 className="mt-1 text-2xl">Cho chúng tôi biết đôi chút về bạn</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Lotus sẽ tư vấn lộ trình phù hợp nhất. (Không bắt buộc — bạn có thể Bỏ qua.)
          </p>

          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Họ và tên" htmlFor="intro-name">
                <Input
                  id="intro-name"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </Field>
              <Field label="Số điện thoại" htmlFor="intro-phone">
                <Input
                  id="intro-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="09xx xxx xxx"
                />
              </Field>
            </div>
            <Field label="Nghề nghiệp" htmlFor="intro-job">
              <Input
                id="intro-job"
                value={form.occupation}
                onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                placeholder="Ví dụ: Doanh nhân, Bác sĩ…"
              />
            </Field>
            <Field label="Trình độ / vai trò" htmlFor="intro-level">
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lv) => (
                  <button
                    key={lv}
                    type="button"
                    onClick={() => setForm({ ...form, level: lv })}
                    aria-pressed={form.level === lv}
                    className={cn(
                      'cursor-pointer rounded-full border px-3.5 py-2 text-sm transition-colors',
                      form.level === lv
                        ? 'border-[var(--color-accent)] bg-[var(--color-golf-50)] text-[var(--color-accent)]'
                        : 'border-[var(--color-border-strong)] hover:border-[var(--color-accent)]',
                    )}
                  >
                    {lv}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={skip}
              className="text-sm text-[var(--color-muted)] underline-offset-4 hover:underline"
            >
              Bỏ qua
            </button>
            <Button variant="accent" size="lg" onClick={submit} loading={saving}>
              Gửi &amp; vào trang chính
              <ArrowRight aria-hidden />
            </Button>
          </div>
        </Card>
      ) : null}

      {/* CẢM ƠN */}
      {phase === 'thanks' ? (
        <Card className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
            <Sparkles className="size-7" aria-hidden />
          </span>
          <h2 className="mt-4 text-2xl">Cảm ơn Quý khách!</h2>
          <p className="mt-2 text-[var(--color-muted)]">
            Cảm ơn Quý khách đã đến với <span className="font-medium text-[var(--color-foreground)]">Lotus Golf Center</span>.
          </p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Đang đưa bạn vào trang chính…</p>
        </Card>
      ) : null}

      {/* CHÀO MỪNG — 1 cửa sổ gộp */}
      {phase === 'welcome' ? (
        <Card>
          <button
            type="button"
            onClick={skip}
            className="absolute top-4 right-4 z-10 text-[var(--color-muted)] transition-colors hover:text-[var(--color-foreground)]"
            aria-label="Đóng"
          >
            <X className="size-5" aria-hidden />
          </button>
          <p className="eyebrow text-[var(--color-accent)]">Khám phá ngay</p>
          <h2 className="mt-1 text-2xl">Bắt đầu với Lotus</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Chọn nội dung bạn quan tâm:</p>

          <div className="mt-5 grid gap-3">
            <WelcomeLink href="/san-golf/an-phu-lotus" icon={<ReceiptText className="size-5" aria-hidden />} title="Bảng giá dịch vụ" desc="Gói bóng, sân Tee, full ngày… đặt & thanh toán ngay" onClick={skip} />
            <WelcomeLink href="/membership" icon={<Crown className="size-5" aria-hidden />} title="Đăng ký hội viên" desc="Quyền lợi & ưu đãi cho hội viên Lotus" onClick={skip} />
            <WelcomeLink href="/privacy" icon={<BookOpenCheck className="size-5" aria-hidden />} title="Chính sách" desc="Chính sách & điều khoản sử dụng" onClick={skip} />
          </div>

          <Button variant="ghost" block className="mt-5" onClick={skip}>
            Vào trang chính
          </Button>
        </Card>
      ) : null}
    </div>
  );
}

function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative my-8 w-full max-w-lg rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface-raised)] p-7 shadow-[var(--shadow-lift)] md:p-8',
        className,
      )}
    >
      {children}
    </div>
  );
}

function WelcomeLink({
  href,
  icon,
  title,
  desc,
  onClick,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href as never}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-accent)] hover:bg-[var(--color-golf-50)]"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-golf-100)] text-[var(--color-accent)]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-medium">{title}</span>
        <span className="block text-xs text-[var(--color-muted)]">{desc}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-accent)]" aria-hidden />
    </Link>
  );
}
