'use client'
import { useState } from 'react'
import Link from 'next/link'

type CheckItem = {
  id: string
  category: string
  label: string
  detail: string
  link?: { text: string; href: string }
}

const CHECKLIST: CheckItem[] = [
  // 治安・安全
  { id: 'c1', category: '🔒 治安・安全', label: '犯罪発生率を確認した', detail: '人口1,000人あたりの刑法犯認知件数で比較。地域安全マップで無料確認できます。', link: { text: 'ダッシュボードで確認', href: '/' } },
  { id: 'c2', category: '🔒 治安・安全', label: '夜間に現地を歩いてみた', detail: '街灯の数・人通り・暗い路地がないか夜間に確認しましょう。' },
  { id: 'c3', category: '🔒 治安・安全', label: '駅から物件までの経路を確認した', detail: '帰宅ルートに危険な場所（高架下・暗い公園など）がないか確認。' },
  { id: 'c4', category: '🔒 治安・安全', label: 'オートロック・防犯カメラを確認した', detail: '一人暮らし女性は特に必須。モニター付きインターフォンもあると安心。' },

  // 災害リスク
  { id: 'd1', category: '🌊 災害リスク', label: 'ハザードマップを確認した', detail: '洪水・土砂災害・津波・液状化のリスクを事前確認。', link: { text: 'ハザードマップを確認', href: '/tools/compare' } },
  { id: 'd2', category: '🌊 災害リスク', label: '地震の地域危険度ランクを確認した', detail: '東京都は区丁目単位で危険度（1〜5）を公表しています。' },
  { id: 'd3', category: '🌊 災害リスク', label: '最寄りの避難場所を確認した', detail: '引越し後に必ず確認しておきましょう。自治体のHPで検索できます。' },

  // 物件・設備
  { id: 'p1', category: '🏠 物件・設備', label: '1階ではない部屋を選んだ', detail: '防犯・水害対策のため2階以上がおすすめ。' },
  { id: 'p2', category: '🏠 物件・設備', label: '建物の築年数・耐震基準を確認した', detail: '1981年以降の新耐震基準の建物を選ぶと安心。' },
  { id: 'p3', category: '🏠 物件・設備', label: '重要事項説明でハザードマップを確認した', detail: '2020年8月から不動産契約時の説明が義務化されています。' },
  { id: 'p4', category: '🏠 物件・設備', label: '管理会社・緊急連絡先を確認した', detail: '24時間対応かどうかも確認しておきましょう。' },

  // 生活環境
  { id: 'l1', category: '🏪 生活環境', label: 'スーパー・コンビニが徒歩圏内にある', detail: '日常の買い物が徒歩10分以内にあると便利。' },
  { id: 'l2', category: '🏪 生活環境', label: '病院・クリニックの場所を確認した', detail: '内科・救急対応病院・薬局の場所を事前に把握。' },
  { id: 'l3', category: '🏪 生活環境', label: '通勤・通学時間を計算した', detail: '実際に乗車して混雑具合を確認するとベター。' },
  { id: 'l4', category: '🏪 生活環境', label: '騒音・振動がないか確認した', detail: '線路・幹線道路・飲食店が近い場合は夜間も確認を。' },

  // 費用・手続き
  { id: 'f1', category: '💰 費用・手続き', label: '家賃が手取りの1/3以下であることを確認した', detail: '管理費・駐車場代込みで計算しましょう。', link: { text: '家賃シミュレーターで確認', href: '/tools/rent-simulator' } },
  { id: 'f2', category: '💰 費用・手続き', label: '初期費用（敷金・礼金・仲介手数料）を確認した', detail: '家賃の4〜6ヶ月分が目安。引越し費用も含めて計算を。' },
  { id: 'f3', category: '💰 費用・手続き', label: '火災保険に加入した（予定）', detail: '賃貸でも火災保険は必須。家財保険もセットで検討を。' },
  { id: 'f4', category: '💰 費用・手続き', label: '住民票の移転・各種住所変更を把握した', detail: '銀行・免許証・マイナンバーなど引越し後2週間以内に手続きを。' },
]

const CATEGORIES = Array.from(new Set(CHECKLIST.map(c => c.category)))

export default function ChecklistPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [openCat, setOpenCat] = useState<string | null>(null)

  const toggle = (id: string) => setChecked(p => ({ ...p, [id]: !p[id] }))
  const total   = CHECKLIST.length
  const done    = Object.values(checked).filter(Boolean).length
  const pct     = Math.round((done / total) * 100)

  const progressColor = pct === 100 ? 'bg-green-500' : pct >= 60 ? 'bg-blue-500' : 'bg-amber-500'

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-xs text-gray-400 mb-6 flex gap-1 items-center">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span>/</span>
        <span className="text-gray-600">引越しチェックリスト</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">✅ 引越しチェックリスト</h1>
        <p className="text-sm text-gray-500">引越し前に確認すべき{total}項目をまとめました</p>
      </div>

      {/* 進捗バー */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">進捗状況</span>
          <span className="text-sm font-bold text-gray-900">{done} / {total}項目完了</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">{pct}% 完了</span>
          {pct === 100 && (
            <span className="text-xs font-bold text-green-600">🎉 全項目クリア！</span>
          )}
        </div>
      </div>

      {/* カテゴリ別リスト */}
      <div className="space-y-3">
        {CATEGORIES.map(cat => {
          const items    = CHECKLIST.filter(c => c.category === cat)
          const catDone  = items.filter(c => checked[c.id]).length
          const isOpen   = openCat === cat || openCat === null
          return (
            <div key={cat} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenCat(openCat === cat ? null : cat)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 text-sm">{cat}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    catDone === items.length
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {catDone}/{items.length}
                  </span>
                </div>
                <span className="text-gray-400 text-xs">{openCat === cat ? '▲' : '▼'}</span>
              </button>

              {openCat === cat && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {items.map(item => (
                    <div key={item.id}
                      className={`px-5 py-4 transition ${checked[item.id] ? 'bg-green-50' : 'bg-white'}`}
                    >
                      <div className="flex gap-3">
                        <button
                          onClick={() => toggle(item.id)}
                          className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition ${
                            checked[item.id]
                              ? 'bg-green-500 border-green-500'
                              : 'border-gray-300 hover:border-blue-400'
                          }`}
                        >
                          {checked[item.id] && (
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1">
                          <p className={`text-sm font-medium transition ${
                            checked[item.id] ? 'line-through text-gray-400' : 'text-gray-900'
                          }`}>
                            {item.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.detail}</p>
                          {item.link && !checked[item.id] && (
                            <Link href={item.link.href}
                              className="inline-block mt-1.5 text-xs text-blue-600 hover:underline">
                              → {item.link.text}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex gap-3 flex-wrap">
        <button
          onClick={() => setChecked({})}
          className="text-sm text-gray-500 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          リセット
        </button>
        <Link href="/tools/rent-simulator"
          className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
          💰 家賃シミュレーターへ
        </Link>
        <Link href="/"
          className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
          🔍 ダッシュボードへ
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        ※ チェック状態はページを閉じるとリセットされます
      </p>
    </div>
  )
}
