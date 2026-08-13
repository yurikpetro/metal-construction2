import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductImage } from "@/components/site/product-image";
import { ProductActiveToggle } from "@/components/admin/product-active-toggle";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { getAllProductsForAdmin } from "@/lib/products";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Товары", robots: { index: false } };

export default async function AdminProductsPage() {
  const products = await getAllProductsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Товары</h1>
        <Link href="/admin/products/new" className={buttonVariants()}>
          <Plus className="size-4" />
          Добавить товар
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-muted-foreground">Товаров пока нет.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-lg border bg-background p-3"
            >
              <ProductImage
                src={product.images[0]?.url ?? null}
                alt={product.name}
                className="size-16 shrink-0 rounded-md"
                sizes="64px"
              />

              <div className="min-w-0 flex-1">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="font-medium hover:underline"
                >
                  {product.name}
                </Link>
                <div className="text-sm text-muted-foreground">
                  {formatPrice(product.basePrice)}
                  {product.variants.length > 0 &&
                    ` · ${product.variants.length} вариант(а/ов)`}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <ProductActiveToggle productId={product.id} initialActive={product.isActive} />
                <DeleteProductButton productId={product.id} productName={product.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
