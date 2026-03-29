import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'データ引用元一覧',
  description: '地域安全マップで使用しているデータの引用元・出典一覧です。',
}

const sources = [
  {
    category: '🚨 犯罪データ',
    items: [
      {
        name: '警視庁「東京の犯罪（令和5年版）」「犯罪発生情報（年計）」',
        url: 'https://www.keishicho.metro.tokyo.lg.jp/about_mpd/jokyo_tokei/jokyo/hanzai.html',
        note: '東京都の刑法犯認知件数・犯罪発生率'
      },
      {
        name: '大阪府警本部「令和5年中の犯罪統計（確定値）」',
        url: 'https://www.police.pref.osaka.lg.jp/tokei.html',
        note: '大阪市の刑法犯認知件数'
      },
      {
        name: '愛知県警察「令和5年中 犯罪統計資料」',
        url: 'https://www.pref.aichi.jp/police/anzen/crimemap/',
        note: '名古屋市の刑法犯認知件数'
      },
      {
        name: '福岡県警察「令和5年中の犯罪統計（確定値）」',
        url: 'https://www.police.pref.fukuoka.jp/toukei/',
        note: '福岡市の刑法犯認知件数'
      },
      {
        name: '北海道警察「令和5年中の犯罪統計」',
        url: 'https://www.police.pref.hokkaido.lg.jp/info/soumu/hanzai-toukei/',
        note: '札幌市の刑法犯認知件数'
      },
      {
        name: '警察庁 犯罪統計資料（e-Stat）',
        url: 'https://www.e-stat.go.jp/stat-search/files?toukei=00130001',
        note: '全国の犯罪統計（政府統計の総合窓口）'
      },
    ]
  },
  {
    category: '🚗 交通事故データ',
    items: [
      {
        name: '警視庁「交通統計（令和5年版）」',
        url: 'https://www.keishicho.metro.tokyo.lg.jp/about_mpd/jokyo_tokei/jokyo/traffic.html',
        note: '東京都の交通事故件数'
      },
      {
        name: '警察庁「交通事故統計情報オープンデータ（2023年）」',
        url: 'https://www.npa.go.jp/publications/statistics/koutsuu/opendata/index_opendata.html',
        note: '全国の交通事故オープンデータ'
      },
    ]
  },
  {
    category: '🔥 火災・防災データ',
    items: [
      {
        name: '東京消防庁「火災の実態（令和5年版）」',
        url: 'https://www.tfd.metro.tokyo.lg.jp/learning/elib/kasaijittai/r05.html',
        note: '東京都の火災件数・火災原因'
      },
      {
        name: '総務省消防庁「消防統計（令和5年）」',
        url: 'https://www.fdma.go.jp/pressrelease/statistics/',
        note: '全国の消防統計'
      },
      {
        name: '東京都都市整備局「地域危険度一覧表（第9回）」',
        url: 'https://www.funenka.metro.tokyo.lg.jp/area-hazard-level/regional-risk-list/',
        note: '震災・建物倒壊リスクの地域別ランク（1〜5）'
      },
      {
        name: '各市消防局「消防年報（令和5年版）」',
        url: '',
        note: '大阪市・名古屋市・福岡市・札幌市の火災件数'
      },
    ]
  },
  {
    category: '👥 人口・外国人データ',
    items: [
      {
        name: '東京都統計局「外国人人口（令和5年）」',
        url: 'https://www.toukei.metro.tokyo.lg.jp/gaikoku/ga-index.htm',
        note: '東京都の外国人住民数・国籍別内訳'
      },
      {
        name: '出入国在留管理庁「在留外国人統計（令和5年）」',
        url: 'https://www.moj.go.jp/isa/policies/statistics/toukei_ichiran_touroku.html',
        note: '全国の在留外国人数・国籍別統計'
      },
      {
        name: '総務省統計局「住民基本台帳に基づく人口・人口動態及び世帯数（令和5年）」',
        url: 'https://www.soumu.go.jp/main_sosiki/jichi_gyousei/daityo/jinkou_jichi.html',
        note: '全国の人口・世帯数'
      },
      {
        name: '各都市市区の住民基本台帳（令和5年）',
        url: '',
        note: '大阪市・名古屋市・福岡市・札幌市の人口データ'
      },
    ]
  },
  {
    category: '💡 街灯・防犯灯データ',
    items: [
      {
        name: '総務省統計局「社会・人口統計体系（市区町村データ）」',
        url: 'https://www.stat.go.jp/data/ssds/index.html',
        note: '市区町村別の街灯・防犯灯数'
      },
      {
        name: '各区市行政資料集（令和5年度版）',
        url: '',
        note: '各区・市の街路灯・防犯灯の設置数'
      },
    ]
  },
  {
    category: '🏠 家賃データ（参考値）',
    items: [
      {
        name: 'LIFULL HOME\'S「東京23区の家賃相場情報（2024年）」',
        url: 'https://www.homes.co.jp/',
        note: '区別の平均家賃相場（1K・1LDK・2LDK以上）'
      },
      {
        name: 'SUUMO「家賃相場データ（2024年）」',
        url: 'https://suumo.jp/chintai/soba/tokyo/',
        note: '賃貸物件の家賃相場'
      },
      {
        name: 'アットホーム「家賃動向 全国主要都市の賃貸マンション・アパート」',
        url: 'https://www.athome.co.jp/',
        note: '全国の家賃動向データ'
      },
      {
        name: '国土交通省「住宅・土地統計調査（令和5年）」',
        url: 'https://www.mlit.go.jp/toukei/list/jutaku-1.html',
        note: '住宅の家賃・規模等に関する公式統計'
      },
    ]
  },
  {
    category: '🌳 生活環境データ',
    items: [
      {
        name: '東京都福祉保健局「保育所等一覧（令和5年4月）」',
        url: 'https://www.fukushihoken.metro.tokyo.lg.jp/',
        note: '区別の保育所・認定こども園数'
      },
      {
        name: '東京都「医療機関情報サービス ひまわり（令和5年）」',
        url: 'https://www.himawari.metro.tokyo.jp/',
        note: '区別の病院・診療所数'
      },
      {
        name: '東京都公園協会「公園データ（令和5年度）」',
        url: 'https://www.tokyo-park.or.jp/',
        note: '区別の公園数・緑被率'
      },
      {
        name: '各政令指定都市の同種統計資料',
        url: '',
        note: '大阪市・名古屋市・福岡市・札幌市の保育所・病院・公園データ'
      },
    ]
  },
]

