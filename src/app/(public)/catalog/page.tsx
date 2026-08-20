import type { Metadata } from "next";
import Link from "next/link";
import {
  ProductList,
  toProductCardData,
} from "@/components/site/product-list";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { getActiveProducts } from "@/lib/products";
import { graph, itemListSchema } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

const TITLE = "Каталог кровельных ограждений и костылей";
const DESCRIPTION =
  "Кровельные ограждения Н600, Н900 и Н1200 длиной L3000 мм и Т-образные кровельные " +
  "костыли. Цены от производителя, сертифицированная продукция, отправка " +
  "транспортными компаниями.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/catalog" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/catalog",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getActiveProducts();

  return (
    <div className="container-page py-10 sm:py-14 xl:py-16">
      <Breadcrumbs items={[{ name: "Каталог" }]} />

      {products.length > 0 && (
        <JsonLd data={graph(itemListSchema(products, TITLE))} />
      )}

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
        {TITLE}
      </h1>
      <p className="mt-3 max-w-3xl text-muted-foreground xl:mt-4 xl:text-lg">
        Сварные металлоконструкции для скатной кровли: секционные ограждения
        Н600, Н900 и Н1200 длиной L3000 мм — для установки по периметру и на
        участках выхода на крышу — и Т-образные костыли для крепления
        карнизного свеса. Ограждения сертифицированы и поставляются с паспортом
        изделия.
      </p>

      {products.length === 0 ? (
        <p className="mt-10 text-muted-foreground">Товары скоро появятся.</p>
      ) : (
        <ProductList
          products={products.map(toProductCardData)}
          className="mt-8 xl:mt-10"
        />
      )}

      <section className="mt-14 max-w-3xl xl:mt-16">
        <h2 className="text-xl font-semibold tracking-tight xl:text-2xl">
          Как подобрать и посчитать количество
        </h2>
        <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground xl:text-base">
          <p>
            Ограждение подбирают по высоте: Н600 и Н900 обычно ставят на
            жилых и небольших зданиях, Н1200 — там, где нужна максимальная
            защита при выходе на кровлю. Секции варим из трубы Ø25 мм со
            стенкой 1 мм, стандартная длина секции — L3000 мм (3 метра),
            поэтому количество считают по длине участка, который нужно
            оградить: например, на 12 метров нужно 4 секции.
          </p>
          <p>
            Костыль кровельный Т-образный нужен на карнизном узле: его крепят
            к обрешётке по линии карниза, он держит карнизную планку и передний
            край покрытия, к нему же крепят водосточную систему. Полоса
            шириной 25 мм, полка 200 мм, стойка 400 мм, три отверстия Ø5 мм
            под крепёж. Количество считают по длине карниза и шагу установки
            из проекта кровли.
          </p>
          <p>
            Если не уверены в комплектации — позвоните по телефону{" "}
            <a href={siteConfig.phoneHref} className="text-primary hover:underline">
              {siteConfig.phone}
            </a>
            : подберём набор под тип кровли и рассчитаем стоимость заказа.
            Готовый заказ можно забрать самовывозом с производства или
            отправить транспортной компанией — по договорённости.
            Сертификат соответствия, протокол испытаний и паспорт изделия на
            ограждения доступны в разделе{" "}
            <Link href="/documents" className="text-primary hover:underline">
              «Документы и сертификаты»
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
