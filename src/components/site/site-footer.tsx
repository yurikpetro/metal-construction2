import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-secondary/40 mt-16">
      <div className="container-page py-10 grid gap-8 sm:grid-cols-3 xl:py-12">
        <div>
          <div className="font-semibold tracking-tight">{siteConfig.name}</div>
          <p className="mt-2 text-sm text-muted-foreground">
            {siteConfig.shortDescription}
          </p>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Навигация</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/catalog" className="hover:text-foreground">
                Каталог
              </Link>
            </li>
            <li>
              <Link href="/documents" className="hover:text-foreground">
                Документы и сертификаты
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:text-foreground">
                Контакты
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-foreground">
                Политика конфиденциальности
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Контакты</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>
              <a href={siteConfig.phoneHref} className="hover:text-foreground">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-foreground">
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page py-4 text-xs text-muted-foreground">
          © {year} {siteConfig.name}. Все права защищены. {siteConfig.legalName}, ИНН{" "}
          {siteConfig.inn}
        </div>
      </div>
    </footer>
  );
}
