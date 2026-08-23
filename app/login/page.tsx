"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("メールアドレスとパスワードを入力してください。");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSubmitting(false);

    if (error || !data.user) {
      setErrorMessage("メールアドレスまたはパスワードが正しくありません。");
      return;
    }

    const { data: patient } = await supabase
      .from("patients")
      .select("name")
      .eq("id", data.user.id)
      .maybeSingle();

    if (!patient?.name) {
      router.push("/register/profile");
    } else {
      router.push("/mypage");
    }
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
            登録済みのメールアドレスとパスワードを入力してください。
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

            <label className="field">
              <span>パスワード</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </label>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          <p className="auth-footnote">
            <Link href="/forgot-password">パスワードをお忘れの方はこちら</Link>
          </p>
          <p className="auth-footnote">
            会員登録がまだの方は
            <Link href="/register">こちら</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
