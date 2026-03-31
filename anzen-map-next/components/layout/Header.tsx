'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-800 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm">
            🏙
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900 leading-tight">地域安全マップ</div>
            <div className="text-xs text-gray-400 leading-tight hidden sm:block">引越し前に確認</div>
          </div>
        </Link>

        {/* PC ナビ */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/', label: 'ダッシュボード' },
            { href: '/columns', label: 'コラム' },
            { href: '/tools/compare', label: 'エリア比較' },
            { href: '/tools/rent-simulator', label: '家賃シミュ' },
            { href: '/tools/checklist', label: 'チェックリスト' },
            { href: '/contact', label: 'お問い合わせ' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              {label}
            </Link>
          ))}
          <Link
            href="https://anzen-map.jp"
            className="ml-2 px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
          >
            地域を検索
          </Link>
        </nav>

        {/* モバイルメニューボタン */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setOpen(!open)}
          aria-label="メニュー"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* モバイルメニュー */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {[
            { href: '/', label: 'ダッシュボード' },
            { href: '/columns', label: 'コラム' },
            { href: '/tools/compare', label: '⚖️ エリア比較' },
            { href: '/tools/rent-simulator', label: '💰 家賃シミュ' },
            { href: '/tools/checklist', label: '✅ チェックリスト' },
            { href: '/contact', label: 'お問い合わせ' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
