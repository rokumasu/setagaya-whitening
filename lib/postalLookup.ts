export type PostalLookupResult = {
  prefecture: string;
  city: string;
} | null;

/**
 * 郵便番号（ハイフンあり/なしどちらも可）から都道府県・市区町村を検索する。
 * zipcloud（日本郵便のデータを使った無料API、APIキー不要）を利用。
 */
export async function lookupAddressByPostalCode(
  postalCode: string
): Promise<PostalLookupResult> {
  const digits = postalCode.replace(/[^0-9]/g, "");
  if (digits.length !== 7) {
    return null;
  }

  const res = await fetch(
    `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${digits}`
  );
  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  const result = data?.results?.[0];
  if (!result) {
    return null;
  }

  return {
    prefecture: result.address1 as string,
    city: result.address2 as string,
  };
}
