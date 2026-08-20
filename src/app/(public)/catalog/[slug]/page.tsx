import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FileText, Phone, Truck } from "lucide-react";
import { ProductGallery } from "@/components/site/product-gallery";
import { AddToCartForm } from "@/components/site/add-to-cart-form";
import {
  ProductList,
  toProductCardData,
} from "@/components/site/product-list";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { graph, productSchema } from "@/lib/schema";
import { OG_IMAGE, truncate } from "@/lib/seo";
import { formatPrice } from "@/lib/format";
import { SITE_TITLE, siteConfig } from "@/lib/site-config";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const prices = product.variants.map((variant) => variant.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : product.basePrice;

  // Описание собираем сами: текст админа обрезаем и дописываем цену и город —
  // именно по ним посетитель выбирает результат в выдаче. Обрезаем до склейки,
  // иначе у товаров с длинным описанием цена не влезала бы в сниппет.
  const description =
    `${truncate(product.description, 130)} Цена от ${formatPrice(minPrice)}. ` +
    `${siteConfig.city} — изготовление и продажа, отправка транспортными компаниями.`;
  const title = `${product.name} — купить в ${siteConfig.cityLocative}`;
  const url = `/catalog/${product.slug}`;

  // openGraph перекрывает родительский объект целиком, поэтому у товара без
  // фото нужно явно подставить общую картинку — иначе превью ссылки будет пустым.
  const image = product.images[0]
    ? { url: product.images[0].url, alt: product.name }
    : { ...OG_IMAGE, alt: SITE_TITLE };

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.id);

  return (
    <div className="container-page py-10 sm:py-14 xl:py-16">
      <JsonLd data={graph(productSchema(product))} />

      <Breadcrumbs
        items={[{ name: "Каталог", href: "/catalog" }, { name: product.name }]}
      />

      <div className="grid gap-10 sm:grid-cols-2 xl:gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
            {product.name}
          </h1>
          <p className="mt-3 whitespace-pre-line text-muted-foreground xl:mt-4 xl:text-lg">
            {product.description}
          </p>

          <div className="mt-6">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              basePrice={product.basePrice}
              imageUrl={product.images[0]?.url ?? null}
              variants={product.variants.map((v) => ({
                id: v.id,
                name: v.name,
                price: v.price,
              }))}
            />
          </div>

          {/* Сертификат и паспорт изделия оформлены на кровельные ограждения,
              поэтому в общих буллетах формулировка привязана к ним, а не ко
              всему каталогу. */}
          <ul className="mt-8 flex flex-col gap-3 border-t pt-6 text-sm text-muted-foreground xl:text-base">
            <li className="flex items-start gap-2.5">
              <Truck className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Отгрузка с производства в {siteConfig.regionLocative}:
                самовывоз или отправка транспортной компанией по
                договорённости — своей доставки у нас нет.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <FileText className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Документы на кровельные ограждения — сертификат соответствия,
                протокол испытаний и паспорт изделия — лежат в разделе{" "}
                <Link href="/documents" className="text-primary hover:underline">
                  «Документы и сертификаты»
                </Link>
                , копии передаём при отгрузке.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>
                Не уверены в выборе? Позвоните{" "}
                <a
                  href={siteConfig.phoneHref}
                  className="text-primary hover:underline"
                >
                  {siteConfig.phone}
                </a>{" "}
                — поможем подобрать исполнение и посчитать количество.
              </span>
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-14 max-w-3xl xl:mt-16">
        <h2 className="text-xl font-semibold tracking-tight xl:text-2xl">
          Оплата, отправка и документы
        </h2>
        <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground xl:text-base">
          <p>
            Оплата на сайте не требуется: вы оставляете заявку, менеджер
            перезванивает, подтверждает наличие и комплектацию, после чего
            согласовывает оплату и способ получения. Продавец —{" "}
            {siteConfig.legalName}, ИНН {siteConfig.inn}.
          </p>
          <p>
            Своей доставки у нас нет: заказ можно забрать самовывозом с
            производства или отправить транспортной компанией — сроки и
            стоимость перевозки зависят от компании и направления и
            согласуются отдельно.
          </p>
          <p>
            К партии кровельных ограждений прилагается паспорт изделия с
            техническими характеристиками, требованиями к монтажу, хранению и
            транспортировке, а также копии сертификата соответствия и протокола
            испытаний. Скачать их можно заранее в разделе{" "}
            <Link href="/documents" className="text-primary hover:underline">
              <FileText className="inline size-3.5 align-[-0.15em]" /> Документы
              и сертификаты
            </Link>
            .
          </p>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-14 xl:mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 xl:mb-8">
            <h2 className="text-xl font-semibold tracking-tight xl:text-2xl">
              Смотрите также
            </h2>
            <Link
              href="/catalog"
              className="text-sm font-medium text-primary hover:underline xl:text-base"
            >
              Весь каталог
            </Link>
          </div>
          <ProductList products={related.map(toProductCardData)} />
        </section>
      )}
    </div>
  );
}
