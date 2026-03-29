import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Column } from '@/types'
import AdSlot from '@/components/ui/AdSlot'

type Props = { params: { slug: string } }

export const revalidate = 3600

async function getColumn(slug: string): Promise<Column | null> {
  const { data } = await supabase
    .from('columns')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  return data as Column | null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const col = await getColumn(params.slug)
  if (!col) return { title: '記事が見つかりません' }
  return {
    title: col.title,
    description: col.description,
    openGraph: {
      title: col.title,
      description: col.description,
      images: col.thumbnail ? [col.thumbnail] : [],
    },
  }
}

export default async function ColumnDetailPage({ params }: Props) {
  const col = await getColumn(params.slug)
  if (!col) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-3 gap-8">

        {/* 本文 */}
        <article className="md:col-span-2">
          {/* パンくず */}
          <nav className="text-xs text-gray-400 mb-4 flex gap-1 items-center flex-wrap">
            <Link href="/" className="hover:text-blue-600">ホーム</Link>
            <span>/</span>
            <Link href="/columns" className="hover:text-blue-600">コラム</Link>
            <span>/</span>
            <span className="text-gray-600 line-clamp-1">{col.title}</span>
          </nav>

          {/* タグ */}
          <div className="flex gap-1.5 mb-3 flex-wrap">
            {col.tags?.map(tag => (
              <span key={tag} className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {tag}
              </span>
            ))}
          </div>

          {/* タイトル */}
          <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-3">{col.title}</h1>

          {/* メタ情報 */}
          {col.published_at && (
            <p className="text-xs text-gray-400 mb-5">
              公開日：{new Date(col.published_at).toLocaleDateString('ja-JP')}
              　最終更新：{new Date(col.updated_at).toLocaleDateString('ja-JP')}
            </p>
          )}

          {/* サムネイル */}
          {col.thumbnail && (
            <img
              src={col.thumbnail}
              alt={col.title}
              className="w-full h-52 object-cover rounded-xl mb-6"
            />
          )}

          {/* 本文 — prose クラスでHTMLを整形 */}
          <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: col.content }} />

          {/* 記事内広告 */}
          <AdSlot position="inline" page="/columns" className="my-8" />

          {/* 免責 */}
          <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 border border-gray-200">
            本記事は政府機関等の公開データをもとに作成しています。
            実際の引越し先選定にあたっては、必ず現地確認・専門家への相談を行ってください。
            <Link href="/disclaimer" className="ml-1 text-blue-500 underline">免責事項</Link>
          </div>

          <div className="mt-6">
            <Link href="/columns" className="inline-flex items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition">
              ← コラム一覧に戻る
            </Link>
          </div>
        </article>

        {/* サイドバー */}
        <aside className="space-y-4">
          <AdSlot position="sidebar" className="rounded-xl overflow-hidden" />
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-bold text-sm text-gray-800 mb-3">地域を検索する</h3>
            <p className="text-xs text-gray-500 mb-3">引越し先の治安・家賃を無料で確認</p>
            <Link href="/" className="block w-full text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              ダッシュボードを開く
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
