import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/app/register/profile/ProfileForm";

type Address = {
  postalCode?: string;
  prefecture?: string;
  city?: string;
  line1?: string;
  line2?: string | null;
};

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: patient } = await supabase
    .from("patients")
    .select("name, phone, address")
    .eq("id", user.id)
    .maybeSingle();

  if (!patient || !patient.name) {
    redirect("/register/profile");
  }

  const address = (patient.address ?? {}) as Address;

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-logo">
          世田谷ホワイトニング
        </Link>

        <div className="auth-card">
          <h1>登録情報の変更</h1>
          <p className="auth-lead">
            お名前・電話番号・お届け先住所を変更できます。
          </p>

          <ProfileForm
            submitLabel="変更を保存する"
            initialValues={{
              name: patient.name ?? "",
              phone: patient.phone ?? "",
              postalCode: address.postalCode ?? "",
              prefecture: address.prefecture ?? "",
              city: address.city ?? "",
              addressLine1: address.line1 ?? "",
              addressLine2: address.line2 ?? "",
            }}
          />

          <p className="auth-footnote">
            <Link href="/mypage">マイページに戻る</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
