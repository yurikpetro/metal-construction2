import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/session";
import { AdminHeader } from "@/components/admin/admin-header";

// Админка закрыта авторизацией и запрещена в robots.txt — метатег добавлен
// третьим уровнем защиты, чтобы страницы не попали в индекс ни при каких настройках.
export const metadata: Metadata = {
  title: { default: "Админка", template: "%s — админка" },
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await isAdminLoggedIn();
  if (!loggedIn) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AdminHeader />
      <main className="flex-1 bg-secondary/20">
        <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
      </main>
    </div>
  );
}
