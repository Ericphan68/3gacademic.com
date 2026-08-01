import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Bắt lỗi link chết ngay khi typecheck/build.
  typedRoutes: false,
  compress: true,
  images: {
    // Ảnh demo hiện là asset tĩnh trong /public/images (sinh bằng scripts/generate-images.mjs).
    // Khi thay bằng ảnh thật từ CDN, chỉ cần bổ sung host vào remotePatterns bên dưới.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.lotusgolf.vn' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920],
    qualities: [60, 75, 90],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
    ];
  },
};

export default nextConfig;
