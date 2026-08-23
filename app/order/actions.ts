"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createStripeClient } from "@/lib/stripe";
import {
  PLANS,
  buildConcentrationMix,
  isValidConcentration,
  isValidPlan,
  type Concentration,
} from "@/lib/pricing";

export type CreateOrderState = {
  error: string | null;
};

export async function createCheckoutSession(
  _prevState: CreateOrderState,
  formData: FormData
): Promise<CreateOrderState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが確認できませんでした。ログインし直してください。" };
  }

  // 購入資格をサーバー側で必ず再確認する（画面の非表示だけに頼らない）
  const { data: patient } = await supabase
    .from("patients")
    .select("status")
    .eq("id", user.id)
    .maybeSingle();

  if (!patient || patient.status !== "approved") {
    return { error: "現在、ご購入いただける状態ではありません。" };
  }

  const planRaw = Number(formData.get("plan"));
  if (!isValidPlan(planRaw)) {
    return { error: "本数を選択してください。" };
  }
  const plan = PLANS[planRaw];

  const packConcentrations: Concentration[] = [];
  for (let i = 0; i < plan.packs; i++) {
    const raw = Number(formData.get(`pack-${i}`));
    if (!isValidConcentration(raw)) {
      return { error: "すべてのパックの濃度を選択してください。" };
    }
    packConcentrations.push(raw);
  }

  const concentrationMix = buildConcentrationMix(packConcentrations);

  // 注文の作成・更新はservice role（管理者権限）でのみ行う。
  // 通常の会員セッションには orders への書き込み権限を与えていない。
  const adminSupabase = createAdminClient();

  const { data: order, error: insertError } = await adminSupabase
    .from("orders")
    .insert({
      patient_id: user.id,
      plan: planRaw,
      concentration_mix: concentrationMix,
      amount: plan.amount,
      payment_status: "pending",
    })
    .select("id")
    .single();

  if (insertError || !order) {
    return { error: "注文の作成に失敗しました。時間をおいて再度お試しください。" };
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  let session;
  try {
    const stripe = createStripeClient();
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: `Opalescence ${plan.label}`,
            },
            unit_amount: plan.amount,
          },
          quantity: 1,
        },
      ],
      client_reference_id: order.id,
      metadata: { order_id: order.id, patient_id: user.id },
      success_url: `${origin}/order/success?order_id=${order.id}`,
      cancel_url: `${origin}/order`,
    });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return {
      error: "決済ページの作成に失敗しました。時間をおいて再度お試しください。",
    };
  }

  if (!session.url) {
    return { error: "決済ページの作成に失敗しました。" };
  }

  await adminSupabase
    .from("orders")
    .update({ stripe_session_id: session.id })
    .eq("id", order.id);

  redirect(session.url);
}
