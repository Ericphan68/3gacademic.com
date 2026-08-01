# Lotus Golf Center — Website

> **Golf thông minh. Dịch vụ từ trái tim. Kết nối bền vững.**

Website production-ready cho Lotus Golf Center — hệ sinh thái golf đô thị gồm sân tập, học viện,
huấn luyện viên, hội viên, voucher, sự kiện, golf doanh nghiệp, Golf Tour và F&B.

Đây là **bản frontend hoàn chỉnh**: toàn bộ giao diện và luồng sử dụng phía người dùng đã chạy được
bằng mock data + localStorage, kiến trúc sẵn sàng để cắm backend thật ở giai đoạn sau.

---

## 1. Công nghệ

| Nhóm | Công nghệ |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components mặc định) |
| Ngôn ngữ | TypeScript strict mode (`noUnusedLocals`, `noUnusedParameters`) |
| Styling | Tailwind CSS v4 (`@theme` tokens trong `globals.css`) |
| UI | Bộ component riêng dựng trên Radix UI (chuẩn tương đương shadcn/ui) |
| Icon | lucide-react (import theo tên qua `icon-registry`, không import toàn thư viện) |
| Animation | Framer Motion (nhẹ) + CSS keyframes, tôn trọng `prefers-reduced-motion` |
| Form | React Hook Form + Zod |
| State | Zustand (có `persist` vào localStorage) |
| Ngày giờ | date-fns (locale `vi`) |
| Biểu đồ | Recharts |
| Toast | Sonner |
| Chất lượng | ESLint (eslint-config-next) + Prettier + `tsc --noEmit` |

---

## 2. Yêu cầu môi trường

- **Node.js `>= 20.9.0`** (khuyến nghị Node 22 LTS)
- npm 10+

Kiểm tra:

```bash
node -v
```

---

## 3. Cài đặt và chạy ở máy cá nhân

### 3.1. Clone repository

```bash
git clone https://github.com/<tai-khoan-cua-ban>/lotus-golf-center.git
```

```bash
cd lotus-golf-center
```

### 3.2. Cài dependency

```bash
npm install
```

### 3.3. Tạo file biến môi trường

```bash
cp .env.example .env.local
```

Mở `.env.local` và điều chỉnh nếu cần (xem mục 7).

### 3.4. Chạy môi trường phát triển

```bash
npm run dev
```

Mở http://localhost:3000

### 3.5. Build bản production

```bash
npm run build
```

### 3.6. Chạy bản production ở máy

```bash
npm run start
```

`next start` tự đọc biến môi trường `PORT`. Ví dụ chạy ở cổng 8080:

```bash
PORT=8080 npm run start
```

---

## 4. Toàn bộ script

| Script | Mục đích |
| --- | --- |
| `npm run dev` | Chạy môi trường phát triển |
| `npm run build` | Build bản production |
| `npm run start` | Chạy server production (đọc `process.env.PORT`) |
| `npm run lint` | Kiểm tra ESLint |
| `npm run lint:fix` | Tự sửa các lỗi ESLint sửa được |
| `npm run typecheck` | Kiểm tra TypeScript (`tsc --noEmit`) |
| `npm run format` | Định dạng code bằng Prettier |
| `npm run format:check` | Kiểm tra định dạng, không sửa |
| `npm run fetch:photos` | Tải lại bộ ảnh thật từ Unsplash vào `public/images` |
| `npm run generate:images` | Sinh bộ ảnh minh hoạ dự phòng (không cần mạng) |
| `npm run verify` | Chạy lần lượt lint → typecheck → build |

---

## 5. Tài khoản demo

Hiển thị sẵn tại trang `/login`, bấm **“Dùng tài khoản này”** để đăng nhập ngay.

| Vai trò | Email | Mật khẩu | Vào khu vực |
| --- | --- | --- | --- |
| Khách hàng | `customer@lotusgolf.vn` | `Demo123!` | `/dashboard` |
| Huấn luyện viên | `coach@lotusgolf.vn` | `Demo123!` | `/coach-portal` |

Ngoài ra có thể tự đăng ký tài khoản mới tại `/register`, hoặc dùng nút
“Google (demo)” / “Số điện thoại (demo)”.

> **Lưu ý bảo mật:** đây là hệ thống đăng nhập **minh hoạ**. Không có backend xác thực, dữ liệu chỉ
> lưu trong trình duyệt. Mật khẩu không được lưu ở dạng dùng lại được. **Không nhập mật khẩu thật.**

---

## 6. Bản đồ route

