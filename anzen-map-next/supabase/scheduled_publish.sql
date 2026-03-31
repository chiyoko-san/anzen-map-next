-- ============================================================
-- 予約公開機能のセットアップ
-- Supabase の「SQL Editor」にそのまま貼り付けて実行してください
-- ============================================================

-- 1. scheduled_at カラムを追加（すでにある場合はスキップ）
alter table columns
  add column if not exists scheduled_at timestamptz;

-- 2. 予約公開を実行するRPC関数
--    GitHub Actionsから15分おきに呼び出される
create or replace function publish_scheduled_columns()
returns json
language plpgsql
security definer
as $$
declare
  published_count integer;
begin
  update columns
  set
    status       = 'published',
    published_at = scheduled_at
  where
    status       = 'scheduled'
    and scheduled_at <= now()
    and scheduled_at is not null;

  get diagnostics published_count = row_count;

  return json_build_object(
    'published', published_count,
    'executed_at', now()
  );
end;
$$;

-- 3. RPC関数をanon（匿名）ユーザーから実行できないよう制限
--    service_role キーからのみ実行可能にする
revoke execute on function publish_scheduled_columns() from anon, authenticated;
grant  execute on function publish_scheduled_columns() to service_role;

-- 動作確認（実行後に件数が表示される）
select publish_scheduled_columns();
