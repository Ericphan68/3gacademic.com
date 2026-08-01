/**
 * Tải bộ ảnh thật từ Unsplash về /public/images.
 *
 * Vì sao tải về thay vì trỏ thẳng URL Unsplash:
 *  - Website chạy được offline, không phụ thuộc mạng bên thứ ba khi build/deploy.
 *  - LCP ổn định, không rủi ro ảnh bị đổi hoặc gỡ.
 *  - Hostinger phục vụ ảnh cùng domain, không tốn thêm DNS lookup.
 *
 * Nguồn: Unsplash (Unsplash License — dùng miễn phí, kể cả thương mại).
 * Khi có ảnh chụp thật của Lotus: ghi đè file cùng tên trong /public/images.
 *
 * Chạy: npm run fetch:photos
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'images');

/* ============================================================
   Thư viện ảnh — mỗi khoá là một ảnh gốc trên Unsplash
   ============================================================ */
const PHOTOS = {
  // Sân golf & cảnh quan
  bunkerSunset: '1538648759472-7251f7cb2c2f', // bunker lúc hoàng hôn
  golferSunset: '1593282153762-a41e3cceb06c', // bóng người chơi ngược nắng
  ballFlagBlue: '1632946269126-0f8edbe8b068', // bóng và cột cờ, trời xanh
  swingDrama: '1535131749006-b7f58c99034b', // cú swing, trời nhiều mây
  ballInHole: '1587174486073-ae5e5cff23aa', // bóng cạnh lỗ, nắng xiên
  courseWater: '1592937238247-cd0090e02f65', // sân có hồ nước
  aerialGreen: '1605144884374-ecbb643615f6', // nhìn từ trên xuống, green và bunker
  coastalCourse: '1592919505780-303950717480', // sân ven biển
  ballOnTee: '1562204320-31975a5e09ce', // bóng trên tee, cận cảnh
  courseAutumn: '1709525616662-8d9f9a995ceb', // sân mùa thu
  swingBlueSky: '1611374243147-44a702c2d44c', // cú swing trời xanh
  putterMacro: '1532508583690-538a1436f423', // gậy putter và bóng, cận cảnh
  swingFairway: '1591491640784-3232eb748d4b', // cú swing trên fairway
  mountainGreen: '1623567341691-1f47b5cf949e', // green và dãy núi
  aerialArt: '1500932334442-8761ee4810a7', // ảnh trên cao nghệ thuật
  fairwayWide: '1602144483643-d6f4ea4ddef8', // fairway rộng
  greenTrees: '1566156814675-adc10b8a8dd8', // green và hàng cây

  // Sân tập (driving range)
  rangeMan: '1670254626993-aa642e1d1736', // nam tập tại bay
  rangeWoman: '1571158096385-a56767c1f57c', // nữ tập tại bay
  rangeGirl: '1670254836361-17267c781d61', // bé gái tại bay
  rangeGroup: '1670254494696-909c4e429575', // nhóm người tại khu tập
  rangeWide: '1668131128182-ed938cf2c514', // toàn cảnh khu tập
  rangeMountain: '1783530558756-1d0709dee1c9', // khu tập nhìn ra núi
  rangeMat: '1604049878718-f2ed3f597dbe', // bóng trên thảm tập
  ballBucket: '1636260396783-8184ab57aed4', // xô bóng tập
  ballPyramid: '1609196276438-e9ee7a8f2d19', // tháp bóng tập
  ballBokeh: '1576220258822-153014832245', // bóng trên cỏ, xoá phông
  golfCarts: '1746631835166-dba10b6cea40', // xe golf và túi gậy

  // Không gian & F&B
  loungeInterior: '1756981168649-0e3c3c8a32f3', // lounge nội thất cao cấp
  bentoA: '1709111642708-8c1893dd2c66', // hộp bento
  bentoB: '1709111642691-ebc144470744', // hộp bento
  icedCoffee: '1755962270053-fbff71ce6f7f', // cà phê đá
  coldBrew: '1625395495909-f60a405584eb', // cold brew trong ly
  icedDrinks: '1771209942915-e69f0e51a67c', // các loại đồ uống đá
  teaGlass: '1671759545218-831c32bfe92d', // ly trà
  waterGlass: '1694718256173-add57556cb49', // ly nước đá
  smoothie: '1514053376103-51c19c5c8291', // sinh tố trái cây
  coffeeCup: '1629170564024-1ed6c5b9ce45', // ly cà phê mang đi
  saladBowl: '1512621776951-a57141f2eefd', // salad rau củ
  saladGreen: '1600335895229-6e75511892c8', // salad xanh tím
  saladCaesar: '1556386734-4227a180d19e', // salad caesar
  saladPlate: '1505253716362-afaea1d3d1af', // salad đĩa trắng
};

