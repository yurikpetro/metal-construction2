"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { cartCount, useCartHydrated, useCartStore } from "@/lib/cart/store";

export function CartBadge() {
  const items = useCartStore((s) => s.items);
  const hydrated = useCartHydrated();
  const count = hydrated ? cartCount(items) : 0;

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center rounded-md p-2 hover:bg-accent"
      aria-label="Корзина"
    >
      <ShoppingCart className="size-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-medium text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
