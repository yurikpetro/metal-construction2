import type { Metadata } from "next";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { siteDocuments } from "@/lib/documents";

const TITLE = "Документы и сертификаты на кровельные ограждения";
const DESCRIPTION =
  "Сертификат соответствия, протокол лабораторных испытаний и паспорт изделия " +
  "на кровельные ограждения — скачайте в PDF и DOCX.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/documents" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/documents",
    type: "website",
  },
};

export default function DocumentsPage() {
  return (
    <div className="container-narrow py-10 sm:py-14 xl:py-16">
      <Breadcrumbs items={[{ name: "Документы и сертификаты" }]} />

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl xl:text-4xl">
        Документы и сертификаты
      </h1>
      <p className="mt-2 text-muted-foreground xl:mt-3 xl:text-lg">
        Продукция сертифицирована и прошла лабораторные испытания. Все документы
        доступны для скачивания — при отгрузке они предоставляются вместе с
        товаром.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {siteDocuments.map((doc) => (
          <div
            key={doc.slug}
            className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start xl:p-5"
          >
            <div className="w-fit rounded-md bg-primary/10 p-2 text-primary">
              <FileText className="size-5" />
            </div>

            <div className="flex-1">
              <div className="font-medium xl:text-lg">{doc.title}</div>
              {doc.meta && (
                <div className="mt-1 text-sm text-muted-foreground">
                  {doc.meta}
                </div>
              )}
              <p className="mt-2 text-sm text-muted-foreground xl:text-base">
                {doc.description}
              </p>
              <div className="mt-1 text-xs text-muted-foreground">
                {doc.format} · {doc.size}
              </div>
            </div>

            <a
              href={doc.href}
              download
              className="inline-flex items-center gap-2 self-start text-sm font-medium text-primary hover:underline"
            >
              <Download className="size-4" />
              Скачать
            </a>
          </div>
        ))}
      </div>

      <section className="mt-12 xl:mt-14">
        <h2 className="text-lg font-semibold tracking-tight xl:text-xl">
          Зачем нужны эти документы
        </h2>
        <div className="mt-3 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground xl:text-base">
          <p>
            Сертификат соответствия подтверждает, что наши сварные кровельные
            ограждения соответствуют требованиям к элементам безопасности
            кровли (полный перечень видов конструкций, на которые выдан
            сертификат, указан в самом документе). Основанием для его выдачи
            служит протокол лабораторных испытаний.
          </p>
          <p>
            Паспорт изделия нужен монтажникам и приёмочной комиссии: в нём
            указаны назначение и технические характеристики, условия
            применения, требования к монтажу, хранению и транспортировке,
            комплектация и гарантийные обязательства.
          </p>
          <p>
            Выбрать конструкции можно в{" "}
            <Link href="/catalog" className="text-primary hover:underline">
              каталоге
            </Link>
            , вопросы по комплектации — по телефону из раздела{" "}
            <Link href="/contacts" className="text-primary hover:underline">
              «Контакты»
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