### Trang public
`/` · `/experience` · `/experience/[slug]` · `/booking` · `/academy` · `/coaches` ·
`/coaches/[slug]` · `/membership` · `/vouchers` · `/events` · `/events/[slug]` ·
`/corporate` · `/golf-tour` · `/food-and-lounge` · `/about` · `/contact` · `/faq` ·
`/partner` · `/privacy` · `/terms` · trang 404 (`not-found`)

### Xác thực
`/login` · `/register` · `/forgot-password`

### Dashboard khách hàng
`/dashboard` · `/dashboard/bookings` · `/dashboard/membership` · `/dashboard/wallet` ·
`/dashboard/vouchers` · `/dashboard/lessons` · `/dashboard/events` · `/dashboard/profile`

### Coach Portal
`/coach-portal` · `/coach-portal/students` · `/coach-portal/schedule` ·
`/coach-portal/commission` · `/coach-portal/referrals`

### Tệp hệ thống
`/sitemap.xml` · `/robots.txt`

---

## 7. Biến môi trường

Xem đầy đủ trong `.env.example`.

| Biến | Bắt buộc | Mô tả |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Có (production) | URL công khai, dùng cho canonical, sitemap, Open Graph |
| `NEXT_PUBLIC_HOTLINE` | Không | Hotline hiển thị trên website |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Không | Email liên hệ hiển thị |
| `NEXT_PUBLIC_ZALO_URL` | Không | Link kênh Zalo |
| `PORT` | Không | Cổng chạy server production (Hostinger tự inject) |

Không có secret nào trong source. Các biến cho giai đoạn backend (`AUTH_SECRET`, `DATABASE_URL`,
`PAYMENT_PUBLIC_KEY`…) đã được ghi chú sẵn dạng comment trong `.env.example`.

---

## 8. Push lên GitHub

Tên repository đề xuất: **`lotus-golf-center`**

```bash
git init
```

```bash
git add .
```

```bash
git commit -m "feat: khởi tạo website Lotus Golf Center"
```

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/<tai-khoan-cua-ban>/lotus-golf-center.git
```

```bash
git push -u origin main
```

Cấu trúc commit đề xuất cho các thay đổi sau này:

```
feat(booking): thêm bước chọn dịch vụ bổ sung
fix(header): sửa tràn ngang ở màn hình 1280px
style(membership): tinh chỉnh khoảng cách bảng so sánh
docs(readme): bổ sung hướng dẫn deploy
chore(deps): cập nhật dependency
```

Không commit: `node_modules`, `.next`, `.env.local`. Đã được khai báo trong `.gitignore`.

---

## 9. Deploy lên Hostinger (Node.js)

Xem hướng dẫn chi tiết từng bước tại **[`docs/deployment-hostinger.md`](docs/deployment-hostinger.md)**.

Tóm tắt cấu hình Node.js App trên hPanel:

| Mục | Giá trị |
| --- | --- |
| Node version | `22.x` (tối thiểu `20.9`) |
| Application root | thư mục chứa `package.json` (ví dụ `domains/lotusgolf.vn/public_html`) |
| Application startup file | `node_modules/next/dist/bin/next` với tham số `start` |
| Build command | `npm ci && npm run build` |
| Start command | `npm run start` |
| Environment variables | `NEXT_PUBLIC_SITE_URL=https://ten-mien-cua-ban`, `NODE_ENV=production` |
| Port | do Hostinger cấp qua `PORT` — `next start` tự đọc, **không hard-code** |

Dự án **không** dùng bất kỳ tính năng chỉ có trên Vercel và **không** dùng `output: 'export'`,
nên chạy được trên Node.js runtime tiêu chuẩn.

---

## 10. Kiến trúc thư mục

