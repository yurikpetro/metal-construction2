// Документы, доступные для скачивания на сайте.
// Файлы лежат в public/docs и отдаются по прямым ссылкам.
export type SiteDocument = {
  slug: string;
  title: string;
  description: string;
  href: string;
  format: "PDF" | "DOCX";
  size: string;
  meta?: string;
};

export const siteDocuments: SiteDocument[] = [
  {
    slug: "sertifikat-sootvetstviya",
    title: "Сертификат соответствия",
    description:
      "Конструкции строительные сварные: элементы безопасности кровли — снегозадержатели, кровельные ограждения, кровельные мостики, кровельные и фасадные лестницы (Н1200, Н900, Н600).",
    href: "/docs/sertifikat-sootvetstviya.pdf",
    format: "PDF",
    size: "0,8 МБ",
    meta: "РОСС RU.32766.04ПГС0.ОС02.02985 · действует с 15.08.2025 по 14.08.2028",
  },
  {
    slug: "protokol-ispytaniy",
    title: "Протокол испытаний",
    description:
      "Протокол испытаний (исследований) испытательной лаборатории ООО «Прогресс» — основание для выдачи сертификата соответствия.",
    href: "/docs/protokol-ispytaniy.pdf",
    format: "PDF",
    size: "0,9 МБ",
    meta: "№ 3731-ПРО/25 от 14.08.2025",
  },
  {
    slug: "pasport-izdeliya",
    title: "Паспорт изделия «Ограждения кровельные»",
    description:
      "Назначение и технические характеристики, условия применения, требования к монтажу, хранению и транспортировке, комплектация и гарантийные обязательства.",
    href: "/docs/pasport-krovelnye-ograzhdeniya.docx",
    format: "DOCX",
    size: "37 КБ",
    meta: "ОКПД2 25.11.23.110 · 25.11.23.110-001-2025 ПС",
  },
];
