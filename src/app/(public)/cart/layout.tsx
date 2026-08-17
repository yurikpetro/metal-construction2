import type { Metadata } from "next";

// Корзина — клиентский компонент (состояние живёт в localStorage), а метаданные
// Next.js разрешает экспортировать только из серверного модуля. Поэтому они здесь.
export const metadata: Metadata = {
  title: "Корзина",
  // Служебные страницы в выдаче не нужны: содержимое у каждого посетителя своё,
  // а в индексе они создавали бы «пустые» дубли. follow оставляем, чтобы вес
  // по ссылкам на каталог продолжал передаваться.
  robots: { index: false, follow: true },
};

export default function CartLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
