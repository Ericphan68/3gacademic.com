# Deploy Lotus Golf Center lên Hostinger (Node.js)

Hướng dẫn này áp dụng cho gói Hostinger có hỗ trợ **Node.js App** (Business Hosting, Cloud Hosting
hoặc VPS). Dự án không dùng bất kỳ tính năng riêng của Vercel và không dùng static export, nên chạy
được trên Node.js runtime tiêu chuẩn.

---

## 0. Chuẩn bị trước khi deploy

Chạy ở máy để chắc chắn mọi thứ sạch:

```bash
npm run verify
```

Lệnh này chạy lần lượt `lint` → `typecheck` → `build`. Chỉ deploy khi cả ba đều xanh.

---

## 1. Đưa source lên GitHub

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

> `node_modules`, `.next` và `.env.local` đã được `.gitignore` loại trừ.
> Bộ ảnh demo trong `public/images` **được commit** để bản deploy có sẵn hình ảnh.

---

## 2. Tạo Node.js App trên hPanel

1. Đăng nhập **hPanel** → chọn hosting đang dùng.
2. Vào **Advanced → Node.js** (một số gói hiển thị là **Website → Node.js App**).
3. Bấm **Create Application**.

Điền các thông số:

| Trường | Giá trị |
| --- | --- |
| **Node.js version** | `22.x` (tối thiểu `20.9` — dưới mức này Next.js 16 không chạy) |
| **Application mode** | `Production` |
| **Application root** | Thư mục chứa `package.json`, ví dụ `domains/lotusgolf.vn/public_html` |
| **Application URL** | Tên miền hoặc subdomain bạn muốn trỏ tới |
| **Application startup file** | `node_modules/next/dist/bin/next` |

> Nếu giao diện hPanel yêu cầu tham số cho startup file, nhập `start`.
> Nếu gói của bạn cho phép nhập trực tiếp **Start command**, dùng `npm run start`.

---

## 3. Lấy source về hosting

### Cách A — Kết nối GitHub (khuyến nghị)

1. hPanel → **Advanced → Git**.
2. **Create a new repository**:
   - Repository URL: `https://github.com/<tai-khoan-cua-ban>/lotus-golf-center.git`
   - Branch: `main`
   - Install path: đúng thư mục **Application root** ở bước 2.
3. Bấm **Create**. Hostinger sẽ clone source về.
4. Bật **Auto Deployment** nếu muốn tự cập nhật mỗi lần push (Hostinger cung cấp một Webhook URL —
   dán URL đó vào GitHub tại *Settings → Webhooks* của repository).

### Cách B — Upload thủ công

Nén toàn bộ project **trừ** `node_modules` và `.next`, rồi upload qua **File Manager** và giải nén
vào Application root.

---

## 4. Cài đặt biến môi trường

Trong màn hình Node.js App, phần **Environment variables**, thêm:

| Key | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_SITE_URL` | `https://lotusgolf.vn` (tên miền thật của bạn) |
| `NEXT_PUBLIC_HOTLINE` | `1900 1990` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `hello@lotusgolf.vn` |
| `NEXT_PUBLIC_ZALO_URL` | `https://zalo.me/lotusgolf` |

**Không** tự thêm biến `PORT`. Hostinger tự cấp cổng và inject vào tiến trình; `next start` đọc
`process.env.PORT` một cách tự động.

> `NEXT_PUBLIC_SITE_URL` được dùng cho canonical URL, `sitemap.xml` và thẻ Open Graph. Đặt sai giá
> trị sẽ khiến SEO trỏ về `localhost`.

---

## 5. Cài dependency và build

Trong màn hình Node.js App:

1. Bấm **Run NPM Install** (hoặc mở Terminal/SSH và chạy `npm ci`).
2. Chạy build. Nếu hPanel có ô **Custom command**, nhập:

```bash
npm run build
```

Nếu dùng SSH:

```bash
cd ~/domains/lotusgolf.vn/public_html && npm ci && npm run build
```

> Build cần khoảng 1–2 GB RAM. Nếu gói hosting bị giới hạn bộ nhớ và build thất bại, hãy build ở máy
> cá nhân rồi upload thêm thư mục `.next` cùng source (khi đó bỏ qua bước build trên server).

---

## 6. Khởi động ứng dụng

Bấm **Restart** (hoặc **Start**) trong màn hình Node.js App.

Kiểm tra log tại mục **Logs** nếu ứng dụng không lên. Log khởi động thành công có dạng:

```
▲ Next.js 16.2.12
- Local:  http://localhost:xxxxx
✓ Ready in ...
```

---

## 7. Trỏ tên miền

1. hPanel → **Domains**.
2. Nếu tên miền đã ở Hostinger: gán tên miền vào đúng thư mục Application root.
3. Nếu tên miền ở nhà cung cấp khác: trỏ **nameserver** về Hostinger, hoặc tạo bản ghi `A` trỏ tới
   địa chỉ IP của hosting.
4. Vào **Security → SSL**, bật **Let's Encrypt** và bật **Force HTTPS**.
5. Sau khi SSL hoạt động, cập nhật lại `NEXT_PUBLIC_SITE_URL` thành `https://...` rồi **Restart**.

---

## 8. Cập nhật phiên bản mới

### Nếu đã bật Auto Deployment

```bash
git add .
```

```bash
git commit -m "feat: cập nhật nội dung trang chủ"
```

```bash
git push
```

Hostinger tự pull. Sau đó vào hPanel chạy lại **NPM Install** (chỉ khi `package.json` thay đổi) và
`npm run build`, rồi **Restart**.

### Nếu deploy thủ công qua SSH

```bash
cd ~/domains/lotusgolf.vn/public_html && git pull && npm ci && npm run build
```

Sau đó bấm **Restart** trong hPanel.

---

## 9. Khắc phục sự cố thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| App không khởi động, log báo lỗi cú pháp | Node.js dưới 20.9 | Đổi Node version sang 22.x rồi Restart |
| Trang trắng, log báo `Could not find a production build` | Chưa chạy `npm run build` | Chạy build rồi Restart |
| Ảnh không hiển thị | Thư mục `public/images` chưa được đưa lên | Kiểm tra thư mục tồn tại, hoặc chạy `npm run generate:images` |
| Build bị kill giữa chừng | Hết RAM | Build ở máy cá nhân rồi upload kèm thư mục `.next` |
| Canonical/sitemap trỏ về `localhost` | Thiếu `NEXT_PUBLIC_SITE_URL` | Thêm biến môi trường rồi build lại |
| Thay đổi không hiện sau khi push | Chưa build lại hoặc chưa Restart | Chạy `npm run build` rồi Restart |
| Cổng bị chiếm / app không nhận request | Có hard-code cổng | Bỏ mọi cấu hình `PORT` thủ công, để Hostinger tự cấp |

---

## 10. Checklist sau khi deploy

- [ ] Trang chủ mở được qua HTTPS
- [ ] Ảnh hero và ảnh các card hiển thị đầy đủ
- [ ] Đăng nhập bằng tài khoản demo → vào được `/dashboard`
- [ ] Hoàn tất một lượt đặt lịch → booking xuất hiện trong Dashboard
- [ ] `https://ten-mien/sitemap.xml` trả về danh sách URL đúng tên miền thật
- [ ] `https://ten-mien/robots.txt` trỏ đúng sitemap
- [ ] Kiểm tra hiển thị trên điện thoại
