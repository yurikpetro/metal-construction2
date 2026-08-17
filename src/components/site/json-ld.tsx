import type { JsonLd as JsonLdObject } from "@/lib/schema";

/**
 * Выводит structured data в виде <script type="application/ld+json">.
 *
 * JSON.stringify не экранирует HTML, поэтому символ «<» заменяем на его
 * юникод-эскейп: иначе строка вида "</script>" в описании товара,
 * которое админ вводит руками, разорвала бы тег.
 */
export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
