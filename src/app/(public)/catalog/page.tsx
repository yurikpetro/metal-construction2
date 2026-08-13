import type { Metadata } from "next";
import { ProductCard } from "@/components/site/product-card";
import { getActiveProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Каталог",
  description: "Кровельные ограждения, снегозадержатели и мостики для безопасной работы на крыше.",
};

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const products = await getActiveProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Каталог
      </h1>
      <p className="mt-2 text-muted-foreground">
        Товары для безопасной работы на кровле
      </p>

      {products.length === 0 ? (
        <p className="mt-10 text-muted-foreground">
          Товары скоро появятся.
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      )}
    </div>
  );
}
