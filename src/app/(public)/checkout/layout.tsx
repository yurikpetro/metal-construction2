import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

// Оформление заказа — клиентский компонент, метаданные выносим в layout
// (см. такой же комментарий в cart/layout.tsx). Дочерняя страница
// /checkout/success наследует robots отсюда и переопределяет только заголовок.
export const metadata: Metadata = {
  title: {
    default: "Оформление заказа",
    // Шаблон нужен повторно: заголовок-строка в layout «съедает» шаблон
    // корневого layout, и вложенная страница осталась бы без названия сайта.
    template: `%s — ${siteConfig.name}`,
  },
  robots: { index: false, follow: true },
};

export default function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
