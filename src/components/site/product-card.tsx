import Link from "next/link";
import { ProductImage } from "@/components/site/product-image";
import { formatPrice } from "@/lib/format";

export interface ProductCardData {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  hasVariants: boolean;
  imageUrl: string | null;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/catalog/${product.slug}`}
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
        <div className="mt-auto pt-2 font-semibold">
          {product.hasVariants && (
            <span className="text-xs font-normal text-muted-foreground mr-1">
              от
            </span>
          )}
          {formatPrice(product.basePrice)}
        </div>
      </div>
    </Link>
  );
}
