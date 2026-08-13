"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CartBadge } from "@/components/site/cart-badge";
import { ThemeToggle } from "@/components/theme-toggle";
import { siteConfig } from "@/lib/site-config";

const NAV_LINKS = [
  { href: "/catalog", label: "Каталог" },
  { href: "/documents", label: "Документы" },
  { href: "/contacts", label: "Контакты" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="border-b bg-secondary/40">
        <div className="mx-auto flex h-8 max-w-6xl items-center px-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3" />
            {siteConfig.city}
          </span>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <Link href="/" className="font-semibold tracking-tight text-lg shrink-0">
            {siteConfig.name}
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/80 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <a
              href={siteConfig.phoneHref}
              className="hidden lg:inline-flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-foreground mr-2"
            >
              <Phone className="size-4" />
              {siteConfig.phone}
            </a>

            <ThemeToggle />
            <CartBadge />

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger
                render={<Button variant="ghost" size="icon" className="md:hidden" />}
                aria-label="Меню"
              >
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>{siteConfig.name}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <a
                    href={siteConfig.phoneHref}
                    className="flex items-center gap-2 rounded-md px-3 py-2.5 text-base font-medium hover:bg-accent"
                  >
                    <Phone className="size-4" />
                    {siteConfig.phone}
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
