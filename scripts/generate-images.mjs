/**
 * Sinh bộ ảnh demo (JPEG) cho Lotus Golf Center.
 *
 * Vì sao không dùng ảnh remote (Unsplash…) mặc định:
 *  - Ảnh remote có thể đổi/biến mất -> website demo bị vỡ layout, hỏng link.
 *  - Ảnh local giúp build & chạy offline, LCP ổn định, không phụ thuộc mạng.
 *
 * Khi có ảnh thật: thay file trong /public/images/<key>.jpg (giữ nguyên tên)
 * hoặc trỏ `MEDIA` trong src/constants/media.ts sang URL CDN.
 *
 * Chạy: npm run generate:images
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public', 'images');

/** Bảng màu thương hiệu */
const P = {
  navy: '#0E2A3E',
  navyDeep: '#081C2A',
  green: '#2F6B4F',
  greenLight: '#4E9271',
  gold: '#C9A227',
  goldSoft: '#DCC188',
  ivory: '#F7F4EC',
  stone: '#8A9199',
  sky: '#BFD8E6',
};

/** Tạo scene SVG kiểu "sân golf" tối giản, có chiều sâu. */
function scene({ w, h, mood, seed }) {
  const rnd = mulberry(seed);
  const M = MOODS[mood];
  const horizon = Math.round(h * (0.46 + rnd() * 0.08));

  const trees = Array.from({ length: 16 }, (_, i) => {
    const x = (i / 15) * w + (rnd() - 0.5) * 40;
    const th = 26 + rnd() * 46;
    const tw = th * (0.5 + rnd() * 0.25);
    return `<ellipse cx="${x.toFixed(1)}" cy="${(horizon - th * 0.35).toFixed(1)}" rx="${tw.toFixed(1)}" ry="${th.toFixed(1)}" fill="${M.tree}" opacity="${(0.5 + rnd() * 0.35).toFixed(2)}"/>`;
  }).join('');

  const flagX = Math.round(w * (0.62 + rnd() * 0.16));
  const flagY = Math.round(horizon + (h - horizon) * 0.3);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${M.skyTop}"/>
      <stop offset="100%" stop-color="${M.skyBottom}"/>
    </linearGradient>
    <linearGradient id="turf" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${M.turfTop}"/>
      <stop offset="100%" stop-color="${M.turfBottom}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${M.sunX}" cy="${M.sunY}" r="0.55">
      <stop offset="0%" stop-color="${M.glow}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${M.glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000" stop-opacity="0.22"/>
      <stop offset="45%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.30"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="${(w * 0.02).toFixed(1)}"/>
    </filter>
    <filter id="haze" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="${(w * 0.004).toFixed(2)}"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>

  <rect width="${w}" height="${h}" fill="url(#sky)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>

  <!-- dải mây mềm -->
  <g opacity="0.55" filter="url(#soft)">
    <ellipse cx="${w * 0.2}" cy="${horizon * 0.42}" rx="${w * 0.28}" ry="${h * 0.05}" fill="#ffffff" opacity="0.34"/>
    <ellipse cx="${w * 0.72}" cy="${horizon * 0.28}" rx="${w * 0.24}" ry="${h * 0.04}" fill="#ffffff" opacity="0.26"/>
    <ellipse cx="${w * 0.45}" cy="${horizon * 0.6}" rx="${w * 0.3}" ry="${h * 0.03}" fill="#ffffff" opacity="0.16"/>
  </g>

  <!-- hàng cây xa -->
  <g filter="url(#haze)">${trees}</g>

  <!-- thảm cỏ -->
  <rect x="0" y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#turf)"/>

  <!-- các dải fairway -->
  <path d="M0 ${horizon + (h - horizon) * 0.18} Q ${w * 0.5} ${horizon + (h - horizon) * 0.05} ${w} ${horizon + (h - horizon) * 0.2} L ${w} ${horizon + (h - horizon) * 0.34} Q ${w * 0.5} ${horizon + (h - horizon) * 0.2} 0 ${horizon + (h - horizon) * 0.32} Z"
    fill="#ffffff" opacity="0.05"/>
  <path d="M0 ${horizon + (h - horizon) * 0.6} Q ${w * 0.45} ${horizon + (h - horizon) * 0.46} ${w} ${horizon + (h - horizon) * 0.64} L ${w} ${h} L 0 ${h} Z"
    fill="${M.turfShade}" opacity="0.55"/>

  <!-- bunker cát -->
  <ellipse cx="${w * 0.22}" cy="${horizon + (h - horizon) * 0.5}" rx="${w * 0.14}" ry="${(h - horizon) * 0.1}" fill="${P.goldSoft}" opacity="0.5"/>

  <!-- cột cờ -->
  <g opacity="${M.flag}">
    <rect x="${flagX}" y="${flagY - 70}" width="2.5" height="70" fill="${P.ivory}" opacity="0.9"/>
    <path d="M${flagX + 2.5} ${flagY - 70} L${flagX + 34} ${flagY - 60} L${flagX + 2.5} ${flagY - 50} Z" fill="${P.gold}"/>
    <ellipse cx="${flagX + 1}" cy="${flagY + 2}" rx="12" ry="4" fill="#000" opacity="0.18"/>
  </g>

  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.05"/>
</svg>`;
}

const MOODS = {
  dawn: {
    skyTop: '#12324A', skyBottom: '#D8B98A', turfTop: '#37714F', turfBottom: '#1F4B36',
    turfShade: '#123526', tree: '#123A2C', glow: '#F0C88A', sunX: '0.72', sunY: '0.42', flag: 1,
  },
  day: {
    skyTop: '#7FB3D5', skyBottom: '#DCEAF2', turfTop: '#4E9271', turfBottom: '#2F6B4F',
    turfShade: '#22553E', tree: '#1D4B37', glow: '#FFFFFF', sunX: '0.5', sunY: '0.2', flag: 1,
  },
  dusk: {
    skyTop: '#0E2A3E', skyBottom: '#7C6A76', turfTop: '#2A5C43', turfBottom: '#15382A',
    turfShade: '#0D2A1F', tree: '#0C2A20', glow: '#C9A227', sunX: '0.3', sunY: '0.5', flag: 1,
  },
  night: {
    skyTop: '#050F18', skyBottom: '#12344B', turfTop: '#1B4634', turfBottom: '#0C2418',
    turfShade: '#081A11', tree: '#08201A', glow: '#5E8FA8', sunX: '0.6', sunY: '0.3', flag: 1,
  },
  studio: {
    skyTop: '#0E2A3E', skyBottom: '#1B4058', turfTop: '#22553E', turfBottom: '#13342600',
    turfShade: '#102D21', tree: '#14382A', glow: '#C9A227', sunX: '0.5', sunY: '0.35', flag: 0,
  },
  ivory: {
    skyTop: '#F7F4EC', skyBottom: '#E4E0D3', turfTop: '#8FA893', turfBottom: '#6F8C79',
    turfShade: '#5E7B69', tree: '#7E9A85', glow: '#FFFFFF', sunX: '0.5', sunY: '0.25', flag: 0,
  },
};

/** Chân dung trừu tượng cho HLV (không dùng ảnh người thật). */
function portrait({ w, h, seed, tone }) {
  const rnd = mulberry(seed);
  const bg = ['#0E2A3E', '#1B4058', '#22553E', '#2F6B4F', '#3A4A55', '#4A3F35'][tone % 6];
  const accent = ['#C9A227', '#DCC188', '#4E9271', '#BFD8E6'][Math.floor(rnd() * 4)];
  const cx = w / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#081C2A"/>
    </linearGradient>
    <radialGradient id="rim" cx="0.5" cy="0.3" r="0.6">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#rim)"/>
  <circle cx="${cx}" cy="${h * 0.36}" r="${w * 0.19}" fill="#0000" stroke="${accent}" stroke-width="1.5" opacity="0.5"/>
  <circle cx="${cx}" cy="${h * 0.36}" r="${w * 0.155}" fill="${P.ivory}" opacity="0.14"/>
  <path d="M${cx - w * 0.3} ${h} Q${cx} ${h * 0.56} ${cx + w * 0.3} ${h} Z" fill="${P.ivory}" opacity="0.12"/>
  <path d="M${cx - w * 0.22} ${h} Q${cx} ${h * 0.66} ${cx + w * 0.22} ${h} Z" fill="${accent}" opacity="0.16"/>
  <circle cx="${w * 0.82}" cy="${h * 0.16}" r="${w * 0.035}" fill="${accent}" opacity="0.5"/>
</svg>`;
}

