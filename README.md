# 世田谷ホワイトニング — Webアプリ（Phase 4まで完了・Phase 5進行中）

オンライン診療から始めるホームホワイトニングサービスのWebアプリです。
[バックエンド構築ロードマップ](https://claude.ai/code/artifact/73237527-d822-4441-be64-f907c9b3bde8) の Phase 0（土台づくり）・Phase 1（会員登録とステータス表示）・Phase 2（今すぐ診療サイン）・Phase 3（診療から承認まで）・Phase 4（購入とStripe決済）が完了し、**インターネット上に公開済み**の状態のプロジェクトです。Phase 5（運用の仕上げ）は一部完了・一部進行中です。

公開URL: https://setagaya-whitening.vercel.app

このREADMEは、**エンジニアではない方**が上から順番に進められるように書いています。
コマンドは黒い画面（ターミナル）に入力するものです。慌てず1つずつ進めてください。

## 今の状態でできること

- トップページ（LP）が実際にインターネット上（Vercel）に公開されている
- Supabase（データベース）のプロジェクトが作成済みで、本番環境からも接続を確認済み
- `/api/health` にアクセスすると、Supabase（データベース）に接続できているかを確認できる
- データベースの設計図（`supabase/schema.sql`）を実行済み（patients / doctor_status / consultations / orders の各テーブルが作成済み）
- **会員登録・ログインができる**（`/register` → 確認メール → `/register/profile` → `/mypage`。詳しくは下記「Phase 1」参照）
- マイページで自分のステータス確認・登録情報の変更ができる
- **管理画面（`/admin`）から「今すぐ診療」の受付状況を切り替えられ、トップページにリアルタイムで反映される**（詳しくは下記「Phase 2」参照）
- **オンライン診療の案内から、管理画面での承認まで一通り動く**（詳しくは下記「Phase 3」参照）
- **購入可能な会員は、本数・濃度を選んでStripeで決済でき、管理画面から発送管理ができる**（詳しくは下記「Phase 4」参照）
- 決済完了・発送完了のタイミングで、お客様へ自動でお知らせメールが届く（実際に届くことを確認済み。詳しくは下記「Phase 5」参照）
- 濃度ごとの在庫状況（在庫あり／在庫僅か／品切れ中）をトップページ・購入画面に表示し、管理画面（`/admin/stock`）から手動で切り替えられる。品切れの濃度は購入時にサーバー側でもブロックされる
- 「今すぐ診療」の受付時間外でも、都合の良い日時を選んでオンライン診療の予約ができる（TimeRex経由。トップページの「今すぐ診療」セクションの下に予約カレンダーを埋め込み表示）
- 送料・梱包料（600円、8,000円以上のご購入で無料）が決済時に自動で加算される
- 特定商取引法に基づく表記（`/legal`）・プライバシーポリシー（`/privacy`）を掲載済み。フッターの該当リンクから遷移できる

---

## 必要なアカウント（すべて無料枠でOK）

1. **GitHub** — コードを保管する場所。https://github.com
2. **Supabase** — データベース・ログイン機能。https://supabase.com
3. **Vercel** — Webサイトの公開（ホスティング）。https://vercel.com

3つとも、GitHubアカウントでログインすると連携がスムーズです。まずGitHubのアカウントを作ってから、Supabase・Vercelは「Continue with GitHub」で登録するのがおすすめです。

---

## 手順1: このプロジェクトをGitHubに置く ✅ 完了（2026-08-23）

1. GitHubにログインし、右上の「+」→「New repository」を選ぶ
2. リポジトリ名を決める（例: `setagaya-whitening`）。Public/Privateはどちらでも良いが、迷ったら **Private** を選ぶ
3. 「Create repository」を押す（READMEなどは追加しなくてOK）
4. 作成後の画面に表示される「…or push an existing repository from the command line」のコマンドを、このプロジェクトのフォルダ内で順番に実行する

   ```bash
   git remote add origin https://github.com/<あなたのユーザー名>/<リポジトリ名>.git
   git branch -M main
   git add .
   git commit -m "Phase 0: プロジェクトの土台"
   git push -u origin main
   ```

   ※ `git add .` の際、`.env.local`（実際のパスワードのような値が入るファイル）は `.gitignore` によって自動的に除外されるので安心してください。

---

## 手順2: Supabaseプロジェクトを作る ✅ 完了（2026-08-23）

1. https://supabase.com にログインし、「New project」を押す
2. プロジェクト名（例: `setagaya-whitening`）、データベースのパスワード（自動生成でOK、忘れないよう控えておく）、リージョンは `Northeast Asia (Tokyo)` を選んで作成する
3. 作成には1〜2分かかります。完了したら左メニューの **SQL Editor** を開く
4. 「New query」を押し、このプロジェクト内の `supabase/schema.sql` の中身を全部コピーして貼り付け、右下の「Run」を押す
   - 実行してエラーが出なければOK（何行か「Success」と表示されます）
   - このSQLは再実行しても安全なので、あとで内容を更新した際も同じ手順でOKです
5. 左メニューの **Project Settings → API Keys** を開き、次の3つの値を控える
   - **Project URL**（Project Settings → General の「Project ID」から `https://<Project ID>.supabase.co` の形で分かります）
   - **anon public** キー（「Legacy anon, service_role API keys」タブにあります。新しい「Publishable and secret API keys」タブの値でも代用可）
   - **service_role** キー（こちらは絶対に人に見せたり、GitHubに載せたりしないこと。「Reveal」を押すと表示されます）
   - ※ SupabaseのUIが更新され、以前の「Project Settings → API」から「Project Settings → API Keys」に名称・場所が変わりました

---

## 手順3: 環境変数を設定する（ローカルで動かす場合） ✅ 完了（2026-08-23）

1. プロジェクトのフォルダで `.env.local.example` をコピーして `.env.local` という名前のファイルを作る

   ```bash
   cp .env.local.example .env.local
   ```

2. `.env.local` を開き、手順2で控えた3つの値を貼り付ける

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SUPABASE_SERVICE_ROLE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. 依存パッケージをインストールして、開発サーバーを起動する

   ```bash
   npm install
   npm run dev
   ```

4. ブラウザで以下の2つを開いて確認する
   - http://localhost:3000 — トップページ（LP）が表示されればOK
   - http://localhost:3000/api/health — 次のような表示になればOK
     ```json
     { "ok": true, "doctorStatus": { "id": 1, "state": "offline", "doctor_name": null, "updated_at": "…" } }
     ```
     `"ok": false` と表示された場合は、`.env.local` の値が正しいか、手順2のSQLを実行済みかを見直してください。エラーメッセージの `hint` に次にすることが書かれています。

---

## 手順4: Vercelで公開する ✅ 完了（2026-08-23）

1. https://vercel.com にログインし、「Add New… → Project」を選ぶ
2. 手順1でGitHubに置いたリポジトリを選んで「Import」する
3. 「Environment Variables」の欄に、手順2で控えた3つの値を登録する（キー名は `.env.local` と同じにする）
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. 「Deploy」を押す。1〜2分待つと公開用のURL（例: `https://setagaya-whitening.vercel.app`）が発行される
5. 発行されたURLと `/api/health` の両方を開いて、手順3と同じように確認する

これでPhase 0は完了です。インターネット上に実際にトップページが公開され、データベースとも接続できている状態になります。

**公開URL: https://setagaya-whitening.vercel.app**（`/api/health` で接続確認済み）

---

---

## Phase 1: 会員登録とステータス表示 ✅ 完了（2026-08-23）

会員登録（事前スクリーニング・年齢確認つき）とログイン、マイページを実装しました。

- `/register` … 会員登録（メール・パスワード・生年月日・事前スクリーニング3項目）。18歳未満やスクリーニング不適合の場合はここで登録できない
- 登録すると確認メールが届く。メール内のリンクをクリックすると本登録が完了する
- `/register/profile` … お届け先情報（お名前・電話番号・住所。郵便番号を入れると都道府県・市区町村が自動入力される）
- `/login` … ログイン（メール＋パスワード）
- `/forgot-password` / `/reset-password` … パスワードを忘れた場合の再設定
- `/mypage` … 現在のステータス（登録済み・診療前 / 購入可能 / 要再確認 / 利用停止）を表示。「登録情報を変更する」から住所等をあとから変更できる

データベース側では、会員登録が完了した瞬間に自動で会員情報（`patients`）の行を作るしくみ（トリガー）を追加しています（`supabase/schema.sql` 参照）。

**動作確認方法**: `/register` から実際に会員登録し、届いたメールのリンクを開いて `/register/profile` → `/mypage` まで進めればOKです。

---

## Phase 2: 今すぐ診療サイン ✅ 完了（2026-08-23）

トップページの受付状況表示を、実際にリアルタイムで切り替わるようにしました。

- `/admin` … 管理画面。固定パスワード（Vercel環境変数 `ADMIN_PASSWORD`）でログインし、ONLINE / BUSY / OFFLINE の切り替えができる
- 担当歯科医師の名前は管理画面内だけの内部記録用（サイトには表示されない）
- トップページの受付状況カードは、Supabase Realtimeで `doctor_status` テーブルを購読しており、管理画面でボタンを押すと**ページの再読み込みなしに**トップページの表示が切り替わる

**動作確認方法**: `/admin/login` からログインし、ステータスを切り替えたうえで、別タブでトップページを開いて表示が変わることを確認すればOKです。

---

## Phase 3: 診療から承認まで ✅ 完了（2026-08-23）

オンライン診療を受けてから、購入資格が付与されるまでの流れを実装しました。

- `/consultation` … 患者向けの診療案内ページ。ログイン状態・お届け先登録状況・現在のステータスに応じて表示を出し分け、固定のZoomリンク（Vercel環境変数 `NEXT_PUBLIC_ZOOM_LINK`）を案内する
- `/admin/patients` … 会員一覧。名前・メール・現在のステータスを確認できる
- `/admin/patients/[id]` … 患者詳細。診療結果（承認 / 要再確認 / 非承認）を選ぶと、`consultations` に記録が残り、`patients.status` が自動更新される（承認→購入可能、要再確認→要再確認、非承認→利用停止）
- トップページの受付状況カード・マイページ・会員登録完了後の遷移先を `/consultation` につなげた

**動作確認方法**: 自分のアカウントでマイページから「オンライン診療を受ける」→ `/consultation` でZoomリンクを確認 → 管理画面（`/admin/patients`）から自分を承認 → マイページのステータスが「購入可能」に変わることを確認すればOKです。

---

## Phase 4: 購入とStripe決済 ✅ 完了（2026-08-23）

購入可能な会員が、実際にStripeで決済できるようにしました。

- `/order` … 本数（2/4/8本）・濃度の組み合わせを選ぶ購入画面。購入資格（`status = approved`）はサーバー側でも必ず再確認してからStripeの決済ページを作成する
- Stripe Checkoutの決済ページで支払いを完了すると、`/order/success` に戻ってくる
- `/api/stripe/webhook` … Stripeからの「支払い完了」通知を受け取り、`orders.payment_status` を`paid`に更新する
- `/admin/orders` … 注文一覧。支払い状況・発送状況の確認と、「発送済みにする」操作ができる
- マイページに購入履歴を追加

**動作確認方法**: テストカード（`4242 4242 4242 4242`）で実際に決済し、マイページの購入履歴と管理画面の注文一覧の両方に反映されることを確認済みです。

---

## Phase 5: 運用の仕上げ（一部完了・一部進行中、2026-08-24時点）

- ✅ **RLS（データベースのアクセス制御）の見直み** … 会員本人が更新してよい項目を氏名・電話番号・住所のみに制限（購入資格などを本人が直接書き換えられない抜け穴を修正）
- ✅ **注文確認・発送連絡メールの自動送信** … Resend（メール配信サービス）を使い、決済完了時・発送完了時にお客様へ自動でメールを送る仕組み。独自ドメイン（`setagaya-whitening.com`）のDNS設定・認証が完了し、実際のテスト購入でメールが届くことを確認済み（2026-08-24）
- ✅ **在庫表示機能** … 濃度ごとに「在庫あり／在庫僅か（残り本数付き）／品切れ中」を管理画面から手動で切り替え、トップページ・購入画面に反映。在庫の自動計算は行わず、あくまで表示のみ
- ✅ 取扱濃度の誤り修正 … 実在しない「45%」の記載をコード・画面・マスタープロンプトから削除し、10/15/20/35%の4段階に修正
- ✅ **予約診療（TimeRex連携）** … 「今すぐ診療」が対応できない時間帯でも、都合の良い日時を選んで予約できるようにTimeRex（外部の日程調整サービス、無料プラン）を導入。トップページに予約カレンダーを埋め込み表示し、予約完了時に固定のZoomリンクを案内するメールが自動送信される。受診方法（Zoom／電話）を選べる質問項目も追加済み。予約枠の管理（曜日・時間帯の変更など）はTimeRexの管理画面から行う
- ✅ **送料の実装** … 送料・梱包料600円（税込）を決済に組み込み、合計8,000円以上のご購入（8本セット）は送料無料になるようにした（`lib/pricing.ts`の`getShippingFee`）。それまでは送料が実際には請求されない状態だったのを修正
- ✅ **特定商取引法ページ・プライバシーポリシーの掲載** … `/legal`・`/privacy`を作成し、トップページのフッターから遷移できるようにした。事業者情報はkoichiroさんと相談の上、医院の住所・お名前を記載。問い合わせ用メールアドレスは医院の既存メールを暫定利用（本番公開時に専用アドレスへの切替を再検討予定）
- 管理画面のログインは、当面は今の固定パスワード方式のまま。将来、複数の歯科医師を雇う際にSupabase Authで個別アカウントを発行できるようにする方針（今回は対応しない）

---

## このプロジェクトの中身

```
app/
  page.tsx              … トップページ（LP）
  layout.tsx            … 全ページ共通の設定（フォント・メタ情報など）
  globals.css           … サイト全体のデザイン（色・フォント・レイアウト）
  api/health/           … Supabase接続確認用のAPI
  register/             … 会員登録（STEP1: メール・パスワード・生年月日・スクリーニング）
  register/profile/     … 会員登録STEP2（お届け先情報の入力）
  login/                … ログイン
  forgot-password/      … パスワード再設定メールの送信
  reset-password/       … 新しいパスワードの設定
  auth/confirm/         … 確認メール・パスワード再設定メールのリンク先（セッションの確立）
  mypage/                … マイページ（ステータス表示・登録情報の変更・ログアウト）
  consultation/          … 患者向けのオンライン診療案内ページ（Zoomリンクの案内）
  order/                 … 購入画面（本数・濃度選択、Stripe決済セッション作成）
  order/success/         … 決済完了後の戻り先ページ
  api/stripe/webhook/    … Stripeからの支払い完了通知を受け取るAPI
  admin/login/           … 管理画面のログイン
  admin/(dashboard)/     … 管理画面本体（受付状況の切り替え、会員一覧・診療結果の入力、注文一覧・発送管理）。
                            ログインしていないとここには入れない
  legal/                 … 特定商取引法に基づく表記
  privacy/                … プライバシーポリシー
components/
  SignBoardDemo.tsx      … 「今すぐ診療」機能の説明用デモ（LPの説明セクション。クリックで見た目が切り替わる）
  ConsultationStatusCard.tsx … トップページの受付状況カード（実データ・リアルタイム連携）
  TimeRexBooking.tsx     … 予約診療の埋め込みカレンダー（外部サービスTimeRexのウィジェットを表示）
lib/
  age.ts                 … 生年月日から満年齢を計算
  patientStatus.ts       … 会員ステータスの日本語表示
  postalLookup.ts        … 郵便番号から住所を検索（zipcloud API）
  adminAuth.ts            … 管理画面の簡易パスワード認証
  pricing.ts              … 本数・濃度と価格の対応表
  stock.ts                 … 濃度ごとの在庫表示（在庫あり／在庫僅か／品切れ中）の型と表示ラベル
  stripe.ts                … サーバー専用のStripe接続
  resend.ts                … サーバー専用のResend（メール配信）接続
  orderEmails.ts           … 注文確認・発送連絡メールの文面と送信処理
  supabase/
    client.ts            … ブラウザから使うSupabase接続
    server.ts             … サーバーから使うSupabase接続（ログイン中の会員として読み書き）
    admin.ts              … 管理者権限のSupabase接続（/admin機能などサーバー専用。絶対にブラウザに渡さない）
proxy.ts                … 会員のログインセッションを維持する仕組み
supabase/schema.sql     … データベースの設計図（patients / doctor_status / consultations / orders、会員登録トリガー、RLS設定）
```

## 次のフェーズ

Phase 5の残りとして、特定商取引法ページ・プライバシーポリシーの掲載を進めます（事業者情報の記載方法をkoichiroさんと相談してから着手）。
