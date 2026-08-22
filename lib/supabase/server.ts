import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * サーバー側（Server Component / Route Handler）から使うSupabaseクライアント。
 * ログイン中の会員としてアクセスする場合に使う（anon key + Cookieのセッション）。
 * RLS（行レベルセキュリティ）が効いた状態で読み書きされる。
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server ComponentからのCookie書き込みは無視して良い
            // （ミドルウェアでセッションが更新されるため）
          }
        },
      },
    }
  );
}
