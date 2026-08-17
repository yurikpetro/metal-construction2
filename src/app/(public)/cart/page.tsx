"use client";

import Link from "next/link";
import { Minus, Plus, X, ShoppingCart } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductImage } from "@/components/site/product-image";
import { formatPrice } from "@/lib/format";
import { cartTotal, useCartHydrated, useCartStore } from "@/lib/cart/store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const hydrated = useCartHydrated();

  if (!hydrated) {
    return <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-14" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-16 text-center">
        <ShoppingCart className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-semibold">Корзина пуста</h1>
        <p className="mt-2 text-muted-foreground">
          Добавьте товары из каталога, чтобы оформить заявку.
        </p>
        <Link href="/catalog" className={buttonVariants({ className: "mt-6" })}>
          Перейти в каталог
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Корзина
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => {
          const line = { productId: item.productId, variantId: item.variantId };
          return (
            <div
              key={`${item.productId}-${item.variantId ?? "base"}`}
              className="flex items-center gap-4 rounded-lg border p-3"
            >
              <ProductImage
                src={item.image}
                alt={item.name}
                className="size-20 shrink-0 rounded-md"
                sizes="80px"
              />

              <div className="min-w-0 flex-1">
                <Link
                  href={`/catalog/${item.slug}`}
                  className="font-medium hover:underline"
                >
                  {item.name}
                </Link>
                {item.variantName && (
                  <div className="text-sm text-muted-foreground">
                    {item.variantName}
                  </div>
                )}
                <div className="mt-1 text-sm text-muted-foreground">
                  {formatPrice(item.price)} / шт.
                </div>
              </div>

              <div className="flex items-center rounded-md border">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setQuantity(line, Math.max(1, item.quantity - 1))
                  }
                  aria-label="Уменьшить количество"
                >
                  <Minus className="size-4" />
                </Button>
                <span className="w-8 text-center tabular-nums">
                  {item.quantity}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(line, item.quantity + 1)}
                  aria-label="Увеличить количество"
                >
                  <Plus className="size-4" />
                </Button>
              </div>

              <div className="w-24 shrink-0 text-right font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeItem(line)}
                aria-label="Удалить"
              >
                <X className="size-4" />
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4 border-t pt-6">
        <div className="text-xl font-semibold">
          Итого: {formatPrice(total)}
        </div>
        <Link href="/checkout" className={buttonVariants({ size: "lg" })}>
          Оформить заказ
        </Link>
      </div>
    </div>
  );
}
