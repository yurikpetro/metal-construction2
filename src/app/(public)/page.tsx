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
  Truck,
  Wrench,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  ProductList,
  toProductCardData,
} from "@/components/site/product-list";
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
      "Ограждение по периметру кровли снижает риск при обслуживании и ремонте крыши.",
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

const ORDER_STEPS = [
  {
    title: "Выбираете позиции в каталоге",
    description:
      "В карточке товара указаны цена и доступные варианты — добавьте нужное количество секций в корзину.",
  },
  {
    title: "Оставляете заявку",
    description:
      "В форме заказа достаточно имени, телефона и города или адреса доставки. Оплата на сайте не требуется.",
  },
  {
    title: "Уточняем детали",
    description:
      "Перезваниваем, проверяем тип кровли и комплектацию, согласуем оплату и способ получения: самовывоз или транспортная компания.",
  },
  {
    title: "Отгружаем с документами",
    description:
      "Передаём паспорт изделия и копии сертификата соответствия на ограждения.",
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
                  "Кровельные ограждения и кровельные костыли",
                ),
              ]
            : []),
        )}
      />

      <section className="container-page py-12 sm:py-16 xl:py-20">
        <div className="grid items-center gap-8 sm:grid-cols-2 xl:gap-14">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl xl:text-5xl">
              Кровельные ограждения и кровельные костыли в{" "}
              {siteConfig.cityLocative}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground xl:mt-6 xl:text-xl">
              Изготавливаем сварные кровельные ограждения в исполнениях Н600,
              Н900 и Н1200 длиной L3000 мм и Т-образные кровельные костыли.
              Сертифицированная продукция. Самовывоз с производства в{" "}
              {siteConfig.regionLocative} или отправка транспортными компаниями
              по договорённости.
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
                Отправка транспортными компаниями
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

      <section className="border-t bg-secondary/30">
        <div className="container-page py-12 sm:py-16 xl:py-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-2xl font-semibold tracking-tight xl:text-3xl">
              Что мы производим
            </h2>
            <Link
              href="/catalog"
              className="text-sm font-medium text-primary hover:underline xl:text-base"
            >
              Весь каталог
            </Link>
          </div>
          <p className="mt-2 max-w-3xl text-muted-foreground xl:mt-3 xl:text-lg">
            Основная позиция — секционные кровельные ограждения из трубы
            Ø25 мм со стенкой 1 мм: исполнения Н600, Н900 и Н1200, длина
            секции L3000 мм. Их ставят по периметру кровли и на участках
            выхода на крышу, монтаж — на кровельные кронштейны, без
            спецтехники. Сопутствующая позиция — Т-образные кровельные
            костыли для крепления карнизного свеса.
          </p>
          {products.length > 0 ? (
            <ProductList
              products={products.map(toProductCardData)}
              className="mt-8 xl:mt-10"
            />
          ) : (
            <p className="mt-8 text-muted-foreground">
              Товары скоро появятся.
            </p>
          )}
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
              Нужна помощь с выбором?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground xl:text-base">
              Позвоните — подберём исполнение ограждения под вашу кровлю,
              посчитаем количество секций и костылей, назовём итоговую сумму.
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
