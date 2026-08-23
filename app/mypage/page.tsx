import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  PATIENT_STATUS_DESCRIPTION,
  PATIENT_STATUS_LABEL,
  type PatientStatus,
} from "@/lib/patientStatus";
import { signOut } from "./actions";

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
