import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PATIENT_STATUS_LABEL, type PatientStatus } from "@/lib/patientStatus";

const STATE_NOTE: Record<string, string> = {
  online: "ただいま歯科医師がオンライン診療に対応できます。今すぐ下のリンクからご参加ください。",
  busy: "現在、別の患者様を診療中です。時間をおいて再度お試しいただくか、下のリンクからお入りいただき、担当医が対応可能になり次第診療を開始します。",
  offline: "現在、即時の診療は受け付けていません。主に昼休みと診療終了後の時間帯に対応しています。時間をおいて再度お試しください。",
};

export default async function ConsultationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <Link href="/" className="auth-logo">
            世田谷ホワイトニング
          </Link>
          <div className="auth-card">
            <h1>オンライン診療</h1>
            <p className="auth-lead">
              オンライン診療を受けるには、先に会員登録が必要です。
            </p>
            <div className="auth-form">
              <Link href="/register" className="btn btn-primary">
                会員登録する
              </Link>
              <Link href="/login" className="btn btn-ghost">
                すでに会員の方はログイン
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { data: patient } = await supabase
    .from("patients")
    .select("name, status")
    .eq("id", user.id)
    .maybeSingle();

  if (!patient) {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <Link href="/" className="auth-logo">
            世田谷ホワイトニング
          </Link>
          <div className="auth-card">
            <h1>オンライン診療</h1>
            <p className="auth-lead">
              会員情報が見つかりませんでした。お手数ですが会員登録をやり直してください。
            </p>
            <div className="auth-form">
              <Link href="/register" className="btn btn-primary">
                会員登録する
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!patient.name) {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <Link href="/" className="auth-logo">
            世田谷ホワイトニング
          </Link>
          <div className="auth-card">
            <h1>オンライン診療</h1>
            <p className="auth-lead">
              診療を受ける前に、お届け先情報のご登録が必要です。
            </p>
            <div className="auth-form">
              <Link href="/register/profile" className="btn btn-primary">
                お届け先を登録する
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const status = patient.status as PatientStatus;
  const zoomLink = process.env.NEXT_PUBLIC_ZOOM_LINK;

  if (status === "approved") {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <Link href="/" className="auth-logo">
            世田谷ホワイトニング
          </Link>
          <div className="auth-card">
            <h1>オンライン診療</h1>
            <p className="auth-lead">
              すでにオンライン診療を受けていただき、ご購入いただける状態です。
            </p>
            <div className="auth-form">
              <Link href="/mypage" className="btn btn-primary">
                マイページを見る
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (status === "suspended") {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <Link href="/" className="auth-logo">
            世田谷ホワイトニング
          </Link>
          <div className="auth-card">
            <h1>オンライン診療</h1>
            <p className="auth-lead">
              現在、本サービスをご利用いただけない状態です。詳しくは運営までお問い合わせください。
            </p>
          </div>
        </div>
      </main>
    );
  }

  const { data: doctorStatus } = await supabase
    .from("doctor_status")
    .select("state")
    .eq("id", 1)
    .maybeSingle();
  const state = doctorStatus?.state ?? "offline";

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-logo">
          世田谷ホワイトニング
        </Link>

        <div className="auth-card">
          <h1>オンライン診療</h1>
          <p className="auth-lead">
            {status === "recheck"
              ? "再確認のため、もう一度オンライン診療を受けてください。"
              : "歯科医師によるオンライン診療（5〜10分程度）を受けていただくと、ホワイトニングジェルをご購入いただけるようになります。"}
          </p>

          <div className={`mypage-status mypage-status-${state === "online" ? "approved" : state === "busy" ? "recheck" : "unapproved"}`}>
            <span className="mypage-status-label">
              {state === "online" ? "ONLINE" : state === "busy" ? "BUSY" : "OFFLINE"}
            </span>
            <p>{STATE_NOTE[state]}</p>
          </div>

          {zoomLink ? (
            <div className="auth-form">
              <a
                href={zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Zoomで診療に入る
              </a>
            </div>
          ) : (
            <p className="auth-error">
              現在、診療用のリンクが準備中です。時間をおいて再度お試しください。
            </p>
          )}

          <p className="auth-footnote">
            現在の登録状況: {PATIENT_STATUS_LABEL[status]}
          </p>
        </div>
      </div>
    </main>
  );
}
