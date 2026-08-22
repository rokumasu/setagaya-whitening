import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * 管理者権限（service role key）で操作するSupabaseクライアント。
 *
 * 重要：
 * - このファイルは "/admin" 配下のAPIルートなど、サーバー側のコードからのみ import すること。
 * - service role key はRLSを無視して全データにアクセスできるため、
 *   絶対にブラウザ（Client Component）へ渡したり、NEXT_PUBLIC_ を付けたりしないこと。
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
