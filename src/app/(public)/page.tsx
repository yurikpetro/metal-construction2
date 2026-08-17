import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  FileText,
  PackageCheck,
  Phone,
  ShieldCheck,
  Snowflake,
  Truck,
  Wrench,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/site/product-card";
import { HeroGraphic } from "@/components/site/hero-graphic";
import { JsonLd } from "@/components/site/json-ld";
import { getActiveProducts } from "@/lib/products";
import { faqSchema, graph, itemListSchema } from "@/lib/schema";
import { siteFaq } from "@/lib/faq";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export const dynamic = "force-dynamic";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "Безопасность на высоте",
    description:
      "Ограждения и снегозадержатели снижают риск при обслуживании и ремонте кровли.",
  },
  {
    icon: PackageCheck,
    title: "Надёжная конструкция",
    description:
      "Прочный металл с порошковой окраской — устойчивость к коррозии и погодным условиям.",
  },
  {
    icon: Wrench,
    title: "Простой монтаж",
    description:
      "Секционная конструкция устанавливается без специальной техники и подготовки.",
  },
];

const PRODUCT_TYPES = [
  {
    icon: ShieldCheck,
    title: "Кровельные ограждения",
    description:
      "Сварные секции в исполнениях Н600, Н900 и Н1200 — основной элемент безопасности скатной кровли. Крепятся к кровельным кронштейнам по всему периметру или на участках выхода на крышу.",
  },
  {
    icon: Snowflake,
    title: "Снегозадержатели",
    description:
      "Трубчатые конструкции, которые удерживают снег на кровле и не дают ему сходить лавиной на водостоки, отмостку и людей внизу.",
  },
  {
    icon: PackageCheck,
    title: "Кровельные мостики",
    description:
      "Переходные площадки для безопасного передвижения по кровле к дымоходам, вентиляции и антеннам без риска повредить покрытие.",
  },
  {
    icon: Wrench,
    title: "Кровельные и фасадные лестницы",
    description:
      "Конструкции для подъёма на крышу и перехода между скатами разной высоты — в одном комплекте с ограждениями и мостиками.",
  },
];

