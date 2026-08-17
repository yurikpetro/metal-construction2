"use client";

import { useState } from "react";
import { ProductImage } from "@/components/site/product-image";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
}: {
  images: { url: string }[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <ProductImage
        src={images[active]?.url ?? null}
        alt={name}
        className="aspect-4/3 w-full rounded-lg"
        sizes="(max-width: 768px) 100vw, 500px"
        eager
      />
      {images.length > 1 && (
        <div className="mt-3 flex gap-2">
          {images.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Показать фото ${i + 1}: ${name}`}
              aria-current={i === active}
              className={cn(
                "size-16 overflow-hidden rounded-md border-2",
                i === active ? "border-primary" : "border-transparent",
              )}
            >
              <ProductImage
                src={img.url}
                alt={`${name} — фото ${i + 1}`}
                className="size-full"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
