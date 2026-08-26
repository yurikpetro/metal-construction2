import Script from "next/script";

export function YandexMetrika() {
  const id = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;
  if (!id) return null;

  return (
    <>
      {/* Соединение с сервером счётчика открывается заранее — скрипт стартует быстрее
          и не задерживает загрузку основного контента */}
      <link rel="preconnect" href="https://mc.yandex.ru" />
      <link rel="dns-prefetch" href="https://mc.yandex.ru" />

      {/* beforeInteractive — код счётчика попадает в серверный HTML, а не
          вставляется после гидратации. Так его видят проверяющие роботы
          (Вебмастер, SEO-сервисы) и считаются визиты тех, кто ушёл
          со страницы раньше, чем догрузился JS Next.js.
          Работает только в корневом layout — там компонент и вызывается. */}
      <Script id="yandex-metrika" strategy="beforeInteractive">
        {`
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

          ym(${id}, "init", {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true
          });
        `}
      </Script>
      <noscript>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://mc.yandex.ru/watch/${id}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
