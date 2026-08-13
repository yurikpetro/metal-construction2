import type { Metadata } from "next";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const metadata: Metadata = { title: "Настройки", robots: { index: false } };

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Настройки</h1>

      <div className="mt-6 rounded-lg border bg-background p-4">
        <div className="mb-4 font-medium">Смена пароля</div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
