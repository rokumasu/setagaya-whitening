import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { LoginForm } from "./LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <div className="auth-logo">世田谷ホワイトニング 管理画面</div>

        <div className="auth-card">
          <h1>管理者ログイン</h1>
          <p className="auth-lead">
            歯科医師・運営者専用のページです。パスワードを入力してください。
          </p>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
