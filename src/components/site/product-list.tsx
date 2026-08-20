import { ProductCard, type ProductCardData } from "@/components/site/product-card";
import { cn } from "@/lib/utils";

/**
 * Список товаров подстраивается под размер ассортимента.
 *
 * Пока позиций одна-две, сетка из узких карточек выглядит недоделанной,
 * поэтому первый товар (по sortOrder) показываем большой карточкой как
 * основной, а остальные — строкой «сопутствующая позиция». Как только
 * товаров станет три и больше, включается обычная сетка.
 */
export function ProductList({
  products,
  className,
}: {
  products: ProductCardData[];
  className?: string;
}) {
  if (products.length >= 3) {
    return (
      <div
        className={cn(
          "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8",
          className,
        )}
      >
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    );
  }

  const [main, ...rest] = products;
  if (!main) return null;

  return (
    <div className={cn("flex max-w-4xl flex-col gap-6", className)}>
      <ProductCard product={main} layout="wide" />
      {rest.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium text-muted-foreground">
            {rest.length === 1
              ? "Сопутствующая позиция"
              : "Сопутствующие позиции"}
          </div>
          {rest.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              layout="compact"
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Приведение товара из БД к данным карточки. */
export function toProductCardData(product: {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  variants: { name: string; price: number }[];
  images: { url: string }[];
}): ProductCardData {
  return {
    slug: product.slug,
    name: product.name,
    description: product.description,
    basePrice: product.basePrice,
    variants: product.variants.map((v) => ({ name: v.name, price: v.price })),
    imageUrl: product.images[0]?.url ?? null,
  };
}
