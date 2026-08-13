import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
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

  const products = [
    {
      slug: "krovelnoe-ograzhdenie",
      name: "Кровельное ограждение",
      description:
        "Секционное металлическое ограждение для плоской кровли. Защищает края крыши при обслуживании и обеспечивает безопасность при работе на высоте. Порошковая окраска, устойчивость к коррозии и погодным условиям.",
      basePrice: 4500,
      sortOrder: 0,
      variants: [
        { name: "Секция 3 м", price: 4500, sortOrder: 0 },
        { name: "Секция 6 м", price: 8500, sortOrder: 1 },
      ],
    },
    {
      slug: "snegozaderzhatel-trubchatyy",
      name: "Снегозадержатель трубчатый",
      description:
        "Трубчатый снегозадержатель для кровли — предотвращает лавинообразный сход снега и наледи с крыши. Прочная стальная конструкция, простой монтаж.",
      basePrice: 2200,
      sortOrder: 1,
      variants: [],
    },
    {
      slug: "perehodnoy-mostik-krovelnyy",
      name: "Переходной мостик кровельный",
      description:
        "Кровельный мостик для безопасного перемещения по крыше во время обслуживания. Противоскользящая поверхность, устойчив к нагрузке.",
      basePrice: 3200,
      sortOrder: 2,
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

  console.log("Сид выполнен: админ и 3 демо-товара созданы.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
