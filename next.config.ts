import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Заголовок X-Powered-By ничего не даёт и лишь сообщает версию стека
  poweredByHeader: false,
  images: {
    remotePatterns: [],
    // AVIF весит меньше WebP при том же качестве — это напрямую улучшает LCP,
    // а он входит в Core Web Vitals и учитывается при ранжировании.
    // Порядок важен: берётся первый формат, поддерживаемый браузером.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Брендовые растровые файлы не меняются — отдаём с длинным кешем,
        // чтобы не тратить на них время загрузки при переходах.
        source: "/:file(og-image.png|icon-192.png|icon-512.png)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
};

export default nextConfig;