export default function SourcesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6 flex gap-1 items-center">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span>/</span>
        <span className="text-gray-600">データ引用元一覧</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-4 border-b-2 border-blue-100">
        データ引用元一覧
      </h1>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-blue-800">
          当サイトで表示するデータは、以下の政府機関・公的機関が公開しているオープンデータをもとに整理・編集しています。最新の確定値は各出典元を直接ご確認ください。
        </p>
      </div>

      <div className="space-y-8">
        {sources.map(({ category, items }) => (
          <section key={category}>
            <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
              {category}
            </h2>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline font-medium"
                        >
                          {item.name}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-800 font-medium">{item.name}</span>
                      )}
                      <p className="text-xs text-gray-500 mt-0.5">{item.note}</p>
                    </div>
                    {item.url && (
                      <span className="text-xs text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded flex-shrink-0">
                        外部リンク
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 border border-gray-200">
        ※ 家賃データはLIFULL HOME'S・SUUMO・アットホームの公開相場データをもとにした参考値です。実際の物件価格とは異なる場合があります。<br />
        ※ データは令和5年（2023年）を基準とし、毎月1日にGitHub Actionsで自動更新しています。
      </div>

      <div className="mt-8 flex gap-3 flex-wrap">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← トップページに戻る</Link>
        <Link href="/disclaimer" className="text-sm text-blue-600 hover:underline">免責事項</Link>
        <Link href="/privacy" className="text-sm text-blue-600 hover:underline">プライバシーポリシー</Link>
      </div>
    </div>
  )
}
