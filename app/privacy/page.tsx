import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー｜世田谷ホワイトニング",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <div className="wrap">
        <Link href="/" className="legal-back">
          ← トップページに戻る
        </Link>
        <h1>プライバシーポリシー</h1>

        <p className="legal-lead">
          世田谷ホワイトニング（運営統括責任者：徳永耕一郎、以下「当方」）は、本サービスをご利用いただくお客様の個人情報を、以下の方針に基づき適切に取り扱います。
        </p>

        <section className="legal-section">
          <h2>1. 取得する情報</h2>
          <p>会員登録・オンライン診療・商品購入の各手続きにおいて、以下の情報を取得します。</p>
          <ul>
            <li>氏名、生年月日、電話番号、配送先ご住所、メールアドレス</li>
            <li>ご注文内容（本数・濃度の組み合わせ、注文日時）</li>
            <li>
              オンライン診療の予約日時（TimeRex経由でご入力いただいた氏名・メールアドレス・受診方法・電話番号）
            </li>
          </ul>
          <p>
            問診内容・診療結果・処方内容などの詳細な診療情報は、オンライン診療（Zoom）を担当する歯科医師側で管理し、当サイトのデータベースには保存しません。
          </p>
          <p>
            クレジットカード番号などの決済情報は、決済代行会社Stripe, Inc.が管理しており、当方のサーバーには一切保存されません。
          </p>
        </section>

        <section className="legal-section">
          <h2>2. 利用目的</h2>
          <ul>
            <li>会員登録の受付・本人確認、マイページでのご案内</li>
            <li>オンライン診療のご案内・予約管理</li>
            <li>商品の購入手続き、決済処理、配送手配</li>
            <li>ご注文確認・発送完了などのお知らせメールの送信</li>
            <li>お問い合わせへの対応</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. 第三者提供・業務委託先</h2>
          <p>
            当方は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。ただし、以下のサービスに業務を委託し、必要な範囲で情報を取り扱っています。
          </p>
          <ul>
            <li>Supabase（データベース・会員認証の基盤）</li>
            <li>Stripe（決済処理。カード情報の管理を含む）</li>
            <li>Resend（ご注文確認・発送連絡メールの配信）</li>
            <li>TimeRex（オンライン診療の予約日程調整）</li>
            <li>Zoom（オンライン診療のビデオ通話）</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Cookie等の利用</h2>
          <p>
            本サービスでは、ログイン状態を維持するためにCookieを利用しています。ブラウザの設定によりCookieを無効にすることも可能ですが、その場合、会員登録・ログインを伴う機能がご利用いただけなくなります。
          </p>
        </section>

        <section className="legal-section">
          <h2>5. 安全管理</h2>
          <p>
            取得した個人情報は、不正アクセス・紛失・改ざん・漏えいなどを防止するため、適切な安全管理措置を講じます。
          </p>
        </section>

        <section className="legal-section">
          <h2>6. 開示・訂正・削除等のご請求</h2>
          <p>
            ご自身の個人情報の開示・訂正・削除等をご希望の場合は、下記お問い合わせ窓口までご連絡ください。ご本人確認の上、法令に従い対応いたします。
          </p>
        </section>

        <section className="legal-section">
          <h2>7. お問い合わせ窓口</h2>
          <p>世田谷ホワイトニング（運営統括責任者：徳永耕一郎）</p>
          <p>メールアドレス：todoroki.sika@gmail.com</p>
        </section>

        <section className="legal-section">
          <h2>8. 本ポリシーの改定</h2>
          <p>
            本ポリシーの内容は、法令の変更やサービス内容の変更に応じて、予告なく改定することがあります。改定後の内容は、本ページに掲載した時点から効力を生じるものとします。
          </p>
        </section>

        <p className="legal-date">制定日：2026年8月25日</p>
      </div>
    </main>
  );
}
