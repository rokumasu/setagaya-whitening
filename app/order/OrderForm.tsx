"use client";

import { useActionState, useState } from "react";
import { createCheckoutSession, type CreateOrderState } from "./actions";
import { CONCENTRATIONS, PLANS, type Plan } from "@/lib/pricing";
import { formatStockLabel, type StockStatus } from "@/lib/stock";

const initialState: CreateOrderState = { error: null };

export function OrderForm({ stock }: { stock: StockStatus[] }) {
  const [state, formAction, pending] = useActionState(
    createCheckoutSession,
    initialState
  );
  const [plan, setPlan] = useState<Plan>(4);
  const packs = PLANS[plan].packs;

  const stockByConcentration = new Map(stock.map((s) => [s.concentration, s]));

  return (
    <form action={formAction} className="auth-form">
      <div className="field">
        <span>本数を選択</span>
        <div className="order-plan-options">
          {([2, 4, 8] as Plan[]).map((p) => (
            <label key={p} className="order-plan-option">
              <input
                type="radio"
                name="plan"
                value={p}
                checked={plan === p}
                onChange={() => setPlan(p)}
              />
              <span>
                {PLANS[p].label} — {PLANS[p].amount.toLocaleString()}円
                {p === 8 && "（歯磨き粉プレゼント）"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {Array.from({ length: packs }).map((_, i) => (
        <label key={i} className="field">
          <span>
            {packs === 1 ? "濃度" : `濃度（${i + 1}パック目・2本）`}
          </span>
          <select name={`pack-${i}`} defaultValue="">
            <option value="" disabled>
              選択してください
            </option>
            {CONCENTRATIONS.map((c) => {
              const s = stockByConcentration.get(c);
              const soldOut = s?.status === "out_of_stock";
              return (
                <option key={c} value={c} disabled={soldOut}>
                  {c}%（{formatStockLabel(s)}）
                </option>
              );
            })}
          </select>
        </label>
      ))}

      <p className="auth-footnote" style={{ textAlign: "left", margin: 0 }}>
        価格は税込・送料別です。合計金額:{" "}
        <strong>{PLANS[plan].amount.toLocaleString()}円</strong>
      </p>

      {state.error && <p className="auth-error">{state.error}</p>}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "手続き中..." : "購入手続きへ進む（Stripe決済）"}
      </button>
    </form>
  );
}