```
src/
├── app/                        # App Router
│   ├── (site)/                 # Nhóm route public — dùng SiteShell (header/footer/assistant)
│   ├── (auth)/                 # Nhóm route đăng nhập/đăng ký — layout hai cột
│   ├── (portal)/               # Dashboard khách hàng + Coach Portal — layout sidebar
│   ├── layout.tsx              # Root layout: font, metadata, JSON-LD, providers
│   ├── not-found.tsx           # Trang 404
│   ├── robots.ts / sitemap.ts  # SEO
│   └── globals.css             # Design system (Tailwind v4 @theme)
├── components/
│   ├── ui/                     # Primitive: button, badge, card, form, overlay, tabs, states…
│   ├── common/                 # Section, PageHero, Breadcrumbs, Reveal, JsonLd, icon-registry…
│   ├── layout/                 # Header, Footer, MobileNav, SearchDialog, SmartAssistant…
│   ├── cards/                  # Card dùng lại: experience, coach, event, voucher
│   ├── home/                   # Các section của trang chủ
│   └── dashboard/              # PortalShell dùng chung cho 2 khu vực nội bộ
├── features/                   # Logic theo nghiệp vụ (client component)
│   ├── auth/ booking/ coaches/ corporate/ contact/ dashboard/
│   ├── coach-portal/ events/ experience/ faq/ food/ membership/ tours/ vouchers/
├── data/                       # Mock data thuần, không phụ thuộc UI
├── services/                   # Service layer — nơi duy nhất chạm dữ liệu
├── store/                      # Zustand store (auth, account, booking, cart, ui)
├── hooks/                      # useHydrated, useLocale, useMediaQuery, useScrolled
├── lib/                        # utils, format, storage, availability, seo, i18n
├── constants/                  # site, navigation, media
└── types/                      # Toàn bộ interface/type dùng chung
```

Giải thích chi tiết: **[`docs/project-structure.md`](docs/project-structure.md)**.

### Nguyên tắc kiến trúc

1. **Component không đọc mock data trực tiếp.** Mọi truy cập đi qua `src/services`.
   Khi có API thật, chỉ sửa phần thân hàm trong service — component giữ nguyên.
2. **Server Component là mặc định.** Chỉ thêm `'use client'` khi cần state/event/browser API.
3. **Không hard-code đường dẫn ảnh.** Toàn bộ qua `constants/media.ts`.
4. **Giá được tính ở một nơi duy nhất** (`services/pricingService.ts`), UI chỉ hiển thị.
5. **Typed routes bật sẵn** (`typedRoutes: true`) — link chết bị bắt ngay khi typecheck.

---

## 11. Tính năng đã hoàn thành

### Trang chủ
Announcement bar (đóng được, ghi nhớ lựa chọn) · Hero full-bleed · Trust bar · Khối “không cần biết
golf để bắt đầu” · 6 gói trải nghiệm nổi bật · 8 khu trải nghiệm · Văn hoá phục vụ · HLV nổi bật ·
Preview 4 hạng hội viên kèm so sánh nhanh · Sự kiện sắp tới · Corporate & Golf Tour · Mockup app
Smart Golf · Testimonial · Newsletter/Zalo · Footer đầy đủ.

### Luồng đặt lịch (`/booking`) — 10 bước, hoạt động đầy đủ
Chọn trải nghiệm → ngày (calendar chặn ngày quá khứ, đánh dấu ngày cao điểm/ưu đãi) → giờ
(06:00–22:00, còn chỗ / sắp đầy / hết chỗ, giá thấp điểm–cao điểm) → khu vực → HLV (có lọc + gợi ý)
→ số khách & 8 dịch vụ bổ sung → voucher + ví + ưu đãi hội viên → thông tin khách → xác nhận +
phương thức thanh toán → **thành công**: mã booking, QR check-in, thêm vào lịch, in vé, xem trong
Dashboard. Có thanh tiến trình và nút quay lại ở mọi bước. Booking lưu vào localStorage và **xuất
hiện ngay trong Dashboard**.

### Các trang chức năng
- **Trải nghiệm**: bộ lọc 7 nhóm đối tượng, 12 gói, trang chi tiết có gallery/FAQ/chia sẻ/tặng voucher, bảng so sánh.
- **Academy**: 12 chương trình, hành trình học viên 8 bước, công nghệ đào tạo, kết quả học viên, FAQ.
- **Huấn luyện viên**: tìm kiếm + lọc theo chuyên môn/ngôn ngữ/giá/đánh giá, yêu thích, trang chi tiết đầy đủ + booking sidebar + mã referral.
- **Hội viên**: 4 hạng, bảng so sánh đầy đủ, **calculator ước tính tiết kiệm**, Founder Membership có countdown + số suất còn lại, modal xác nhận, mua hội viên cập nhật ví + trạng thái.
- **Voucher**: 16 voucher, 8 nhóm, 5 tab (gồm “Voucher của tôi”), mua/lưu/tặng.
- **Sự kiện**: 12 sự kiện, lọc theo loại, trang chi tiết có lịch trình, điều lệ, giải thưởng, nhà tài trợ, **form đăng ký + QR + add-to-calendar**.
- **Doanh nghiệp**: 8 gói, lợi ích, quy trình 6 bước, 4 case study, gallery, form báo giá validate bằng Zod.
- **Golf Tour**: 7 gói kèm lịch trình mẫu, khối “Dành cho công ty du lịch”, form đặt đoàn + form đăng ký đại lý.
- **F&B**: 14 món, 9 danh mục, giỏ hàng drawer, chọn nơi phục vụ/thời gian, thanh toán demo, lưu đơn.
- **Về Lotus / Liên hệ / FAQ / Đối tác / Bảo mật / Điều khoản**: nội dung thương hiệu đầy đủ, FAQ 11 nhóm có tìm kiếm.

