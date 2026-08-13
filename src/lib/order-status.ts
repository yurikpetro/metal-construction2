import type { OrderStatus } from "@/generated/prisma/enums";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  NEW: "Новая",
  PROCESSING: "В обработке",
  CONFIRMED: "Подтверждён",
  DONE: "Выполнен",
  CANCELLED: "Отменён",
};

export const ORDER_STATUS_BADGE_CLASS: Record<OrderStatus, string> = {
  NEW: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  PROCESSING: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  CONFIRMED: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  DONE: "bg-green-500/10 text-green-600 dark:text-green-400",
  CANCELLED: "bg-muted text-muted-foreground",
};

export const ORDER_STATUS_TRANSITIONS: Record<
  OrderStatus,
  { to: OrderStatus; label: string; variant?: "destructive" }[]
> = {
  NEW: [
    { to: "PROCESSING", label: "Взять в обработку" },
    { to: "CANCELLED", label: "Отменить", variant: "destructive" },
  ],
  PROCESSING: [
    { to: "CONFIRMED", label: "Подтвердить заказ" },
    { to: "CANCELLED", label: "Отменить", variant: "destructive" },
  ],
  CONFIRMED: [
    { to: "DONE", label: "Заказ выполнен" },
    { to: "CANCELLED", label: "Отменить", variant: "destructive" },
  ],
  DONE: [],
  CANCELLED: [],
};

export const ALL_ORDER_STATUSES: OrderStatus[] = [
  "NEW",
  "PROCESSING",
  "CONFIRMED",
  "DONE",
  "CANCELLED",
];
