# Changelog

Định dạng theo [Keep a Changelog](https://keepachangelog.com/vi/1.1.0/),
phiên bản theo [Semantic Versioning](https://semver.org/lang/vi/).

---

## [1.0.0] — 2026-08-01

Phiên bản đầu tiên: toàn bộ frontend và trải nghiệm phía người dùng.

### Thêm mới

**Nền tảng**
- Khởi tạo Next.js 16 (App Router) + TypeScript strict mode + Tailwind CSS v4.
- Design system đầy đủ: bảng màu navy / xanh lá golf / champagne / trắng ngà / xám đá, token ngữ
  nghĩa, dark mode, thang bo góc, shadow và easing.
- Typography Playfair Display (heading) + Be Vietnam Pro (body), đều có subset `vietnamese`.
- Bộ UI primitive dựng trên Radix UI: button, badge, card, form field, dialog, sheet, tooltip,
  accordion, tabs, skeleton, empty state, error state, rating, progress, QR minh hoạ.
- Cấu trúc song ngữ VI/EN với từ điển đơn giản, sẵn sàng chuyển sang next-intl.

**Trang public**
- Trang chủ 14 khối nội dung, từ announcement bar đến newsletter.
- `/experience` + `/experience/[slug]`: 12 gói, bộ lọc theo 7 nhóm đối tượng, bảng so sánh.
- `/academy`: 12 chương trình, hành trình học viên 8 bước, công nghệ đào tạo, kết quả học viên.
- `/coaches` + `/coaches/[slug]`: 12 huấn luyện viên, tìm kiếm và lọc đa tiêu chí, hồ sơ đầy đủ.
- `/membership`: 4 hạng, bảng so sánh, calculator tiết kiệm, Founder Membership có countdown.
- `/vouchers`: 16 voucher, 8 nhóm, 5 tab.
- `/events` + `/events/[slug]`: 12 sự kiện, form đăng ký, QR, add-to-calendar.
- `/corporate`: 8 gói, case study, form báo giá.
- `/golf-tour`: 7 gói tour, khối dành cho công ty du lịch, form đặt đoàn và đăng ký đại lý.
- `/food-and-lounge`: 14 món, giỏ hàng, thanh toán demo.
- `/about`, `/contact`, `/faq`, `/partner`, `/privacy`, `/terms`, trang 404.

**Luồng đặt lịch**
- 10 bước hoạt động đầy đủ, có thanh tiến trình, nút quay lại và tóm tắt giá theo thời gian thực.
- Lịch trống sinh bằng thuật toán xác định, không bị hết hạn theo thời gian.
- Booking lưu vào localStorage và hiển thị ngay trong Dashboard.

**Tài khoản**
- Đăng nhập / đăng ký / quên mật khẩu (demo), hai tài khoản mẫu bấm-là-vào.
- Dashboard khách hàng: 8 trang gồm tổng quan, lịch đặt, hội viên, ví, voucher, buổi học, sự kiện, hồ sơ.
- Coach Portal: 5 trang gồm tổng quan, học viên, lịch dạy, hoa hồng (có biểu đồ), giới thiệu.

**Smart features (demo, không phải AI thật)**
- Lotus Smart Assistant dạng chat bubble với 7 chủ đề tra cứu.
- Gợi ý khung giờ, huấn luyện viên, nâng hạng hội viên và nhắc quay lại trong Dashboard.
- Nhận định hiệu suất trong Coach Portal.

**SEO**
- Metadata riêng từng trang, Open Graph, Twitter Card, canonical.
- `sitemap.xml` gồm cả route động, `robots.txt` chặn khu vực cá nhân.
- Structured data: `LocalBusiness`, `SportsActivityLocation`, `Event`, `FAQPage`, `BreadcrumbList`.

**Accessibility**
- HTML semantic, label đầy đủ, focus ring nhất quán, ARIA đúng ngữ cảnh.
- Vùng chạm tối thiểu 44px, skip-link, không chặn zoom, tôn trọng `prefers-reduced-motion`.

**Công cụ**
- Script `dev`, `build`, `start`, `lint`, `lint:fix`, `typecheck`, `format`, `format:check`,
  `generate:images`, `verify`.
- Script sinh 120 ảnh demo bằng sharp.
- Tài liệu: README, `docs/project-structure.md`, `docs/deployment-hostinger.md`, CONTRIBUTING.

### Ghi chú

- Đây là bản **frontend demo**: chưa kết nối cơ sở dữ liệu, thanh toán, API hay hệ thống AI thật.
- Toàn bộ dữ liệu người dùng tạo ra được lưu trong localStorage của trình duyệt.
- Hệ thống đăng nhập chỉ mang tính minh hoạ, không dùng cho mục đích bảo mật thật.
