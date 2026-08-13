import { redirect } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/session";
import { AdminHeader } from "@/components/admin/admin-header";

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
