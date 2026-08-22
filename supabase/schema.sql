-- ============================================================================
-- 世田谷ホワイトニング — 初期スキーマ (Phase 0)
--
-- 使い方:
--   Supabaseの管理画面 → 該当プロジェクト → SQL Editor → New query に
--   このファイルの中身を貼り付けて実行してください。
--
-- 設計方針（バックエンドロードマップより）:
--   ・診療情報（既往歴・診断内容・処方内容）は一切持たない。
--   ・カード番号は一切持たない（Stripeのセッション/トークンのみ保持）。
--   ・doctor_status は常に1行だけのシングルトンとして扱う。
-- ============================================================================

-- --------------------------------------------------------------------------
-- 1. patients — 会員（購入資格の主語）
-- --------------------------------------------------------------------------
create table if not exists public.patients (
  id                uuid primary key references auth.users(id) on delete cascade,
  name              text,
  birthdate         date,
  phone             text,
  address           jsonb,
  status            text not null default 'unapproved'
                      check (status in ('unapproved', 'approved', 'recheck')),
  last_approved_at  timestamptz,
  last_purchase_at  timestamptz,
  created_at        timestamptz not null default now()
);

comment on table public.patients is '会員。診療の詳細情報は持たず、購入資格の状態(status)のみを扱う。';
comment on column public.patients.status is 'unapproved=未承認 / approved=購入可能 / recheck=要再確認';

-- --------------------------------------------------------------------------
-- 2. doctor_status — 「今すぐ診療」の唯一の情報源（常に1行のみ）
-- --------------------------------------------------------------------------
create table if not exists public.doctor_status (
  id           int primary key default 1,
  state        text not null default 'offline'
                 check (state in ('online', 'busy', 'offline')),
  doctor_name  text,
  updated_at   timestamptz not null default now(),
  constraint doctor_status_singleton check (id = 1)
);

comment on table public.doctor_status is '歯科医師のオンライン受付状況。常に1行(id=1)だけを更新する。';

insert into public.doctor_status (id, state)
values (1, 'offline')
on conflict (id) do nothing;

-- --------------------------------------------------------------------------
-- 3. consultations — 診療の予約・実施記録（結果のみ。所見や処方は含めない）
-- --------------------------------------------------------------------------
create table if not exists public.consultations (
  id            uuid primary key default gen_random_uuid(),
  patient_id    uuid not null references public.patients(id) on delete cascade,
  scheduled_at  timestamptz,
  zoom_link     text,
  result        text check (result in ('approved', 'recheck', 'rejected')),
  created_at    timestamptz not null default now()
);

comment on table public.consultations is '診療の予約・結果記録。診断内容や所見などの医療情報は含めない。';

-- --------------------------------------------------------------------------
-- 4. orders — 注文
-- --------------------------------------------------------------------------
create table if not exists public.orders (
  id                  uuid primary key default gen_random_uuid(),
  patient_id          uuid not null references public.patients(id) on delete cascade,
  plan                int not null check (plan in (2, 4, 8)),
  concentration_mix   jsonb not null,
  amount              int not null,
  stripe_session_id   text,
  payment_status      text not null default 'pending'
                        check (payment_status in ('pending', 'paid', 'failed')),
  shipping_status     text not null default 'preparing'
                        check (shipping_status in ('preparing', 'shipped')),
  created_at          timestamptz not null default now()
);

comment on table public.orders is '注文。濃度の組み合わせ(concentration_mix)は自社DBのみで保持し、Stripeには渡さない。';

-- --------------------------------------------------------------------------
-- インデックス
-- --------------------------------------------------------------------------
create index if not exists idx_consultations_patient_id on public.consultations(patient_id);
create index if not exists idx_orders_patient_id on public.orders(patient_id);
create index if not exists idx_patients_status on public.patients(status);

-- --------------------------------------------------------------------------
-- Row Level Security（RLS）
-- --------------------------------------------------------------------------
alter table public.patients enable row level security;
alter table public.doctor_status enable row level security;
alter table public.consultations enable row level security;
alter table public.orders enable row level security;

-- ポリシーはこのSQLを再実行しても安全なように、一度drop してから作り直す

-- patients: 本人だけが自分の行を読み書きできる
drop policy if exists "patients can view own row" on public.patients;
create policy "patients can view own row"
  on public.patients for select
  using (auth.uid() = id);

drop policy if exists "patients can update own row" on public.patients;
create policy "patients can update own row"
  on public.patients for update
  using (auth.uid() = id);

drop policy if exists "patients can insert own row" on public.patients;
create policy "patients can insert own row"
  on public.patients for insert
  with check (auth.uid() = id);

-- doctor_status: 誰でも（未ログインでも）状態を閲覧できる。書き込みは管理API(service role)のみ。
drop policy if exists "anyone can view doctor status" on public.doctor_status;
create policy "anyone can view doctor status"
  on public.doctor_status for select
  using (true);

-- consultations: 本人の記録だけ閲覧可能。書き込みは管理API(service role)のみ。
drop policy if exists "patients can view own consultations" on public.consultations;
create policy "patients can view own consultations"
  on public.consultations for select
  using (auth.uid() = patient_id);

-- orders: 本人の注文だけ閲覧可能。作成・更新はサーバー側API(service role)のみ。
drop policy if exists "patients can view own orders" on public.orders;
create policy "patients can view own orders"
  on public.orders for select
  using (auth.uid() = patient_id);

-- --------------------------------------------------------------------------
-- Realtime（「今すぐ診療」表示のリアルタイム配信に必須）
-- 既に追加済みの場合はエラーにせずスキップする（このSQLを再実行しても安全）
-- --------------------------------------------------------------------------
do $$
begin
  alter publication supabase_realtime add table public.doctor_status;
exception
  when others then
    raise notice 'doctor_status is already in supabase_realtime publication (skipped)';
end $$;
