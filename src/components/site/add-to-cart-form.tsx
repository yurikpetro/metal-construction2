"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/lib/cart/store";

interface Variant {
  id: string;
  name: string;
  price: number;
}

export function AddToCartForm({
  productId,
  slug,
  name,
  basePrice,
  variants,
  imageUrl,
}: {
  productId: string;
  slug: string;
  name: string;
  basePrice: number;
  variants: Variant[];
  imageUrl: string | null;
}) {
  const [variantId, setVariantId] = useState<string | null>(
    variants[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === variantId) ?? null,
    [variants, variantId],
  );
  const price = selectedVariant?.price ?? basePrice;

  function handleAdd() {
    addItem(
      {
        productId,
        variantId: selectedVariant?.id ?? null,
        slug,
        name,
        variantName: selectedVariant?.name ?? null,
        price,
        image: imageUrl,
      },
      quantity,
    );
    toast.success("Добавлено в корзину", {
      description: selectedVariant ? `${name} — ${selectedVariant.name}` : name,
      action: {
        label: "Перейти в корзину",
        onClick: () => {
          window.location.href = "/cart";
        },
      },
    });
  }

  return (
    <div className="flex flex-col gap-5">
      {variants.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-medium">Вариант</div>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariantId(v.id)}
                className={cn(
                  "rounded-md border px-3 py-2 text-sm transition-colors",
                  v.id === variantId
                    ? "border-primary bg-primary/5 font-medium"
                    : "hover:bg-accent",
                )}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-2xl font-semibold">{formatPrice(price)}</div>

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-md border">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Уменьшить количество"
          >
            <Minus className="size-4" />
          </Button>
          <span className="w-10 text-center tabular-nums">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="Увеличить количество"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        <Button type="button" size="lg" className="flex-1" onClick={handleAdd}>
          <ShoppingCart className="size-4" />
          Добавить в корзину
        </Button>
      </div>

      <Link
        href="/cart"
        className="text-sm text-muted-foreground hover:text-foreground hover:underline"
      >
        Перейти в корзину
      </Link>
    </div>
  );
}
