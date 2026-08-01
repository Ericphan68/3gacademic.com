# Hướng dẫn đóng góp

Cảm ơn bạn tham gia phát triển website Lotus Golf Center. Tài liệu này mô tả quy ước làm việc để
code giữ được sự nhất quán.

---

## 1. Chuẩn bị

```bash
npm install
```

```bash
cp .env.example .env.local
```

```bash
npm run dev
```

---

## 2. Trước khi mở Pull Request

Bắt buộc chạy và pass cả ba:

```bash
npm run verify
```

Tương đương `npm run lint` → `npm run typecheck` → `npm run build`.

Định dạng lại code nếu cần:

```bash
npm run format
```

---

## 3. Quy ước commit

Theo [Conventional Commits](https://www.conventionalcommits.org/), viết mô tả bằng tiếng Việt.

```
<type>(<scope>): <mô tả ngắn, không viết hoa đầu, không dấu chấm cuối>
```

| Type | Dùng khi |
| --- | --- |
| `feat` | Thêm tính năng mới |
| `fix` | Sửa lỗi |
| `style` | Thay đổi giao diện, không đổi logic |
| `refactor` | Tái cấu trúc, không đổi hành vi |
| `perf` | Cải thiện hiệu suất |
| `docs` | Tài liệu |
| `chore` | Cấu hình, dependency, công cụ |
| `a11y` | Cải thiện khả năng tiếp cận |

Scope thường dùng: `home`, `booking`, `coaches`, `membership`, `vouchers`, `events`, `corporate`,
`tours`, `food`, `dashboard`, `coach-portal`, `auth`, `layout`, `seo`, `deps`.

Ví dụ:

```
feat(booking): thêm bước chọn dịch vụ bổ sung
fix(header): sửa tràn ngang ở màn hình 1280px
a11y(form): bổ sung aria-live cho thông báo lỗi
docs(readme): bổ sung hướng dẫn deploy Hostinger
```

---

## 4. Quy tắc code

### 4.1. Dữ liệu

- **Không** import trực tiếp từ `src/data` trong component. Luôn đi qua `src/services`.
- Thêm dữ liệu mới: khai type trong `src/types` trước, rồi mới viết mock trong `src/data`.

### 4.2. Component

- Mặc định là Server Component. Chỉ thêm `'use client'` khi cần state, event handler hoặc browser API.
- Một file một component chính. File vượt ~300 dòng nên tách nhỏ.
- Đặt trong `components/` nếu không mang nghiệp vụ, trong `features/` nếu có.

### 4.3. Styling

- Dùng token trong `globals.css`, **không** viết mã màu trực tiếp trong component.
  - Đúng: `text-[var(--color-muted)]`
  - Sai: `text-[#5f6873]`
- Gộp class bằng `cn()` từ `@/lib/utils`.
- Mobile-first: viết style cho màn hình nhỏ trước, rồi thêm `sm:` `md:` `lg:` `xl:` `2xl:`.

### 4.4. Accessibility (bắt buộc)

- Mọi input phải có `<label>` liên kết đúng.
- Nút chỉ có icon phải có `aria-label`.
- **Không bao giờ** gỡ focus ring.
- Vùng chạm tối thiểu 44×44px.
- Ảnh nội dung phải có `alt` mô tả; ảnh trang trí dùng `alt=""` kèm `aria-hidden`.
- Danh sách kết quả thay đổi theo bộ lọc nên có `aria-live="polite"`.
- Animation phải tự tắt khi người dùng bật `prefers-reduced-motion`.

### 4.5. Hiệu suất

- Ảnh dùng `next/image` kèm `sizes` phù hợp.
- Chỉ đặt `priority` cho ảnh above-the-fold.
- Import icon theo tên. **Không** dùng `import * as Icons from 'lucide-react'`.
- Tránh `useEffect` chỉ để `setState` — cân nhắc `useSyncExternalStore` hoặc tính trực tiếp khi render.

### 4.6. Form

- Luôn dùng React Hook Form + Zod.
- Thông báo lỗi hiển thị ngay dưới field, viết bằng tiếng Việt, nói rõ cách sửa.
- Dữ liệu người dùng nhập phải qua `sanitizeText()` trước khi lưu hoặc hiển thị lại.

### 4.7. Nội dung

- Toàn bộ nội dung hiển thị viết bằng **tiếng Việt tự nhiên**, không dùng lorem ipsum.
- Nhãn UI dùng lại nhiều nơi nên khai báo trong `lib/i18n/dictionaries.ts`.
- **Không** đưa lên website: dữ liệu tài chính nội bộ, chiến lược kinh doanh, chính sách nhân sự,
  thông tin cá nhân thật, hay bất kỳ nội dung bảo mật nào.
- Tính năng demo phải được **ghi rõ là demo** trên giao diện (ví dụ QR minh hoạ, Smart Assistant,
  chuyển tặng voucher).

---

## 5. Thêm một trang mới

1. Tạo `page.tsx` trong route group phù hợp (`(site)`, `(auth)`, `(portal)`).
2. Export `metadata` bằng `buildMetadata()` từ `@/lib/seo`.
3. Thêm `<Breadcrumbs>` hoặc `<PageHero>` cho trang con.
4. Nếu là trang public, thêm route vào `src/app/sitemap.ts`.
5. Nếu cần vào menu, cập nhật `src/constants/navigation.ts`.
6. Chạy `npm run typecheck` — typed routes sẽ báo ngay nếu link sai.

---

## 6. Thêm dữ liệu mock mới

1. Khai type trong `src/types/`.
2. Viết dữ liệu trong `src/data/`.
3. Bổ sung hàm truy cập trong `src/services/catalogService.ts`.
4. Nếu cần ảnh, thêm vào `scripts/generate-images.mjs` rồi chạy `npm run generate:images`.
5. Khai đường dẫn ảnh trong `src/constants/media.ts`.

---

## 7. Checklist trước khi gửi PR

- [ ] `npm run verify` pass
- [ ] Kiểm tra ở 375px, 768px, 1280px và 1536px — không có cuộn ngang
- [ ] Kiểm tra được cả giao diện sáng và tối
- [ ] Điều hướng được bằng bàn phím, focus ring luôn nhìn thấy
- [ ] Không còn `console.log` sót lại
- [ ] Không có import thừa
- [ ] Nội dung tiếng Việt đã đọc lại, không sai chính tả
- [ ] Không commit `.env.local` hay bất kỳ secret nào
