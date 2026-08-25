import Link from "next/link";

export const metadata = {
  title: "特定商取引法に基づく表記｜世田谷ホワイトニング",
};

const ROWS: { label: string; value: React.ReactNode }[] = [
  { label: "販売事業者", value: "世田谷ホワイトニング（運営統括責任者：徳永耕一郎）" },
  {
    label: "所在地",
    value: (
      <>
        〒158-0082
        <br />
        東京都世田谷区等々力8丁目6-9
      </>
    ),
  },
  {
    label: "電話番号",
    value: "ご請求いただければ遅滞なく開示いたします。まずは下記メールアドレスまでご連絡ください。",
  },
  { label: "メールアドレス", value: "todoroki.sika@gmail.com" },
  {
    label: "販売価格",
    value: (
      <>
        2本セット 3,980円（税込）
        <br />
        4本セット 6,980円（税込）
        <br />
        8本セット 13,480円（税込）
      </>
    ),
  },
  {
    label: "商品代金以外の必要料金",
    value: "送料・梱包料として600円（税込）。合計8,000円以上のご購入で送料無料。",
  },
  { label: "お支払い方法", value: "クレジットカード決済（Stripe）" },
  { label: "お支払い時期", value: "ご注文手続きの際に決済が確定します。" },
  {
    label: "商品の引渡時期",
    value: "13時までのご注文は当日発送。祝前日を挟む場合は翌営業日の発送となります。",
  },
  {
    label: "返品・交換について",
    value:
      "商品の性質上（医療用ホワイトニングジェル）、お客様のご都合による返品・交換はお受けできません。不良品・誤配送の場合は良品と交換いたしますので、商品到着後7日以内にメールにてご連絡ください。",
  },
  {
    label: "ご購入条件",
    value:
      "本サービスはオンライン診療を起点とした自由診療です。歯科医師によるオンライン診療を受診し、使用可能と判断された方のみご購入いただけます。",
  },
];

export default function LegalPage() {
  return (
    <main className="legal-page">
      <div className="wrap">
        <Link href="/" className="legal-back">
          ← トップページに戻る
        </Link>
        <h1>特定商取引法に基づく表記</h1>
        <dl className="legal-table">
          {ROWS.map((row) => (
            <div className="legal-row" key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  );
}
