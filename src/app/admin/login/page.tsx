import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/login-form";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Вход в админку",
  robots: { index: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-lg border p-6">
        <h1 className="text-xl font-semibold">Вход в админку</h1>
        <p className="mt-1 text-sm text-muted-foreground">{siteConfig.name}</p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
