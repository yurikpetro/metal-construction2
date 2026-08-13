import { startOfMonth } from "date-fns";
import { prisma } from "@/lib/db";
import { getOrderStatusCounts } from "@/lib/orders";

export async function getDashboardStats() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const thirtyDaysAgo = new Date(now.getTime() - 29 * 24 * 60 * 60 * 1000);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [statusCounts, monthOrders, recentOrders, topProductsRaw] = await Promise.all([
    getOrderStatusCounts(),
    prisma.order.findMany({
      where: { createdAt: { gte: monthStart }, status: { not: "CANCELLED" } },
      select: { totalAmount: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 3,
    }),
  ]);

  const monthRevenue = monthOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const days: { date: string; label: string; count: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
      count: 0,
    });
  }
  const dayIndex = new Map(days.map((d, idx) => [d.date, idx]));
  for (const order of recentOrders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    const idx = dayIndex.get(key);
    if (idx !== undefined) days[idx].count++;
  }

  return {
    statusCounts,
    monthOrderCount: monthOrders.length,
    monthRevenue,
    last30Days: days,
    topProducts: topProductsRaw.map((p) => ({
      name: p.productName,
      quantity: p._sum.quantity ?? 0,
    })),
  };
}
