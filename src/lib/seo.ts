/**
 * Базовые SEO-утилиты: канонический адрес сайта и построение абсолютных ссылок.
 *
 * Про адрес сайта важно помнить: переменные с префиксом NEXT_PUBLIC_ Next.js
 * подставляет в код на этапе `next build`, а не читает в рантайме. Поэтому
 * NEXT_PUBLIC_SITE_URL передаётся в Docker-сборку build-аргументом (см. Dockerfile),
 * а обычная переменная SITE_URL читается сервером в рантайме и страхует
 * robots.txt и sitemap.xml от адреса localhost.
 *
 * Статические страницы (/contacts, /documents, /privacy, 404) получают canonical
 * на этапе сборки, поэтому при смене домена образ нужно пересобрать.
 */

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim().replace(/\/+$/, "");
  return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
}

export const SITE_URL = normalizeUrl(
  process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000",
);

/** Абсолютная ссылка от корня сайта: absoluteUrl("/catalog") → https://site.ru/catalog */
export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Обрезает текст до длины, комфортной для сниппета в выдаче
 * (Google показывает ~160 символов, Яндекс — до ~250), не разрывая слово.
 */
export function truncate(text: string, max = 180): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:—-]+$/, "")}…`;
}

/** Дефолтная картинка для Open Graph / Twitter (1200×630, см. scripts/generate-brand-images.mjs). */
export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
} as const;

/** Коды подтверждения прав в Search Console / Яндекс.Вебмастере (если заданы). */
export const verificationCodes = {
  google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  yandex: process.env.YANDEX_VERIFICATION || undefined,
};
