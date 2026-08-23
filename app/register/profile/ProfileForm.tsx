"use client";

import { useActionState, useState } from "react";
import { saveProfile, type SaveProfileState } from "./actions";
import { lookupAddressByPostalCode } from "@/lib/postalLookup";

const initialState: SaveProfileState = { error: null };

type ProfileFormProps = {
  initialValues?: {
    name: string;
    phone: string;
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
  };
  submitLabel?: string;
};

export function ProfileForm({ initialValues, submitLabel }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(
    saveProfile,
    initialState
  );

  const [postalCode, setPostalCode] = useState(
    initialValues?.postalCode ?? ""
  );
  const [prefecture, setPrefecture] = useState(
    initialValues?.prefecture ?? ""
  );
  const [city, setCity] = useState(initialValues?.city ?? "");
  const [looking, setLooking] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  async function handleLookup() {
    setLookupError(null);
    setLooking(true);
    const result = await lookupAddressByPostalCode(postalCode);
    setLooking(false);

    if (!result) {
      setLookupError("郵便番号から住所が見つかりませんでした。都道府県・市区町村を直接入力してください。");
      return;
    }

    setPrefecture(result.prefecture);
    setCity(result.city);
  }

  return (
    <form action={formAction} className="auth-form">
      <label className="field">
        <span>お名前</span>
        <input
          type="text"
          name="name"
          required
          defaultValue={initialValues?.name}
          placeholder="世田谷 花子"
        />
      </label>

      <label className="field">
        <span>電話番号</span>
        <input
          type="tel"
          name="phone"
          required
          defaultValue={initialValues?.phone}
          placeholder="09012345678"
        />
      </label>

      <div className="field postal-row">
        <label>
          <span>郵便番号</span>
          <input
            type="text"
            name="postalCode"
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="1540001"
            inputMode="numeric"
          />
        </label>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={handleLookup}
          disabled={looking || postalCode.length < 7}
        >
          {looking ? "検索中..." : "住所を検索"}
        </button>
      </div>
      {lookupError && <p className="auth-error">{lookupError}</p>}

      <label className="field">
        <span>都道府県</span>
        <input
          type="text"
          name="prefecture"
          required
          value={prefecture}
          onChange={(e) => setPrefecture(e.target.value)}
          placeholder="東京都"
        />
      </label>

      <label className="field">
        <span>市区町村</span>
        <input
          type="text"
          name="city"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="世田谷区"
        />
      </label>

      <label className="field">
        <span>番地・建物名</span>
        <input
          type="text"
          name="addressLine1"
          required
          defaultValue={initialValues?.addressLine1}
          placeholder="◯◯1-2-3"
        />
      </label>

      <label className="field">
        <span>建物名・部屋番号（任意）</span>
        <input
          type="text"
          name="addressLine2"
          defaultValue={initialValues?.addressLine2}
          placeholder="◯◯マンション101"
        />
      </label>

      {state.error && <p className="auth-error">{state.error}</p>}

      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending
          ? "保存中..."
          : (submitLabel ?? "登録を完了する")}
      </button>
    </form>
  );
}
