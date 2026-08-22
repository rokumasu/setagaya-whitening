import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Phase 0の動作確認用エンドポイント。
 * ブラウザで /api/health を開き、Supabaseへの接続と
 * doctor_status テーブルの中身が読めるかを確認する。
 *
 * 例: { "ok": true, "doctorStatus": { "id": 1, "state": "offline", ... } }
 */
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("doctor_status")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          step: "supabaseへの問い合わせ",
          message: error.message,
          hint: "Supabaseで supabase/schema.sql を実行済みか、.env.local の値が正しいか確認してください。",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, doctorStatus: data });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        step: "接続設定",
        message: err instanceof Error ? err.message : String(err),
        hint: ".env.local に NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY が設定されているか確認してください。",
      },
      { status: 500 }
    );
  }
}
