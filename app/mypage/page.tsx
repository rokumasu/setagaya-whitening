import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  PATIENT_STATUS_DESCRIPTION,
  PATIENT_STATUS_LABEL,
  type PatientStatus,
} from "@/lib/patientStatus";
import {
  PLANS,
  formatConcentrationMix,
  type ConcentrationMixItem,
  type Plan,
} from "@/lib/pricing";
import { signOut } from "./actions";

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pending: "決済待ち",
  paid: "支払い完了",
  failed: "失敗",
};

const SHIPPING_STATUS_LABEL: Record<string, string> = {
  preparing: "発送準備中",
  shipped: "発送済み",
};

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: patient } = await supabase
    .from("patients")
    .select("name, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!patient) {
    redirect("/register");
  }

  if (!patient.name) {
    redirect("/register/profile");
  }

  const status = patient.status as PatientStatus;

  const { data: orders } = await supabase
    .from("orders")
    .select("id, plan, concentration_mix, amount, payment_status, shipping_status, created_at")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-logo">
          世田谷ホワイトニング
        </Link>

        <div className="auth-card">
          <h1>マイページ</h1>
          <p className="auth-lead">{patient.name} 様</p>

          <div className={`mypage-status mypage-status-${status}`}>
            <span className="mypage-status-label">
              {PATIENT_STATUS_LABEL[status]}
            </span>
            <p>{PATIENT_STATUS_DESCRIPTION[status]}</p>
          </div>

          {(status === "unapproved" || status === "recheck") && (
            <div className="auth-form">
              <Link href="/consultation" className="btn btn-primary">
                オンライン診療を受ける
              </Link>
            </div>
          )}

          {status === "approved" && (
            <div className="auth-form">
              <Link href="/order" className="btn btn-primary">
                商品を購入する
              </Link>
            </div>
          )}

          {orders && orders.length > 0 && (
            <>
              <h2 className="admin-section-title">購入履歴</h2>
              <table className="admin-detail-table">
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <th>
                        {new Date(order.created_at).toLocaleDateString("ja-JP")}
                      </th>
                      <td>
                        {PLANS[order.plan as Plan]?.label ?? `${order.plan}本`}
                        （{formatConcentrationMix(order.concentration_mix as ConcentrationMixItem[])}）
                        <br />
                        {order.amount.toLocaleString()}円 ・{" "}
                        {PAYMENT_STATUS_LABEL[order.payment_status] ?? order.payment_status}
                        {order.payment_status === "paid" &&
                          ` ・ ${SHIPPING_STATUS_LABEL[order.shipping_status] ?? order.shipping_status}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <div className="auth-form">
            <Link href="/mypage/edit" className="btn btn-ghost">
              登録情報を変更する
            </Link>
          </div>

          <form action={signOut} className="auth-form">
            <button type="submit" className="btn btn-ghost">
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
