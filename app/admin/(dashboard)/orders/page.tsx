import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { PLANS, formatConcentrationMix, type ConcentrationMixItem, type Plan } from "@/lib/pricing";
import { markShipped } from "./actions";

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "決済待ち",
  paid: "支払い完了",
  failed: "失敗",
};

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();

  const [{ data: orders }, { data: usersData }, { data: patients }] =
    await Promise.all([
      supabase
        .from("orders")
        .select(
          "id, patient_id, plan, concentration_mix, amount, payment_status, shipping_status, created_at"
        )
        .order("created_at", { ascending: false }),
      supabase.auth.admin.listUsers(),
      supabase.from("patients").select("id, name"),
    ]);

  const emailById = new Map(
    (usersData?.users ?? []).map((u) => [u.id, u.email ?? ""])
  );
  const nameById = new Map((patients ?? []).map((p) => [p.id, p.name]));

  const unshippedCount = (orders ?? []).filter(
    (o) => o.payment_status === "paid" && o.shipping_status !== "shipped"
  ).length;

  return (
    <main className="auth-page">
      <div className="auth-shell admin-shell">
        <div className="auth-logo">世田谷ホワイトニング 管理画面</div>

        <div className="auth-card">
          <h1>注文一覧</h1>
          <p className="auth-lead">
            全 {orders?.length ?? 0} 件（未発送 {unshippedCount} 件）
          </p>

          <div className="admin-patient-list">
            {(orders ?? []).map((order) => (
              <div key={order.id} className="admin-order-row">
                <div>
                  <strong>
                    {nameById.get(order.patient_id) || "(未登録)"}
                  </strong>
                  <span className="admin-patient-email">
                    {emailById.get(order.patient_id) ?? ""}
                  </span>
                  <span className="admin-patient-email">
                    {PLANS[order.plan as Plan]?.label ?? `${order.plan}本`}
                    （
                    {formatConcentrationMix(
                      order.concentration_mix as ConcentrationMixItem[]
                    )}
                    ） ・ {order.amount.toLocaleString()}円 ・{" "}
                    {new Date(order.created_at).toLocaleString("ja-JP")}
                  </span>
                </div>
                <div className="admin-order-actions">
                  <span
                    className={`admin-patient-status admin-patient-status-${order.payment_status === "paid" ? "approved" : "unapproved"}`}
                  >
                    {PAYMENT_STATUS_LABEL[order.payment_status] ??
                      order.payment_status}
                  </span>
                  {order.payment_status === "paid" &&
                    (order.shipping_status === "shipped" ? (
                      <span className="admin-patient-status admin-patient-status-approved">
                        発送済み
                      </span>
                    ) : (
                      <form action={markShipped.bind(null, order.id)}>
                        <button type="submit" className="btn btn-ghost btn-sm">
                          発送済みにする
                        </button>
                      </form>
                    ))}
                </div>
              </div>
            ))}
            {(orders ?? []).length === 0 && (
              <p className="auth-footnote">まだ注文がありません。</p>
            )}
          </div>

          <p className="auth-footnote">
            <Link href="/admin">受付状況の管理に戻る</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
