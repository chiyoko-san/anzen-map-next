'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Ward = {
  name: string; population: number; crime: number; crime_per1000: number
  foreign_pct: number; child_pct: number; traffic: number; fire: number
  danger_rank: number; streetlight_per_km2: number
  rent_1k: number; rent_1ldk: number; rent_family: number
  nursery: number; hospital: number; park_area_pct: number
  safety_score?: number
}
type CityKey = 'tokyo' | 'osaka' | 'nagoya' | 'fukuoka' | 'sapporo'
type SafetyData = {
  updated_at: string
  cities: Record<CityKey, { label: string; pref: string; wards: Ward[] }>
}

const CITY_LABELS: Record<CityKey, string> = {
  tokyo: '🗼 東京都', osaka: '🌸 大阪市',
  nagoya: '🏯 名古屋市', fukuoka: '🌊 福岡市', sapporo: '❄️ 札幌市',
}

function calcScore(w: Ward): number {
  return Math.max(0, Math.min(100, Math.round(
    100 - (w.crime_per1000 * 1.2) - (w.traffic / w.population * 5000)
      - (w.fire / w.population * 3000) - (w.danger_rank * 4)
  )))
}

const GRADE = (s: number) => s >= 80 ? 'A' : s >= 65 ? 'B' : s >= 50 ? 'C' : s >= 35 ? 'D' : 'E'
const GRADE_COLOR: Record<string, string> = {
  A: 'text-green-700', B: 'text-blue-700', C: 'text-yellow-700', D: 'text-orange-700', E: 'text-red-700',
}

type Slot = { city: CityKey; ward: Ward | null }

