# Kiến trúc dự án Lotus Golf Center

Tài liệu này giải thích cách source code được tổ chức và **vì sao** lại tổ chức như vậy, để người
tiếp nhận dự án biết nên sửa ở đâu.

---

## 1. Nguyên tắc nền tảng

### 1.1. Component không chạm mock data

Không component nào import trực tiếp từ `src/data`. Mọi truy cập dữ liệu đi qua `src/services`.

```
UI component  →  services/*  →  data/* (hiện tại)
                            →  fetch() API (giai đoạn sau)
```

Nhờ vậy, khi có backend thật chỉ cần sửa phần thân hàm trong service; toàn bộ component giữ nguyên.

**Ngoại lệ có chủ đích:** các file nhãn hiển thị (`SPECIALTY_LABELS`, `FAQ_GROUP_LABELS`,
`VOUCHER_CATEGORY_LABELS`…) được import trực tiếp vì chúng là hằng số giao diện, không phải dữ liệu
nghiệp vụ.

### 1.2. Server Component là mặc định

Chỉ thêm `'use client'` khi thật sự cần state, event handler hoặc browser API. Các trang nội dung
(About, Academy, Corporate, Golf Tour, Privacy, Terms…) hoàn toàn là Server Component.

### 1.3. Logic giá nằm ở một nơi

Toàn bộ phép tính giá booking (giá theo khung giờ, phụ thu khu vực, phí HLV, dịch vụ bổ sung, ưu đãi
hội viên, voucher, trừ ví) nằm trong `services/pricingService.ts`. UI chỉ hiển thị kết quả.

### 1.4. Không hard-code đường dẫn ảnh

Mọi ảnh đi qua `constants/media.ts`. Đổi sang CDN chỉ cần sửa file này (và thêm host vào
`images.remotePatterns` trong `next.config.ts`).

### 1.5. Typed routes

`typedRoutes: true` trong `next.config.ts`. Link tới route không tồn tại sẽ **fail ngay khi
typecheck**, không đợi phát hiện lúc chạy.

---

## 2. Cây thư mục

```
lotus-golf-center/
├── docs/                        # Tài liệu dự án
├── public/
│   ├── images/                  # Ảnh thật (tải bằng scripts/fetch-photos.mjs)
│   └── lotus-mark.svg
├── scripts/
│   ├── fetch-photos.mjs         # Tải ảnh thật từ Unsplash, cắt và nén bằng sharp
│   └── generate-images.mjs      # Sinh ảnh minh hoạ dự phòng khi không có mạng
└── src/
    ├── app/
    ├── components/
    ├── features/
    ├── data/
    ├── services/
    ├── store/
    ├── hooks/
    ├── lib/
    ├── constants/
    └── types/
```

---

## 3. `src/app` — Routing

Dùng **route group** để mỗi khu vực có layout riêng mà không ảnh hưởng URL:

| Nhóm | Layout | Route |
| --- | --- | --- |
| `(site)` | `SiteShell`: announcement bar, header, footer, search dialog, Smart Assistant | Toàn bộ trang public |
| `(auth)` | Hai cột: form bên trái, ảnh thương hiệu bên phải | `/login`, `/register`, `/forgot-password` |
| `(portal)` | `PortalShell`: sidebar desktop + bottom nav mobile, chặn truy cập khi chưa đăng nhập | `/dashboard/*`, `/coach-portal/*` |

Các file đặc biệt:

| File | Vai trò |
| --- | --- |
| `layout.tsx` | Root layout: `next/font`, metadata gốc, JSON-LD `LocalBusiness`, `Providers` |
| `not-found.tsx` | Trang 404 có gợi ý điều hướng |
| `sitemap.ts` | Sinh sitemap gồm cả route động (coach, event, experience) |
| `robots.ts` | Cho phép index trang public, chặn khu vực cá nhân |
| `globals.css` | Toàn bộ design system |

