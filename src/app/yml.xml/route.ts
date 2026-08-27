import { createHash } from "node:crypto";
import { getActiveProducts } from "@/lib/products";
import { absoluteUrl, SITE_URL } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";

/**
 * Товарный фид в формате YML (Yandex Market Language) для Яндекс Товаров —
 * сервиса, который наполняет блок «Популярные товары по запросу» и вкладку
 * «Товары» в выдаче. Ссылку на этот адрес нужно добавить в личном кабинете
 * merchants.yandex.ru: Товары → Источники данных → Фиды.
 *
 * Формат и требования: https://yandex.ru/support/merchants/ru/connect/form-feed
 *
 * Фид собирается из базы на каждый запрос: Яндекс перепроверяет файл раз в два
 * часа и блокирует предложения, если цена или наличие в фиде разошлись с сайтом.
 */
export const dynamic = "force-dynamic";

/** В каталоге пока одна категория — она же указана в разметке Product. */
const CATEGORY_ID = 1;
const CATEGORY_NAME = "Элементы безопасности кровли";

/**
 * Яндекс требует заменять " & > < ' на сущности и запрещает непечатаемые
 * символы с кодами 0–31, кроме табуляции и переводов строки.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "");
}

/** Текст внутри CDATA нельзя экранировать, но нужно разорвать закрывающую скобку. */
function cdata(value: string): string {
  return `<![CDATA[${value.replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
}

/**
 * Идентификатор предложения. Он должен быть постоянным: при смене id Яндекс
 * считает предложение новым и обнуляет накопленную по нему статистику.
 * Берём короткий хеш от id записи в базе — он переживает переименование
 * товара и изменение порядка в каталоге.
 */
function offerId(seed: string): string {
  return createHash("sha1").update(seed).digest("hex").slice(0, 16);
}

/**
 * Дата по RFC 3339 с обязательным часовым поясом. Секунды без миллисекунд —
 * как в примере из документации Яндекса.
 */
function rfc3339(date: Date): string {
  return `${date.toISOString().slice(0, 19)}+00:00`;
}

export async function GET() {
  const products = await getActiveProducts();

  const offers = products.flatMap((product) => {
    const url = absoluteUrl(`/catalog/${product.slug}`);
    const pictures = product.images.map((image) => absoluteUrl(image.url));

    // У товара с исполнениями каждое из них — отдельное предложение со своей
    // ценой: так покупатель, который ищет «ограждение Н900», видит нужную цену.
    // Если исполнений нет, предложение одно, по базовой цене.
    const items =
      product.variants.length > 0
        ? product.variants.map((variant) => ({
            seed: variant.id,
            name: `${product.name} ${variant.name}`,
            price: variant.price,
          }))
        : [{ seed: product.id, name: product.name, price: product.basePrice }];

    return items.map((item) =>
      [
        `<offer id="${offerId(item.seed)}" available="true">`,
        `<name>${escapeXml(item.name)}</name>`,
        `<url>${escapeXml(url)}</url>`,
        `<price>${item.price}</price>`,
        `<currencyId>RUB</currencyId>`,
        `<categoryId>${CATEGORY_ID}</categoryId>`,
        `<vendor>${escapeXml(siteConfig.name)}</vendor>`,
        ...pictures.map((picture) => `<picture>${escapeXml(picture)}</picture>`),
        `<description>${cdata(`<p>${product.description}</p>`)}</description>`,
        `</offer>`,
      ].join("\n"),
    );
  });

  const body = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<yml_catalog date="${rfc3339(new Date())}">`,
    `<shop>`,
    `<name>${escapeXml(siteConfig.name)}</name>`,
    `<company>${escapeXml(siteConfig.legalName)}</company>`,
    `<url>${escapeXml(SITE_URL)}</url>`,
    `<email>${escapeXml(siteConfig.email)}</email>`,
    `<currencies><currency id="RUB" rate="1"/></currencies>`,
    `<categories><category id="${CATEGORY_ID}">${escapeXml(CATEGORY_NAME)}</category></categories>`,
    `<offers>`,
    ...offers,
    `</offers>`,
    `</shop>`,
    `</yml_catalog>`,
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      // Фид тянет робот, а не браузер: короткий кеш снимает нагрузку
      // при частых проверках, но не даёт данным устареть.
      "Cache-Control": "public, max-age=600",
    },
  });
}
