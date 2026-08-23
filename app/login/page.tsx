"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage("メールアドレスを入力してください。");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setSubmitting(false);

    if (error) {
      setErrorMessage(
        "コードの送信に失敗しました。会員登録がお済みでない場合は、会員登録をお試しください。"
      );
      return;
    }

    router.push(`/register/verify?email=${encodeURIComponent(email)}`);
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-logo">
          世田谷ホワイトニング
        </Link>

        <div className="auth-card">
          <h1>ログイン</h1>
          <p className="auth-lead">
            登録済みのメールアドレスを入力してください。ログイン用の確認コードをお送りします。
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field">
              <span>メールアドレス</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "送信中..." : "コードを送信"}
            </button>
          </form>

          <p className="auth-footnote">
            会員登録がまだの方は
            <Link href="/register">こちら</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
