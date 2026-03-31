import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Column } from '@/types'
import AdSlot from '@/components/ui/AdSlot'

export const metadata: Metadata = {
  title: 'コラム｜引越しと治安に関する情報',
  description: '引越し先の治安・家賃・生活環境に関するコラムをまとめています。東京・大阪・名古屋・福岡・札幌の最新データをもとに解説。',
}

export const revalidate = 60 // 1時間キャッシュ

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

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* ヘッダー広告 */}
      <AdSlot position="header" className="mb-6" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">コラム</h1>
        <p className="text-sm text-gray-500">引越し先の治安・家賃・生活環境に関する情報をまとめています</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* メインコンテンツ */}
        <div className="md:col-span-2">
          {columns.length === 0 ? (
            <div className="card text-center py-12 text-gray-400">
              <p className="text-lg mb-1">コラムを準備中です</p>
              <p className="text-sm">近日公開予定</p>
            </div>
          ) : (
            <div className="space-y-4">
              {columns.map(col => (
                <Link key={col.id} href={`/columns/${col.slug}`}>
                  <article className="card hover:shadow-md transition group">
                    <div className="flex gap-4">
                      {col.thumbnail && (
                        <img
                          src={col.thumbnail}
                          alt={col.title}
                          className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex gap-1.5 mb-1.5 flex-wrap">
                          {col.tags?.slice(0, 3).map(tag => (
                            <span key={tag} className="badge bg-blue-50 text-blue-700">{tag}</span>
                          ))}
                        </div>
                        <h2 className="font-bold text-gray-900 text-sm leading-snug mb-1.5 group-hover:text-blue-600 transition line-clamp-2">
                          {col.title}
                        </h2>
                        <p className="text-xs text-gray-500 line-clamp-2">{col.description}</p>
                        {col.published_at && (
                          <p className="text-xs text-gray-400 mt-1.5">
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

        {/* サイドバー広告 */}
        <aside className="space-y-4">
          <AdSlot position="sidebar" className="rounded-xl overflow-hidden" />
          <div className="card">
            <h3 className="font-bold text-sm text-gray-800 mb-3">よく読まれている記事</h3>
            <p className="text-xs text-gray-400">準備中</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