---

## 4. `src/components` — UI không mang nghiệp vụ

| Thư mục | Nội dung |
| --- | --- |
| `ui/` | Primitive: `button`, `badge`, `card`, `form-fields`, `overlays` (dialog/sheet/tooltip), `disclosure` (accordion/tabs), `states` (skeleton/empty/error), `misc` (rating, progress, avatar, `DemoQrCode`) |
| `common/` | `Section`, `SectionHeader`, `PageHero`, `Breadcrumbs`, `Reveal`, `StatTile`, `FaqAccordion`, `JsonLd`, `LegalPage`, `icon-registry` |
| `layout/` | `Header`, `Footer`, `MobileNav`, `AnnouncementBar`, `SearchDialog`, `SmartAssistant`, `Providers`, `SiteShell`, `Logo` |
| `cards/` | Card dùng lại nhiều nơi: experience, coach, event, voucher |
| `home/` | Các section của trang chủ, mỗi section một file |
| `dashboard/` | `PortalShell` — khung layout dùng chung cho Dashboard và Coach Portal |

### Về `icon-registry`

Mock data lưu tên icon dạng chuỗi (`"CalendarCheck"`). `icon-registry.ts` map chuỗi → component,
**import theo tên** thay vì `import * as Icons from 'lucide-react'` (cách sau kéo toàn bộ thư viện
vào bundle).

---

## 5. `src/features` — UI mang nghiệp vụ

Mỗi thư mục là một mảng chức năng, hầu hết là client component:

| Thư mục | Nội dung chính |
| --- | --- |
| `auth/` | Form đăng nhập, đăng ký, quên mật khẩu |
| `booking/` | `BookingFlow` (điều phối 10 bước), `BookingProgress`, `BookingSummary`, `steps/` |
| `coaches/` | Bộ lọc danh sách HLV, panel đặt lịch ở trang chi tiết |
| `experience/` | Bộ lọc gói, gallery, bảng so sánh, nút chia sẻ |
| `membership/` | Pricing + luồng mua, calculator, countdown Founder |
| `vouchers/`, `events/`, `corporate/`, `tours/`, `food/`, `contact/`, `faq/` | Explorer + form tương ứng |
| `dashboard/` | 7 panel của Dashboard khách hàng |
| `coach-portal/` | 5 panel của Coach Portal |

### Luồng booking

`BookingFlow` chỉ làm nhiệm vụ điều phối: đọc/ghi `useBookingStore`, gọi `pricingService`, và render
đúng bước. Mỗi bước là một component thuần nhận props — dễ test và dễ thay thế.

Các bước được gom theo nhóm để tránh file quá dài:

- `steps/step-schedule.tsx` — bước 1, 2, 3 (trải nghiệm, ngày, giờ)
- `steps/step-details.tsx` — bước 4, 5, 6, 8 (khu vực, HLV, khách & dịch vụ, thông tin)
- `steps/step-payment.tsx` — bước 7, 9, 10 (voucher/ví, xác nhận, thành công)

---

## 6. `src/services` — Tầng dữ liệu

| File | Vai trò |
| --- | --- |
| `catalogService.ts` | Đọc danh mục: experience, coach, membership, voucher, event, F&B, booking option, academy, corporate, tour |
| `pricingService.ts` | Tính giá booking, kiểm tra voucher, tính bonus nạp ví, ước tính tiết kiệm hội viên |
| `demoSeedService.ts` | Sinh dữ liệu demo cho tài khoản mẫu (booking, giao dịch, voucher, buổi học, sự kiện) |

Mọi hàm trong `catalogService` hiện là đồng bộ. Khi chuyển sang API, đổi thành `async` và cập nhật
nơi gọi — TypeScript sẽ chỉ ra chính xác những chỗ cần sửa.

---

## 7. `src/store` — State phía client (Zustand + persist)

