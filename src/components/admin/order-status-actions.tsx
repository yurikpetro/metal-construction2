"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_TRANSITIONS } from "@/lib/order-status";
import { updateOrderStatusAction } from "@/lib/actions/orders";
import type { OrderStatus } from "@/generated/prisma/enums";

export function OrderStatusActions({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();
  const transitions = ORDER_STATUS_TRANSITIONS[status];

  if (transitions.length === 0) {
    return null;
  }

  function handleClick(toStatus: OrderStatus) {
    startTransition(async () => {
      try {
        await updateOrderStatusAction(orderId, toStatus);
        toast.success("Статус заявки обновлён");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Не удалось изменить статус");
      }
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {transitions.map((t) => (
        <Button
          key={t.to}
          variant={t.variant === "destructive" ? "outline" : "default"}
          className={t.variant === "destructive" ? "text-destructive hover:text-destructive" : ""}
          disabled={pending}
          onClick={() => handleClick(t.to)}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