/** Tạo URL Unsplash với kích thước và khung cắt mong muốn. */
function url(key, w, h) {
  const id = PHOTOS[key];
  if (!id) throw new Error(`Khong tim thay anh: ${key}`);
  return `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&q=80&fm=jpg`;
}

/* ============================================================
   Bản đồ: file đích -> (ảnh nguồn, kích thước)
   ============================================================ */
const MAP = [];
const add = (file, key, w, h) => MAP.push({ file, key, w, h });

// --- Hero / banner lớn ---
add('hero-range', 'bunkerSunset', 1920, 1080);
add('hero-academy', 'swingDrama', 1600, 900);
add('hero-corporate', 'golfCarts', 1600, 900);
add('hero-tour', 'mountainGreen', 1600, 900);
add('hero-events', 'golferSunset', 1600, 900);
add('hero-membership', 'aerialGreen', 1600, 900);
add('hero-about', 'coastalCourse', 1600, 900);
add('hero-lounge', 'loungeInterior', 1600, 900);
add('hero-contact', 'courseWater', 1600, 900);
add('hero-auth', 'golferSunset', 1200, 1600);
add('og-default', 'bunkerSunset', 1200, 630);

// --- Khu vực tập luyện ---
add('facility-driving-range', 'rangeWide', 1200, 800);
add('facility-putting-green', 'ballFlagBlue', 1200, 800);
add('facility-short-game', 'rangeMat', 1200, 800);
add('facility-private-bay', 'rangeMan', 1200, 800);
add('facility-vip-area', 'rangeMountain', 1200, 800);
add('facility-lounge', 'loungeInterior', 1200, 800);
add('facility-academy', 'rangeWoman', 1200, 800);
add('facility-networking', 'rangeGroup', 1200, 800);

// --- Ảnh phụ trợ cho section trang chủ ---
add('service-culture', 'loungeInterior', 1200, 1500);
add('app-backdrop', 'rangeWide', 1200, 900);
add('testimonial-bg', 'aerialArt', 1600, 900);

// --- Gói trải nghiệm: 12 gói × 3 ảnh gallery ---
const EXPERIENCE_SETS = {
  'lotus-discovery': ['rangeWoman', 'rangeMat', 'ballBucket'],
  'first-swing': ['swingDrama', 'rangeMan', 'putterMacro'],
  'full-golf-experience': ['rangeWide', 'ballFlagBlue', 'loungeInterior'],
  'golf-3in1': ['swingFairway', 'ballInHole', 'rangeMat'],
  'junior-golf': ['rangeGirl', 'ballBucket', 'greenTrees'],
  'family-golf-day': ['rangeGroup', 'ballFlagBlue', 'courseAutumn'],
  'private-vip-golf': ['rangeMountain', 'loungeInterior', 'aerialGreen'],
  'golf-networking': ['rangeGroup', 'golfCarts', 'loungeInterior'],
  'weekend-golf': ['golferSunset', 'fairwayWide', 'ballBucket'],
  'putting-master': ['putterMacro', 'ballInHole', 'ballFlagBlue'],
  'short-game-lab': ['rangeMat', 'ballOnTee', 'ballPyramid'],
  'corporate-golf-day': ['golfCarts', 'rangeGroup', 'aerialGreen'],
};
for (const [slug, keys] of Object.entries(EXPERIENCE_SETS)) {
  keys.forEach((key, i) => add(`experience/${slug}-${i + 1}`, key, 1200, 800));
}

// --- Huấn luyện viên (ảnh hành động, khung dọc) ---
const COACH_KEYS = [
  'swingDrama', 'rangeWoman', 'putterMacro', 'rangeGirl',
  'swingBlueSky', 'rangeMan', 'swingFairway', 'rangeGroup',
  'rangeMat', 'rangeWide', 'golfCarts', 'ballOnTee',
];
COACH_KEYS.forEach((key, i) => add(`coaches/coach-${i + 1}`, key, 800, 1000));

