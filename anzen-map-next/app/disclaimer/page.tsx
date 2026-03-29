import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '免責事項',
  description: '地域安全マップの免責事項について説明しています。',
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-gray-400 mb-6 flex gap-1 items-center">
        <Link href="/" className="hover:text-blue-600">ホーム</Link>
        <span>/</span>
        <span className="text-gray-600">免責事項</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b-2 border-blue-100">
        免責事項
      </h1>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
        <p className="text-sm text-amber-800 font-medium">
          ⚠️ 当サイトのデータは参考情報であり、特定の地域の安全性・居住適性を保証するものではありません。引越し先の選定にあたっては、必ず現地確認・専門家への相談等を行ってください。
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            1. 情報の正確性について
          </h2>
          <p className="mb-3">
            当サイトに掲載する統計データは、政府機関・公的機関が公開する資料を参考として整理・編集したものです。データの正確性・完全性・最新性については万全を期しておりますが、これを保証するものではありません。
          </p>
          <p>
            統計データには集計時点・集計方法の違いにより実態と差異が生じる場合があります。特に家賃データは参考相場値であり、実際の物件価格とは異なります。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            2. 利用目的の限定
          </h2>
          <p>
            当サイトは引越し前の参考情報提供を目的としており、投資判断・法的判断・営業活動等に使用することを想定していません。当サイトの情報を上記目的に使用した場合の結果について、運営者は一切の責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            3. 損害の免責
          </h2>
          <p className="mb-3">
            当サイトの情報を利用したことにより生じたいかなる損害（直接損害・間接損害・逸失利益等を含む）についても、当サイト運営者は一切の責任を負いません。
          </p>
          <p>
            当サイトの情報に基づいて行った行動の結果については、利用者自身の責任においてご判断ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            4. データの更新について
          </h2>
          <p>
            本サイトは定期的にデータ更新を行いますが、最新の公式データとの間に差異が生じる場合があります。最新の確定値は各省庁・都道府県警察等の公式サイトをご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            5. 外部サービスの利用
          </h2>
          <p>
            当サイトはVercel・Supabase等の外部サービスを利用しています。これらのサービスの変更・停止による情報の消失等について、当サイト運営者は責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            6. 地域・人物に関する表現について
          </h2>
          <p>
            当サイトに掲載するデータは統計的事実に基づくものであり、特定の地域・居住者・民族等を差別・排除することを意図するものではありません。すべての地域には多様な側面があり、統計データはあくまで参考の一つとしてご利用ください。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            7. 著作権について
          </h2>
          <p>
            当サイトのコンテンツ（文章・デザイン・構成等）の著作権は運営者に帰属します。無断転載・複製はお断りします。ただし、出典を明記した上での引用は可能です。
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
            8. 適用法令
          </h2>
          <p>
            本免責事項は日本国法令に基づき解釈・適用されます。
          </p>
        </section>

        <p className="text-xs text-gray-400 pt-4 border-t border-gray-100">
          最終更新：2025年1月
        </p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link href="/" className="text-sm text-blue-600 hover:underline">← トップページに戻る</Link>
        <Link href="/privacy" className="text-sm text-blue-600 hover:underline">プライバシーポリシー</Link>
        <Link href="/sources" className="text-sm text-blue-600 hover:underline">引用元一覧</Link>
      </div>
    </div>
  )
}
