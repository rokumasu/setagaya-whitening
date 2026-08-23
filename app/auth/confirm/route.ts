import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 会員登録の確認メール・パスワード再設定メールのリンク先。
 * Supabaseの現在の認証方式（PKCE）では ?code=... が付与されるので、
 * それをセッションと交換したうえで、適切なページへ転送する。
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (next) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: patient } = await supabase
          .from("patients")
          .select("name")
          .eq("id", user.id)
          .maybeSingle();

        if (!patient?.name) {
          return NextResponse.redirect(`${origin}/register/profile`);
        }
      }

      return NextResponse.redirect(`${origin}/mypage`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=confirm_failed`);
}
