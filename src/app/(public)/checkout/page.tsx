"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice } from "@/lib/format";
import { checkoutSchema } from "@/lib/validation/order";
import { cartTotal, useCartHydrated, useCartStore } from "@/lib/cart/store";

const checkoutFormSchema = checkoutSchema.omit({ items: true, website: true });
type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const hydrated = useCartHydrated();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      comment: "",
      consent: false,
    },
  });

  const consent = useWatch({ control, name: "consent" });

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: "",
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.error ?? "Не удалось оформить заявку. Попробуйте ещё раз.");
        return;
      }

      const data = await res.json();
      clear();
      router.push(`/checkout/success?order=${data.orderNumber}`);
    } catch {
      toast.error("Не удалось оформить заявку. Проверьте подключение к интернету.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!hydrated) {
    return <div className="mx-auto max-w-4xl px-4 py-14" />;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-xl font-semibold">Корзина пуста</h1>
        <p className="mt-2 text-muted-foreground">
          Добавьте товары из каталога, чтобы оформить заявку.
        </p>
        <Link href="/catalog" className={buttonVariants({ className: "mt-6" })}>
          Перейти в каталог
        </Link>
      </div>
    );
  }

  const total = cartTotal(items);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Оформление заказа
      </h1>
      <p className="mt-2 text-muted-foreground">
        Заполните форму — мы свяжемся с вами для уточнения деталей и оплаты.
      </p>

      <div className="mt-8 grid gap-10 sm:grid-cols-[1fr_320px]">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerName">Имя</Label>
            <Input id="customerName" {...register("customerName")} autoComplete="name" />
            {errors.customerName && (
              <p className="text-sm text-destructive">{errors.customerName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+7 900 000-00-00"
              {...register("phone")}
              autoComplete="tel"
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Адрес доставки</Label>
            <Input id="address" {...register("address")} autoComplete="street-address" />
            {errors.address && (
              <p className="text-sm text-destructive">{errors.address.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="comment">Комментарий (необязательно)</Label>
            <Textarea id="comment" rows={3} {...register("comment")} />
          </div>

          <div className="flex items-start gap-2.5">
            <Checkbox
              id="consent"
              checked={consent === true}
              onCheckedChange={(checked) => setValue("consent", checked === true, { shouldValidate: true })}
            />
            <Label htmlFor="consent" className="text-sm font-normal leading-snug">
              Я согласен(на) на{" "}
              <Link href="/privacy" className="underline hover:no-underline" target="_blank">
                обработку персональных данных
              </Link>
            </Label>
          </div>
          {errors.consent && (
            <p className="-mt-3 text-sm text-destructive">{errors.consent.message}</p>
          )}

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Отправляем..." : "Отправить заявку"}
          </Button>
        </form>

        <aside className="h-fit rounded-lg border p-4">
          <div className="mb-3 font-medium">Ваш заказ</div>
          <ul className="flex flex-col gap-2 text-sm">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.variantId ?? "base"}`}
                className="flex justify-between gap-2"
              >
                <span className="text-muted-foreground">
                  {item.name}
                  {item.variantName ? ` (${item.variantName})` : ""} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
            <span>Итого</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
