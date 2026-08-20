import Image from "next/image";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  className,
  sizes,
  eager,
  fit = "contain",
}: {
  src?: string | null;
  alt: string;
  className?: string;
  sizes?: string;
  /**
   * Для главного изображения на странице товара: оно почти всегда является
   * LCP-элементом, поэтому грузим его сразу и с высоким приоритетом.
   * (В Next 16 проп `priority` объявлен устаревшим в пользу loading/fetchPriority.)
   */
  eager?: boolean;
  /**
   * По умолчанию `contain`: фото товара вписывается в бокс целиком и
   * центрируется. Для металлоконструкций и чертежей это важнее заполнения
   * рамки — при `cover` у снимка обрезаются края, а у схемы пропадают размеры.
   */
  fit?: "cover" | "contain";
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          className,
        )}
      >
        <ImageOff className="size-8 opacity-50" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 400px"}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className={cn(
          "object-center",
          fit === "cover" ? "object-cover" : "object-contain",
        )}
      />
    </div>
  );
}
