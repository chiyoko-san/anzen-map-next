import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: '地域安全マップのプライバシーポリシーについて説明しています。',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6 flex gap-1 items-center">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span>/</span>
        <span className="text-gray-600">プライバシーポリシー</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-blue-100">
        プライバシーポリシー
      </h1>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <p>
          地域安全マップ（以下「当サイト」）は、利用者のプライバシーを尊重し、個人情報の保護に努めます。本ポリシーでは、当サイトにおける個人情報の取り扱いについて説明します。
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            1. 収集する情報
          </h2>
          <p className="mb-3">
            当サイトは、以下の場合に個人情報を収集することがあります。
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>お問い合わせフォームを通じてご連絡いただいた場合（氏名・メールアドレス・お問い合わせ内容）</li>
            <li>Google Analytics によるアクセス解析（匿名化されたデータ）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            2. 個人情報の利用目的
          </h2>
          <p className="mb-3">収集した個人情報は、以下の目的にのみ使用します。</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>お問い合わせへの返答</li>
            <li>サービスの改善・品質向上</li>
          </ul>
          <p className="mt-3">
            収集した個人情報を、上記目的以外に使用することはありません。また、第三者への提供・販売は一切行いません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            3. Google Analytics について
          </h2>
          <p className="mb-3">
            当サイトはアクセス解析のためにGoogle Analytics（GA4）を使用しています。Google Analyticsはトラフィックデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
          </p>
          <p>
            Google AnalyticsのデータはGoogleのプライバシーポリシーに従い管理されます。詳細は
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              Googleのプライバシーポリシー
            </a>
            をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            4. Cookie（クッキー）について
          </h2>
          <p>
            当サイトはGoogle Analyticsの機能のためにCookieを使用する場合があります。ブラウザの設定によりCookieを無効にすることが可能ですが、その場合一部機能が正常に動作しないことがあります。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            5. 広告について
          </h2>
          <p className="mb-3">
            当サイトでは、Google AdSenseおよびアフィリエイト広告を掲載する場合があります。これらの広告配信事業者は、利用者の興味に応じた広告を表示するためにCookieを使用することがあります。
          </p>
          <p>
            Google AdSenseに関するプライバシーの詳細は
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
              こちら
            </a>
            をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            6. 外部リンクについて
          </h2>
          <p>
            当サイトには警視庁・各都道府県警察・統計局等の外部サイトへのリンクが含まれます。外部サイトのプライバシーポリシーは各サイトのポリシーに従います。当サイトは外部サイトの内容について責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            7. 個人情報の管理
          </h2>
          <p>
            お問い合わせフォームからお預かりした個人情報は、Supabase（PostgreSQL）のデータベースに保管し、適切なアクセス制限を設けて管理します。不正アクセス・紛失・破損・改ざん・漏洩等を防ぐため、適切なセキュリティ対策を講じます。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            8. 個人情報の開示・訂正・削除
          </h2>
          <p>
            ご自身の個人情報の開示・訂正・削除をご希望の場合は、お問い合わせフォームよりご連絡ください。本人確認の上、合理的な期間内に対応いたします。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            9. ポリシーの変更
          </h2>
          <p>
            本プライバシーポリシーは、必要に応じて予告なく変更する場合があります。変更後はこのページに掲載します。重要な変更がある場合はサイト上でお知らせします。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            10. お問い合わせ
          </h2>
          <p>
            プライバシーポリシーに関するお問い合わせは、
            <Link href="/contact" className="text-blue-600 hover:underline ml-1">
              お問い合わせフォーム
            </Link>
            またはメール（
            <a href="mailto:anzen.jp@gmail.com" className="text-blue-600 hover:underline">
              anzen.jp@gmail.com
            </a>
            ）までご連絡ください。
          </p>
        </section>

        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          最終更新：2025年1月
        </p>
      </div>

      <div className="mt-8 flex gap-3 flex-wrap">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← トップページに戻る</Link>
        <Link href="/disclaimer" className="text-sm text-blue-600 hover:underline">免責事項</Link>
        <Link href="/sources" className="text-sm text-blue-600 hover:underline">引用元一覧</Link>
      </div>
    </div>
  )
}
