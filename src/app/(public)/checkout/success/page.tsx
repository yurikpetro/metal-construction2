import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

// robots: { index: false } наследуется из checkout/layout.tsx
export const metadata: Metadata = {
  title: "Заявка принята",
};

interface Props {
  searchParams: Promise<{ order?: string }>;
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { order } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-xl px-4 sm:px-6 py-16 text-center">
      <CircleCheck className="mx-auto size-12 text-primary" />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {order ? `Заявка №${order} принята` : "Заявка принята"}
      </h1>
      <p className="mt-3 text-muted-foreground">
        Мы свяжемся с вами по указанному телефону в ближайшее время, чтобы
        уточнить детали заказа, оплату и отправку. Если у вас срочный вопрос —
        позвоните нам сами: {siteConfig.phone}.
      </p>
      <Link href="/catalog" className={buttonVariants({ className: "mt-8" })}>
        Вернуться в каталог
      </Link>
    </div>
  );
}
