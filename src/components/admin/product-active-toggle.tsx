"use client";

import { useState, useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleProductActiveAction } from "@/lib/actions/products";

export function ProductActiveToggle({
  productId,
  initialActive,
}: {
  productId: string;
  initialActive: boolean;
}) {
  const [active, setActive] = useState(initialActive);
  const [pending, startTransition] = useTransition();

  return (
    <Switch
      checked={active}
      disabled={pending}
      aria-label={active ? "Скрыть с сайта" : "Показать на сайте"}
      onCheckedChange={(checked) => {
        setActive(checked);
        startTransition(() => toggleProductActiveAction(productId, checked));
      }}
    />
  );
}
