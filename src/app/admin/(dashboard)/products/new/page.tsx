import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "Новый товар", robots: { index: false } };

export default function AdminNewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Новый товар</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        После создания вы сможете добавить фото и варианты товара.
      </p>
      <div className="mt-6 rounded-lg border bg-background p-4">
        <ProductForm mode="create" />
      </div>
    </div>
  );
}