export default function ComparePage() {
  const [data,  setData]  = useState<SafetyData | null>(null)
  const [slots, setSlots] = useState<Slot[]>([
    { city: 'tokyo', ward: null },
    { city: 'tokyo', ward: null },
  ])
  const [queries,  setQueries]  = useState(['', ''])
  const [sugg,     setSugg]     = useState<[Ward[], Ward[]]>([[], []])

  useEffect(() => {
    fetch('/data/tokyo_safety.json')
      .then(r => r.json())
      .then((d: SafetyData) => {
        Object.values(d.cities).forEach(c =>
          c.wards.forEach(w => { w.safety_score = calcScore(w) })
        )
        setData(d)
      })
  }, [])

  function handleInput(idx: number, q: string) {
    const next = [...queries]; next[idx] = q; setQueries(next)
    if (!q || !data) { const s = [...sugg] as [Ward[], Ward[]]; s[idx] = []; setSugg(s); return }
    const wards = data.cities[slots[idx].city].wards
    const s = [...sugg] as [Ward[], Ward[]]
    s[idx] = wards.filter(w => w.name.includes(q)).slice(0, 6)
    setSugg(s)
  }

  function selectWard(idx: number, ward: Ward) {
    const next = [...slots] as Slot[]
    next[idx] = { ...next[idx], ward }
    setSlots(next)
    const q = [...queries]; q[idx] = ward.name; setQueries(q)
    const s = [...sugg] as [Ward[], Ward[]]; s[idx] = []; setSugg(s)
  }

  function changeCity(idx: number, city: CityKey) {
    const next = [...slots] as Slot[]
    next[idx] = { city, ward: null }
    setSlots(next)
    const q = [...queries]; q[idx] = ''; setQueries(q)
  }

  type Row = {
    label: string
    key: keyof Ward
    unit: string
    better: 'high' | 'low' | null
    format?: (v: number) => string
  }

  const rows: Row[] = [
    { label: '総合治安スコア',    key: 'safety_score',          unit: '点',       better: 'high' },
    { label: '犯罪発生率',        key: 'crime_per1000',         unit: '件/千人',  better: 'low'  },
    { label: '交通事故件数',      key: 'traffic',               unit: '件',       better: 'low'  },
    { label: '火災件数',          key: 'fire',                  unit: '件',       better: 'low'  },
    { label: '地域危険度ランク',  key: 'danger_rank',           unit: '',         better: 'low'  },
    { label: '街灯密度',          key: 'streetlight_per_km2',   unit: '基/km²',   better: 'high' },
    { label: '外国人割合',        key: 'foreign_pct',           unit: '%',        better: null   },
    { label: '子供の割合',        key: 'child_pct',             unit: '%',        better: 'high' },
    { label: '緑被率',            key: 'park_area_pct',         unit: '%',        better: 'high' },
    { label: '病院・診療所',      key: 'hospital',              unit: 'ヶ所',     better: 'high' },
    { label: '1K 家賃相場',       key: 'rent_1k',               unit: '万円/月',  better: 'low',  format: (v: number) => (v / 10000).toFixed(1) },
    { label: '1LDK 家賃相場',     key: 'rent_1ldk',             unit: '万円/月',  better: 'low',  format: (v: number) => (v / 10000).toFixed(1) },
  ]

  const bothSelected = slots[0].ward && slots[1].ward

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="text-xs text-gray-400 mb-6 flex gap-1 items-center">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span>/</span>
        <span className="text-gray-600">エリア比較</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">⚖️ エリア比較</h1>
        <p className="text-sm text-gray-500">2つのエリアを治安・家賃・生活環境で比較します</p>
      </div>

      {/* エリア選択 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {slots.map((slot, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs font-medium text-gray-500 mb-3">
              {idx === 0 ? '🔵 エリアA' : '🔴 エリアB'}
            </p>

            {/* 都市選択 */}
            <select
              className="input text-sm mb-3"
              value={slot.city}
              onChange={e => changeCity(idx, e.target.value as CityKey)}
            >
              {(Object.keys(CITY_LABELS) as CityKey[]).map(k => (
                <option key={k} value={k}>{CITY_LABELS[k]}</option>
              ))}
            </select>

            {/* 地域検索 */}
            <div className="relative">
              <input
                className="input text-sm"
                placeholder="区名・市名を入力…"
                value={queries[idx]}
                onChange={e => handleInput(idx, e.target.value)}
              />
              {sugg[idx].length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                  {sugg[idx].map(w => (
                    <button key={w.name}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 border-b border-gray-50 last:border-0 flex justify-between"
                      onClick={() => selectWard(idx, w)}
                    >
                      <span>{w.name}</span>
                      <span className="text-xs text-gray-400">{w.safety_score}点</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 選択済みエリアの概要 */}
            {slot.ward && (
              <div className={`mt-3 p-3 rounded-lg ${idx === 0 ? 'bg-blue-50 border border-blue-100' : 'bg-red-50 border border-red-100'}`}>
                <p className="font-bold text-gray-900 text-sm">{slot.ward.name}</p>
                <p className={`text-lg font-bold mt-0.5 ${GRADE_COLOR[GRADE(slot.ward.safety_score ?? 0)]}`}>
                  {slot.ward.safety_score}点 / {GRADE(slot.ward.safety_score ?? 0)}ランク
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 比較テーブル */}
      {bothSelected ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {/* ヘッダー */}
          <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-200">
            <div className="px-4 py-3 text-xs font-medium text-gray-500">指標</div>
            <div className="px-4 py-3 text-xs font-bold text-blue-700 text-center border-x border-gray-200">
              🔵 {slots[0].ward!.name}
            </div>
            <div className="px-4 py-3 text-xs font-bold text-red-700 text-center">
              🔴 {slots[1].ward!.name}
            </div>
          </div>

          {/* 行 */}
          {rows.map(row => {
            const vA = slots[0].ward![row.key as keyof Ward] as number
            const vB = slots[1].ward![row.key as keyof Ward] as number
            const fmtA = row.format ? row.format(vA) : String(vA)
            const fmtB = row.format ? row.format(vB) : String(vB)

            const aWins = row.better === 'high' ? vA > vB : row.better === 'low' ? vA < vB : null
            const bWins = row.better === 'high' ? vB > vA : row.better === 'low' ? vB < vA : null

            return (
              <div key={row.key} className="grid grid-cols-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                <div className="px-4 py-3 text-xs text-gray-600 flex items-center">{row.label}</div>
                <div className={`px-4 py-3 text-center border-x border-gray-100 ${aWins ? 'bg-blue-50' : ''}`}>
                  <span className={`text-sm font-bold ${aWins ? 'text-blue-700' : 'text-gray-700'}`}>
                    {fmtA}{row.unit}
                    {aWins && <span className="ml-1 text-xs">✓</span>}
                  </span>
                </div>
                <div className={`px-4 py-3 text-center ${bWins ? 'bg-red-50' : ''}`}>
                  <span className={`text-sm font-bold ${bWins ? 'text-red-600' : 'text-gray-700'}`}>
                    {fmtB}{row.unit}
                    {bWins && <span className="ml-1 text-xs">✓</span>}
                  </span>
                </div>
              </div>
            )
          })}

          {/* 総合判定 */}
          <div className="grid grid-cols-3 bg-gray-50 border-t-2 border-gray-200">
            <div className="px-4 py-4 text-xs font-bold text-gray-700">総合判定</div>
            {[0, 1].map(idx => {
              const ward = slots[idx].ward!
              const wins = rows.filter(r => {
                const vA = slots[0].ward![r.key as keyof Ward] as number
                const vB = slots[1].ward![r.key as keyof Ward] as number
                const aW = r.better === 'high' ? vA > vB : r.better === 'low' ? vA < vB : false
                const bW = r.better === 'high' ? vB > vA : r.better === 'low' ? vB < vA : false
                return idx === 0 ? aW : bW
              }).length
              return (
                <div key={idx} className={`px-4 py-4 text-center ${idx === 0 ? 'border-x border-gray-200' : ''}`}>
                  <p className={`text-xs font-bold ${idx === 0 ? 'text-blue-700' : 'text-red-600'}`}>
                    {ward.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{wins}項目で優勢</p>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-2xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
          <p className="text-lg mb-1">⚖️</p>
          <p className="text-sm">2つのエリアを選択すると比較が表示されます</p>
        </div>
      )}

      <div className="mt-6 flex gap-3 flex-wrap">
        <Link href="/tools/rent-simulator"
          className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
          💰 家賃シミュレーターへ
        </Link>
        <Link href="/tools/checklist"
          className="text-sm text-blue-600 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
          ✅ チェックリストへ
        </Link>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        出典：警視庁・各都道府県警察・総務省統計局・LIFULL HOME'S（令和5年・2024年データ）
      </p>
    </div>
  )
}
