import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, siteConfig } from "@/lib/site-config";

/**
 * Web App Manifest: описывает сайт для мобильных браузеров (иконка при
 * добавлении на домашний экран, цвета оболочки). Пути относительные —
 * файл кешируется на сборке, абсолютные адреса тут не нужны.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.city}`,
    short_name: siteConfig.name,
    description: SITE_DESCRIPTION,
    lang: "ru",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#8c431f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
