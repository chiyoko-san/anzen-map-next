'use client'
import { useState } from 'react'
import Link from 'next/link'

type RoomType = '1K' | '1LDK' | '2LDK以上'
type Priority = '治安重視' | '家賃重視' | 'バランス'

const AREAS = [
  { name: '練馬区',   score: 87, rent_1k: 78000,  rent_1ldk: 120000, rent_family: 155000, crime: 7.5  },
  { name: '杉並区',   score: 84, rent_1k: 88000,  rent_1ldk: 130000, rent_family: 165000, crime: 8.1  },
  { name: '世田谷区', score: 83, rent_1k: 95000,  rent_1ldk: 140000, rent_family: 175000, crime: 8.3  },
  { name: '板橋区',   score: 82, rent_1k: 72000,  rent_1ldk: 108000, rent_family: 140000, crime: 8.1  },
  { name: '江東区',   score: 80, rent_1k: 82000,  rent_1ldk: 125000, rent_family: 160000, crime: 8.5  },
  { name: '文京区',   score: 78, rent_1k: 98000,  rent_1ldk: 145000, rent_family: 185000, crime: 11.7 },
  { name: '目黒区',   score: 76, rent_1k: 108000, rent_1ldk: 158000, rent_family: 200000, crime: 10.1 },
  { name: '豊島区',   score: 62, rent_1k: 85000,  rent_1ldk: 128000, rent_family: 163000, crime: 18.2 },
  { name: '渋谷区',   score: 48, rent_1k: 130000, rent_1ldk: 190000, rent_family: 245000, crime: 25.1 },
  { name: '新宿区',   score: 45, rent_1k: 110000, rent_1ldk: 165000, rent_family: 210000, crime: 24.3 },
]

const GRADE = (s: number) => s >= 80 ? 'A' : s >= 65 ? 'B' : s >= 50 ? 'C' : 'D'
const GRADE_COLOR: Record<string, string> = {
  A: 'bg-green-100 text-green-700 border-green-200',
  B: 'bg-blue-100 text-blue-700 border-blue-200',
  C: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  D: 'bg-red-100 text-red-700 border-red-200',
}

export default function RentSimulator() {
  const [income,   setIncome]   = useState(300)
  const [roomType, setRoomType] = useState<RoomType>('1K')
  const [priority, setPriority] = useState<Priority>('バランス')
  const [result,   setResult]   = useState<typeof AREAS | null>(null)

  const rentKey = roomType === '1K' ? 'rent_1k' : roomType === '1LDK' ? 'rent_1ldk' : 'rent_family'

  // 家賃の目安（手取りの3分の1）
  const maxRent = Math.round((income * 10000) / 3)

  function simulate() {
    const filtered = AREAS.filter(a => a[rentKey] <= maxRent)
    const sorted = [...filtered].sort((a, b) => {
      if (priority === '治安重視') return b.score - a.score
      if (priority === '家賃重視') return a[rentKey] - b[rentKey]
      // バランス：スコアと家賃の総合評価
      const scoreA = (a.score / 100) * 0.6 + (1 - a[rentKey] / 200000) * 0.4
      const scoreB = (b.score / 100) * 0.6 + (1 - b[rentKey] / 200000) * 0.4
      return scoreB - scoreA
    })
    setResult(sorted.slice(0, 5))
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <nav className="text-xs text-gray-400 mb-6 flex gap-1 items-center">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span>/</span>
        <span className="text-gray-600">家賃シミュレーター</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">💰 家賃シミュレーター</h1>
        <p className="text-sm text-gray-500">収入と条件を入力して、住めるエリアとおすすめ区を確認しましょう</p>
      </div>

      {/* 入力フォーム */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6 space-y-6">

        {/* 月収入力 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            月収（手取り）
            <span className="ml-2 text-blue-600 font-bold text-base">{income}万円</span>
          </label>
          <input
            type="range" min={15} max={80} step={1}
            value={income}
            onChange={e => setIncome(Number(e.target.value))}
            className="w-full accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>15万円</span><span>80万円</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            家賃の目安（手取りの1/3）：
            <span className="font-bold text-blue-600 ml-1">{Math.round(maxRent / 10000)}万円/月 以下</span>
          </p>
        </div>

        {/* 間取り */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">間取り</label>
          <div className="grid grid-cols-3 gap-3">
            {(['1K', '1LDK', '2LDK以上'] as RoomType[]).map(r => (
              <button key={r} onClick={() => setRoomType(r)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                  roomType === r
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* 優先事項 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">優先事項</label>
          <div className="grid grid-cols-3 gap-3">
            {(['治安重視', 'バランス', '家賃重視'] as Priority[]).map(p => (
              <button key={p} onClick={() => setPriority(p)}
                className={`py-2.5 rounded-xl text-sm font-medium border transition ${
                  priority === p
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}>
                {p === '治安重視' ? '🔒 治安重視' : p === '家賃重視' ? '💰 家賃重視' : '⚖️ バランス'}
              </button>
            ))}
          </div>
        </div>

        <button onClick={simulate}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-sm">
          おすすめエリアを探す →
        </button>
      </div>

      {/* 結果 */}
      {result !== null && (
        <div>
          <h2 className="font-bold text-gray-900 mb-4">
            {result.length > 0
              ? `✅ おすすめエリア（${result.length}件見つかりました）`
              : '😢 条件に合うエリアが見つかりませんでした'}
          </h2>
          {result.length === 0 && (
            <p className="text-sm text-gray-500 mb-4">月収を上げるか、間取りを変えて再検索してみてください。</p>
          )}
          <div className="space-y-3">
            {result.map((area, i) => {
              const g = GRADE(area.score)
              const rent = area[rentKey]
              return (
                <div key={area.name} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                      i === 0 ? 'bg-yellow-100 text-yellow-700' :
                      i === 1 ? 'bg-gray-100 text-gray-600' :
                      i === 2 ? 'bg-orange-50 text-orange-600' : 'bg-gray-50 text-gray-400'
                    }`}>{i + 1}</span>
                    <span className="font-bold text-gray-900">{area.name}</span>
                    <span className={`badge border ${GRADE_COLOR[g]}`}>{g}ランク</span>
                    <span className="ml-auto text-xs text-gray-400">治安スコア {area.score}点</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-blue-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-blue-600 mb-0.5">家賃相場</p>
                      <p className="font-bold text-blue-900 text-sm">{Math.round(rent / 10000)}万円/月</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-gray-500 mb-0.5">犯罪発生率</p>
                      <p className="font-bold text-gray-900 text-sm">{area.crime}件/千人</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-xs text-gray-500 mb-0.5">予算との差</p>
                      <p className={`font-bold text-sm ${maxRent - rent >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {maxRent - rent >= 0 ? `+${Math.round((maxRent - rent) / 1000)}千円` : `${Math.round((maxRent - rent) / 1000)}千円`}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            ※ 家賃はLIFULL HOME'S・SUUMOの2024年相場データをもとにした参考値です。実際の物件価格とは異なる場合があります。
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm font-medium text-blue-900 mb-2">📊 詳細データを確認する</p>
            <p className="text-xs text-blue-700 mb-3">ダッシュボードで治安・家賃・ハザードマップを詳しく確認できます</p>
            <Link href="/" className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
              ダッシュボードを開く
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
