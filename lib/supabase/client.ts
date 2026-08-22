"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * ブラウザ（Client Component）から使うSupabaseクライアント。
 * 公開しても問題ない anon key だけを使う。
 * 例: doctor_status のリアルタイム購読、会員のログイン処理など。
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
