import type { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: '地域安全マップへのお問い合わせはこちらから。データの誤りのご指摘・掲載に関するご相談など、お気軽にどうぞ。',
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">お問い合わせ</h1>
        <p className="text-gray-600 text-sm leading-relaxed">
          データの誤り・掲載に関するご相談・その他ご意見はこちらからお送りください。<br />
          通常2〜3営業日以内にご返信いたします。
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-800">
        <strong>メールでのお問い合わせ：</strong>
        <a href="mailto:anzen.jp@gmail.com" className="ml-1 underline">
          anzen.jp@gmail.com
        </a>
      </div>

      <ContactForm />
    </div>
  )
}
