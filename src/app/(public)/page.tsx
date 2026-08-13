import Link from "next/link";
import { ShieldCheck, Wrench, PackageCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/components/site/product-card";
import { HeroGraphic } from "@/components/site/hero-graphic";
import { getActiveProducts } from "@/lib/products";

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

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <div className="grid items-center gap-8 sm:grid-cols-2">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Кровельные ограждения и безопасность вашей крыши
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Изготовление и продажа кровельных ограждений, снегозадержателей
              и мостиков для безопасной работы на высоте.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/catalog" className={buttonVariants({ size: "lg" })}>
                Смотреть каталог
              </Link>
              <Link
                href="/contacts"
                className={buttonVariants({ size: "lg", variant: "outline" })}
              >
                Связаться с нами
              </Link>
            </div>
          </div>
          <div className="aspect-4/3 sm:aspect-square">
            <HeroGraphic />
          </div>
        </div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-8 sm:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="flex flex-col items-start gap-2">
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <b.icon className="size-5" />
              </div>
              <h2 className="font-medium">{b.title}</h2>
              <p className="text-sm text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {products.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">
              Наши товары
            </h2>
            <Link
              href="/catalog"
              className="text-sm font-medium text-primary hover:underline"
            >
              Весь каталог
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
    </>
  );
}