| Store | localStorage key | Nội dung |
| --- | --- | --- |
| `useAuthStore` | `lotus.auth.v1` | Người dùng đang đăng nhập, tài khoản tự đăng ký, ví, hạng hội viên |
| `useAccountStore` | `lotus.bookings.v1` | Booking, giao dịch ví, voucher sở hữu, hội viên, sự kiện, buổi học, đơn F&B, HLV yêu thích, lead |
| `useBookingStore` | `lotus.booking-draft.v1` | Bản nháp booking 10 bước (giữ được khi tải lại trang) |
| `useCartStore` | `lotus.fnb-cart.v1` | Giỏ F&B và tuỳ chọn phục vụ |
| `useUiStore` | `lotus.locale.v1` | Ngôn ngữ, theme, trạng thái announcement/search/assistant |

### Tránh lỗi hydration

Mọi UI đọc dữ liệu đã persist đều bọc bằng `useHydrated()`. Server render trạng thái rỗng, client
chỉ hiển thị dữ liệu thật sau khi hydrate xong — không bao giờ có mismatch.

`useHydrated`, `useMediaQuery`, `useScrolled` đều cài bằng `useSyncExternalStore` thay vì
`useEffect + setState`, nên không tạo vòng render thừa.

---

## 8. `src/lib` — Tiện ích thuần

| File | Vai trò |
| --- | --- |
| `utils.ts` | `cn`, `slugify`, `generateCode`, `sanitizeText`, `matchesQuery` (tìm kiếm bỏ dấu tiếng Việt)… |
| `format.ts` | Định dạng tiền VND, ngày giờ tiếng Việt, thời lượng, số điện thoại |
| `availability.ts` | **Sinh lịch trống bằng thuật toán xác định** |
| `storage.ts` | Bọc localStorage an toàn cho SSR |
| `seo.ts` | `buildMetadata`, JSON-LD `LocalBusiness` và `Event` |
| `i18n/dictionaries.ts` | Từ điển VI/EN cho nhãn UI |

### Vì sao lịch trống được sinh bằng thuật toán

Nếu lưu ngày giờ cố định trong mock data, sau vài tuần toàn bộ lịch sẽ nằm ở quá khứ. `availability.ts`
dùng hàm băm FNV-1a trên `(ngày, giờ, khoá)` để cho ra kết quả:

- **Ổn định** — cùng input luôn cho cùng output, nên server và client khớp nhau.
- **Không hết hạn** — luôn tính từ ngày hiện tại.
- **Trông thật** — có ngày nghỉ, khung giờ cao điểm đông hơn, khung thấp điểm rẻ hơn.

---

## 9. `src/types`

| File | Nội dung |
| --- | --- |
| `common.ts` | `Locale`, `ServiceResult`, `FaqItem`, `Testimonial`, `BreadcrumbItem`… |
| `catalog.ts` | `ExperiencePackage`, `Coach`, `MembershipTier`, `Voucher`, `GolfEvent`, `FnbItem`, `CorporatePackage`, `TourPackage`, `PracticeZone` |
| `booking.ts` | `TimeSlot`, `AddOnItem`, `Booking`, `BookingDraft`, `BookingPriceBreakdown` |
| `account.ts` | `User`, `WalletTransaction`, `OwnedVoucher`, `LessonRecord`, `EventRegistration`, `FnbOrder`, `CoachStudent`, `CommissionRecord`… |

Tất cả re-export qua `src/types/index.ts` để import gọn: `import type { Coach } from '@/types'`.

---

## 10. Design system

Toàn bộ token nằm trong `src/app/globals.css`, khai báo bằng `@theme` của Tailwind v4.

### Bảng màu

