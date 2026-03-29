import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json()

    // バリデーション
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: '必須項目を入力してください' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'メールアドレスが正しくありません' }, { status: 400 })
    }

    // Supabase に保存
    const { error: dbError } = await supabaseAdmin
      .from('contacts')
      .insert({ name, email, subject, message })

    if (dbError) throw new Error(dbError.message)

    // Gmail でメール通知（設定済みの場合のみ）
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      await transporter.sendMail({
        from: `"地域安全マップ" <${process.env.GMAIL_USER}>`,
        to: process.env.CONTACT_NOTIFY_TO,
        subject: `【お問い合わせ】${subject}`,
        text: [
          `お名前：${name}`,
          `メール：${email}`,
          `種別：${subject}`,
          '',
          '【内容】',
          message,
          '',
          '---',
          '地域安全マップ 管理システム',
          'https://anzen-map.jp',
        ].join('\n'),
        html: `
          <h2 style="color:#1e3a8a">新しいお問い合わせ</h2>
          <table style="border-collapse:collapse;width:100%;font-size:14px">
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;width:120px"><strong>お名前</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${name}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>メール</strong></td><td style="padding:8px;border:1px solid #e5e7eb"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb"><strong>種別</strong></td><td style="padding:8px;border:1px solid #e5e7eb">${subject}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb;background:#f9fafb;vertical-align:top"><strong>内容</strong></td><td style="padding:8px;border:1px solid #e5e7eb;white-space:pre-wrap">${message}</td></tr>
          </table>
          <p style="margin-top:16px;font-size:12px;color:#6b7280">地域安全マップ 管理システム</p>
        `,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました。しばらく後にお試しください。' },
      { status: 500 }
    )
  }
}
