"use server";

import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export interface ProductFormState {
  error?: string;
}

async function generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "tovar";
  let slug = base;
  let i = 2;
  while (
    await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
    })
  ) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

function parseProductForm(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    basePrice: Number(formData.get("basePrice")),
    isActive: formData.get("isActive") === "on",
  };
}

function validateProductForm(data: ReturnType<typeof parseProductForm>): string | null {
  if (!data.name || data.name.length < 2) return "Введите название товара";
  if (!data.description) return "Введите описание товара";
  if (!Number.isFinite(data.basePrice) || data.basePrice <= 0) return "Укажите корректную цену";
  return null;
}

export async function createProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const data = parseProductForm(formData);
  const error = validateProductForm(data);
  if (error) return { error };

  const slug = await generateUniqueSlug(data.name);

  const product = await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      basePrice: Math.round(data.basePrice),
      isActive: data.isActive,
      slug,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProductAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const productId = String(formData.get("productId") ?? "");
  const data = parseProductForm(formData);
  const error = validateProductForm(data);
  if (error) return { error };

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: data.name,
      description: data.description,
      basePrice: Math.round(data.basePrice),
      isActive: data.isActive,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/catalog");
  return {};
}

export async function toggleProductActiveAction(productId: string, isActive: boolean) {
  await prisma.product.update({ where: { id: productId }, data: { isActive } });
  revalidatePath("/admin/products");
  revalidatePath("/catalog");
}

export async function deleteProductAction(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });
  if (!product) return;

  await prisma.product.delete({ where: { id: productId } });

  await Promise.all(product.images.map((img) => deleteImageFile(img.url)));

  revalidatePath("/admin/products");
  revalidatePath("/catalog");
  redirect("/admin/products");
}

export async function addVariantAction(
  _prevState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const productId = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));

  if (!name) return { error: "Введите название варианта" };
  if (!Number.isFinite(price) || price <= 0) {
    return { error: "Укажите корректную цену варианта" };
  }

  const count = await prisma.productVariant.count({ where: { productId } });

  await prisma.productVariant.create({
    data: { productId, name, price: Math.round(price), sortOrder: count },
  });

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/catalog");
  return {};
}

export async function deleteVariantAction(variantId: string, productId: string) {
  await prisma.productVariant.delete({ where: { id: variantId } });
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/catalog");
}

export async function uploadProductImageAction(
  formData: FormData,
): Promise<{ error?: string }> {
  const productId = String(formData.get("productId") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Выберите файл изображения" };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { error: "Разрешены только изображения JPEG, PNG или WebP" };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "Файл слишком большой (максимум 5 МБ)" };
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  const count = await prisma.productImage.count({ where: { productId } });
  await prisma.productImage.create({
    data: { productId, url: `/uploads/products/${filename}`, sortOrder: count },
  });

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/catalog");
  return {};
}

export async function deleteProductImageAction(imageId: string, productId: string) {
  const image = await prisma.productImage.findUnique({ where: { id: imageId } });
  if (!image) return;

  await prisma.productImage.delete({ where: { id: imageId } });
  await deleteImageFile(image.url);

  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath("/catalog");
}

export async function reorderProductImageAction(
  imageId: string,
  productId: string,
  direction: "up" | "down",
) {
  const images = await prisma.productImage.findMany({
    where: { productId },
    orderBy: { sortOrder: "asc" },
  });
  const idx = images.findIndex((i) => i.id === imageId);
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (idx === -1 || swapIdx < 0 || swapIdx >= images.length) return;

  const a = images[idx];
  const b = images[swapIdx];

  await prisma.$transaction([
    prisma.productImage.update({ where: { id: a.id }, data: { sortOrder: b.sortOrder } }),
    prisma.productImage.update({ where: { id: b.id }, data: { sortOrder: a.sortOrder } }),
  ]);

  revalidatePath(`/admin/products/${productId}/edit`);
}

async function deleteImageFile(url: string) {
  if (!url.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", url);
  await unlink(filePath).catch(() => undefined);
}
