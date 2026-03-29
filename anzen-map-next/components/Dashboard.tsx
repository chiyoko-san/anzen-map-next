'use client'
import { useEffect, useRef, useState } from 'react'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

/* ─── 型 ─── */
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
const GRADE = (s: number) => s >= 80 ? 'A' : s >= 65 ? 'B' : s >= 50 ? 'C' : s >= 35 ? 'D' : 'E'
const GRADE_COLOR: Record<string, string> = {
  A: 'bg-green-100 text-green-700', B: 'bg-blue-100 text-blue-700',
  C: 'bg-yellow-100 text-yellow-700', D: 'bg-orange-100 text-orange-700',
  E: 'bg-red-100 text-red-700',
}
const GRADE_LABEL: Record<string, string> = {
  A: '非常に安全', B: '安全', C: '普通', D: 'やや注意', E: '要注意',
}

function calcScore(w: Ward): number {
  return Math.max(0, Math.min(100, Math.round(
    100 - (w.crime_per1000 * 1.2) - (w.traffic / w.population * 5000)
      - (w.fire / w.population * 3000) - (w.danger_rank * 4)
  )))
}

export default function Dashboard() {
  const [data, setData]       = useState<SafetyData | null>(null)
  const [city, setCity]       = useState<CityKey>('tokyo')
  const [query, setQuery]     = useState('')
  const [suggestions, setSug] = useState<Ward[]>([])
  const [selected, setSel]    = useState<Ward | null>(null)
  const [tab, setTab]         = useState('overview')
  const chartRefs             = useRef<Record<string, Chart>>({})

  /* データ取得 */
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

  /* 都市切替でチャート再描画 */
  useEffect(() => {
    if (!data) return
    setSel(null); setQuery(''); setSug([])
    setTimeout(() => renderCharts(), 100)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, data, tab])

  const wards = data ? data.cities[city].wards : []

  /* サジェスト */
  const handleInput = (q: string) => {
    setQuery(q)
    if (!q || !data) { setSug([]); return }
    setSug(wards.filter(w => w.name.includes(q)).slice(0, 8))
  }
  const selectWard = (w: Ward) => { setSel(w); setQuery(w.name); setSug([]) }

  /* Chart描画 */
  function destroyChart(id: string) {
    if (chartRefs.current[id]) { chartRefs.current[id].destroy(); delete chartRefs.current[id] }
  }
  function mkBarH(id: string, labels: string[], data: number[], color: string) {
    destroyChart(id)
    const el = document.getElementById(id) as HTMLCanvasElement | null
    if (!el) return
    chartRefs.current[id] = new Chart(el, {
      type: 'bar',
      data: { labels, datasets: [{ data, backgroundColor: color, borderRadius: 3 }] },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { color: 'rgba(0,0,0,.05)' } }, y: { ticks: { font: { size: 10 } } } },
      },
    })
  }

  function renderCharts() {
    if (!data) return
    const ws = [...wards]
    if (tab === 'overview') {
      const sorted = [...ws].sort((a, b) => (b.safety_score ?? 0) - (a.safety_score ?? 0))
      const cols = sorted.map(w => {
        const g = GRADE(w.safety_score ?? 0)
        return g === 'A' ? '#10b981' : g === 'B' ? '#3b82f6' : g === 'C' ? '#f59e0b' : g === 'D' ? '#f97316' : '#ef4444'
      })
      mkBarH('c-score', sorted.map(w => w.name), sorted.map(w => w.safety_score ?? 0), cols as unknown as string)
    }
    if (tab === 'crime') {
      const s = [...ws].sort((a, b) => b.crime_per1000 - a.crime_per1000)
      mkBarH('c-crime', s.map(w => `${w.name} ${w.crime_per1000}件/千人`), s.map(w => w.crime_per1000), '#ef4444')
    }
    if (tab === 'rent') {
      const s = [...ws].sort((a, b) => b.rent_1k - a.rent_1k)
      mkBarH('c-rent', s.map(w => `${w.name} ${Math.round(w.rent_1k/10000)}万`), s.map(w => Math.round(w.rent_1k / 1000)), '#3b82f6')
    }
    if (tab === 'ranking') renderRanking()
  }

  function renderRanking() { /* テーブルはJSXで直接レンダリング */ }

  const TABS = [
    { key: 'overview', label: '🏠 概要' },
    { key: 'crime',    label: '🚨 犯罪' },
    { key: 'rent',     label: '🏠 家賃' },
    { key: 'ranking',  label: '📋 ランキング' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* ─── ヒーロー検索 ─── */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500 p-6 mb-6">
        <h1 className="text-xl font-bold text-white mb-1">引越し前に地域の安全性を確認</h1>
        <p className="text-blue-100 text-sm mb-4">治安・交通事故・火災・街灯・家賃・保育所を一括チェック</p>

        {/* 都市選択 */}
        <div className="flex gap-2 flex-wrap mb-4">
          {(Object.keys(CITY_LABELS) as CityKey[]).map(k => (
            <button
              key={k}
              onClick={() => setCity(k)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                city === k ? 'bg-white text-blue-700 shadow' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {CITY_LABELS[k]}
            </button>
          ))}
        </div>

        {/* 検索 */}
        <div className="relative max-w-lg">
          <div className="flex items-center bg-white rounded-xl shadow-lg overflow-hidden">
            <span className="pl-3 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-gray-800"
              placeholder={`${data?.cities[city].label ?? ''}の区名を入力…`}
              value={query}
              onChange={e => handleInput(e.target.value)}
            />
            {query && (
              <button onClick={() => { setQuery(''); setSug([]); setSel(null) }} className="px-3 text-gray-400 text-lg">✕</button>
            )}
          </div>
          {/* サジェスト */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
              {suggestions.map(w => {
                const g = GRADE(w.safety_score ?? 0)
                return (
                  <button
                    key={w.name}
                    className="w-full px-4 py-2.5 text-left flex items-center gap-3 hover:bg-blue-50 transition border-b border-gray-100 last:border-0"
                    onClick={() => selectWard(w)}
                  >
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${GRADE_COLOR[g]}`}>{g}</span>
                    <span className="text-sm text-gray-800">{w.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{w.safety_score}点</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* クイックタグ */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {wards.sort((a, b) => (b.safety_score ?? 0) - (a.safety_score ?? 0)).slice(0, 5).map(w => (
            <button
              key={w.name}
              onClick={() => selectWard(w)}
              className="text-xs bg-white/20 hover:bg-white/35 text-white px-3 py-1 rounded-full transition"
            >
              {w.name}
            </button>
          ))}
        </div>
      </div>

      {/* ─── 地域詳細カード ─── */}
      {selected && (
        <div className="mb-6 rounded-2xl overflow-hidden shadow border border-gray-200">
          <div className="bg-gradient-to-r from-blue-900 to-blue-600 px-5 py-4 flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-white">{selected.name}</h2>
              <p className="text-blue-200 text-xs mt-0.5">総人口 {selected.population.toLocaleString()}人 ／ {data?.cities[city].label}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs mb-0.5">総合治安スコア</p>
              <p className="text-4xl font-bold text-white leading-none">{selected.safety_score}</p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${GRADE_COLOR[GRADE(selected.safety_score ?? 0)]}`}>
                {GRADE(selected.safety_score ?? 0)}ランク ー {GRADE_LABEL[GRADE(selected.safety_score ?? 0)]}
              </span>
            </div>
          </div>
          <div className="bg-white p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                ['🚨', '犯罪発生率', `${selected.crime_per1000}件/千人`, `認知件数 ${selected.crime.toLocaleString()}件`],
                ['🚗', '交通事故', `${selected.traffic.toLocaleString()}件`, `10万人あたり ${Math.round(selected.traffic/selected.population*100000)}件`],
                ['🔥', '火災件数', `${selected.fire.toLocaleString()}件`, `10万人あたり ${Math.round(selected.fire/selected.population*100000)}件`],
                ['💡', '街灯密度', `${selected.streetlight_per_km2.toLocaleString()}基/km²`, '面積あたりの街灯数'],
                ['🌏', '外国人割合', `${selected.foreign_pct}%`, '総人口に占める割合'],
                ['👦', '子供の割合', `${selected.child_pct}%`, '14歳以下の人口比率'],
                ['🌳', '緑被率', `${selected.park_area_pct}%`, '公園・緑地の面積率'],
                ['🏥', '病院・診療所', `${selected.hospital}ヶ所`, '医療施設の数'],
              ].map(([icon, label, val, sub]) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="text-xs text-gray-500 mb-0.5">{label}</div>
                  <div className="text-base font-bold text-gray-900">{val}</div>
                  <div className="text-xs text-gray-400">{sub}</div>
                </div>
              ))}
            </div>
            {/* 家賃 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                ['1K（単身）', selected.rent_1k],
                ['1LDK（カップル）', selected.rent_1ldk],
                ['2LDK以上（家族）', selected.rent_family],
              ].map(([label, val]) => (
                <div key={label} className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
                  <div className="text-xs text-blue-700 font-medium mb-1">{label}</div>
                  <div className="text-lg font-bold text-blue-900">
                    {Math.round((val as number)/10000)}万<span className="text-xs font-normal">円/月</span>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => { setSel(null); setQuery('') }} className="mt-4 text-xs text-gray-400 hover:text-gray-600">✕ 閉じる</button>
          </div>
        </div>
      )}

      {/* ─── タブ ─── */}
      <div className="flex gap-1.5 mb-5 bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex-wrap">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
              tab === t.key ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ─── 概要タブ ─── */}
      {tab === 'overview' && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">総合治安スコア（全区・市）</h2>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">高い＝安全 / 100点満点</span>
          </div>
          <p className="text-xs text-gray-500 mb-3">犯罪率・交通事故率・火災率・危険度を統合したスコア。単位：点</p>
          <div style={{ position:'relative', width:'100%', height: `${wards.length * 28 + 60}px` }}>
            <canvas id="c-score"></canvas>
          </div>
        </div>
      )}

      {/* ─── 犯罪タブ ─── */}
      {tab === 'crime' && (
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-1">犯罪発生率（人口1,000人あたりの件数）</h2>
          <p className="text-xs text-gray-500 mb-3">単位：件/千人　出典：警視庁「東京の犯罪（令和5年版）」等</p>
          <div style={{ position:'relative', width:'100%', height: `${wards.length * 28 + 60}px` }}>
            <canvas id="c-crime"></canvas>
          </div>
        </div>
      )}

      {/* ─── 家賃タブ ─── */}
      {tab === 'rent' && (
        <div className="card">
          <h2 className="font-bold text-gray-900 mb-1">1K 平均家賃ランキング</h2>
          <p className="text-xs text-gray-500 mb-3">単位：千円/月　出典：LIFULL HOME'S・SUUMO家賃相場データ（2024年）</p>
          <div style={{ position:'relative', width:'100%', height: `${wards.length * 28 + 60}px` }}>
            <canvas id="c-rent"></canvas>
          </div>
        </div>
      )}

      {/* ─── ランキングタブ ─── */}
      {tab === 'ranking' && (
        <div className="card overflow-x-auto">
          <h2 className="font-bold text-gray-900 mb-3">総合ランキング</h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 text-gray-500">
                <th className="text-left px-2 py-2">#</th>
                <th className="text-left px-2 py-2">区・市</th>
                <th className="text-left px-2 py-2">スコア<span className="font-normal text-gray-400">（点）</span></th>
                <th className="text-left px-2 py-2">犯罪率<span className="font-normal text-gray-400">（件/千人）</span></th>
                <th className="text-left px-2 py-2">交通事故<span className="font-normal text-gray-400">（件）</span></th>
                <th className="text-left px-2 py-2">家賃1K<span className="font-normal text-gray-400">（万円/月）</span></th>
                <th className="text-left px-2 py-2">外国人<span className="font-normal text-gray-400">（%）</span></th>
                <th className="text-left px-2 py-2">緑被率<span className="font-normal text-gray-400">（%）</span></th>
              </tr>
            </thead>
            <tbody>
              {[...wards].sort((a, b) => (b.safety_score ?? 0) - (a.safety_score ?? 0)).map((w, i) => {
                const g = GRADE(w.safety_score ?? 0)
                return (
                  <tr key={w.name} className="border-t border-gray-100 hover:bg-blue-50 cursor-pointer" onClick={() => selectWard(w)}>
                    <td className="px-2 py-2 text-gray-400">{i + 1}</td>
                    <td className="px-2 py-2 font-medium text-blue-600">{w.name}</td>
                    <td className="px-2 py-2"><span className={`badge ${GRADE_COLOR[g]}`}>{w.safety_score}</span></td>
                    <td className="px-2 py-2">{w.crime_per1000}</td>
                    <td className="px-2 py-2">{w.traffic.toLocaleString()}</td>
                    <td className="px-2 py-2 text-blue-700 font-medium">{Math.round(w.rent_1k/10000)}万</td>
                    <td className="px-2 py-2">{w.foreign_pct}%</td>
                    <td className="px-2 py-2">{w.park_area_pct}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        出典：警視庁・各都道府県警察・東京消防庁・総務省統計局・LIFULL HOME'S・SUUMO（2023〜2024年）
        ／ 本サイトのデータは参考情報です。詳細は<a href="/disclaimer" className="text-blue-500 underline ml-1">免責事項</a>をご確認ください。
      </p>
    </div>
  )
}
