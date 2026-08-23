"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function markShipped(orderId: string, _formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const supabase = createAdminClient();
  await supabase
    .from("orders")
    .update({ shipping_status: "shipped" })
    .eq("id", orderId);

  revalidatePath("/admin/orders");
}
