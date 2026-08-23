import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { CONCENTRATIONS } from "@/lib/pricing";
import { STOCK_LABEL, type StockState } from "@/lib/stock";
import { updateStock } from "./actions";

export default async function AdminStockPage() {
  const supabase = createAdminClient();
  const { data: stockRows } = await supabase
    .from("stock_status")
    .select("concentration, status, low_stock_count");

  const stockByConcentration = new Map(
    (stockRows ?? []).map((row) => [row.concentration, row])
  );

  return (
    <main className="auth-page">
      <div className="auth-shell admin-shell">
        <div className="auth-logo">世田谷ホワイトニング 管理画面</div>

        <div className="auth-card">
          <h1>在庫表示の管理</h1>
          <p className="auth-lead">
            濃度ごとに在庫の状態を切り替えます。ここでの表示は購入画面とトップページに反映されます（在庫数を自動計算するものではありません）。
          </p>

          <div className="admin-patient-list">
            {CONCENTRATIONS.map((c) => {
              const current = stockByConcentration.get(c);
              const status: StockState =
                (current?.status as StockState) ?? "in_stock";
              return (
                <form
                  key={c}
                  action={updateStock.bind(null, c)}
                  className="admin-stock-row"
                >
                  <strong className="admin-stock-pct">{c}%</strong>
                  <select name="status" defaultValue={status}>
                    {(Object.keys(STOCK_LABEL) as StockState[]).map((s) => (
                      <option key={s} value={s}>
                        {STOCK_LABEL[s]}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="low_stock_count"
                    min={0}
                    placeholder="残り本数（任意）"
                    defaultValue={current?.low_stock_count ?? ""}
                  />
                  <button type="submit" className="btn btn-ghost btn-sm">
                    更新
                  </button>
                </form>
              );
            })}
          </div>

          <p className="auth-footnote">
            <Link href="/admin">受付状況の管理に戻る</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
