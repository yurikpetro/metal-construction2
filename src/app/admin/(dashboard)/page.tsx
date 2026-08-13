import type { Metadata } from "next";
import Link from "next/link";
import { OrdersChart } from "@/components/admin/orders-chart";
import { getDashboardStats } from "@/lib/stats";
import { ALL_ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/order-status";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Дашборд", robots: { index: false } };

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Дашборд</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {ALL_ORDER_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className="rounded-lg border bg-background p-4 transition-colors hover:bg-accent"
          >
            <div className="text-2xl font-semibold">{stats.statusCounts[s]}</div>
            <div className="text-sm text-muted-foreground">{ORDER_STATUS_LABELS[s]}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border bg-background p-4">
          <div className="mb-2 font-medium">Заявки за последние 30 дней</div>
          <OrdersChart data={stats.last30Days} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border bg-background p-4">
            <div className="mb-3 font-medium">Этот месяц</div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Заявок</span>
              <span className="font-semibold">{stats.monthOrderCount}</span>
            </div>
            <div className="mt-1.5 flex justify-between text-sm">
              <span className="text-muted-foreground">Выручка (оценка)</span>
              <span className="font-semibold">{formatPrice(stats.monthRevenue)}</span>
            </div>
          </div>

          <div className="rounded-lg border bg-background p-4">
            <div className="mb-3 font-medium">Топ товаров</div>
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Пока нет данных</p>
            ) : (
              <ol className="flex flex-col gap-2 text-sm">
                {stats.topProducts.map((p, i) => (
                  <li key={p.name} className="flex justify-between gap-2">
                    <span>
                      {i + 1}. {p.name}
                    </span>
                    <span className="shrink-0 font-medium text-muted-foreground">
                      {p.quantity} шт.
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
