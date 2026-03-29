'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Contact, Column, Ad } from '@/types'

type Tab = 'contacts' | 'columns' | 'ads'

// 管理者認証情報（環境変数から取得、なければデフォルト値）
const ADMIN_ID  = process.env.NEXT_PUBLIC_ADMIN_ID       || 'admin'
const ADMIN_PW  = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'anzen-map-2024'

export default function AdminPage() {
  const [authed,   setAuthed]   = useState(false)
  const [loginId,  setLoginId]  = useState('')
  const [loginPw,  setLoginPw]  = useState('')
  const [loginErr, setLoginErr] = useState('')

  const [tab,      setTab]      = useState<Tab>('contacts')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [columns,  setColumns]  = useState<Column[]>([])
  const [ads,      setAds]      = useState<Ad[]>([])
  const [loading,  setLoading]  = useState(false)
  const [newCol,   setNewCol]   = useState({ slug:'', title:'', description:'', content:'', tags:'', status:'draft' as 'draft'|'published' })
  const [newAd,    setNewAd]    = useState({ name:'', position:'header' as Ad['position'], type:'adsense' as Ad['type'], code:'', page:'all', priority:0 })
  const [saving,   setSaving]   = useState(false)
  const [msg,      setMsg]      = useState('')

  // ─── ログイン処理 ───────────────────────────────────────
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginId === ADMIN_ID && loginPw === ADMIN_PW) {
      setAuthed(true)
      setLoginErr('')
      sessionStorage.setItem('admin_authed', '1')
    } else {
      setLoginErr('IDまたはパスワードが違います')
    }
  }

  // セッション維持（ページリロード対応）
  useEffect(() => {
    if (sessionStorage.getItem('admin_authed') === '1') setAuthed(true)
  }, [])

  useEffect(() => { if (authed) fetchAll() }, [tab, authed])

  async function fetchAll() {
    setLoading(true)
    if (tab === 'contacts') {
      const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(50)
      setContacts((data as Contact[]) ?? [])
    }
    if (tab === 'columns') {
      const { data } = await supabase.from('columns').select('*').order('created_at', { ascending: false })
      setColumns((data as Column[]) ?? [])
    }
    if (tab === 'ads') {
      const { data } = await supabase.from('ads').select('*').order('priority', { ascending: false })
      setAds((data as Ad[]) ?? [])
    }
    setLoading(false)
  }

  async function markRead(id: string) {
    await supabase.from('contacts').update({ status: 'read' }).eq('id', id)
    setContacts(cs => cs.map(c => c.id === id ? { ...c, status: 'read' } : c))
  }

  async function saveColumn() {
    setSaving(true)
    const tags = newCol.tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = { ...newCol, tags, published_at: newCol.status === 'published' ? new Date().toISOString() : null }
    const { error } = await supabase.from('columns').insert(payload)
    setMsg(error ? `エラー: ${error.message}` : '記事を保存しました')
    if (!error) { setNewCol({ slug:'', title:'', description:'', content:'', tags:'', status:'draft' }); fetchAll() }
    setSaving(false)
  }

  async function saveAd() {
    setSaving(true)
    const { error } = await supabase.from('ads').insert(newAd)
    setMsg(error ? `エラー: ${error.message}` : '広告枠を保存しました')
    if (!error) { setNewAd({ name:'', position:'header', type:'adsense', code:'', page:'all', priority:0 }); fetchAll() }
    setSaving(false)
  }

  async function toggleAd(id: string, is_active: boolean) {
    await supabase.from('ads').update({ is_active: !is_active }).eq('id', id)
    setAds(as => as.map(a => a.id === id ? { ...a, is_active: !is_active } : a))
  }

  async function deleteColumn(id: string) {
    if (!confirm('削除しますか？')) return
    await supabase.from('columns').delete().eq('id', id)
    setColumns(cs => cs.filter(c => c.id !== id))
  }

  // ─── ログイン画面 ─────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow border border-gray-200 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="text-3xl mb-2">🔒</div>
            <h1 className="text-lg font-bold text-gray-900">管理画面</h1>
            <p className="text-sm text-gray-500 mt-1">地域安全マップ</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                管理者ID
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="admin"
                value={loginId}
                onChange={e => setLoginId(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                パスワード
              </label>
              <input
                type="password"
                required
                className="input"
                placeholder="••••••••"
                value={loginPw}
                onChange={e => setLoginPw(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {loginErr && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                {loginErr}
              </div>
            )}
            <button type="submit" className="btn-primary w-full">
              ログイン
            </button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">
            IDとパスワードはVercelの環境変数で設定してください
          </p>
        </div>
      </div>
    )
  }

  // ─── 管理画面本体 ─────────────────────────────────────
  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'contacts', label: '問い合わせ', count: contacts.filter(c => c.status === 'unread').length || undefined },
    { key: 'columns',  label: 'コラム管理' },
    { key: 'ads',      label: '広告枠管理' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">管理画面</h1>
        <button
          onClick={() => { sessionStorage.removeItem('admin_authed'); setAuthed(false) }}
          className="text-sm text-gray-500 hover:text-red-500 transition border border-gray-200 px-3 py-1.5 rounded-lg"
        >
          ログアウト
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition relative ${
              tab === t.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.label}
            {t.count ? (
              <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{t.count}</span>
            ) : null}
          </button>
        ))}
      </div>

      {msg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {msg} <button onClick={() => setMsg('')} className="ml-2 text-green-500">✕</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">読み込み中…</div>
      ) : (
        <>
          {/* 問い合わせ */}
          {tab === 'contacts' && (
            <div className="space-y-3">
              {contacts.length === 0 && <p className="text-gray-400 text-sm">問い合わせはありません</p>}
              {contacts.map(c => (
                <div key={c.id} className={`card ${c.status === 'unread' ? 'border-blue-300 bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className={`badge mr-2 ${c.status === 'unread' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.status === 'unread' ? '未読' : c.status === 'read' ? '既読' : '返信済'}
                      </span>
                      <span className="font-medium text-sm">{c.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{c.email}</span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {new Date(c.created_at).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-700 mb-1">{c.subject}</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{c.message}</p>
                  <div className="flex gap-2 mt-3">
                    {c.status === 'unread' && (
                      <button onClick={() => markRead(c.id)} className="text-xs btn-secondary py-1 px-3">既読にする</button>
                    )}
                    <a href={`mailto:${c.email}?subject=Re: ${c.subject}`} className="text-xs btn-primary py-1 px-3">返信する</a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* コラム管理 */}
          {tab === 'columns' && (
            <div>
              <div className="card mb-6">
                <h2 className="font-bold text-sm text-gray-800 mb-4">新規記事を作成</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">スラッグ（URL用・英数字）</label>
                      <input className="input text-sm" placeholder="tokyo-anzen-2024" value={newCol.slug} onChange={e => setNewCol({...newCol, slug: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">ステータス</label>
                      <select className="input text-sm" value={newCol.status} onChange={e => setNewCol({...newCol, status: e.target.value as 'draft'|'published'})}>
                        <option value="draft">下書き</option>
                        <option value="published">公開</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">タイトル</label>
                    <input className="input text-sm" placeholder="記事タイトル" value={newCol.title} onChange={e => setNewCol({...newCol, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">概要（一覧表示用）</label>
                    <input className="input text-sm" placeholder="100〜150文字程度の概要" value={newCol.description} onChange={e => setNewCol({...newCol, description: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">タグ（カンマ区切り）</label>
                    <input className="input text-sm" placeholder="治安, 東京, 引越し" value={newCol.tags} onChange={e => setNewCol({...newCol, tags: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">本文（HTMLで記述）</label>
                    <textarea className="input text-sm font-mono resize-none" rows={8} placeholder="<h2>見出し</h2><p>本文…</p>" value={newCol.content} onChange={e => setNewCol({...newCol, content: e.target.value})} />
                  </div>
                  <button onClick={saveColumn} disabled={saving} className="btn-primary text-sm">
                    {saving ? '保存中…' : '記事を保存'}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {columns.map(c => (
                  <div key={c.id} className="card flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <span className={`badge mr-2 ${c.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.status === 'published' ? '公開中' : '下書き'}
                      </span>
                      <span className="text-sm font-medium">{c.title}</span>
                      <span className="text-xs text-gray-400 ml-2">/{c.slug}</span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a href={`/columns/${c.slug}`} target="_blank" className="text-xs text-blue-600 hover:underline">表示</a>
                      <button onClick={() => deleteColumn(c.id)} className="text-xs text-red-500 hover:underline">削除</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 広告枠管理 */}
          {tab === 'ads' && (
            <div>
              <div className="card mb-6">
                <h2 className="font-bold text-sm text-gray-800 mb-4">新規広告枠を追加</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">広告名（管理用）</label>
                      <input className="input text-sm" placeholder="ヘッダー下バナー" value={newAd.name} onChange={e => setNewAd({...newAd, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">表示位置</label>
                      <select className="input text-sm" value={newAd.position} onChange={e => setNewAd({...newAd, position: e.target.value as Ad['position']})}>
                        <option value="header">ヘッダー下</option>
                        <option value="sidebar">サイドバー</option>
                        <option value="inline">記事内</option>
                        <option value="footer">フッター上</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">種別</label>
                      <select className="input text-sm" value={newAd.type} onChange={e => setNewAd({...newAd, type: e.target.value as Ad['type']})}>
                        <option value="adsense">Google AdSense</option>
                        <option value="affiliate">アフィリエイト</option>
                        <option value="direct">直接広告</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">表示ページ</label>
                      <input className="input text-sm" placeholder="all" value={newAd.page} onChange={e => setNewAd({...newAd, page: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">広告コード（HTMLタグ）</label>
                    <textarea className="input text-sm font-mono resize-none" rows={5} placeholder="<script>/* AdSenseタグ */</script>" value={newAd.code} onChange={e => setNewAd({...newAd, code: e.target.value})} />
                  </div>
                  <button onClick={saveAd} disabled={saving} className="btn-primary text-sm">
                    {saving ? '保存中…' : '広告枠を追加'}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {ads.map(a => (
                  <div key={a.id} className="card flex items-center justify-between gap-4">
                    <div>
                      <span className={`badge mr-2 ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                        {a.is_active ? '表示中' : '停止中'}
                      </span>
                      <span className="text-sm font-medium">{a.name}</span>
                      <span className="text-xs text-gray-400 ml-2">{a.position} / {a.type}</span>
                    </div>
                    <button
                      onClick={() => toggleAd(a.id, a.is_active)}
                      className={`text-xs px-3 py-1 rounded-lg border transition ${
                        a.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}
                    >
                      {a.is_active ? '停止する' : '有効にする'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
