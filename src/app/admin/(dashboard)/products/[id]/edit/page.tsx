import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductForAdmin } from "@/lib/products";
import { ProductForm } from "@/components/admin/product-form";
import { ProductImagesManager } from "@/components/admin/product-images-manager";
import { VariantsManager } from "@/components/admin/variants-manager";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const metadata: Metadata = { title: "Редактировать товар", robots: { index: false } };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductForAdmin(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold tracking-tight">Редактировать товар</h1>

      <section className="rounded-lg border bg-background p-4">
        <div className="mb-4 font-medium">Основная информация</div>
        <ProductForm mode="edit" product={product} />
      </section>

      <section className="rounded-lg border bg-background p-4">
        <div className="mb-4 font-medium">Фотографии</div>
        <ProductImagesManager productId={product.id} images={product.images} />
      </section>

      <section className="rounded-lg border bg-background p-4">
        <div className="mb-4 font-medium">Варианты товара (необязательно)</div>
        <VariantsManager productId={product.id} variants={product.variants} />
      </section>

      <section className="rounded-lg border border-destructive/30 bg-background p-4">
        <div className="mb-1 font-medium text-destructive">Опасная зона</div>
        <p className="mb-3 text-sm text-muted-foreground">
          Безвозвратное удаление товара.
        </p>
        <DeleteProductButton productId={product.id} productName={product.name} />
      </section>
    </div>
  );
}
