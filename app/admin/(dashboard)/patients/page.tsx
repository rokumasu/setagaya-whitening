import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { PATIENT_STATUS_LABEL, type PatientStatus } from "@/lib/patientStatus";

export default async function AdminPatientsPage() {
  const supabase = createAdminClient();

  const [{ data: patients }, { data: usersData }] = await Promise.all([
    supabase
      .from("patients")
      .select("id, name, phone, status, screening_passed, created_at")
      .order("created_at", { ascending: false }),
    supabase.auth.admin.listUsers(),
  ]);

  const emailById = new Map(
    (usersData?.users ?? []).map((u) => [u.id, u.email ?? ""])
  );

  return (
    <main className="auth-page">
      <div className="auth-shell admin-shell">
        <div className="auth-logo">世田谷ホワイトニング 管理画面</div>

        <div className="auth-card">
          <h1>会員一覧</h1>
          <p className="auth-lead">
            全 {patients?.length ?? 0} 件。診療結果の入力は、名前をクリックしてください。
          </p>

          <div className="admin-patient-list">
            {(patients ?? []).map((patient) => (
              <Link
                key={patient.id}
                href={`/admin/patients/${patient.id}`}
                className="admin-patient-row"
              >
                <div>
                  <strong>{patient.name || "(未登録)"}</strong>
                  <span className="admin-patient-email">
                    {emailById.get(patient.id) ?? ""}
                  </span>
                </div>
                <span
                  className={`admin-patient-status admin-patient-status-${patient.status}`}
                >
                  {PATIENT_STATUS_LABEL[patient.status as PatientStatus] ??
                    patient.status}
                </span>
              </Link>
            ))}
            {(patients ?? []).length === 0 && (
              <p className="auth-footnote">まだ会員登録がありません。</p>
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
