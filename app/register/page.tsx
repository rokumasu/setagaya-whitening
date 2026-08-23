"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { calculateAge, MINIMUM_AGE } from "@/lib/age";

const SCREENING_ITEMS = [
  {
    key: "pregnancy",
    label: "妊娠中または授乳中ではない",
  },
  {
    key: "catalase",
    label: "無カタラーゼ症と診断されたことがない",
  },
  {
    key: "sensitivity",
    label: "現在、強い知覚過敏の症状がない",
  },
] as const;

const MIN_PASSWORD_LENGTH = 8;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const allChecked = SCREENING_ITEMS.every((item) => checked[item.key]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !birthdate || !password) {
      setErrorMessage("すべての項目を入力してください。");
      return;
    }

    if (calculateAge(birthdate) < MINIMUM_AGE) {
      setErrorMessage("本サービスは18歳以上の方を対象としています。");
      return;
    }

    if (!allChecked) {
      setErrorMessage(
        "安全上の理由から、本オンラインサービスをご利用いただけません。症状や状態については、かかりつけの歯科医師・医療機関へご相談ください。"
      );
      return;
    }

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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { birthdate, screening_passed: true },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });
    setSubmitting(false);

    if (error) {
      setErrorMessage(
        "会員登録に失敗しました。すでに登録済みのメールアドレスの可能性があります。"
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
            <h1>確認メールを送信しました</h1>
            <p className="auth-lead">
              <strong>{email}</strong>{" "}
              宛に確認メールをお送りしました。メール内のリンクをクリックすると、会員登録が完了します。
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
          <span className="auth-step">STEP 1 / 2</span>
          <h1>会員登録</h1>
          <p className="auth-lead">
            メールアドレス・パスワード・生年月日と、簡単な確認事項の入力をお願いします。
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
              <span>パスワード（8文字以上）</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
              />
            </label>

            <label className="field">
              <span>パスワード（確認）</span>
              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                placeholder="********"
              />
            </label>

            <label className="field">
              <span>生年月日</span>
              <input
                type="date"
                required
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </label>

            <fieldset className="field screening">
              <legend>以下の内容を確認しました</legend>
              {SCREENING_ITEMS.map((item) => (
                <label key={item.key} className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={!!checked[item.key]}
                    onChange={(e) =>
                      setChecked((prev) => ({
                        ...prev,
                        [item.key]: e.target.checked,
                      }))
                    }
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </fieldset>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "送信中..." : "会員登録する"}
            </button>
          </form>

          <p className="auth-footnote">
            すでに会員の方は
            <Link href="/login">こちら</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