| Nhóm | Token | Dùng cho |
| --- | --- | --- |
| Navy | `--color-navy-50` → `--color-navy-950` | Nền tối, header, footer, văn bản chính |
| Golf green | `--color-golf-50` → `--color-golf-900` | Màu nhấn chính, CTA phụ, trạng thái thành công |
| Champagne | `--color-champagne-50` → `--color-champagne-900` | Điểm nhấn sang trọng, badge giới hạn |
| Stone | `--color-stone-50` → `--color-stone-900` | Văn bản phụ, viền |
| Ivory | `--color-ivory`, `--color-ivory-deep` | Nền ấm |

### Token ngữ nghĩa

`--color-background`, `--color-surface`, `--color-surface-raised`, `--color-foreground`,
`--color-muted`, `--color-border`, `--color-primary`, `--color-accent`, `--color-gold`,
`--color-success` / `warning` / `danger` / `info`, `--color-ring`.

Dark mode ghi đè các token này dưới `[data-theme='dark']` — component không cần biết đang ở theme nào.

### Typography

- **Heading**: Playfair Display (serif) — `--font-display`
- **Body**: Be Vietnam Pro (sans) — `--font-sans`

Cả hai đều nạp subset `vietnamese`, hiển thị đầy đủ dấu tiếng Việt.

### Lớp tiện ích riêng

`.container-lotus` (container chuẩn) · `.section-y` (khoảng cách dọc section) · `.eyebrow` (nhãn nhỏ
in hoa) · `.rule-gold` (gạch chân trang trí) · `.surface-grid` (nền lưới nhạt) ·
`.animate-fade-up` / `.animate-fade-in` / `.animate-shimmer`.

---

## 11. Ảnh

Website dùng **ảnh chụp thật** (135 file, ~17 MB) đặt sẵn trong `public/images`.

Nguồn: [Unsplash](https://unsplash.com) — Unsplash License cho phép dùng miễn phí, kể cả cho mục
đích thương mại, không bắt buộc ghi nguồn.

Tải lại toàn bộ khi cần:

```bash
npm run fetch:photos
```

`scripts/fetch-photos.mjs` khai báo một thư viện ảnh (`PHOTOS`) rồi ánh xạ sang từng vị trí cụ thể
trên site, cắt đúng tỷ lệ và nén bằng `sharp`. Muốn đổi ảnh cho một vị trí, chỉ cần sửa bản đồ đó.

**Vì sao tải về thay vì trỏ thẳng URL Unsplash:**
- Website chạy được offline, không phụ thuộc dịch vụ bên thứ ba khi build hoặc deploy.
- LCP ổn định, không rủi ro ảnh bị đổi hoặc gỡ khỏi nguồn.
- Hostinger phục vụ ảnh cùng domain, không tốn thêm DNS lookup.

**Khi có ảnh chụp thật của Lotus:** ghi đè file cùng tên trong `public/images` là xong — không cần
sửa dòng code nào. Hoặc sửa `constants/media.ts` để trỏ sang CDN riêng (nhớ thêm host vào
`images.remotePatterns` trong `next.config.ts`).

`scripts/generate-images.mjs` vẫn được giữ lại để sinh bộ ảnh minh hoạ dạng vector khi cần chạy
hoàn toàn offline, không có mạng.

## 12. Quy ước đặt tên

| Loại | Quy ước | Ví dụ |
| --- | --- | --- |
| File component | kebab-case | `experience-card.tsx` |
| Component | PascalCase | `ExperienceCard` |
| Hook | camelCase, tiền tố `use` | `useHydrated` |
| Store | camelCase, tiền tố `use` | `useBookingStore` |
| Hằng số | SCREAMING_SNAKE_CASE | `MEMBERSHIP_TIERS` |
| Type / Interface | PascalCase | `BookingDraft` |
| Key localStorage | `lotus.<mục>.v<phiên bản>` | `lotus.bookings.v1` |

Key localStorage có hậu tố phiên bản để khi đổi cấu trúc dữ liệu, chỉ cần tăng số phiên bản là dữ
liệu cũ tự bị bỏ qua thay vì gây lỗi.
