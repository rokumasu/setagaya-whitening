import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let paid = false;
  if (user && order_id) {
    const { data: order } = await supabase
      .from("orders")
      .select("payment_status")
      .eq("id", order_id)
      .eq("patient_id", user.id)
      .maybeSingle();
    paid = order?.payment_status === "paid";
  }

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-logo">
          世田谷ホワイトニング
        </Link>
        <div className="auth-card">
          <h1>ご購入ありがとうございます</h1>
          <p className="auth-lead">
            {paid
              ? "お支払いが完了しました。発送までしばらくお待ちください。"
              : "決済処理を確認しています。反映まで数秒かかる場合があります。マイページの注文履歴からもご確認いただけます。"}
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
