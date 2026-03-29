import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { GoogleAnalytics } from '@/components/layout/GoogleAnalytics'

export const metadata: Metadata = {
  title: {
    default: '地域安全マップ｜引越し前に治安・家賃・犯罪率を確認',
    template: '%s｜地域安全マップ',
  },
  description:
    '引越し前に確認すべき治安・犯罪率・家賃・火災・街灯データを警視庁・各都道府県警察・総務省の公式統計からまとめています。東京・大阪・名古屋・福岡・札幌対応。',
  keywords: ['治安', '引越し', '犯罪率', '家賃相場', '地域安全', '東京23区'],
  // Search Console の「HTMLタグ」に表示された content の値に置き換えてください
  // 例: <meta name="google-site-verification" content="AbCdEfGhIj123456" />
  //      → 'AbCdEfGhIj123456' の部分だけ貼り付けます
  verification: {
    google: 'ここにSearch Consoleのcontent値を貼り付け',
  },
  openGraph: {
    siteName: '地域安全マップ',
    locale: 'ja_JP',
    type: 'website',
    url: 'https://anzen-map.jp',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@anzen_map_jp',
  },
  metadataBase: new URL('https://anzen-map.jp'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        <GoogleAnalytics />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
