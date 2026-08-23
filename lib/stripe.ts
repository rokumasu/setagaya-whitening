import Stripe from "stripe";

/**
 * サーバー側だけで使うStripeクライアント。
 * secret keyを使うため、絶対にブラウザ（Client Component）へ渡さないこと。
 */
export function createStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY が設定されていません。");
  }
  return new Stripe(secretKey);
}
