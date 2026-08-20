import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  alternates: { canonical: "/privacy" },
  // Юридическая страница не нужна в выдаче, но ссылки с неё должны работать
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Политика конфиденциальности" }]} />

      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        Политика обработки персональных данных
      </h1>

      <div className="mt-6 flex flex-col gap-5 text-sm leading-relaxed text-muted-foreground">
        <p>
          Настоящая политика определяет порядок обработки персональных данных
          пользователей сайта {siteConfig.name}. Оператором персональных
          данных является {siteConfig.legalName}, ИНН {siteConfig.inn} (далее
          — «Оператор»), в соответствии с требованиями Федерального закона от
          27.07.2006 №152-ФЗ «О персональных данных».
        </p>

        <section>
          <h2 className="mb-1.5 font-medium text-foreground">
            1. Какие данные мы собираем
          </h2>
          <p>
            При оформлении заявки на сайте Оператор собирает: имя, номер
            телефона, адрес доставки и комментарий к заказу, указанные
            пользователем добровольно в форме заказа.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-medium text-foreground">
            2. Цели обработки данных
          </h2>
          <p>
            Персональные данные используются исключительно для обработки
            заявки, связи с покупателем для уточнения деталей заказа, оплаты
            и отправки товара.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-medium text-foreground">
            3. Передача данных третьим лицам
          </h2>
          <p>
            Оператор не передаёт персональные данные третьим лицам, за
            исключением случаев, необходимых для выполнения заказа (например,
            передача адреса доставки транспортной компании), либо когда это
            прямо предусмотрено законодательством РФ.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-medium text-foreground">
            4. Хранение и защита данных
          </h2>
          <p>
            Оператор принимает необходимые организационные и технические меры
            для защиты персональных данных от неправомерного доступа,
            изменения, раскрытия или уничтожения.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-medium text-foreground">
            5. Права пользователя
          </h2>
          <p>
            Пользователь вправе запросить уточнение, блокирование или
            удаление своих персональных данных, отозвав согласие на их
            обработку, обратившись по контактам, указанным на сайте.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-medium text-foreground">6. Контакты</h2>
          <p>
            По вопросам обработки персональных данных: {siteConfig.email},{" "}
            {siteConfig.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}
