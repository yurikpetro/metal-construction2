"use client";

import { useActionState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addVariantAction, deleteVariantAction, type ProductFormState } from "@/lib/actions/products";
import { formatPrice } from "@/lib/format";

interface VariantItem {
  id: string;
  name: string;
  price: number;
}

const initialState: ProductFormState = {};

export function VariantsManager({
  productId,
  variants,
}: {
  productId: string;
  variants: VariantItem[];
}) {
  const [state, formAction, pending] = useActionState(addVariantAction, initialState);
  const [busy, startTransition] = useTransition();

  return (
    <div>
      {variants.length > 0 && (
        <ul className="mb-4 flex flex-col divide-y">
          {variants.map((v) => (
            <li key={v.id} className="flex items-center justify-between gap-3 py-2">
              <span>{v.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-medium">{formatPrice(v.price)}</span>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  disabled={busy}
                  onClick={() => startTransition(() => deleteVariantAction(v.id, productId))}
                  aria-label="Удалить вариант"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form action={formAction} className="flex flex-wrap items-end gap-2">
        <input type="hidden" name="productId" value={productId} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="variantName" className="text-xs text-muted-foreground">
            Название варианта
          </Label>
          <Input id="variantName" name="name" placeholder="Например, Секция 6 м" className="w-48" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="variantPrice" className="text-xs text-muted-foreground">
            Цена, ₽
          </Label>
          <Input id="variantPrice" name="price" type="number" min={1} className="w-28" />
        </div>
        <Button type="submit" variant="secondary" disabled={pending}>
          + Добавить вариант
        </Button>
      </form>
      {state.error && <p className="mt-2 text-sm text-destructive">{state.error}</p>}
    </div>
  );
}
