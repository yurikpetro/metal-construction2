import { readFile, stat } from "node:fs/promises";
import path from "node:path";

/**
 * Раздача картинок, загруженных через админку.
 *
 * Next составляет список файлов каталога `public` при старте сервера, поэтому
 * фото, сохранённое уже после запуска контейнера, он отдаёт только после
 * перезапуска — до этого и прямой запрос, и оптимизатор `/_next/image`
 * (он ходит за исходником на этот же сервер) получают 404.
 *
 * Читаем файл с диска сами: адреса те же (`/uploads/products/<id>.png`),
 * менять сохранённые в базе ссылки не нужно.
 */

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

// Отдаём только те типы, которые принимает загрузчик (см. ALLOWED_MIME
// в src/lib/actions/products.ts) — чтобы через этот адрес нельзя было
// вытащить из каталога что-то постороннее.
const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // path.resolve схлопывает «..», поэтому проверяем, что итоговый путь
  // остался внутри каталога загрузок.
  const filePath = path.resolve(UPLOAD_ROOT, ...segments);
  if (!filePath.startsWith(UPLOAD_ROOT + path.sep)) return notFound();

  const contentType = MIME_BY_EXT[path.extname(filePath).toLowerCase()];
  if (!contentType) return notFound();

  try {
    const info = await stat(filePath);
    if (!info.isFile()) return notFound();

    const file = await readFile(filePath);
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(info.size),
        // Имя файла — UUID, содержимое по этому адресу уже не изменится
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return notFound();
  }
}
