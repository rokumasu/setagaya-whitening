"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SaveProfileState = {
  error: string | null;
};

export async function saveProfile(
  _prevState: SaveProfileState,
  formData: FormData
): Promise<SaveProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが確認できませんでした。ログインし直してください。" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const prefecture = String(formData.get("prefecture") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const addressLine1 = String(formData.get("addressLine1") ?? "").trim();
  const addressLine2 = String(formData.get("addressLine2") ?? "").trim();

  if (!name || !phone || !postalCode || !prefecture || !city || !addressLine1) {
    return { error: "すべての必須項目を入力してください。" };
  }

  const { error } = await supabase
    .from("patients")
    .update({
      name,
      phone,
      address: {
        postalCode,
        prefecture,
        city,
        line1: addressLine1,
        line2: addressLine2 || null,
      },
    })
    .eq("id", user.id);

  if (error) {
    return { error: "保存に失敗しました。時間をおいて再度お試しください。" };
  }

  redirect("/mypage");
}
