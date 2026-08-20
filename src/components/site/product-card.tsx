import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/site/product-image";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

export interface ProductCardData {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  /** Активные варианты: в большой карточке показываем их мини-прайсом. */
  variants: { name: string; price: number }[];
  imageUrl: string | null;
}

/**
 * `grid` — компактная карточка для сетки из трёх и более товаров;
 * `wide` — большая карточка основного товара (фото, описание, исполнения, цена);
 * `secondary` — карточка сопутствующей позиции: рядом с основным товаром
 * (от lg) она вертикальная с крупным фото, а в одну колонку на узких
 * экранах — горизонтальная, чтобы не спорить с основным товаром.
 */
export type ProductCardLayout = "grid" | "wide" | "secondary";

export function ProductCard({
  product,
  layout = "grid",
}: {
  product: ProductCardData;
  layout?: ProductCardLayout;
}) {
  const href = `/catalog/${product.slug}`;
  const hasVariants = product.variants.length > 0;
  const price = (
    <div className="font-semibold xl:text-lg">
      {hasVariants && (
        <span className="mr-1 text-xs font-normal text-muted-foreground">
          от
        </span>
      )}
      {formatPrice(product.basePrice)}
    </div>
  );

  if (layout === "wide") {
    return (
      <Link
        href={href}
        className="group grid overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="aspect-4/3 w-full sm:h-full"
          sizes="(max-width: 640px) 100vw, 40vw"
        />
        <div className="flex flex-col gap-3 p-5 xl:p-6">
          <h3 className="text-lg font-medium leading-snug group-hover:text-primary xl:text-xl">
            {product.name}
          </h3>
          <p className="line-clamp-4 text-sm text-muted-foreground xl:text-base">
            {product.description}
          </p>
          {hasVariants && (
            <ul className="flex flex-wrap gap-1.5">
              {product.variants.map((variant) => (
                <li
                  key={variant.name}
                  className="rounded-full border bg-secondary/60 px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {variant.name} — {formatPrice(variant.price)}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
            {price}
            <span
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              Подробнее
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  if (layout === "secondary") {
    return (
      <Link
        href={href}
        className="group flex flex-1 gap-4 overflow-hidden rounded-lg border bg-card p-3 transition-shadow hover:shadow-md lg:flex-col lg:gap-0 lg:p-0"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="h-24 w-24 shrink-0 rounded-md sm:h-28 sm:w-28 lg:aspect-3/2 lg:h-auto lg:w-full lg:rounded-none"
          sizes="(max-width: 1024px) 120px, 30vw"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5 lg:p-5">
          <h3 className="font-medium leading-snug group-hover:text-primary lg:text-lg">
            {product.name}
          </h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {product.description}
          </p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            {price}
            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
              Подробнее
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-md"
    >
      <ProductImage
        src={product.imageUrl}
        alt={product.name}
        className="aspect-4/3 w-full"
      />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-medium leading-snug group-hover:text-primary">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-auto pt-2">{price}</div>
      </div>
    </Link>
  );
}
