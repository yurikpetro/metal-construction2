import { cn } from "@/lib/utils";
import { ORDER_STATUS_BADGE_CLASS, ORDER_STATUS_LABELS } from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma/enums";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        ORDER_STATUS_BADGE_CLASS[status],
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
