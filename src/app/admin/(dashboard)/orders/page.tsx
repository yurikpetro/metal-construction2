import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatusBadge } from "@/components/admin/order-status-badge";
import { getOrders, getOrderStatusCounts } from "@/lib/orders";
import { ALL_ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { formatDateTime, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/generated/prisma/enums";

export const metadata: Metadata = { title: "Заявки", robots: { index: false } };

interface Props {
  searchParams: Promise<{ status?: string; q?: string }>;
}

function isOrderStatus(value: string | undefined): value is OrderStatus {
  return !!value && (ALL_ORDER_STATUSES as string[]).includes(value);
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status: rawStatus, q } = await searchParams;
  const status = isOrderStatus(rawStatus) ? rawStatus : undefined;

  const [orders, counts] = await Promise.all([
    getOrders({ status, search: q }),
    getOrderStatusCounts(),
  ]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  function filterHref(s?: OrderStatus) {
    const params = new URLSearchParams();
    if (s) params.set("status", s);
    if (q) params.set("q", q);
    const qs = params.toString();
    return qs ? `/admin/orders?${qs}` : "/admin/orders";
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Заявки</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={filterHref(undefined)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium",
            !status ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent",
          )}
        >
          Все ({total})
        </Link>
        {ALL_ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={filterHref(s)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium",
              status === s ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent",
            )}
          >
            {ORDER_STATUS_LABELS[s]} ({counts[s]})
          </Link>
        ))}
      </div>

      <form method="GET" className="mt-4 flex max-w-sm gap-2">
        {status && <input type="hidden" name="status" value={status} />}
        <Input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Поиск по имени, телефону, номеру"
        />
        <Button type="submit" variant="secondary" size="icon" aria-label="Найти">
          <Search className="size-4" />
        </Button>
      </form>

      {orders.length === 0 ? (
        <p className="mt-10 text-muted-foreground">Заявок не найдено.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>№</TableHead>
                <TableHead>Дата</TableHead>
                <TableHead>Клиент</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer">
                  <TableCell className="p-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="block px-4 py-2.5 font-medium"
                    >
                      №{order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{order.phone}</TableCell>
                  <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
