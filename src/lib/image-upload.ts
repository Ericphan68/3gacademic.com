/**
 * Nén ảnh phía trình duyệt TRƯỚC khi tải lên admin.
 *
 * Mục tiêu: mọi ảnh tải lên đều nhẹ để web tải nhanh và tiết kiệm dung lượng DB.
 *  - Khuyến nghị: dưới ~200KB là đẹp.
 *  - Nếu ảnh lớn hơn: tự động giảm chất lượng rồi giảm kích thước cho tới khi < 200KB.
 *  - Chặn cứng: nếu không thể đưa xuống dưới 1MB thì báo lỗi, không lưu.
 *
 * Dùng chung cho TẤT CẢ ô tải ảnh trong admin (blog, huấn luyện viên, …).
 */

export interface CompressOptions {
  /** Ngưỡng mong muốn — cố nén xuống dưới mức này (mặc định 200KB). */
  targetBytes?: number;
  /** Ngưỡng tối đa — vượt mức này sẽ báo lỗi (mặc định 1MB). */
  maxBytes?: number;
  /** Cạnh dài nhất tối đa của ảnh sau khi thu nhỏ (mặc định 1600px). */
  maxDim?: number;
}

const TARGET_BYTES = 200 * 1024; // ~200KB
const MAX_BYTES = 1024 * 1024; // 1MB
const MAX_DIM = 1600;

/** Ước lượng số byte thật từ chuỗi dataURL base64. */
export function dataUrlBytes(dataUrl: string): number {
  const comma = dataUrl.indexOf(',');
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const padding = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((b64.length * 3) / 4) - padding);
}

/** KB gọn để hiển thị cho người dùng. */
export function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  return `${Math.round(bytes / 1024)}KB`;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(new Error('Không đọc được tệp ảnh.'));
    fr.readAsDataURL(file);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Không đọc được ảnh (định dạng không hỗ trợ?).'));
    img.src = dataUrl;
  });
}

function drawToJpegDataUrl(img: HTMLImageElement, width: number, height: number, quality: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, width);
  canvas.height = Math.max(1, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ xử lý ảnh.');
  // Nền trắng để ảnh PNG trong suốt không bị đen khi chuyển sang JPEG.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Nén 1 ảnh thành dataURL (JPEG) đạt dưới ngưỡng mong muốn nếu có thể.
 * GIF động được giữ nguyên (chỉ kiểm tra ngưỡng tối đa) để không mất hoạt ảnh.
 */
export async function compressImageToDataUrl(file: File, opts: CompressOptions = {}): Promise<string> {
  const targetBytes = opts.targetBytes ?? TARGET_BYTES;
  const maxBytes = opts.maxBytes ?? MAX_BYTES;
  const maxDim = opts.maxDim ?? MAX_DIM;

  const original = await readAsDataUrl(file);

  // GIF: không nén lại (giữ hoạt ảnh) — chỉ chặn nếu quá lớn.
  if (file.type === 'image/gif') {
    if (dataUrlBytes(original) > maxBytes) {
      throw new Error(`Ảnh GIF quá lớn (${formatBytes(dataUrlBytes(original))}, tối đa 1MB). Vui lòng chọn ảnh nhỏ hơn.`);
    }
    return original;
  }

  const img = await loadImage(original);
  let width = img.width;
  let height = img.height;
  const longest = Math.max(width, height);
  if (longest > maxDim) {
    const scale = maxDim / longest;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  let out = drawToJpegDataUrl(img, width, height, 0.82);

  // Bước 1: hạ dần chất lượng.
  for (const quality of [0.82, 0.72, 0.62, 0.52, 0.42]) {
    out = drawToJpegDataUrl(img, width, height, quality);
    if (dataUrlBytes(out) <= targetBytes) return out;
  }

  // Bước 2: nếu vẫn lớn, thu nhỏ kích thước dần (giữ chất lượng 0.6).
  while (dataUrlBytes(out) > targetBytes && Math.max(width, height) > 400) {
    width = Math.round(width * 0.85);
    height = Math.round(height * 0.85);
    out = drawToJpegDataUrl(img, width, height, 0.6);
  }

  // Không thể xuống dưới 1MB -> từ chối; dưới 1MB thì chấp nhận (best effort).
  if (dataUrlBytes(out) > maxBytes) {
    throw new Error('Ảnh quá lớn và không thể nén xuống dưới 1MB. Vui lòng chọn ảnh khác.');
  }
  return out;
}

/**
 * Nén + tải 1 ảnh lên admin, trả về link công khai (/api/media/...).
 * Dùng cho mọi ô tải ảnh trong khu vực quản trị.
 */
export async function uploadAdminImage(file: File, opts?: CompressOptions): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Vui lòng chọn tệp ảnh.');
  const dataUrl = await compressImageToDataUrl(file, opts);
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dataUrl }),
  });
  const body = (await res.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!res.ok || !body?.url) throw new Error(body?.error ?? 'Tải ảnh thất bại.');
  return body.url;
}
