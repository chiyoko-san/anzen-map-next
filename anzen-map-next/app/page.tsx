import type { Metadata } from 'next'
import Dashboard from '@/components/Dashboard'
import AdSlot from '@/components/ui/AdSlot'

export const metadata: Metadata = {
  title: '地域安全マップ｜引越し前に治安・犯罪率・家賃を確認',
  description:
    '引越し前に確認すべき治安・犯罪率・家賃・火災・街灯データを警視庁・各都道府県警察・総務省の公式統計からまとめています。東京・大阪・名古屋・福岡・札幌の区別データを無料で検索。',
}

export default function HomePage() {
  return (
    <>
      {/* ヘッダー下広告 */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <AdSlot position="header" />
      </div>
      {/* メインダッシュボード */}
      <Dashboard />
      {/* フッター上広告 */}
      <div className="max-w-6xl mx-auto px-4 pb-4">
        <AdSlot position="footer" />
      </div>
    </>
  )
}
