import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/site/product-gallery";
import { AddToCartForm } from "@/components/site/add-to-cart-form";
import { getProductBySlug } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="grid gap-10 sm:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-3 whitespace-pre-line text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-6">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              basePrice={product.basePrice}
              imageUrl={product.images[0]?.url ?? null}
              variants={product.variants.map((v) => ({
                id: v.id,
                name: v.name,
                price: v.price,
              }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