### Dashboard khách hàng
Tổng quan (lời chào theo giờ, hạng hội viên, ví, điểm thưởng, booking & buổi học sắp tới, voucher,
sự kiện, gợi ý cá nhân hoá) · Lịch đặt (3 tab, chi tiết + QR, **đổi lịch**, **huỷ**) · Hội viên (thẻ,
quyền lợi, tiến độ lên hạng) · Ví (**nạp tiền demo cập nhật số dư thật**, bonus, lịch sử giao dịch) ·
Voucher (4 trạng thái, chuyển tặng) · Buổi học (HLV, tiến độ, ghi chú, bài tập) · Sự kiện (QR,
add-to-calendar) · Hồ sơ (thông tin, sở thích, tay thuận, trình độ, mục tiêu, ngôn ngữ, thông báo, bảo mật).

### Coach Portal
Tổng quan (học viên, lịch, doanh thu, hoa hồng, học viên mới, referral + QR, bảng xếp hạng, nhận
định) · Học viên (tìm kiếm, lọc trình độ, tiến độ, ghi chú) · Lịch dạy (tuần/tháng, slot trống,
**chặn khung giờ**) · Hoa hồng (chỉ số, **biểu đồ Recharts**, lịch sử, chính sách) · Giới thiệu
(link + QR + danh sách được ghi nhận).

### Xuyên suốt
Chuyển ngôn ngữ VI/EN · Giao diện sáng/tối · Tìm kiếm toàn site (Cmd-K style dialog) ·
**Lotus Smart Assistant** (chat bubble, trả lời theo kịch bản cố định, ghi rõ không phải AI thật) ·
Toast cho mọi thao tác · Loading/empty/error/skeleton state · Breadcrumb · Mobile navigation.

---

## 12. Phần nào đang dùng mock data

| Khu vực | Nguồn hiện tại | File |
| --- | --- | --- |
| 12 gói trải nghiệm | Mock tĩnh | `src/data/experiences.ts` |
| 12 huấn luyện viên | Mock tĩnh | `src/data/coaches.ts` |
| 4 hạng hội viên | Mock tĩnh | `src/data/memberships.ts` |
| 16 voucher | Mock tĩnh | `src/data/vouchers.ts` |
| 12 sự kiện | Mock tĩnh | `src/data/events.ts` |
| 14 món F&B | Mock tĩnh | `src/data/fnb.ts` |
| 8 gói doanh nghiệp + case study | Mock tĩnh | `src/data/corporate.ts` |
| 7 gói Golf Tour | Mock tĩnh | `src/data/tours.ts` |
| FAQ (11 nhóm) / testimonial | Mock tĩnh | `src/data/faqs.ts`, `testimonials.ts` |
| Dữ liệu Coach Portal | Mock tĩnh | `src/data/coach-portal.ts` |
| **Lịch trống & khung giờ** | Sinh bằng thuật toán xác định | `src/lib/availability.ts` |
| **Booking / ví / voucher / hội viên / sự kiện / đơn F&B** | localStorage (Zustand persist) | `src/store/*` |
| Tài khoản & đăng nhập | localStorage | `src/store/useAuthStore.ts` |
| Yêu cầu doanh nghiệp / tour / liên hệ | localStorage | `src/store/useAccountStore.ts` (`leads`) |
| Ảnh | **Ảnh thật** tải sẵn vào `public/images` (nguồn Unsplash) | `scripts/fetch-photos.mjs` |
| QR code | Ma trận minh hoạ, **không quét được** | `src/components/ui/misc.tsx` (`DemoQrCode`) |
| Smart Assistant | Kịch bản cố định, **không phải AI** | `src/components/layout/smart-assistant.tsx` |

> Lịch trống dùng hàm băm xác định thay vì ngày giờ cố định, nên dữ liệu demo **không bao giờ bị hết
> hạn** theo thời gian và luôn nhất quán giữa server và client (không gây lỗi hydration).

---

## 13. Kết nối backend thật ở giai đoạn sau

Kiến trúc đã tách sẵn để việc thay thế diễn ra ở **một tầng duy nhất**.

