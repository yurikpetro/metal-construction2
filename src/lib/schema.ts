/**
 * Построение JSON-LD (schema.org) разметки.
 *
 * Разметку читают и Google (расширенные сниппеты: цена, наличие, крошки,
 * блок вопрос-ответ), и Яндекс (карточка организации, быстрые ссылки),
 * поэтому она собирается из одного места — чтобы @id сущностей совпадали
 * на всех страницах и поисковик склеивал их в один граф.
 *
 * Проверять результат: https://validator.schema.org/ и
 * https://search.google.com/test/rich-results
 */
import { SITE_NAME, SITE_DESCRIPTION, siteConfig } from "@/lib/site-config";
import { SITE_URL, absoluteUrl, OG_IMAGE } from "@/lib/seo";
import type { ProductWithRelations } from "@/lib/products";

export type JsonLd = Record<string, unknown>;

/** Стабильные идентификаторы сущностей — на них ссылаются остальные схемы. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/** Организация + локальный бизнес: карточка компании в выдаче и на картах. */
export function organizationSchema(): JsonLd {
  return {
    "@type": ["Organization", "LocalBusiness"],
    "@id": ORGANIZATION_ID,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon-512.png"),
      width: 512,
      height: 512,
    },
    image: absoluteUrl(OG_IMAGE.url),
    telephone: siteConfig.phoneE164,
    email: siteConfig.email,
    taxID: siteConfig.inn,
    vatID: siteConfig.inn,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.postalAddress.street,
      addressLocality: siteConfig.postalAddress.locality,
      addressRegion: siteConfig.postalAddress.region,
      addressCountry: siteConfig.postalAddress.country,
    },
    areaServed: siteConfig.areaServed.map((name) => ({
      "@type": "AdministrativeArea",
      name,
    })),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phoneE164,
      email: siteConfig.email,
      contactType: "sales",
      areaServed: "RU",
      availableLanguage: "Russian",
    },
    ...(siteConfig.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: siteConfig.geo.lat,
        longitude: siteConfig.geo.lon,
      },
    }),
    ...(siteConfig.openingHours?.length && {
      openingHours: siteConfig.openingHours,
    }),
    ...(siteConfig.sameAs.length > 0 && { sameAs: siteConfig.sameAs }),
  };
}

/** Сайт как сущность — связывает страницы с организацией-издателем. */
export function websiteSchema(): JsonLd {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "ru-RU",
    publisher: { "@id": ORGANIZATION_ID },
  };
}

export interface BreadcrumbItem {
  name: string;
  /** Путь от корня сайта; у последнего элемента можно не указывать. */
  href?: string;
}

/** Хлебные крошки — Google показывает их вместо URL в сниппете. */
export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href && { item: absoluteUrl(item.href) }),
    })),
  };
}

/**
 * Товар с ценой и наличием. При наличии вариантов отдаём AggregateOffer
 * с диапазоном «от … до …», иначе обычный Offer.
 */
export function productSchema(product: ProductWithRelations): JsonLd {
  const url = absoluteUrl(`/catalog/${product.slug}`);
  const images = product.images.map((image) => absoluteUrl(image.url));
  const prices = product.variants.map((variant) => variant.price);

  const offerBase = {
    priceCurrency: "RUB",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    url,
    seller: { "@id": ORGANIZATION_ID },
  };

  return {
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    sku: product.slug,
    ...(images.length > 0 && { image: images }),
    url,
    category: "Элементы безопасности кровли",
    brand: { "@type": "Brand", name: siteConfig.name },
    manufacturer: { "@id": ORGANIZATION_ID },
    offers:
      prices.length > 0
        ? {
            "@type": "AggregateOffer",
            ...offerBase,
            lowPrice: Math.min(...prices),
            highPrice: Math.max(...prices),
            offerCount: prices.length,
          }
        : {
            "@type": "Offer",
            ...offerBase,
            price: product.basePrice,
          },
  };
}

/** Список товаров каталога — помогает поисковику понять структуру раздела. */
export function itemListSchema(
  products: { slug: string; name: string }[],
  listName: string,
): JsonLd {
  return {
    "@type": "ItemList",
    name: listName,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: product.name,
      url: absoluteUrl(`/catalog/${product.slug}`),
    })),
  };
}

/** Блок «вопрос — ответ». Может выводиться в выдаче раскрывающимся списком. */
export function faqSchema(items: { question: string; answer: string }[]): JsonLd {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Страница контактов. */
export function contactPageSchema(): JsonLd {
  return {
    "@type": "ContactPage",
    "@id": `${absoluteUrl("/contacts")}#contactpage`,
    url: absoluteUrl("/contacts"),
    name: `Контакты — ${siteConfig.name}`,
    inLanguage: "ru-RU",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    mainEntity: { "@id": ORGANIZATION_ID },
  };
}

/**
 * Собирает несколько схем в один @graph — так на странице остаётся
 * единственный тег ld+json, а сущности связаны между собой через @id.
 */
export function graph(...schemas: JsonLd[]): JsonLd {
  return { "@context": "https://schema.org", "@graph": schemas };
}
