# Database & Admin Backend — Lotus Golf Center

Tài liệu này mô tả tầng dữ liệu (PostgreSQL + Prisma) của hệ thống Admin/CMS.

> **Trạng thái:** Phase 1 — Nền tảng database. Public site vẫn chạy bằng dữ liệu
> hiện có; chưa bị ảnh hưởng. Việc chuyển public site sang đọc từ DB thực hiện ở
> Phase 6 (có regression test).

---

## 1. Công nghệ

| Thành phần | Lựa chọn |
| --- | --- |
| ORM | Prisma `^6.19` |
| Database | PostgreSQL (vendor-neutral qua `DATABASE_URL`) |
| Auth admin | JWT (jose) trong HttpOnly cookie + bcrypt hash mật khẩu |
| Timezone | Lưu UTC (timestamptz); hiển thị theo `APP_TIMEZONE` (mặc định `Asia/Ho_Chi_Minh`) |

Hostinger hiện đang chạy **Next.js server thật (Node)** nên API routes + Prisma
chạy được ở production.

## 2. Cấu hình môi trường

Sao chép `.env.example` → `.env.local` (dev) hoặc cấu hình trên Hostinger (prod).
Biến bắt buộc cho backend:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/lotus?schema=public&sslmode=require
ADMIN_SESSION_SECRET=<chuỗi ngẫu nhiên >= 32 ký tự>
ADMIN_SESSION_TTL=28800
SUPER_ADMIN_EMAIL=...
SUPER_ADMIN_PASSWORD=...
```

Sinh secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

**Không** commit `.env` / `.env.local` (đã nằm trong `.gitignore`).

## 3. Nhà cung cấp PostgreSQL

Dùng bất kỳ Postgres nào có `DATABASE_URL`:

- **Hostinger** — nếu gói của bạn có PostgreSQL, tạo DB rồi lấy connection string.
- **Neon / Supabase / Railway** — có free tier, tạo project → copy `DATABASE_URL`
  (nhớ `sslmode=require`).

## 4. Lệnh Database

| Lệnh | Tác dụng |
| --- | --- |
| `npm run db:generate` | Sinh Prisma Client (tự chạy khi `npm install` qua `postinstall`) |
| `npm run db:deploy` | Áp dụng migration lên DB (production) |
| `npm run db:migrate` | Tạo & áp migration mới (development) |
| `npm run db:seed` | Seed dữ liệu hệ thống (roles, settings, membership, zones, experiences, add-ons, content) |
| `npm run create-admin` | Tạo/cập nhật Super Admin từ biến môi trường |
| `npm run db:studio` | Mở Prisma Studio để xem/sửa dữ liệu trực quan |

### Thiết lập lần đầu (production)

```bash
# 1. Cấu hình DATABASE_URL + secrets trong môi trường
npm ci                 # cài deps (postinstall tự chạy prisma generate)
npm run db:deploy      # tạo bảng từ prisma/migrations
npm run db:seed        # nạp dữ liệu hệ thống
SUPER_ADMIN_EMAIL=... SUPER_ADMIN_PASSWORD=... npm run create-admin
```

Sau khi tạo Super Admin, đăng nhập tại `/admin/login` rồi đổi mật khẩu / tạo các
admin khác từ giao diện.

## 5. Sơ đồ schema (nhóm chính)

- **RBAC/Admin:** `AdminUser`, `Role`, `Permission`, `RolePermission`, `AdminSession`
- **CRM:** `Customer`
- **Golf:** `Coach`, `CoachAvailability`, `PracticeZone`, `Experience`, `AddOn`, `AcademyProgram`, `Lesson`
- **Booking:** `Booking`, `BookingItem`, `BookingStatusHistory`
- **Membership:** `MembershipPlan`, `MembershipPlanHistory`, `CustomerMembership`
- **Voucher:** `Voucher`, `VoucherRedemption`
- **Event:** `Event`, `EventRegistration`
- **F&B:** `FoodCategory`, `FoodProduct`, `FoodOrder`, `FoodOrderItem`
- **Leads:** `CorporateLead`, `TourLead`, `Partner`
- **CMS:** `ContentPage`, `ContentSection`, `Testimonial`, `Faq`, `NavItem`
- **Media/SEO/Settings:** `Media`, `SiteSetting`, `SeoSetting`
- **Finance:** `Transaction`, `Commission`
- **Hệ thống:** `Notification`, `AuditLog`

Tổng: **42 bảng, 20 enum**. Chi tiết trong `prisma/schema.prisma`.

Nguyên tắc:
- Soft delete (`deletedAt`) cho dữ liệu quan trọng (customer, coach, booking, event, voucher, membership...).
- Index cho các trường hay query (booking date/status, email, phone, createdAt...).
- Trạng thái thanh toán: `UNPAID | PAID_AT_COUNTER | PAID | REFUNDED` — **không tự động đánh dấu PAID**.

## 6. RBAC

Nguồn sự thật quyền ở **`src/server/rbac.ts`** (server-side). 7 role:
`SUPER_ADMIN, ADMIN, MANAGER, RECEPTION, COACH_MANAGER, MARKETING, ACCOUNTING`.
Quyền được kiểm tra ở server; frontend chỉ ẩn/hiện UI.

## 7. Backup & Restore

```bash
# Backup (pg_dump)
pg_dump "$DATABASE_URL" -Fc -f lotus_backup_$(date +%Y%m%d).dump

# Restore
pg_restore --clean --no-owner -d "$DATABASE_URL" lotus_backup_YYYYMMDD.dump
```

- Đặt lịch backup định kỳ (cron) trên môi trường production.
- **Không** chạy `prisma migrate reset` trên production (xoá sạch dữ liệu).
- Rollback migration: khôi phục từ bản dump gần nhất, hoặc tạo migration đảo ngược
  có kiểm soát (`prisma migrate diff` giữa 2 trạng thái).

## 8. An toàn khi deploy (không downtime)

- Tầng DB được thêm dạng **additive**: public site không import Prisma nên vẫn chạy
  bình thường kể cả khi chưa có `DATABASE_URL`.
- Chỉ khu `/admin/*` (server) mới truy vấn DB.
- Migration chạy **trước** khi trỏ traffic sang bản build mới.
