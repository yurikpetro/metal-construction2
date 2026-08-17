import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkoutSchema } from "@/lib/validation/order";
import { sendTelegramMessage } from "@/lib/notifications/telegram";
import { sendOrderEmail } from "@/lib/notifications/email";
import { isRateLimited } from "@/lib/rate-limit";
import { formatPrice } from "@/lib/format";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (isRateLimited(`orders:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Слишком много запросов. Попробуйте позже." },
      { status: 429 },
    );
  }

  const body = await request.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Проверьте правильность заполнения формы" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  // Honeypot: бот заполнил скрытое поле — тихо отвечаем "успехом", ничего не создавая
  if (data.website) {
    return NextResponse.json({ orderNumber: 0 });
  }

  // Пересчитываем цены и проверяем товары по БД — не доверяем данным от клиента
  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
    include: { variants: true },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const orderItemsData: {
    productId: string;
    variantId: string | null;
    productName: string;
    variantName: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json(
        { error: "Один из товаров больше недоступен" },
        { status: 400 },
      );
    }

    let unitPrice = product.basePrice;
    let variantName: string | null = null;

    if (item.variantId) {
      const variant = product.variants.find(
        (v) => v.id === item.variantId && v.isActive,
      );
      if (!variant) {
        return NextResponse.json(
          { error: "Выбранный вариант товара больше недоступен" },
          { status: 400 },
        );
      }
      unitPrice = variant.price;
      variantName = variant.name;
    }

    const lineTotal = unitPrice * item.quantity;
    orderItemsData.push({
      productId: product.id,
      variantId: item.variantId,
      productName: product.name,
      variantName,
      unitPrice,
      quantity: item.quantity,
      lineTotal,
    });
  }

  const totalAmount = orderItemsData.reduce((sum, i) => sum + i.lineTotal, 0);

  const order = await prisma.order.create({
    data: {
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      comment: data.comment || null,
      consentGiven: true,
      consentAt: new Date(),
      totalAmount,
      items: { create: orderItemsData },
      statusHistory: { create: { toStatus: "NEW" } },
    },
  });

  const itemsText = orderItemsData
    .map(
      (i) =>
        `${i.productName}${i.variantName ? ` (${i.variantName})` : ""} × ${i.quantity} = ${formatPrice(i.lineTotal)}`,
    )
    .join("\n");

  const [telegramOk, emailOk] = await Promise.all([
    sendTelegramMessage(
      `Новая заявка №${order.id}\n` +
        `Имя: ${data.customerName}\n` +
        `Телефон: ${data.phone}\n` +
        `Адрес: ${data.address}\n` +
        (data.comment ? `Комментарий: ${data.comment}\n` : "") +
        `\n${itemsText}\n\nИтого: ${formatPrice(totalAmount)}`,
    ),
    sendOrderEmail({
      orderNumber: order.id,
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      comment: data.comment || null,
      totalAmount,
      itemsText,
    }),
  ]);

  await prisma.order.update({
    where: { id: order.id },
    data: { notifiedTelegram: telegramOk, notifiedEmail: emailOk },
  });

  return NextResponse.json({ orderNumber: order.id });
}
