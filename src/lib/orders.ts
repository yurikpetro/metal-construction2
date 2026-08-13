import { prisma } from "@/lib/db";
import type { OrderStatus } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

export async function getOrders({
  status,
  search,
}: {
  status?: OrderStatus;
  search?: string;
} = {}) {
  const where: Prisma.OrderWhereInput = {};

  if (status) {
    where.status = status;
  }

  if (search && search.trim()) {
    const term = search.trim();
    const asNumber = Number(term);
    where.OR = [
      { customerName: { contains: term, mode: "insensitive" } },
      { phone: { contains: term } },
      ...(!Number.isNaN(asNumber) ? [{ orderNumber: asNumber }] : []),
    ];
  }

  return prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 200,
  });
}

export async function getOrderStatusCounts(): Promise<Record<OrderStatus, number>> {
  const groups = await prisma.order.groupBy({
    by: ["status"],
    _count: true,
  });

  const counts: Record<OrderStatus, number> = {
    NEW: 0,
    PROCESSING: 0,
    CONFIRMED: 0,
    DONE: 0,
    CANCELLED: 0,
  };

  for (const g of groups) {
    counts[g.status] = g._count;
  }

  return counts;
}

export function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      statusHistory: { orderBy: { changedAt: "asc" } },
    },
  });
}
