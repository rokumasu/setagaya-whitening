"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminPassword } from "@/lib/adminAuth";

export type AdminLoginState = {
  error: string | null;
};

export async function adminLogin(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const password = String(formData.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    return { error: "パスワードが正しくありません。" };
  }

  await createAdminSession();
  redirect("/admin");
}
