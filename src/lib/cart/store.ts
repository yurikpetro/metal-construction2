"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  variantId: string | null;
  slug: string;
  name: string;
  variantName: string | null;
  price: number;
  image: string | null;
  quantity: number;
}

type CartLineKey = Pick<CartItem, "productId" | "variantId">;

function sameLine(a: CartLineKey, b: CartLineKey) {
  return a.productId === b.productId && a.variantId === b.variantId;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (line: CartLineKey) => void;
  setQuantity: (line: CartLineKey, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item, quantity = 1) =>
        set((state) => {
          const idx = state.items.findIndex((i) => sameLine(i, item));
          if (idx !== -1) {
            const items = [...state.items];
            items[idx] = { ...items[idx], quantity: items[idx].quantity + quantity };
            return { items };
          }
          return { items: [...state.items, { ...item, quantity }] };
        }),
      removeItem: (line) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, line)),
        })),
      setQuantity: (line, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => !sameLine(i, line))
              : state.items.map((i) => (sameLine(i, line) ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "mc-cart",
      skipHydration: true,
    },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function subscribeCartHydration(callback: () => void) {
  const unsub = useCartStore.persist.onFinishHydration(callback);
  useCartStore.persist.rehydrate();
  return unsub;
}

function getCartHydrated() {
  return useCartStore.persist.hasHydrated();
}

function getCartHydratedServer() {
  return false;
}

/** Гидрирует стор из localStorage только на клиенте, чтобы избежать SSR-мисматча. */
export function useCartHydrated() {
  return useSyncExternalStore(subscribeCartHydration, getCartHydrated, getCartHydratedServer);
}
