import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Column } from '@/types'
import AdSlot from '@/components/ui/AdSlot'

export const metadata: Metadata = {
  title: 'コラム｜引越しと治安に関する情報',
  description: '引越し先の治安・家賃・生活環境に関するコラムをまとめています。東京・大阪・名古屋・福岡・札幌の最新データをもとに解説。',
}

export const revalidate = 0 // キャッシュなし（常に最新を表示）

async function getColumns(): Promise<Column[]> {
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('columns')
    .select('id,slug,title,description,thumbnail,tags,status,published_at,scheduled_at')
    .or(`status.eq.published,and(status.eq.scheduled,scheduled_at.lte.${now})`)
    .order('published_at', { ascending: false })
    .limit(20)
  return (data as Column[]) ?? []
}

export default async function ColumnsPage() {
  const columns = await getColumns()

  // 人気記事：公開日が新しい順に上位3件（将来的にPV数で並び替え可能）
  const popular = columns.slice(0, 3)

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* ヘッダー広告 */}
      <AdSlot position="header" className="mb-6" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">コラム</h1>
        <p className="text-sm text-gray-500">引越し先の治安・家賃・生活環境に関する情報をまとめています</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {/* ─── メインコンテンツ ─── */}
        <div className="md:col-span-2">
          {columns.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              <p className="text-lg mb-1">コラムを準備中です</p>
              <p className="text-sm">近日公開予定</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {columns.map(col => (
                <Link key={col.id} href={`/columns/${col.slug}`}>
                  <article className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition group overflow-hidden">
                    <div className="flex gap-0">
                      {/* サムネイル */}
                      {col.thumbnail ? (
                        <img
                          src={col.thumbnail}
                          alt={col.title}
                          className="w-36 h-28 object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-36 h-28 bg-gradient-to-br from-blue-100 to-blue-50 flex-shrink-0 flex items-center justify-center text-3xl">
                          🏙
                        </div>
                      )}
                      {/* テキスト */}
                      <div className="flex-1 min-w-0 p-4">
                        <div className="flex gap-1.5 mb-2 flex-wrap">
                          {col.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="font-bold text-gray-900 text-sm leading-snug mb-2 group-hover:text-blue-600 transition line-clamp-2">
                          {col.title}
                        </h2>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{col.description}</p>
                        {col.published_at && (
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(col.published_at).toLocaleDateString('ja-JP')}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* ─── サイドバー ─── */}
        <aside className="space-y-5">
          {/* 広告 */}
          <AdSlot position="sidebar" className="rounded-xl overflow-hidden" />

          {/* 人気記事ランキング */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-bold text-sm text-gray-800 mb-4 pb-2 border-b border-gray-100">
              📊 人気記事
            </h3>
            {popular.length === 0 ? (
              <p className="text-xs text-gray-400">準備中</p>
            ) : (
              <div className="space-y-4">
                {popular.map((col, i) => (
                  <Link key={col.id} href={`/columns/${col.slug}`}>
                    <div className="flex gap-3 items-start group">
                      {/* 順位バッジ */}
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                        i === 0 ? 'bg-yellow-100 text-yellow-700' :
                        i === 1 ? 'bg-gray-100 text-gray-600' :
                        'bg-orange-50 text-orange-600'
                      }`}>
                        {i + 1}
                      </span>
                      {/* サムネイル */}
                      {col.thumbnail ? (
                        <img
                          src={col.thumbnail}
                          alt={col.title}
                          className="w-14 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-12 bg-blue-50 rounded-lg flex-shrink-0 flex items-center justify-center text-lg">
                          🏙
                        </div>
                      )}
                      {/* タイトル */}
                      <p className="text-xs text-gray-700 leading-snug line-clamp-3 group-hover:text-blue-600 transition">
                        {col.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ダッシュボードへの導線 */}
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <h3 className="font-bold text-sm text-blue-900 mb-2">🔍 地域を検索する</h3>
            <p className="text-xs text-blue-700 mb-3 leading-relaxed">引越し先の治安・家賃・ハザードマップを無料で確認</p>
            <Link href="/" className="block w-full text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              ダッシュボードを開く
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
