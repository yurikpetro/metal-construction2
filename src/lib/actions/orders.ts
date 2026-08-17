"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ORDER_STATUS_TRANSITIONS } from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma/enums";

export async function updateOrderStatusAction(orderId: number, toStatus: OrderStatus) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new Error("Заявка не найдена");
  }

  const allowed = ORDER_STATUS_TRANSITIONS[order.status].some((t) => t.to === toStatus);
  if (!allowed) {
    throw new Error("Недопустимый переход статуса");
  }

  await prisma.$transaction([
    prisma.order.update({ where: { id: orderId }, data: { status: toStatus } }),
    prisma.orderStatusHistory.create({
      data: { orderId, fromStatus: order.status, toStatus },
    }),
  ]);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
}
