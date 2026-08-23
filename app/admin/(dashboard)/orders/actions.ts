"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { sendShippingNotificationEmail } from "@/lib/orderEmails";
import type { ConcentrationMixItem, Plan } from "@/lib/pricing";

export async function markShipped(orderId: string, _formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .update({ shipping_status: "shipped" })
    .eq("id", orderId)
    .select("patient_id, plan, concentration_mix")
    .single();

  if (order) {
    const { data: patient } = await supabase
      .from("patients")
      .select("name")
      .eq("id", order.patient_id)
      .single();
    const { data: userData } = await supabase.auth.admin.getUserById(
      order.patient_id
    );

    if (patient && userData.user?.email) {
      await sendShippingNotificationEmail({
        to: userData.user.email,
        patientName: patient.name ?? "",
        plan: order.plan as Plan,
        concentrationMix: order.concentration_mix as ConcentrationMixItem[],
      });
    }
  }

  revalidatePath("/admin/orders");
}
