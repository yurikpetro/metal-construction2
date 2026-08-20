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
 * `compact` — строка для сопутствующей позиции.
 */
export type ProductCardLayout = "grid" | "wide" | "compact";

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

  if (layout === "compact") {
    return (
      <Link
        href={href}
        className="group flex items-center gap-4 rounded-lg border bg-card p-3 transition-shadow hover:shadow-md xl:p-4"
      >
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          className="size-16 shrink-0 rounded-md sm:size-20"
          sizes="80px"
        />
        <div className="min-w-0 flex-1">
          <h3 className="font-medium leading-snug group-hover:text-primary">
            {product.name}
          </h3>
          <p className="hidden text-sm text-muted-foreground sm:line-clamp-2 sm:block">
            {product.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {price}
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
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
