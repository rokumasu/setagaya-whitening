import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { setDoctorStatus, setDoctorName, adminLogout } from "./actions";

const STATE_LABEL: Record<string, string> = {
  online: "ONLINE（今すぐ診療できます）",
  busy: "BUSY（診療中です）",
  offline: "OFFLINE（受付していません）",
};

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const supabase = await createClient();
  const { data: doctorStatus } = await supabase
    .from("doctor_status")
    .select("state, doctor_name, updated_at")
    .eq("id", 1)
    .maybeSingle();

  const state = doctorStatus?.state ?? "offline";
  const doctorName = doctorStatus?.doctor_name ?? "";
  const updatedAt = doctorStatus?.updated_at
    ? new Date(doctorStatus.updated_at).toLocaleString("ja-JP")
    : "-";

  return (
    <main className="auth-page">
      <div className="auth-shell admin-shell">
        <div className="auth-logo">世田谷ホワイトニング 管理画面</div>

        <div className="auth-card">
          <h1>受付状況</h1>
          <p className="auth-lead">
            現在の状態:{" "}
            <strong>{STATE_LABEL[state] ?? state}</strong>
            <br />
            最終更新: {updatedAt}
          </p>

          <div className="admin-status-buttons">
            <form action={setDoctorStatus.bind(null, "online")}>
              <button
                type="submit"
                className={`btn ${state === "online" ? "btn-primary" : "btn-ghost"}`}
              >
                ONLINE にする
              </button>
            </form>
            <form action={setDoctorStatus.bind(null, "busy")}>
              <button
                type="submit"
                className={`btn ${state === "busy" ? "btn-primary" : "btn-ghost"}`}
              >
                BUSY にする
              </button>
            </form>
            <form action={setDoctorStatus.bind(null, "offline")}>
              <button
                type="submit"
                className={`btn ${state === "offline" ? "btn-primary" : "btn-ghost"}`}
              >
                OFFLINE にする
              </button>
            </form>
          </div>

          <form action={setDoctorName} className="auth-form admin-doctor-name-form">
            <label className="field">
              <span>本日の担当歯科医師（サイトには表示されません）</span>
              <input
                type="text"
                name="doctorName"
                defaultValue={doctorName}
                placeholder="例：田中 先生"
              />
            </label>
            <button type="submit" className="btn btn-ghost">
              保存する
            </button>
          </form>
          {saved === "1" && <p className="admin-saved-note">保存しました</p>}

          <div className="auth-form">
            <Link href="/admin/patients" className="btn btn-ghost">
              会員一覧・診療結果の入力
            </Link>
          </div>

          <div className="auth-form">
            <Link href="/admin/orders" className="btn btn-ghost">
              注文一覧・発送管理
            </Link>
          </div>

          <form action={adminLogout} className="auth-form">
            <button type="submit" className="btn btn-ghost">
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
