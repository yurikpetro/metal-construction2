import { LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function AdminHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-0">
        <div className="flex items-center justify-between gap-4">
          <span className="font-semibold tracking-tight">Админка</span>
          <div className="flex items-center gap-1 sm:hidden">
            <ThemeToggle />
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="size-4" />
                Выйти
              </Button>
            </form>
          </div>
        </div>

        <AdminNav />

        <div className="hidden items-center gap-1 sm:flex">
          <ThemeToggle />
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" size="sm">
              <LogOut className="size-4" />
              Выйти
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