### 13.1. Dữ liệu danh mục (đọc)

Sửa phần thân hàm trong `src/services/catalogService.ts`, giữ nguyên chữ ký:

```ts
// Hiện tại
export const coachService = {
  getAll(): Coach[] {
    return COACHES;
  },
};

// Sau khi có API — component không phải sửa gì
export const coachService = {
  async getAll(): Promise<Coach[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/coaches`, {
      next: { revalidate: 300 },
    });
    return res.json();
  },
};
```

### 13.2. Xác thực

Thay `src/store/useAuthStore.ts` bằng NextAuth/Auth.js hoặc backend riêng. Component chỉ dùng
`user`, `isAuthenticated`, `login`, `logout`, nên chỉ cần giữ đúng các trường này.

### 13.3. Ghi dữ liệu (booking, ví, voucher, sự kiện, F&B)

Các store trong `src/store/` hiện ghi thẳng vào localStorage. Thay mỗi action bằng lời gọi API
tương ứng (`POST /bookings`, `POST /wallet/top-up`…) và giữ lại state cục bộ làm cache lạc quan.

### 13.4. Lịch trống

Thay `getTimeSlots` / `getCoachAvailability` trong `src/lib/availability.ts` bằng
`GET /availability?date=…`. Shape trả về (`TimeSlot[]`) giữ nguyên.

### 13.5. Thanh toán

Bước 9 của booking (`features/booking/steps/step-payment.tsx`) đã có sẵn UI chọn phương thức —
chỉ cần thay hành động xác nhận bằng lời gọi cổng thanh toán.

### 13.6. QR check-in

`DemoQrCode` vẽ ma trận minh hoạ. Thay bằng thư viện QR thật (ví dụ `qrcode.react`) và dùng
`booking.qrPayload` làm nội dung — payload đã được sinh sẵn đúng định dạng.

### 13.7. AI / Smart features

`SmartAssistant` và các khối gợi ý trong Dashboard đang dùng dữ liệu tĩnh. Thay hàm trả lời bằng
lời gọi API model, giữ nguyên giao diện.

### 13.8. Đa ngôn ngữ

`src/lib/i18n/dictionaries.ts` là từ điển đơn giản theo namespace. Khi cần đầy đủ, chuyển sang
`next-intl` bằng cách tách object này thành file JSON theo locale.

---

## 14. SEO, Accessibility và hiệu suất

**SEO**: metadata riêng cho từng trang (title, description, canonical, Open Graph, Twitter Card) ·
`sitemap.xml` sinh động gồm cả route động · `robots.txt` (chặn index khu vực cá nhân) ·
structured data `LocalBusiness` + `SportsActivityLocation`, `Event`, `FAQPage`, `BreadcrumbList`.

**Accessibility**: HTML semantic · label đầy đủ cho mọi input · focus ring nhất quán, không bao giờ
bị gỡ · `aria-label` / `aria-pressed` / `aria-current` / `aria-live` đúng ngữ cảnh · alt text cho
ảnh nội dung, `alt=""` cho ảnh trang trí · vùng chạm tối thiểu 44px · skip-link · không chặn zoom ·
tôn trọng `prefers-reduced-motion`.

**Hiệu suất**: Server Component mặc định · `next/image` (AVIF/WebP, blur placeholder, `priority`
đúng chỗ) · `next/font` với subset `vietnamese` · icon import theo tên · ảnh đã được cắt đúng tỷ lệ
và nén sẵn · không dùng video nặng.

---

## 15. Bảo mật

- Không có secret trong source; có `.env.example` đầy đủ.
- Toàn bộ form validate bằng Zod ở client.
- Dữ liệu người dùng nhập được `sanitizeText()` trước khi lưu/hiển thị lại.
- Không lưu mật khẩu dạng dùng lại được (chỉ băm nhẹ để so khớp trong phiên demo).
- Header bảo mật cơ bản (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) trong `next.config.ts`.
- Website công khai **không** chứa dữ liệu tài chính nội bộ, chiến lược kinh doanh hay thông tin cá nhân thật.

---

## 16. Tài liệu liên quan

- [`docs/project-structure.md`](docs/project-structure.md) — giải thích chi tiết kiến trúc
- [`docs/deployment-hostinger.md`](docs/deployment-hostinger.md) — hướng dẫn deploy từng bước
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — quy ước làm việc
- [`CHANGELOG.md`](CHANGELOG.md) — lịch sử phiên bản

---

© 2026 Lotus Golf Center. Bản demo giao diện — dữ liệu hiển thị là dữ liệu mẫu.
