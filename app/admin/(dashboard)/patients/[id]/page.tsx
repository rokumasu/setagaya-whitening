import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { PATIENT_STATUS_LABEL, type PatientStatus } from "@/lib/patientStatus";
import { recordConsultationResult } from "../actions";

type Address = {
  postalCode?: string;
  prefecture?: string;
  city?: string;
  line1?: string;
  line2?: string | null;
};

export default async function AdminPatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createAdminClient();

  const [{ data: patient }, { data: userData }, { data: consultations }] =
    await Promise.all([
      supabase.from("patients").select("*").eq("id", id).maybeSingle(),
      supabase.auth.admin.getUserById(id),
      supabase
        .from("consultations")
        .select("id, result, scheduled_at, created_at")
        .eq("patient_id", id)
        .order("created_at", { ascending: false }),
    ]);

  if (!patient) {
    notFound();
  }

  const address = (patient.address ?? {}) as Address;
  const status = patient.status as PatientStatus;

  return (
    <main className="auth-page">
      <div className="auth-shell admin-shell">
        <div className="auth-logo">世田谷ホワイトニング 管理画面</div>

        <div className="auth-card">
          <h1>{patient.name || "(未登録)"} 様</h1>
          <p className="auth-lead">
            現在の状態:{" "}
            <strong>{PATIENT_STATUS_LABEL[status] ?? status}</strong>
          </p>

          <table className="admin-detail-table">
            <tbody>
              <tr>
                <th>メール</th>
                <td>{userData?.user?.email ?? "-"}</td>
              </tr>
              <tr>
                <th>電話番号</th>
                <td>{patient.phone || "-"}</td>
              </tr>
              <tr>
                <th>生年月日</th>
                <td>{patient.birthdate || "-"}</td>
              </tr>
              <tr>
                <th>住所</th>
                <td>
                  {address.postalCode
                    ? `〒${address.postalCode} ${address.prefecture ?? ""}${address.city ?? ""}${address.line1 ?? ""} ${address.line2 ?? ""}`
                    : "-"}
                </td>
              </tr>
              <tr>
                <th>事前スクリーニング</th>
                <td>{patient.screening_passed ? "通過済み" : "未通過"}</td>
              </tr>
              <tr>
                <th>登録日</th>
                <td>
                  {new Date(patient.created_at).toLocaleString("ja-JP")}
                </td>
              </tr>
            </tbody>
          </table>

          <h2 className="admin-section-title">診療結果を入力</h2>
          <p className="auth-footnote" style={{ marginTop: 0, textAlign: "left" }}>
            オンライン診療の結果を選んでください。診療の所見・診断内容は入力しません（結果のみ記録します）。
          </p>

          <div className="admin-status-buttons">
            <form
              action={recordConsultationResult.bind(null, patient.id, "approved")}
            >
              <button type="submit" className="btn btn-primary">
                承認する（購入可能にする）
              </button>
            </form>
            <form
              action={recordConsultationResult.bind(null, patient.id, "recheck")}
            >
              <button type="submit" className="btn btn-ghost">
                要再確認にする
              </button>
            </form>
            <form
              action={recordConsultationResult.bind(null, patient.id, "rejected")}
            >
              <button type="submit" className="btn btn-ghost">
                非承認にする（利用停止）
              </button>
            </form>
          </div>

          {(consultations ?? []).length > 0 && (
            <>
              <h2 className="admin-section-title">診療履歴</h2>
              <table className="admin-detail-table">
                <tbody>
                  {(consultations ?? []).map((c) => (
                    <tr key={c.id}>
                      <th>
                        {new Date(c.created_at).toLocaleString("ja-JP")}
                      </th>
                      <td>
                        {c.result === "approved"
                          ? "承認"
                          : c.result === "recheck"
                            ? "要再確認"
                            : "非承認"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <p className="auth-footnote">
            <Link href="/admin/patients">会員一覧に戻る</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
