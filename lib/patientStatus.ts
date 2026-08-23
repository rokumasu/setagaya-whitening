export type PatientStatus = "unapproved" | "approved" | "recheck" | "suspended";

export const PATIENT_STATUS_LABEL: Record<PatientStatus, string> = {
  unapproved: "登録済み・診療前",
  approved: "購入可能",
  recheck: "要再確認",
  suspended: "利用停止",
};

export const PATIENT_STATUS_DESCRIPTION: Record<PatientStatus, string> = {
  unapproved:
    "まだオンライン診療を受けていません。歯科医師の診療を受けると、購入できるかどうかが判定されます。",
  approved: "オンライン診療の結果、ホワイトニングジェルをご購入いただけます。",
  recheck: "再確認が必要な状態です。担当歯科医師からのご案内をお待ちください。",
  suspended: "現在、本サービスをご利用いただけない状態です。詳しくは運営までお問い合わせください。",
};
