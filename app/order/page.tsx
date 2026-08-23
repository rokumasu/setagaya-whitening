import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { OrderForm } from "./OrderForm";
import type { StockStatus } from "@/lib/stock";

export default async function OrderPage() {
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
            <h1>ご購入</h1>
            <p className="auth-lead">ご購入には会員登録・ログインが必要です。</p>
            <div className="auth-form">
              <Link href="/login" className="btn btn-primary">
                ログイン
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { data: patient } = await supabase
    .from("patients")
    .select("status")
    .eq("id", user.id)
    .maybeSingle();

  if (!patient || patient.status !== "approved") {
    return (
      <main className="auth-page">
        <div className="auth-shell">
          <Link href="/" className="auth-logo">
            世田谷ホワイトニング
          </Link>
          <div className="auth-card">
            <h1>ご購入</h1>
            <p className="auth-lead">
              現在、ご購入いただける状態ではありません。まずはオンライン診療を受けてください。
            </p>
            <div className="auth-form">
              <Link href="/consultation" className="btn btn-primary">
                オンライン診療について見る
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const { data: stockRows } = await supabase
    .from("stock_status")
    .select("concentration, status, low_stock_count");
  const stock = (stockRows ?? []) as StockStatus[];

  return (
    <main className="auth-page">
      <div className="auth-shell">
        <Link href="/" className="auth-logo">
          世田谷ホワイトニング
        </Link>

        <div className="auth-card">
          <h1>Opalescenceのご購入</h1>
          <p className="auth-lead">
            本数と濃度を選択してください。2本を1パックとして、パックごとに濃度を選べます。
          </p>

          <OrderForm stock={stock} />
        </div>
      </div>
    </main>
  );
}
