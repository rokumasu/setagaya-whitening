"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const RESULT_TO_STATUS: Record<string, string> = {
  approved: "approved",
  recheck: "recheck",
  rejected: "suspended",
};

const VALID_RESULTS = Object.keys(RESULT_TO_STATUS);

export async function recordConsultationResult(
  patientId: string,
  result: string,
  _formData: FormData
) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  if (!VALID_RESULTS.includes(result)) {
    return;
  }

  const supabase = createAdminClient();

  await supabase.from("consultations").insert({
    patient_id: patientId,
    scheduled_at: new Date().toISOString(),
    zoom_link: process.env.NEXT_PUBLIC_ZOOM_LINK ?? null,
    result,
  });

  await supabase
    .from("patients")
    .update({
      status: RESULT_TO_STATUS[result],
      last_approved_at:
        result === "approved" ? new Date().toISOString() : undefined,
    })
    .eq("id", patientId);

  revalidatePath(`/admin/patients/${patientId}`);
  revalidatePath("/admin/patients");
}
