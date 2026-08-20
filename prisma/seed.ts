import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminUsername = process.env.ADMIN_SEED_USERNAME ?? "admin";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "changeme123";

  await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      passwordHash: await bcrypt.hash(adminPassword, 10),
      displayName: "Администратор",
    },
  });

  // Сейчас в производстве только две позиции. Тексты и цены — ориентировочные,
  // реальные значения владелец задаёт в админке.
  const products = [
    {
      slug: "krovelnoe-ograzhdenie",
      name: "Кровельное ограждение",
      description:
        "Секционное кровельное ограждение из стальной трубы Ø25 мм со стенкой 1 мм. Исполнения Н600, Н900 и Н1200 (высота 600, 900 и 1200 мм), длина секции L3000 мм. Крепится к кровельным кронштейнам, монтируется без спецтехники. Порошковая окраска — защита от коррозии и погодных нагрузок.",
      basePrice: 4500,
      sortOrder: 0,
      variants: [
        { name: "Н600, L3000 мм", price: 4500, sortOrder: 0 },
        { name: "Н900, L3000 мм", price: 5500, sortOrder: 1 },
        { name: "Н1200, L3000 мм", price: 6500, sortOrder: 2 },
      ],
    },
    {
      slug: "kostyl-krovelnyy-t-obraznyy",
      name: "Костыль кровельный Т-образный",
      description:
        "Т-образный кровельный костыль из стальной полосы шириной 25 мм: полка 200 мм, стойка 400 мм, три отверстия Ø5 мм под крепёж (шаг 90 мм, нижнее — в 40 мм от края). Крепится к обрешётке по линии карниза, держит карнизную планку и передний край кровельного покрытия, служит опорой для водосточной системы. Цена указана за 1 шт.",
      basePrice: 250,
      sortOrder: 1,
      variants: [],
    },
  ];

  for (const p of products) {
    const { variants, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: productData,
    });

    for (const v of variants) {
      const existing = await prisma.productVariant.findFirst({
        where: { productId: product.id, name: v.name },
      });
      if (!existing) {
        await prisma.productVariant.create({
          data: { ...v, productId: product.id },
        });
      }
    }
  }

  console.log("Сид выполнен: админ и 2 демо-товара созданы.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
