import { Resend } from "resend";

/**
 * サーバー側だけで使うResendクライアント。
 * API keyを使うため、絶対にブラウザ（Client Component）へ渡さないこと。
 */
export function createResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY が設定されていません。");
  }
  return new Resend(apiKey);
}

export const MAIL_FROM = "世田谷ホワイトニング <noreply@setagaya-whitening.com>";
