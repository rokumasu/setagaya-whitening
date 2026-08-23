"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allChecked = SCREENING_ITEMS.every((item) => checked[item.key]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !birthdate) {
      setErrorMessage("メールアドレスと生年月日を入力してください。");
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

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setSubmitting(false);

    if (error) {
      setErrorMessage(
        "コードの送信に失敗しました。時間をおいて再度お試しください。"
      );
      return;
    }

    sessionStorage.setItem(
      "setagaya_pending_registration",
      JSON.stringify({ birthdate, screeningPassed: true })
    );
    router.push(`/register/verify?email=${encodeURIComponent(email)}`);
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
            まずはメールアドレスと生年月日、簡単な確認事項の入力をお願いします。
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
              {submitting ? "送信中..." : "コードを送信"}
            </button>
          </form>

          <p className="auth-footnote">
            入力いただいたメールアドレスに、ログイン用の確認コードをお送りします。パスワードの作成は不要です。
          </p>
        </div>
      </div>
    </main>
  );
}
