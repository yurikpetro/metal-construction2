/**
 * Генерация растровых брендовых изображений из векторного исходника.
 *
 *   node scripts/generate-brand-images.mjs
 *
 * Что создаётся:
 *   public/og-image.png      1200×630  — картинка для Open Graph / Twitter Card
 *                                        (превью ссылки в соцсетях и мессенджерах)
 *   public/icon-192.png      192×192   — иконка для manifest.webmanifest
 *   public/icon-512.png      512×512   — иконка для manifest + logo в JSON-LD
 *   src/app/apple-icon.png   180×180   — иконка для «на экран Домой» в iOS
 *   src/app/favicon.ico      16/32/48  — фавиконка (её ищут поисковики для выдачи)
 *
 * Скрипт запускается вручную и НЕ входит в сборку: результат коммитится в репозиторий,
 * чтобы в Docker-образе не требовались системные шрифты для растеризации текста.
 * Перезапускать нужно, только если поменялся логотип или текст на OG-картинке.
 *
 * Зависимость sharp приходит вместе с Next.js (оптимизация изображений),
 * отдельная установка не нужна.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();

const BRAND = "#8C431F";
const INK = "#14110f";
const FONT = "Segoe UI, Tahoma, Arial, Helvetica, sans-serif";

/** Знак из src/app/icon.svg в системе координат 32×32 (без фоновой плашки). */
const MARK_STROKES = `
  <g fill="none" stroke="#ffffff" stroke-linecap="round">
    <g stroke-width="2.6">
      <path d="M3.5 5.9 L28.5 7.7"/>
      <path d="M3.5 14 L28.5 15.8"/>
      <path d="M10 6.4 L10 24.9"/>
      <path d="M21 7.2 L21 25.65"/>
    </g>
    <g stroke-width="2">
      <path d="M10 18 L15.8 25.3"/>
      <path d="M21 18.8 L26.8 26"/>
      <path d="M2.5 24.4 L29.5 26.2"/>
    </g>
  </g>
`;

/** Квадратная иконка: плашка бренда + знак. */
function iconSvg(size, cornerRadius) {
  const scale = size / 32;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${cornerRadius}" fill="${BRAND}"/>
  <g transform="scale(${scale})">${MARK_STROKES}</g>
</svg>`;
}

/**
 * Картинка для превью ссылки. Текст растеризуется системным шрифтом,
 * поэтому в PNG уже нет зависимости от шрифтов — важно для Docker.
 */
function ogImageSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${INK}"/>
  <rect width="14" height="630" fill="${BRAND}"/>

  <g transform="translate(80 58)">
    <rect width="84" height="84" rx="19" fill="${BRAND}"/>
    <g transform="scale(2.625)">${MARK_STROKES}</g>
  </g>

  <text x="188" y="110" font-family="${FONT}" font-size="24" font-weight="600"
        letter-spacing="4" fill="#D08C60">ЭЛЕМЕНТЫ БЕЗОПАСНОСТИ КРОВЛИ</text>

  <text x="80" y="290" font-family="${FONT}" font-size="78" font-weight="700"
        fill="#ffffff">Кровельные ограждения</text>
  <text x="80" y="384" font-family="${FONT}" font-size="78" font-weight="700"
        fill="#ffffff">и снегозадержатели</text>

  <text x="80" y="456" font-family="${FONT}" font-size="30" fill="#A8A29E">Кровельные мостики · лестницы · изготовление и продажа</text>

  <line x1="80" y1="522" x2="1120" y2="522" stroke="#332c28" stroke-width="2"/>

  <text x="80" y="578" font-family="${FONT}" font-size="28" fill="#D6D3D1">Ставрополь · доставка по России</text>
  <text x="1120" y="578" font-family="${FONT}" font-size="28" fill="#A8A29E"
        text-anchor="end">Сертифицированная продукция</text>
</svg>`;
}

/**
 * Один кадр .ico в классическом BMP-виде: BITMAPINFOHEADER, пиксели BGRA
 * снизу вверх и пустая AND-маска.
 *
 * PNG внутри ICO понимают браузеры, но не любой парсер поисковых роботов,
 * а фавиконку для выдачи забирает отдельный робот со своим кодом разбора.
 * BMP-кадры читают все, поэтому платим лишними килобайтами за совместимость.
 */
function bmpIcoFrame(rgba, size) {
  // XOR-слой: сама картинка, строки идут снизу вверх, каналы в порядке BGRA
  const xor = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    const src = (size - 1 - y) * size * 4;
    const dst = y * size * 4;
    for (let x = 0; x < size; x++) {
      const s = src + x * 4;
      const d = dst + x * 4;
      xor[d] = rgba[s + 2];
      xor[d + 1] = rgba[s + 1];
      xor[d + 2] = rgba[s];
      xor[d + 3] = rgba[s + 3];
    }
  }

  // AND-маска обязательна даже для 32-битных иконок. Нули = пиксель непрозрачный,
  // прозрачность берётся из альфа-канала. Строки выравниваются по 4 байта.
  const maskStride = Math.ceil(size / 32) * 4;
  const and = Buffer.alloc(maskStride * size);

  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0); // размер заголовка
  header.writeInt32LE(size, 4); // ширина
  header.writeInt32LE(size * 2, 8); // высота: XOR-слой + AND-маска
  header.writeUInt16LE(1, 12); // color planes
  header.writeUInt16LE(32, 14); // бит на пиксель
  header.writeUInt32LE(0, 16); // без сжатия (BI_RGB)
  header.writeUInt32LE(xor.length + and.length, 20); // размер данных

  return Buffer.concat([header, xor, and]);
}

/** Собирает .ico из нескольких кадров разного размера. */
function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // тип: 1 — иконка
  header.writeUInt16LE(frames.length, 4); // количество изображений

  const entries = [];
  let offset = header.length + frames.length * 16;

  for (const { size, data } of frames) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0); // ширина (0 означает 256)
    entry.writeUInt8(size === 256 ? 0 : size, 1); // высота
    entry.writeUInt8(0, 2); // палитра не используется
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // бит на пиксель
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(entry);
  }

  return Buffer.concat([header, ...entries, ...frames.map((f) => f.data)]);
}

async function renderPng(svg, relativePath) {
  const target = path.join(ROOT, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(target, png);
  console.log(`${relativePath} — ${(png.length / 1024).toFixed(1)} КБ`);
  return png;
}

await renderPng(ogImageSvg(), "public/og-image.png");
await renderPng(iconSvg(192, 42), "public/icon-192.png");
await renderPng(iconSvg(512, 112), "public/icon-512.png");
// Для iOS без скруглений — систему устраивает квадрат, маску она наложит сама.
await renderPng(iconSvg(180, 0), "src/app/apple-icon.png");

// Несколько размеров в одном файле: 16 — вкладка браузера, 32 — закладки и
// выдача, 48 — ярлыки и ретина. Робот выбирает подходящий сам.
const faviconFrames = [];
for (const size of [16, 32, 48]) {
  const rgba = await sharp(Buffer.from(iconSvg(size, Math.round((size * 7) / 32))))
    .ensureAlpha()
    .raw()
    .toBuffer();
  faviconFrames.push({ size, data: bmpIcoFrame(rgba, size) });
}
const favicon = buildIco(faviconFrames);
await writeFile(path.join(ROOT, "src/app/favicon.ico"), favicon);
console.log(
  `src/app/favicon.ico — ${(favicon.length / 1024).toFixed(1)} КБ (${faviconFrames
    .map((f) => `${f.size}×${f.size}`)
    .join(", ")})`,
);
