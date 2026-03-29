-- ============================================================
-- 地域安全マップ — Supabase テーブル定義
-- Supabase の「SQL Editor」にそのまま貼り付けて実行してください
-- ============================================================

-- 1. 問い合わせテーブル
create table if not exists contacts (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  status      text not null default 'unread', -- unread / read / replied
  created_at  timestamptz not null default now()
);

-- 問い合わせは管理者だけが読める（RLS）
alter table contacts enable row level security;
create policy "管理者のみ閲覧可" on contacts
  for all using (auth.role() = 'authenticated');

-- 誰でも投稿できる（フォーム送信）
create policy "誰でも投稿可" on contacts
  for insert with check (true);

-- ============================================================

-- 2. コラム（ブログ）テーブル
create table if not exists columns (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,        -- URL用スラッグ（英数字）
  title       text not null,
  description text not null,              -- 一覧表示用の概要
  content     text not null,              -- 本文（HTML or Markdown）
  thumbnail   text,                       -- サムネイル画像URL
  tags        text[] default '{}',        -- タグ配列
  status      text not null default 'draft', -- draft / published
  published_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 公開記事は誰でも読める
alter table columns enable row level security;
create policy "公開記事は誰でも閲覧可" on columns
  for select using (status = 'published');
create policy "管理者は全操作可" on columns
  for all using (auth.role() = 'authenticated');

-- updated_at を自動更新するトリガー
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger columns_updated_at
  before update on columns
  for each row execute function update_updated_at();

-- サンプル記事を1件挿入
insert into columns (slug, title, description, content, tags, status, published_at)
values (
  'tokyo-anzen-ranking-2024',
  '【2024年版】東京23区 治安ランキング｜犯罪発生率で徹底比較',
  '警視庁の公式データをもとに、東京23区の犯罪発生率を人口1,000人あたりで比較しました。引越し先の候補エリアを検討している方は必見です。',
  '<h2>犯罪発生率とは？</h2><p>犯罪発生率とは、刑法犯認知件数を人口で割った数値です。人口規模に関係なく地域の治安を比較できる最も重要な指標です。</p><h2>東京23区のランキング</h2><p>2023年の警視庁データによると、犯罪発生率が最も低いのは練馬区（7.5件/千人）、最も高いのは千代田区（32.8件/千人）となっています。</p><p>千代田区は昼間人口が夜間人口より大きく、実態以上に高く出る点に注意が必要です。</p><h2>引越し先として安全な区は？</h2><p>ファミリー向けには練馬区・杉並区・世田谷区が、単身者には文京区・目黒区が治安・利便性のバランスが良いエリアです。</p>',
  ARRAY['治安', 'ランキング', '東京', '引越し'],
  'published',
  now()
);

-- ============================================================

-- 3. 広告枠テーブル
create table if not exists ads (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,              -- 広告名（管理用）
  position    text not null,             -- 表示位置（header / sidebar / footer / inline）
  type        text not null default 'adsense', -- adsense / affiliate / direct
  code        text not null,             -- 広告タグHTML or アフィリエイトリンク
  is_active   boolean not null default true,
  page        text default 'all',        -- 'all' or 特定のパス
  priority    int not null default 0,    -- 表示優先度
  created_at  timestamptz not null default now()
);

-- 広告はクライアントから読める
alter table ads enable row level security;
create policy "有効な広告は誰でも閲覧可" on ads
  for select using (is_active = true);
create policy "管理者は全操作可" on ads
  for all using (auth.role() = 'authenticated');

-- サンプル広告枠を挿入（AdSense承認後に実際のコードに置き換え）
insert into ads (name, position, type, code, page, priority)
values
  ('ヘッダー下バナー', 'header', 'adsense',
   '<!-- Google AdSense ここに貼り付け -->',
   'all', 10),
  ('引越しアフィリエイト', 'sidebar', 'affiliate',
   '<a href="https://www.hikkoshi-samurai.jp/" target="_blank" rel="noopener"><img src="/ads/hikkoshi-samurai.jpg" alt="引越し侍で一括見積もり" width="300" height="250"></a>',
   'all', 20),
  ('記事内広告', 'inline', 'adsense',
   '<!-- Google AdSense インライン ここに貼り付け -->',
   '/columns', 30);

-- ============================================================

-- 4. ページビュー集計テーブル（簡易アクセス解析）
create table if not exists page_views (
  id         bigserial primary key,
  path       text not null,
  referrer   text,
  created_at timestamptz not null default now()
);

alter table page_views enable row level security;
create policy "誰でも投稿可" on page_views
  for insert with check (true);
create policy "管理者のみ閲覧可" on page_views
  for select using (auth.role() = 'authenticated');
