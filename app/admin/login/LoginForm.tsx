"use client";

import { useActionState } from "react";
import { adminLogin, type AdminLoginState } from "./actions";

const initialState: AdminLoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <form action={formAction} className="auth-form">
      <label className="field">
        <span>管理者パスワード</span>
        <input type="password" name="password" required placeholder="********" />
      </label>

      {state.error && <p className="auth-error">{state.error}</p>}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "確認中..." : "ログイン"}
      </button>
    </form>
  );
}
