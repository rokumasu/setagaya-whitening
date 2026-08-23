# 世田谷ホワイトニング — Webアプリ（Phase 1まで完了）

オンライン診療から始めるホームホワイトニングサービスのWebアプリです。
[バックエンド構築ロードマップ](https://claude.ai/code/artifact/73237527-d822-4441-be64-f907c9b3bde8) の Phase 0（土台づくり）・Phase 1（会員登録とステータス表示）が完了し、**インターネット上に公開済み**の状態のプロジェクトです。

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

まだできないこと（Phase 2以降で作ります）：「今すぐ診療」表示のリアルタイム連携、オンライン診療、管理画面、決済。

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
components/
  SignBoardDemo.tsx      … 「今すぐ診療」機能の説明用デモ（クリックで状態が切り替わる）
lib/
  age.ts                 … 生年月日から満年齢を計算
  patientStatus.ts       … 会員ステータスの日本語表示
  postalLookup.ts        … 郵便番号から住所を検索（zipcloud API）
  supabase/
    client.ts            … ブラウザから使うSupabase接続
    server.ts             … サーバーから使うSupabase接続（ログイン中の会員として読み書き）
    admin.ts              … 管理者権限のSupabase接続（/admin機能などサーバー専用。絶対にブラウザに渡さない）
proxy.ts                … 会員のログインセッションを維持する仕組み
supabase/schema.sql     … データベースの設計図（patients / doctor_status / consultations / orders、会員登録トリガー）
```

## 次のフェーズ

バックエンド構築ロードマップに沿って、Phase 2（今すぐ診療サイン）に進みます。「Phase 2から始めよう」と伝えれば続きに着手できます。
