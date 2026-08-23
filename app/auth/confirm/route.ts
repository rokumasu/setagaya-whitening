import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * 会員登録の確認メール・パスワード再設定メールのリンク先。
 * token_hash を検証してログイン状態にしたうえで、適切なページへ転送する。
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash });

    if (!error) {
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
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
