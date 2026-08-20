import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JsonLd } from "@/components/site/json-ld";
import { contactPageSchema, graph } from "@/lib/schema";
import { siteConfig } from "@/lib/site-config";

const TITLE = `Контакты — кровельные ограждения в ${siteConfig.cityLocative}`;
const DESCRIPTION =
  `Телефон ${siteConfig.phone}, почта и адрес производства: ${siteConfig.address}, ` +
  `${siteConfig.region}. Ответим на вопросы по кровельным ограждениям, ` +
  "костылям и отправке заказа.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/contacts" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/contacts",
    type: "website",
  },
};

const ITEMS = [
  { icon: Phone, label: "Телефон", value: siteConfig.phone, href: siteConfig.phoneHref },
  { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: MapPin, label: "Адрес производства", value: siteConfig.address },
];

export default function ContactsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14 xl:py-16">
      <JsonLd data={graph(contactPageSchema())} />
      <Breadcrumbs items={[{ name: "Контакты" }]} />

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
        Контакты
      </h1>
      <p className="mt-2 text-muted-foreground xl:mt-3 xl:text-lg">
        Свяжитесь с нами напрямую или оформите заявку из каталога — мы
        перезвоним, чтобы уточнить детали заказа и отправки.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-4 rounded-lg border p-4">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <item.icon className="size-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{item.label}</div>
              {item.href ? (
                <a href={item.href} className="font-medium hover:underline">
                  {item.value}
                </a>
              ) : (
                <div className="font-medium">{item.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight xl:text-xl">
          Где мы работаем
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground xl:text-base">
          Производство находится в {siteConfig.regionLocative}:{" "}
          {siteConfig.address}. Готовый заказ можно забрать самовывозом или
          отправить транспортной компанией в любой регион — по договорённости;
          своей доставки у нас нет. Условия и стоимость перевозки менеджер
          согласует при обработке заявки.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold tracking-tight xl:text-xl">
          Как оформить заказ
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground xl:text-base">
          Выберите позиции в{" "}
          <Link href="/catalog" className="text-primary hover:underline">
            каталоге
          </Link>{" "}
          и оставьте заявку — оплата на сайте не требуется. Документы на
          продукцию можно посмотреть заранее в разделе{" "}
          <Link href="/documents" className="text-primary hover:underline">
            «Документы и сертификаты»
          </Link>
          .
        </p>
      </section>

      <div className="mt-10 border-t pt-6 text-sm text-muted-foreground">
        {siteConfig.legalName}, ИНН {siteConfig.inn}
      </div>
    </div>
  );
}
