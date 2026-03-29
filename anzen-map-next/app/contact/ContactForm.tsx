'use client'
import { useState, useEffect, useRef } from 'react'

declare global {
  interface Window {
    grecaptcha: {
      render: (el: HTMLElement, options: object) => number
      getResponse: (id: number) => string
      reset: (id: number) => void
    }
    onRecaptchaLoad: () => void
  }
}

const SUBJECTS = [
  'データの誤りについて',
  '掲載・広告に関するご相談',
  'サービスへのご意見・ご要望',
  'メディア・取材のご依頼',
  'その他',
]

// Google reCAPTCHA v2 サイトキー
// https://www.google.com/recaptcha/admin で取得して環境変数に設定してください
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
// ↑ 上記はテスト用キーです。本番では必ず差し替えてください

export default function ContactForm() {
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError]   = useState('')
  const [captchaDone, setCaptchaDone] = useState(false)
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetId   = useRef<number | null>(null)

  // reCAPTCHA スクリプトを動的に読み込む
  useEffect(() => {
    window.onRecaptchaLoad = () => {
      if (captchaRef.current && widgetId.current === null) {
        widgetId.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          callback: () => setCaptchaDone(true),
          'expired-callback': () => setCaptchaDone(false),
        })
      }
    }
    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit'
    script.async = true
    script.defer = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!captchaDone) {
      setError('「私はロボットではありません」にチェックを入れてください')
      setStatus('error')
      return
    }
    setStatus('sending')
    setError('')

    const captchaToken = window.grecaptcha.getResponse(widgetId.current!)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, captchaToken }),
      })
      if (!res.ok) throw new Error((await res.json()).error || '送信に失敗しました')
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setCaptchaDone(false)
      if (widgetId.current !== null) window.grecaptcha.reset(widgetId.current)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '送信に失敗しました')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h2 className="text-lg font-bold text-green-800 mb-2">送信完了しました</h2>
        <p className="text-sm text-green-700">
          お問い合わせありがとうございます。<br />
          2〜3営業日以内にご返信いたします。
        </p>
        <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-green-700 underline">
          別のお問い合わせをする
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          type="text" required className="input" placeholder="山田 太郎"
          value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email" required className="input" placeholder="example@gmail.com"
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          お問い合わせ種別 <span className="text-red-500">*</span>
        </label>
        <select
          required className="input"
          value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
        >
          <option value="">選択してください</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          required rows={6} className="input resize-none"
          placeholder="お問い合わせ内容をご記入ください"
          value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
        />
      </div>

      {/* reCAPTCHA */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          スパム防止認証 <span className="text-red-500">*</span>
        </label>
        <div ref={captchaRef} />
        {!captchaDone && status === 'error' && error.includes('ロボット') && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>

      {status === 'error' && !error.includes('ロボット') && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full disabled:opacity-50"
      >
        {status === 'sending' ? '送信中…' : '送信する'}
      </button>

      <p className="text-xs text-gray-400 text-center">
        送信いただいた情報はお問い合わせへの返答のみに使用し、第三者に提供しません。
      </p>
    </form>
  )
}