const ORDER_STEPS = [
  {
    title: "Выбираете позиции в каталоге",
    description:
      "В карточке товара указаны цена и доступные варианты — добавьте нужное количество секций в корзину.",
  },
  {
    title: "Оставляете заявку",
    description:
      "В форме заказа достаточно имени, телефона и адреса доставки. Оплата на сайте не требуется.",
  },
  {
    title: "Уточняем детали",
    description:
      "Перезваниваем, проверяем тип кровли и комплектацию, согласуем способ оплаты и доставки.",
  },
  {
    title: "Отгружаем с документами",
    description:
      "Вместе с товаром передаём паспорт изделия и копии сертификатов на продукцию.",
  },
];

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <JsonLd
        data={graph(
          faqSchema(
            siteFaq.map((item) => ({
              question: item.question,
              answer: item.answer,
            })),
          ),
          ...(products.length > 0
            ? [
                itemListSchema(
                  products,
                  "Кровельные ограждения и снегозадержатели",
                ),
              ]
            : []),
        )}
      />

      <section className="container-page py-12 sm:py-16 xl:py-20">
        <div className="grid items-center gap-8 sm:grid-cols-2 xl:gap-14">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">
              Кровельные ограждения и снегозадержатели в{" "}
              {siteConfig.cityLocative}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground xl:mt-6 xl:text-xl">
              Изготавливаем и продаём элементы безопасности кровли: ограждения
              в исполнениях Н600, Н900 и Н1200, трубчатые снегозадержатели,
              кровельные мостики и лестницы. Сертифицированная продукция,
              доставка по {siteConfig.regionDative} и всей России.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/catalog" className={buttonVariants({ size: "lg" })}>
                Смотреть каталог
              </Link>
              <a
                href={siteConfig.phoneHref}
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                <Phone className="size-4" />
                {siteConfig.phone}
              </a>
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground xl:mt-8 xl:gap-x-7 xl:text-base">
              <li className="inline-flex items-center gap-1.5">
                <BadgeCheck className="size-4 text-primary" />
                Сертификат соответствия
              </li>
              <li className="inline-flex items-center gap-1.5">
                <FileText className="size-4 text-primary" />
                Паспорт изделия
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Truck className="size-4 text-primary" />
                Доставка по России
              </li>
            </ul>
          </div>
          {/* Соотношение совпадает с viewBox графики — иначе SVG вписывается
              в контейнер с пустыми полями сверху и снизу */}
          <div className="aspect-400/260">
            <HeroGraphic />
          </div>
        </div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="container-page py-12 xl:py-16">
          <h2 className="text-xl font-semibold tracking-tight xl:text-2xl">
            Почему выбирают наши конструкции
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3 xl:mt-10 xl:gap-12">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex flex-col items-start gap-2">
                <div className="rounded-md bg-primary/10 p-2 text-primary">
                  <b.icon className="size-5" />
                </div>
                <h3 className="font-medium xl:text-lg">{b.title}</h3>
                <p className="text-sm text-muted-foreground xl:text-base">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="container-page py-12 sm:py-16 xl:py-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3 xl:mb-8">
            <h2 className="text-2xl font-semibold tracking-tight xl:text-3xl">
              Каталог кровельных ограждений и снегозадержателей
            </h2>
            <Link
              href="/catalog"
              className="text-sm font-medium text-primary hover:underline xl:text-base"
            >
              Весь каталог
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  slug: p.slug,
                  name: p.name,
                  description: p.description,
                  basePrice: p.basePrice,
                  hasVariants: p.variants.length > 0,
                  imageUrl: p.images[0]?.url ?? null,
                }}
              />
            ))}
          </div>
        </section>
      )}

      <section className="border-t bg-secondary/30">
        <div className="container-page py-12 sm:py-16 xl:py-20">
          <h2 className="text-2xl font-semibold tracking-tight xl:text-3xl">
            Что мы производим
          </h2>
          <p className="mt-2 max-w-3xl text-muted-foreground xl:mt-3 xl:text-lg">
            Все конструкции — сварные металлические, с порошковой окраской.
            Их подбирают комплектом под конкретную кровлю: ограждение по
            периметру, снегозадержатели над входами и водостоками, мостики
            и лестницы для доступа к оборудованию.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:mt-10 xl:gap-8">
            {PRODUCT_TYPES.map((type) => (
              <div
                key={type.title}
                className="flex gap-4 rounded-lg border bg-card p-5 xl:gap-5 xl:p-6"
              >
                <div className="h-fit rounded-md bg-primary/10 p-2 text-primary">
                  <type.icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-medium xl:text-lg">{type.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground xl:text-base">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16 xl:py-20">
        <h2 className="text-2xl font-semibold tracking-tight xl:text-3xl">
          Как заказать
        </h2>
        <ol className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:mt-10 xl:gap-10">
          {ORDER_STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </span>
              <h3 className="font-medium xl:text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground xl:text-base">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3 xl:mt-10">
          <Link
            href="/catalog"
            className={buttonVariants({ variant: "default" })}
          >
            Перейти в каталог
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/documents"
            className={buttonVariants({ variant: "outline" })}
          >
            <ClipboardList className="size-4" />
            Документы и сертификаты
          </Link>
        </div>
      </section>

      <section className="border-t bg-secondary/30">
        <div className="container-narrow py-12 sm:py-16 xl:py-20">
          <h2 className="text-2xl font-semibold tracking-tight xl:text-3xl">
            Частые вопросы о кровельных ограждениях
          </h2>
          <div className="mt-8 divide-y rounded-lg border bg-card xl:mt-10">
            {siteFaq.map((item) => (
              <details key={item.question} className="group px-5 py-4 xl:px-6 xl:py-5">
                <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden xl:text-lg">
                  <span className="flex items-start justify-between gap-4">
                    {item.question}
                    <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground xl:text-base">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-lg border bg-card p-6 text-center xl:mt-12 xl:p-8">
            <h2 className="text-xl font-semibold tracking-tight xl:text-2xl">
              Не нашли нужную конструкцию?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground xl:text-base">
              Позвоните — подберём комплект элементов безопасности под вашу
              кровлю и рассчитаем стоимость с доставкой.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a
                href={siteConfig.phoneHref}
                className={buttonVariants({ size: "lg" })}
              >
                <Phone className="size-4" />
                {siteConfig.phone}
              </a>
              <Link
                href="/contacts"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Все контакты
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
