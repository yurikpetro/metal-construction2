"use client";

import { useActionState, useState } from "react";
import {
  createProductAction,
  updateProductAction,
  type ProductFormState,
} from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const initialState: ProductFormState = {};

export function ProductForm({
  mode,
  product,
}: {
  mode: "create" | "edit";
  product?: {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    isActive: boolean;
  };
}) {
  const action = mode === "create" ? createProductAction : updateProductAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-4">
      {product && <input type="hidden" name="productId" value={product.id} />}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Название</Label>
        <Input id="name" name="name" defaultValue={product?.name} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description}
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="basePrice">Цена, ₽</Label>
        <Input
          id="basePrice"
          name="basePrice"
          type="number"
          min={1}
          step={1}
          defaultValue={product?.basePrice}
          required
        />
        <p className="text-xs text-muted-foreground">
          Если у товара есть варианты (см. ниже), эта цена показывается на
          сайте как «от».
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <Checkbox
          id="isActive"
          checked={isActive}
          onCheckedChange={(checked) => setIsActive(checked === true)}
        />
        <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
        <Label htmlFor="isActive" className="font-normal">
          Показывать на сайте
        </Label>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Сохраняем..." : mode === "create" ? "Создать товар" : "Сохранить"}
      </Button>
    </form>
  );
}
