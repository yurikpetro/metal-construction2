import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/site/json-ld";
import { breadcrumbSchema, graph, type BreadcrumbItem } from "@/lib/schema";

/**
 * Хлебные крошки: видимая навигация + BreadcrumbList в JSON-LD.
 * Поисковики показывают такую цепочку вместо длинного URL в сниппете,
 * а пользователю она даёт быстрый путь наверх.
 *
 * Первый элемент («Главная») добавляется автоматически.
 */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const trail: BreadcrumbItem[] = [{ name: "Главная", href: "/" }, ...items];

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(trail))} />
      <nav aria-label="Навигационная цепочка" className="mb-4 text-sm">
        <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
          {trail.map((item, index) => {
            const isLast = index === trail.length - 1;
            return (
              <li key={item.name} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="size-3.5 shrink-0 opacity-60" />
                )}
                {isLast || !item.href ? (
                  <span aria-current="page" className="text-foreground">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.href} className="hover:text-foreground">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
