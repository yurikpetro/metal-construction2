import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/products";
import { absoluteUrl, SITE_URL } from "@/lib/seo";

// Карта сайта строится по данным из БД и по адресу из окружения,
// поэтому кешировать её на этапе сборки нельзя.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts();

  // За дату обновления каталога берём самый свежий товар — так поисковик
  // видит, что раздел меняется, и переобходит его чаще.
  const lastProductUpdate = products.reduce<Date | undefined>(
    (latest, product) =>
      !latest || product.updatedAt > latest ? product.updatedAt : latest,
    undefined,
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      // Без слэша на конце — ровно так, как rel="canonical" на главной,
      // иначе поисковик увидит в карте сайта неканонический адрес
      url: SITE_URL,
      lastModified: lastProductUpdate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/catalog"),
      lastModified: lastProductUpdate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/documents"),
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/contacts"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Картинки товаров указываем отдельно — это image sitemap,
  // по нему фото попадают в Google Картинки и Яндекс.Картинки.
  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/catalog/${product.slug}`),
    lastModified: product.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
    ...(product.images.length > 0 && {
      images: product.images.map((image) => absoluteUrl(image.url)),
    }),
  }));

  return [...staticRoutes, ...productRoutes];
}
