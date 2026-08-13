import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с нами по телефону или почте — ответим на вопросы и поможем с заказом.",
};

const ITEMS = [
  { icon: Phone, label: "Телефон", value: siteConfig.phone, href: siteConfig.phoneHref },
  { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: MapPin, label: "Адрес", value: siteConfig.address },
];

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Контакты
      </h1>
      <p className="mt-2 text-muted-foreground">
        Свяжитесь с нами напрямую или оформите заявку из каталога — мы
        перезвоним, чтобы уточнить детали заказа и доставки.
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

      <div className="mt-8 text-sm text-muted-foreground">
        {siteConfig.legalName}, ИНН {siteConfig.inn}
      </div>
    </div>
  );
}
