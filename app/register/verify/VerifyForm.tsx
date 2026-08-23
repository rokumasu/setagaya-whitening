"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type PendingRegistration = {
  birthdate: string;
  screeningPassed: boolean;
};

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    if (!email) {
      setErrorMessage(
        "メールアドレスが確認できませんでした。会員登録・ログインをやり直してください。"
      );
      return;
    }

    setSubmitting(true);
    const supabase = createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });

    if (error || !data.user) {
      setSubmitting(false);
      setErrorMessage(
        "コードが正しくないか、有効期限が切れています。もう一度お試しください。"
      );
      return;
    }

    const user = data.user;

    const { data: existingPatient } = await supabase
      .from("patients")
      .select("id, name")
      .eq("id", user.id)
      .maybeSingle();

    const pendingRaw = sessionStorage.getItem("setagaya_pending_registration");
    const pending: PendingRegistration | null = pendingRaw
      ? JSON.parse(pendingRaw)
      : null;

    if (!existingPatient) {
      if (!pending) {
        setSubmitting(false);
        setErrorMessage(
          "アカウントの情報が見つかりませんでした。お手数ですが会員登録からやり直してください。"
        );
        return;
      }

      const { error: insertError } = await supabase.from("patients").insert({
        id: user.id,
        birthdate: pending.birthdate,
        screening_passed: pending.screeningPassed,
        status: "unapproved",
      });

      if (insertError) {
        setSubmitting(false);
        setErrorMessage(
          "会員情報の登録に失敗しました。時間をおいて再度お試しください。"
        );
        return;
      }

      sessionStorage.removeItem("setagaya_pending_registration");
      router.push("/register/profile");
      return;
    }

    sessionStorage.removeItem("setagaya_pending_registration");

    if (!existingPatient.name) {
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
          <h1>確認コードの入力</h1>
          <p className="auth-lead">
            {email ? (
              <>
                <strong>{email}</strong> 宛にコードを送信しました。メールに記載の6桁のコードを入力してください。
              </>
            ) : (
              "メールに記載のコードを入力してください。"
            )}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label className="field">
              <span>確認コード</span>
              <input
                type="text"
                inputMode="numeric"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
              />
            </label>

            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "確認中..." : "ログインする"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
