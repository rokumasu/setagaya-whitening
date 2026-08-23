"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { clearAdminSession, isAdminAuthenticated } from "@/lib/adminAuth";

const VALID_STATES = ["online", "busy", "offline"];

export async function setDoctorStatus(state: string, _formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  if (!VALID_STATES.includes(state)) {
    return;
  }

  const supabase = createAdminClient();
  await supabase
    .from("doctor_status")
    .update({ state, updated_at: new Date().toISOString() })
    .eq("id", 1);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function setDoctorName(formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const doctorName = String(formData.get("doctorName") ?? "").trim();

  const supabase = createAdminClient();
  await supabase
    .from("doctor_status")
    .update({ doctor_name: doctorName || null, updated_at: new Date().toISOString() })
    .eq("id", 1);

  revalidatePath("/admin");
  revalidatePath("/");
}

export async function adminLogout() {
  await clearAdminSession();
  redirect("/admin/login");
}
