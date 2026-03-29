# 地域安全マップ — Next.js版

## 技術スタック
- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Next.js API Routes
- **データベース**: Supabase (PostgreSQL)
- **ホスティング**: Vercel（無料）
- **データ更新**: GitHub Actions（毎月自動）

---

## セットアップ手順

### 1. Supabase テーブルを作成
Supabase の「SQL Editor」を開き、`supabase/schema.sql` の内容を貼り付けて実行。

### 2. 環境変数を設定
`.env.local.example` をコピーして `.env.local` を作成し、値を入力。

```bash
cp .env.local.example .env.local
```

| 変数名 | 取得場所 |
|--------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `GMAIL_USER` | Gmailアドレス |
| `GMAIL_APP_PASSWORD` | Google アカウント → セキュリティ → アプリパスワード |
| `NEXT_PUBLIC_GA_ID` | Google Analytics → 管理 → データストリーム |

### 3. Vercel にデプロイ
1. [vercel.com](https://vercel.com) でリポジトリをインポート
2. 環境変数を Vercel の「Environment Variables」に入力
3. `anzen-map.jp` をカスタムドメインとして追加

### 4. データファイルを配置
`data/tokyo_safety.json` を `public/data/` にコピーするか、
`update_data.py` を実行して生成。

```bash
python update_data.py
```

---

## 管理画面
`https://anzen-map.jp/admin` にアクセス（Supabase Authでの認証実装を推奨）

- **問い合わせ管理**: 受信・既読・返信
- **コラム管理**: 記事の作成・公開・削除
- **広告枠管理**: 広告の追加・有効化・停止

---

## ディレクトリ構成

```
anzen-map-next/
├── app/
│   ├── layout.tsx          ← 共通レイアウト（GA4・SEO）
│   ├── page.tsx            ← トップページ
│   ├── contact/            ← お問い合わせ
│   ├── columns/            ← コラム一覧・詳細
│   ├── admin/              ← 管理画面
│   └── api/
│       └── contact/        ← 問い合わせAPI
├── components/
│   ├── layout/             ← Header・Footer・GA4
│   ├── ui/                 ← AdSlot（広告枠）
│   └── Dashboard.tsx       ← メインダッシュボード
├── lib/
│   └── supabase.ts         ← Supabaseクライアント
├── types/
│   └── index.ts            ← 型定義
├── supabase/
│   └── schema.sql          ← テーブル定義SQL
├── public/
│   └── data/
│       └── tokyo_safety.json
└── .github/workflows/
    └── update_data.yml     ← データ自動更新
```
