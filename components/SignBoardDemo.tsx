"use client";

import { useState } from "react";

type SignState = "on" | "busy" | "off";

const SIGNS: {
  state: SignState;
  className: string;
  title: string;
  desc: string;
  button: string;
}[] = [
  {
    state: "on",
    className: "sign-on",
    title: "ONLINE — ただいまオンライン診療できます",
    desc: "今すぐビデオ通話で歯科医師の診療を受けられます。",
    button: "今すぐ診療する",
  },
  {
    state: "busy",
    className: "sign-busy",
    title: "BUSY — 現在オンライン診療中です",
    desc: "別の患者様を診療中です。次の対応時間をご確認ください。",
    button: "次の対応時間を見る",
  },
  {
    state: "off",
    className: "sign-off",
    title: "OFFLINE — 即時診療は受付していません",
    desc: "主に昼休みと診療終了後の時間帯に対応しています。",
    button: "診療を予約する",
  },
];

/**
 * 「今すぐ診療」機能の説明用デモ。
 * クリックで見た目を切り替えられるが、実データとは連動していない
 * （実際のリアルタイム連携はPhase 2でSupabaseのdoctor_statusと接続する）。
 */
export function SignBoardDemo() {
  const [active, setActive] = useState<SignState>("on");

  return (
    <div className="signs">
      {SIGNS.map((sign) => (
        <div
          key={sign.state}
          className={`sign ${sign.className}`}
          role="button"
          tabIndex={0}
          aria-pressed={active === sign.state}
          onClick={() => setActive(sign.state)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setActive(sign.state);
            }
          }}
        >
          <span className="sign-led" />
          <span className="sign-text">
            <span className="sign-title">{sign.title}</span>
            <span className="sign-desc">{sign.desc}</span>
          </span>
          <span className="sign-btn">{sign.button}</span>
        </div>
      ))}
    </div>
  );
}