// --- Sự kiện ---
const EVENT_KEYS = [
  'golferSunset', 'swingDrama', 'rangeGirl', 'rangeGroup',
  'golfCarts', 'rangeWoman', 'swingFairway', 'rangeMountain',
  'bunkerSunset', 'rangeWide', 'putterMacro', 'aerialGreen',
];
EVENT_KEYS.forEach((key, i) => add(`events/event-${i + 1}`, key, 1200, 675));

// --- F&B ---
const FNB_KEYS = [
  'coffeeCup', 'icedCoffee', 'coldBrew', 'icedDrinks',
  'teaGlass', 'smoothie', 'waterGlass', 'icedDrinks',
  'saladPlate', 'bentoA', 'bentoB', 'bentoA',
  'saladGreen', 'saladBowl',
];
FNB_KEYS.forEach((key, i) => add(`food/item-${i + 1}`, key, 800, 800));

// --- Golf Tour ---
const TOUR_KEYS = [
  'courseWater', 'golferSunset', 'bentoA', 'loungeInterior',
  'coastalCourse', 'golfCarts', 'mountainGreen',
];
TOUR_KEYS.forEach((key, i) => add(`tours/tour-${i + 1}`, key, 1200, 800));

// --- Doanh nghiệp ---
const CORPORATE_KEYS = [
  'golfCarts', 'rangeGroup', 'rangeWide', 'loungeInterior',
  'aerialGreen', 'swingFairway', 'rangeGirl', 'rangeWoman',
];
CORPORATE_KEYS.forEach((key, i) => add(`corporate/pkg-${i + 1}`, key, 1200, 800));

// --- Hội viên ---
add('membership/starter', 'greenTrees', 1000, 600);
add('membership/member', 'fairwayWide', 1000, 600);
add('membership/premium', 'aerialGreen', 1000, 600);
add('membership/founder', 'bunkerSunset', 1000, 600);

// --- Voucher ---
const VOUCHER_MAP = {
  'new-member': 'rangeWoman',
  'flash-sale': 'ballInHole',
  'off-peak': 'golferSunset',
  'coach-package': 'swingDrama',
  fnb: 'icedDrinks',
  event: 'golfCarts',
  corporate: 'rangeGroup',
  gift: 'ballBucket',
};
for (const [name, key] of Object.entries(VOUCHER_MAP)) {
  add(`vouchers/${name}`, key, 900, 500);
}

// --- Academy: 12 chương trình ---
const ACADEMY_KEYS = [
  'rangeWoman', 'rangeGirl', 'rangeMan', 'rangeGroup',
  'swingDrama', 'rangeWide', 'putterMacro', 'rangeMat',
  'swingBlueSky', 'ballFlagBlue', 'swingFairway', 'ballPyramid',
];
ACADEMY_KEYS.forEach((key, i) => add(`academy/program-${i + 1}`, key, 1000, 700));

/* ============================================================
   Tải và ghi file
   ============================================================ */
async function download(entry, attempt = 1) {
  const target = path.join(OUT, `${entry.file}.jpg`);
  try {
    const res = await fetch(url(entry.key, entry.w, entry.h));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    // Chuẩn hoá lại kích thước và nén để dung lượng đồng đều
    await sharp(buf)
      .resize(entry.w, entry.h, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toFile(target);
    return true;
  } catch (err) {
    if (attempt < 3) {
      await new Promise((r) => setTimeout(r, 700 * attempt));
      return download(entry, attempt + 1);
    }
    console.error(`✗ ${entry.file}: ${err.message}`);
    return false;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const sub of ['experience', 'coaches', 'events', 'food', 'tours', 'corporate', 'membership', 'vouchers', 'academy']) {
    await mkdir(path.join(OUT, sub), { recursive: true });
  }

  let done = 0;
  let failed = 0;
  const BATCH = 6; // tải song song vừa phải để không bị chặn

  for (let i = 0; i < MAP.length; i += BATCH) {
    const chunk = MAP.slice(i, i + BATCH);
    const results = await Promise.all(chunk.map((entry) => download(entry)));
    results.forEach((ok) => (ok ? done++ : failed++));
    process.stdout.write(`\r  đã tải ${done}/${MAP.length}`);
  }

  process.stdout.write('\n');
  console.log(failed === 0 ? `✔ Hoàn tất ${done} ảnh thật` : `⚠ ${done} thành công, ${failed} lỗi`);
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