/** Ảnh món F&B / voucher: bố cục hình học tinh giản. */
function abstract({ w, h, seed, hue }) {
  const rnd = mulberry(seed);
  const sets = [
    ['#0E2A3E', '#1B4058', '#C9A227'],
    ['#2F6B4F', '#4E9271', '#DCC188'],
    ['#F7F4EC', '#E4E0D3', '#2F6B4F'],
    ['#3A4A55', '#5A6B76', '#C9A227'],
    ['#4A3F35', '#6B5B47', '#DCC188'],
  ];
  const [a, b, c] = sets[hue % sets.length];
  const r = () => (rnd() * 100).toFixed(1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 100 ${((h / w) * 100).toFixed(1)}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${a}"/><stop offset="100%" stop-color="${b}"/>
  </linearGradient></defs>
  <rect width="100" height="${((h / w) * 100).toFixed(1)}" fill="url(#g)"/>
  <circle cx="${r()}" cy="${r()}" r="${18 + rnd() * 16}" fill="${c}" opacity="0.22"/>
  <circle cx="${r()}" cy="${r()}" r="${10 + rnd() * 14}" fill="${c}" opacity="0.16"/>
  <rect x="${r()}" y="${r()}" width="${20 + rnd() * 25}" height="${8 + rnd() * 10}" rx="3" fill="#fff" opacity="0.10"/>
  <circle cx="50" cy="${((h / w) * 50).toFixed(1)}" r="14" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.55"/>
</svg>`;
}

function mulberry(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Danh sách ảnh cần sinh: [key, generator, width, height] */
const JOBS = [
  // Hero & bối cảnh lớn
  ['hero-range', () => scene({ w: 1920, h: 1080, mood: 'dusk', seed: 11 })],
  ['hero-academy', () => scene({ w: 1600, h: 900, mood: 'day', seed: 21 })],
  ['hero-corporate', () => scene({ w: 1600, h: 900, mood: 'dawn', seed: 31 })],
  ['hero-tour', () => scene({ w: 1600, h: 900, mood: 'day', seed: 41 })],
  ['hero-events', () => scene({ w: 1600, h: 900, mood: 'night', seed: 51 })],
  ['hero-membership', () => scene({ w: 1600, h: 900, mood: 'dusk', seed: 61 })],
  ['hero-about', () => scene({ w: 1600, h: 900, mood: 'dawn', seed: 71 })],
  ['hero-lounge', () => scene({ w: 1600, h: 900, mood: 'ivory', seed: 81 })],
  ['hero-contact', () => scene({ w: 1600, h: 900, mood: 'day', seed: 91 })],
  ['hero-auth', () => scene({ w: 1200, h: 1600, mood: 'dusk', seed: 101 })],

  // Cơ sở vật chất
  ['facility-driving-range', () => scene({ w: 1200, h: 800, mood: 'day', seed: 111 })],
  ['facility-putting-green', () => scene({ w: 1200, h: 800, mood: 'dawn', seed: 121 })],
  ['facility-short-game', () => scene({ w: 1200, h: 800, mood: 'day', seed: 131 })],
  ['facility-private-bay', () => scene({ w: 1200, h: 800, mood: 'studio', seed: 141 })],
  ['facility-vip-area', () => scene({ w: 1200, h: 800, mood: 'dusk', seed: 151 })],
  ['facility-lounge', () => scene({ w: 1200, h: 800, mood: 'ivory', seed: 161 })],
  ['facility-academy', () => scene({ w: 1200, h: 800, mood: 'studio', seed: 171 })],
  ['facility-networking', () => scene({ w: 1200, h: 800, mood: 'night', seed: 181 })],
];

// Gói trải nghiệm (12) — mỗi gói 3 ảnh gallery
const EXPERIENCE_KEYS = [
  'lotus-discovery', 'first-swing', 'full-golf-experience', 'golf-3in1',
  'junior-golf', 'family-golf-day', 'private-vip-golf', 'golf-networking',
  'weekend-golf', 'putting-master', 'short-game-lab', 'corporate-golf-day',
];
EXPERIENCE_KEYS.forEach((key, i) => {
  const moods = ['day', 'dawn', 'dusk', 'studio', 'ivory', 'night'];
  for (let g = 0; g < 3; g++) {
    JOBS.push([
      `experience/${key}-${g + 1}`,
      () => scene({ w: 1200, h: 800, mood: moods[(i + g) % moods.length], seed: 200 + i * 7 + g }),
    ]);
  }
});

// HLV (12)
for (let i = 1; i <= 12; i++) {
  JOBS.push([`coaches/coach-${i}`, () => portrait({ w: 800, h: 1000, seed: 400 + i * 13, tone: i })]);
}

// Sự kiện (12)
for (let i = 1; i <= 12; i++) {
  const moods = ['night', 'dusk', 'day', 'dawn'];
  JOBS.push([`events/event-${i}`, () => scene({ w: 1200, h: 675, mood: moods[i % 4], seed: 600 + i * 17 })]);
}

// F&B (14)
for (let i = 1; i <= 14; i++) {
  JOBS.push([`food/item-${i}`, () => abstract({ w: 800, h: 800, seed: 800 + i * 19, hue: i })]);
}

// Golf Tour (7)
for (let i = 1; i <= 7; i++) {
  const moods = ['day', 'dawn', 'dusk', 'ivory'];
  JOBS.push([`tours/tour-${i}`, () => scene({ w: 1200, h: 800, mood: moods[i % 4], seed: 1000 + i * 23 })]);
}

// Corporate (8)
for (let i = 1; i <= 8; i++) {
  JOBS.push([`corporate/pkg-${i}`, () => scene({ w: 1200, h: 800, mood: i % 2 ? 'dawn' : 'studio', seed: 1200 + i * 29 })]);
}

// Membership (4)
['starter', 'member', 'premium', 'founder'].forEach((k, i) => {
  JOBS.push([`membership/${k}`, () => abstract({ w: 1000, h: 600, seed: 1400 + i * 31, hue: i })]);
});

// Academy — 12 chương trình đào tạo
for (let i = 1; i <= 12; i++) {
  const moods = ['studio', 'day', 'dawn', 'ivory', 'dusk'];
  JOBS.push([
    `academy/program-${i}`,
    () => scene({ w: 1000, h: 700, mood: moods[i % moods.length], seed: 1500 + i * 41 }),
  ]);
}

// Ảnh phụ trợ cho các section trang chủ
JOBS.push(['service-culture', () => scene({ w: 1200, h: 1500, mood: 'ivory', seed: 1700 })]);
JOBS.push(['app-backdrop', () => scene({ w: 1200, h: 900, mood: 'night', seed: 1710 })]);
JOBS.push(['testimonial-bg', () => scene({ w: 1600, h: 900, mood: 'dusk', seed: 1720 })]);

// Voucher (8 nhóm)
['new-member', 'flash-sale', 'off-peak', 'coach-package', 'fnb', 'event', 'corporate', 'gift'].forEach((k, i) => {
  JOBS.push([`vouchers/${k}`, () => abstract({ w: 900, h: 500, seed: 1600 + i * 37, hue: i + 1 })]);
});

// OG image mặc định
JOBS.push(['og-default', () => scene({ w: 1200, h: 630, mood: 'dusk', seed: 1800 })]);

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const sub of ['experience', 'coaches', 'events', 'food', 'tours', 'corporate', 'membership', 'vouchers', 'academy']) {
    await mkdir(path.join(OUT, sub), { recursive: true });
  }

  let n = 0;
  for (const [key, make] of JOBS) {
    const svg = make();
    const file = path.join(OUT, `${key}.jpg`);
    await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(file);
    n++;
  }

  // Logo SVG (dùng trực tiếp, không qua next/image)
  await writeFile(
    path.join(process.cwd(), 'public', 'lotus-mark.svg'),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">
  <path d="M24 6c3.6 4.4 5.4 8.8 5.4 13.2 0 4.4-1.8 8.8-5.4 13.2-3.6-4.4-5.4-8.8-5.4-13.2C18.6 14.8 20.4 10.4 24 6Z" fill="currentColor" opacity=".95"/>
  <path d="M10.2 14.4c5 1.4 8.6 3.9 10.8 7.4 2.2 3.5 2.9 7.9 2 13.1-5-1.4-8.6-3.9-10.8-7.4-2.2-3.5-2.9-7.9-2-13.1Z" fill="currentColor" opacity=".65"/>
  <path d="M37.8 14.4c.9 5.2.2 9.6-2 13.1-2.2 3.5-5.8 6-10.8 7.4-.9-5.2-.2-9.6 2-13.1 2.2-3.5 5.8-6 10.8-7.4Z" fill="currentColor" opacity=".65"/>
  <path d="M8 33.6h32c-2.4 5.4-7.9 8.4-16 8.4S10.4 39 8 33.6Z" fill="currentColor" opacity=".35"/>
</svg>\n`,
    'utf8',
  );

  console.log(`✔ Đã sinh ${n} ảnh demo vào public/images`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
