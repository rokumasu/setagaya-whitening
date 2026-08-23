"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage("メールアドレスを入力してください。");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/confirm?next=/reset-password`,
    });
    setSubmitting(false);

    if (error) {
      setErrorMessage(
        "送信に失敗しました。時間をおいて再度お試しください。"
      );
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <Link href="/" className="auth-logo">
            世田谷ホワイトニング
          </Link>
          <div className="auth-card">
            <h1>メールを送信しました</h1>
            <p className="auth-lead">
              <strong>{email}</strong>{" "}
              宛にパスワード再設定用のメールをお送りしました。メール内のリンクから、新しいパスワードを設定してください。
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-logo">
          世田谷ホワイトニング
        </Link>

        <div className="auth-card">
          <h1>パスワードの再設定</h1>
          <p className="auth-lead">
            登録済みのメールアドレスを入力してください。パスワード再設定用のリンクをお送りします。
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
              {submitting ? "送信中..." : "再設定メールを送信"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
