import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Адрес сайта читается из окружения в рантайме, поэтому файл нельзя
// кешировать на этапе сборки — иначе в robots.txt попадёт localhost.
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Закрываем только то, что не должно попадать даже в обход:
        // админку и служебные ручки. Корзина и оформление заказа
        // закрыты метатегом noindex — так краулер видит запрет и
        // при этом проходит по ссылкам на каталог.
        disallow: ["/admin", "/api/"],
      },
    ],
    // Директива Host устарела — Яндекс определяет главное зеркало
    // по редиректам и canonical, поэтому в файле её нет.
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
