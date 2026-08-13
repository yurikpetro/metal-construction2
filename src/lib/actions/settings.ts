"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export interface ChangePasswordState {
  error?: string;
  success?: boolean;
}

export async function changePasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData,
): Promise<ChangePasswordState> {
  const session = await getSession();
  if (!session.adminId) {
    return { error: "Сессия истекла, войдите заново" };
  }

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 6) {
    return { error: "Новый пароль должен содержать не менее 6 символов" };
  }
  if (newPassword !== confirmPassword) {
    return { error: "Пароли не совпадают" };
  }

  const admin = await prisma.adminUser.findUnique({ where: { id: session.adminId } });
  if (!admin || !(await bcrypt.compare(currentPassword, admin.passwordHash))) {
    return { error: "Текущий пароль указан неверно" };
  }

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(newPassword, 10) },
  });

  return { success: true };
}
