import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { OrderStatusActions } from "@/components/admin/order-status-actions";
import { getOrderById } from "@/lib/orders";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import { formatDateTime, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Заявка", robots: { index: false } };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Заявка №{order.orderNumber}
          </h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Оформлена {formatDateTime(order.createdAt)}
        </p>

        <div className="mt-6 rounded-lg border bg-background p-4">
          <div className="mb-3 font-medium">Покупатель</div>
          <dl className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
            <dt className="text-muted-foreground">Имя</dt>
            <dd>{order.customerName}</dd>
            <dt className="text-muted-foreground">Телефон</dt>
            <dd>
              <a
                href={`tel:${order.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
              >
                <Phone className="size-3.5" />
                {order.phone}
              </a>
            </dd>
            <dt className="text-muted-foreground">Адрес</dt>
            <dd>{order.address}</dd>
            {order.comment && (
              <>
                <dt className="text-muted-foreground">Комментарий</dt>
                <dd>{order.comment}</dd>
              </>
            )}
          </dl>
        </div>

        <div className="mt-6 rounded-lg border bg-background p-4">
          <div className="mb-3 font-medium">Состав заказа</div>
          <ul className="flex flex-col divide-y">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 py-2 text-sm">
                <span>
                  {item.productName}
                  {item.variantName ? ` (${item.variantName})` : ""} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium">{formatPrice(item.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t pt-3 font-semibold">
            <span>Итого</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-lg border bg-background p-4">
          <div className="mb-3 font-medium">История статусов</div>
          <ul className="flex flex-col gap-2 text-sm">
            {order.statusHistory.map((h) => (
              <li key={h.id} className="flex justify-between gap-4 text-muted-foreground">
                <span>
                  {h.fromStatus ? `${ORDER_STATUS_LABELS[h.fromStatus]} → ` : ""}
                  {ORDER_STATUS_LABELS[h.toStatus]}
                </span>
                <span>{formatDateTime(h.changedAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside className="h-fit rounded-lg border bg-background p-4 lg:sticky lg:top-6">
        <div className="mb-3 font-medium">Изменить статус</div>
        <OrderStatusActions orderId={order.id} status={order.status} />
      </aside>
    </div>
  );
}
