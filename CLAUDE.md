@AGENTS.md

# プロジェクト概要(Claude Code用の引き継ぎメモ)

このファイルはClaude Codeが起動するたびに自動で読み込まれます。
毎回説明し直さなくていいように、事業の背景・今の状況・ルールをここにまとめています。

## この事業について

「世田谷ホワイトニング」は、来院不要のオンライン・ホームホワイトニング事業です。

基本の流れ:
1. 患者がオンラインで歯科医師の診療を受ける
2. 医師が適否を判定する
3. 適合した患者だけが購入できる(購入前に医師の許可が必要)
4. Opalescence(オパールエッセンス)のホワイトニングジェルを2本セットで配送する
5. 濃度は10/15/20/35%の4段階、価格帯は3,980円/6,980円/13,480円の3ティア

特徴的な機能: 医師の「今すぐ診療可能」状態をトップページにリアルタイム表示する(Supabase Realtimeを使用)。

運営者(koichiroさん)はエンジニアではないため、実装や技術判断はClaude Codeが担い、
koichiroさんには**専門用語を避けて、日本語でわかりやすく**状況を報告すること。

## 今の状況(2026年8月24日時点)

- Phase 0(プロジェクトの土台づくり)・Phase 1(会員登録とステータス表示)・
  Phase 2(今すぐ診療サイン)・Phase 3(診療から承認まで)・Phase 4(購入とStripe決済)が完了し、
  本番環境(Vercel)で動作確認済み
- Phase 5(運用の仕上げ)は一部完了・一部進行中:
  - 完了: RLS(データベースのアクセス制御)の見直し、注文確認・発送連絡メールの自動送信の実装
  - 進行中: 独自ドメイン(`setagaya-whitening.com`、お名前.comで取得)のDNS設定を完了し反映待ち。
    反映後、Resend側でドメイン認証を確認してから実際のメール送信テストを行う
  - 保留: 特定商取引法ページ・プライバシーポリシー(事業者情報の記載方法が未決定のためkoichiroさんと後日相談)
  - 対応しない方針: 管理画面ログインの強化(当面は固定パスワードのまま。将来複数の歯科医師を
    雇う際にSupabase Authで個別アカウント発行できるようにする、という方針のみ決定)
- 詳しい手順・実装内容は `README.md` に非エンジニア向けに書いてある。作業の際は必ずこれを参照し、
  進んだら `README.md` の該当箇所を更新すること
- 事業の基本仕様は `docs/master-prompt.md`(マスタープロンプト v2.0)に保管している。
  実装内容を判断する際はこのファイルを正とする。実装の都合でマスタープロンプトの内容から
  変更した場合は、同ファイル末尾の「実装時の変更履歴」に理由とあわせて追記すること

## 技術構成

- フレームワーク: Next.js 16(App Router)+ TypeScript。破壊的変更が多いバージョンなので
  `AGENTS.md`(このファイルの1行目でimportしている)の注意事項に必ず従うこと
- バックエンド: Supabase(PostgreSQL + Auth + Realtime)
- 認証: Supabase Auth(メール＋パスワード。確認メール・パスワード再設定は標準のメールリンクを使用。
  マスタープロンプトのワンタイムコード案から変更した経緯は `docs/master-prompt.md` 参照)
- 決済: Stripe Checkout(Phase 4で実装済み。`concentration`などの個別情報はStripeに渡さず自社DBのみで管理)
- メール配信: Resend(Phase 5で実装済み。決済完了・発送完了時に自動送信。独自ドメインのDNS反映待ち)
- オンライン診療: Zoom(MVPでは固定リンク。`NEXT_PUBLIC_ZOOM_LINK`環境変数に担当医の
  個人ミーティングルームURLを設定している。患者画面にそのまま表示されるので公開前提の値)
- 環境変数: `.env.local.example` を参照。実際の値は `.env.local`(gitには含めない)
- 主要ファイル:
  - `app/page.tsx` … トップページ
  - `app/api/health/route.ts` … Supabase接続確認用API
  - `app/register/`, `app/login/`, `app/mypage/` など … 会員登録・ログイン・マイページ(Phase 1)
  - `app/consultation/` … 患者向けのオンライン診療案内ページ(Zoomリンク案内)(Phase 3)
  - `app/admin/` … 管理画面。`admin/login`はログイン、`admin/(dashboard)`が本体
    (受付状況の切り替えはPhase 2、`patients/`配下の会員一覧・診療結果入力はPhase 3)。
    `lib/adminAuth.ts`の固定パスワード(環境変数`ADMIN_PASSWORD`)で保護している
  - `components/ConsultationStatusCard.tsx` … トップページの受付状況表示。Supabase Realtimeで
    `doctor_status`を購読し、管理画面での変更を再読み込みなしで反映する(Phase 2)
  - `app/order/`, `app/order/success/` … 購入画面・決済完了後の戻り先(Phase 4)
  - `app/api/stripe/webhook/route.ts` … Stripeの支払い完了通知を受け取るAPI(Phase 4)
  - `app/admin/(dashboard)/orders/` … 管理画面の注文一覧・発送管理(Phase 4)
  - `lib/stripe.ts`, `lib/pricing.ts` … Stripe接続・本数濃度と価格の対応表(Phase 4)
  - `lib/resend.ts`, `lib/orderEmails.ts` … メール配信接続・注文確認/発送連絡メールの送信処理(Phase 5)
  - `lib/supabase/{client,server,admin}.ts` … 用途別のSupabase接続
  - `supabase/schema.sql` … DB設計(patients / doctor_status / consultations / orders、会員登録トリガー、RLS設定)
  - `proxy.ts` … 会員セッション維持用(Next.js 16の`middleware`相当)

## 今後のロードマップ

バックエンド構築ロードマップ(全体像・アーキテクチャ図・DB設計の詳細):
https://claude.ai/code/artifact/73237527-d822-4441-be64-f907c9b3bde8

わかっている範囲:
- Phase 0: プロジェクトの土台 — 完了
- Phase 1: 会員登録とステータス表示 — 完了
- Phase 2: 今すぐ診療サイン — 完了
- Phase 3: 診療から承認まで — 完了
- Phase 4: 購入とStripe決済 — 完了
- Phase 5: 運用の仕上げ(今ここ。上記「今の状況」参照)
  → 着手前に必ず上記ロードマップ資料で詳細を確認すること(このメモに正確な内容がなければ推測で進めない)

**このプロジェクトの対象範囲は「HPの実装まで」。集客・問い合わせ対応・経理などの事業運営面は対象外。**

## 作業のルール

- 何かを実行する前に、影響がわかるように一言で説明してから実行する
- 完了したら「何が終わって、次に何をすればいいか」を非エンジニア向けの言葉で報告する
- 迷ったり判断が必要な場面(設計判断・外部サービスの選定など)は、実行せずkoichiroさんに確認する
- git commitメッセージは日本語でよい
- フェーズが完了したら `/phase-check` コマンドを使って、READMEのチェックリスト更新と報告をまとめて行う
