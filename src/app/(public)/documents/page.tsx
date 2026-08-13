import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { siteDocuments } from "@/lib/documents";

export const metadata: Metadata = {
  title: "Документы и сертификаты",
  description:
    "Сертификат соответствия, протокол испытаний и паспорт изделия на кровельные ограждения — скачайте в PDF и DOCX.",
};

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Документы и сертификаты
      </h1>
      <p className="mt-2 text-muted-foreground">
        Продукция сертифицирована и прошла лабораторные испытания. Все документы
        доступны для скачивания — при отгрузке они предоставляются вместе с
        товаром.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {siteDocuments.map((doc) => (
          <div
            key={doc.slug}
            className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-start"
          >
            <div className="w-fit rounded-md bg-primary/10 p-2 text-primary">
              <FileText className="size-5" />
            </div>

            <div className="flex-1">
              <div className="font-medium">{doc.title}</div>
              {doc.meta && (
                <div className="mt-1 text-sm text-muted-foreground">
                  {doc.meta}
                </div>
              )}
              <p className="mt-2 text-sm text-muted-foreground">
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
    </div>
  );
}
