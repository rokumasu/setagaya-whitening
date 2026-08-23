"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import type { StockState } from "@/lib/stock";

const VALID_STATES: StockState[] = ["in_stock", "low_stock", "out_of_stock"];

export async function updateStock(concentration: number, formData: FormData) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  const status = String(formData.get("status") ?? "");
  if (!VALID_STATES.includes(status as StockState)) {
    return;
  }

  const rawCount = String(formData.get("low_stock_count") ?? "").trim();
  const lowStockCount =
    status === "low_stock" && rawCount !== "" ? Number(rawCount) : null;

  const supabase = createAdminClient();
  await supabase
    .from("stock_status")
    .update({
      status,
      low_stock_count: lowStockCount,
      updated_at: new Date().toISOString(),
    })
    .eq("concentration", concentration);

  revalidatePath("/admin/stock");
  revalidatePath("/order");
  revalidatePath("/");
}
