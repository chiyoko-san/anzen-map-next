import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-white font-bold mb-3">地域安全マップ</div>
            <p className="text-xs leading-relaxed">
              引越し前に確認すべき治安・家賃・生活環境データを政府公式統計からまとめています。
            </p>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">コンテンツ</div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white transition">ダッシュボード</Link></li>
              <li><Link href="/columns" className="hover:text-white transition">コラム</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">サポート</div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/contact" className="hover:text-white transition">お問い合わせ</Link></li>
              <li><Link href="/sources" className="hover:text-white transition">引用元一覧</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-white font-semibold mb-3">法的情報</div>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-white transition">プライバシーポリシー</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition">免責事項</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between gap-2 text-xs">
          <div>© 2024 地域安全マップ（anzen-map.jp）</div>
          <div>
            出典：警視庁・各都道府県警察・総務省・国土交通省・東京都統計局
            <span className="ml-2 text-gray-600">本サイトのデータは参考情報です</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
