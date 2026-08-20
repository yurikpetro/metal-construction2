import { ProductCard, type ProductCardData } from "@/components/site/product-card";
import { cn } from "@/lib/utils";

/**
 * Список товаров подстраивается под размер ассортимента.
 *
 * Три позиции и больше — обычная сетка. Две — основной товар большой
 * карточкой на две трети ширины, сопутствующая позиция рядом в правой
 * колонке (от lg), чтобы ряд заполнял ширину секции, а не оставлял пустоту.
 * Одна — большая карточка на всю ширину.
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

  // Одна позиция (например, блок перелинковки на странице товара): карточку
  // на всю ширину контейнера растягивать не нужно — получается баннер.
  if (rest.length === 0) {
    return (
      <div className={cn("max-w-3xl", className)}>
        <ProductCard product={main} layout="wide" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid items-stretch gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] xl:gap-8",
        className,
      )}
    >
      <ProductCard product={main} layout="wide" />
      <div className="flex flex-col gap-3">
        <div className="text-sm font-medium text-muted-foreground">
          {rest.length === 1
            ? "Сопутствующая позиция"
            : "Сопутствующие позиции"}
        </div>
        {rest.map((product) => (
          <ProductCard key={product.slug} product={product} layout="secondary" />
        ))}
      </div>
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
