"use client";

import { useActionState, useTransition } from "react";
import { ArrowDown, ArrowUp, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductImage } from "@/components/site/product-image";
import {
  deleteProductImageAction,
  reorderProductImageAction,
  uploadProductImageAction,
} from "@/lib/actions/products";

interface ImageItem {
  id: string;
  url: string;
}

const initialState: { error?: string } = {};

async function uploadAction(_prev: { error?: string }, formData: FormData) {
  return uploadProductImageAction(formData);
}

export function ProductImagesManager({
  productId,
  images,
}: {
  productId: string;
  images: ImageItem[];
}) {
  const [state, formAction, pending] = useActionState(uploadAction, initialState);
  const [busy, startTransition] = useTransition();

  return (
    <div>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.id} className="group relative">
              <ProductImage src={img.url} alt="" className="aspect-square rounded-md" />
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-black/50 p-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white"
                  disabled={i === 0 || busy}
                  onClick={() =>
                    startTransition(() => reorderProductImageAction(img.id, productId, "up"))
                  }
                  aria-label="Переместить раньше"
                >
                  <ArrowUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white"
                  disabled={i === images.length - 1 || busy}
                  onClick={() =>
                    startTransition(() => reorderProductImageAction(img.id, productId, "down"))
                  }
                  aria-label="Переместить позже"
                >
                  <ArrowDown className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20 hover:text-white"
                  disabled={busy}
                  onClick={() =>
                    startTransition(() => deleteProductImageAction(img.id, productId))
                  }
                  aria-label="Удалить фото"
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <form action={formAction} className="mt-4 flex flex-wrap items-center gap-2">
        <input type="hidden" name="productId" value={productId} />
        <Input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp"
          required
          className="max-w-xs"
        />
        <Button type="submit" disabled={pending} variant="secondary">
          <Upload className="size-4" />
          {pending ? "Загружаем..." : "Загрузить фото"}
        </Button>
      </form>
      {state.error && <p className="mt-2 text-sm text-destructive">{state.error}</p>}
    </div>
  );
}
