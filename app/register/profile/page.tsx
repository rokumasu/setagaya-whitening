import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: patient } = await supabase
    .from("patients")
    .select("name")
    .eq("id", user.id)
    .maybeSingle();

  if (!patient) {
    redirect("/register");
  }

  if (patient.name) {
    redirect("/mypage");
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-logo">
          世田谷ホワイトニング
        </Link>

        <div className="auth-card">
          <span className="auth-step">STEP 2 / 2</span>
          <h1>お届け先の登録</h1>
          <p className="auth-lead">
            ホワイトニングジェルの発送に必要な情報を入力してください。
          </p>

          <ProfileForm redirectTo="/consultation" />
        </div>
      </div>
    </main>
  );
}
