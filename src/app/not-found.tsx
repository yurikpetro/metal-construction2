import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: true },
};

/**
 * Страница 404 для всего сайта. Отдаётся вместе с кодом 404, поэтому в индекс
 * не попадает, но ссылки на каталог и контакты не дают посетителю уйти —
 * а поисковику помогают переобойти живые разделы.
 *
 * Шапку и подвал подключаем здесь вручную: корневой not-found рендерится вне
 * группы (public) и её layout к нему не применяется.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col flex-1">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-xl px-4 sm:px-6 py-20 text-center">
          <p className="text-5xl font-semibold tracking-tight text-primary">
            404
          </p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Такой страницы нет
          </h1>
          <p className="mt-3 text-muted-foreground">
            Возможно, товар снят с продажи или ссылка устарела. Актуальные
            кровельные ограждения и костыли — в каталоге.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalog" className={buttonVariants({ size: "lg" })}>
              Перейти в каталог
            </Link>
            <Link
              href="/"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              На главную
            </Link>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Нужна помощь с подбором? Звоните{" "}
            <a
              href={siteConfig.phoneHref}
              className="font-medium text-primary hover:underline"
            >
              {siteConfig.phone}
            </a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
