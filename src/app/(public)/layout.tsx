import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { JsonLd } from "@/components/site/json-ld";
import { graph, organizationSchema, websiteSchema } from "@/lib/schema";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // data-site-shell включает укрупнённую типографику публичного сайта (globals.css)
  return (
    <div data-site-shell className="flex min-h-full flex-col flex-1">
      {/* Организация и сайт описываются один раз на всех публичных страницах —
          остальные схемы ссылаются на них через @id */}
      <JsonLd data={graph(organizationSchema(), websiteSchema())} />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
