"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const MIN_PASSWORD_LENGTH = 8;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setErrorMessage(
        `パスワードは${MIN_PASSWORD_LENGTH}文字以上で設定してください。`
      );
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMessage("パスワードが一致しません。");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      setErrorMessage(
        "パスワードの更新に失敗しました。もう一度、再設定メールの送信からお試しください。"
      );
      return;
    }

    router.push("/mypage");
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-logo">
          世田谷ホワイトニング
        </Link>

        <div className="auth-card">
          <h1>新しいパスワードの設定</h1>
          <p className="auth-lead">新しいパスワードを入力してください。</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field">
              <span>新しいパスワード（8文字以上）</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </label>

            <label className="field">
              <span>新しいパスワード（確認）</span>
              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="********"
              />
            </label>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "更新中..." : "パスワードを更新する"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
