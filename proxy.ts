import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * 会員のログインセッションを維持するためのproxy（Next.js 15以前の"middleware"に相当）。
 * Supabase Authの標準的な実装パターン。Phase 1で会員登録・ログインを
 * 実装する際にそのまま利用する（Phase 0時点ではまだ使う画面がない）。
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Supabaseの環境変数がまだ設定されていない場合（Phase 0の初期状態など）は
  // 何もせずそのまま通す。ここで例外を投げるとサイト全体が真っ白になってしまう。
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
