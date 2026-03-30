'use client'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import type { Contact, Column, Ad } from '@/types'

type Tab = 'contacts' | 'columns' | 'ads'

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID       || 'admin'
const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'anzen-map-2024'

const EMPTY_COL = { slug:'', title:'', description:'', content:'', tags:'', status:'draft' as 'draft'|'published', thumbnail:'' }

export default function AdminPage() {
  const [authed,    setAuthed]    = useState(false)
  const [loginId,   setLoginId]   = useState('')
  const [loginPw,   setLoginPw]   = useState('')
  const [loginErr,  setLoginErr]  = useState('')
  const [tab,       setTab]       = useState<Tab>('contacts')
  const [contacts,  setContacts]  = useState<Contact[]>([])
  const [columns,   setColumns]   = useState<Column[]>([])
  const [ads,       setAds]       = useState<Ad[]>([])
  const [loading,   setLoading]   = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [msg,       setMsg]       = useState('')
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 新規 or 編集中の記事
  const [editingId, setEditingId] = useState<string | null>(null)
  const [col, setCol] = useState(EMPTY_COL)

  // 広告
  const [newAd, setNewAd] = useState({
    name:'', position:'header' as Ad['position'],
    type:'adsense' as Ad['type'], code:'', page:'all', priority:0
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginId === ADMIN_ID && loginPw === ADMIN_PW) {
      setAuthed(true); setLoginErr('')
      sessionStorage.setItem('admin_authed', '1')
    } else {
      setLoginErr('IDまたはパスワードが違います')
    }
  }

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

  // 編集ボタンを押したとき — フォームに既存データを読み込む
  function startEdit(c: Column) {
    setEditingId(c.id)
    setCol({
      slug:        c.slug,
      title:       c.title,
      description: c.description,
      content:     c.content,
      tags:        (c.tags ?? []).join(', '),
      status:      c.status,
      thumbnail:   c.thumbnail ?? '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setCol(EMPTY_COL)
  }

  // 画像アップロード
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const ext  = file.name.split('.').pop()
      const path = `thumbnails/${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('column-images').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('column-images').getPublicUrl(path)
      setCol(c => ({ ...c, thumbnail: urlData.publicUrl }))
      setMsg('画像をアップロードしました')
    } catch (err: unknown) {
      setMsg(`画像エラー: ${err instanceof Error ? err.message : '失敗しました'}`)
    }
    setUploading(false)
  }

  // 保存（新規 or 更新）
  async function saveColumn() {
    setSaving(true)
    const tags = col.tags.split(',').map(t => t.trim()).filter(Boolean)
    const payload = {
      slug:        col.slug,
      title:       col.title,
      description: col.description,
      content:     col.content,
      thumbnail:   col.thumbnail || null,
      tags,
      status:      col.status,
      published_at: col.status === 'published' ? new Date().toISOString() : null,
    }

    let error
    if (editingId) {
      // 更新
      const res = await supabase.from('columns').update(payload).eq('id', editingId)
      error = res.error
      if (!error) { setMsg('記事を更新しました ✓'); cancelEdit(); fetchAll() }
    } else {
      // 新規
      const res = await supabase.from('columns').insert(payload)
      error = res.error
      if (!error) { setMsg('記事を保存しました ✓'); setCol(EMPTY_COL); fetchAll() }
    }

    if (error) setMsg(`エラー: ${error.message}`)
    setSaving(false)
  }

  async function updateStatus(id: string, status: 'draft' | 'published') {
    await supabase.from('columns').update({
      status,
      published_at: status === 'published' ? new Date().toISOString() : null
    }).eq('id', id)
    setColumns(cs => cs.map(c => c.id === id ? { ...c, status } : c))
  }

  async function deleteColumn(id: string) {
    if (!confirm('削除しますか？')) return
    await supabase.from('columns').delete().eq('id', id)
    setColumns(cs => cs.filter(c => c.id !== id))
    if (editingId === id) cancelEdit()
  }

  async function markRead(id: string) {
    await supabase.from('contacts').update({ status: 'read' }).eq('id', id)
    setContacts(cs => cs.map(c => c.id === id ? { ...c, status: 'read' } : c))
  }

  async function saveAd() {
    setSaving(true)
    const { error } = await supabase.from('ads').insert(newAd)
    setMsg(error ? `エラー: ${error.message}` : '広告枠を保存しました ✓')
    if (!error) { setNewAd({ name:'', position:'header', type:'adsense', code:'', page:'all', priority:0 }); fetchAll() }
    setSaving(false)
  }

  async function toggleAd(id: string, is_active: boolean) {
    await supabase.from('ads').update({ is_active: !is_active }).eq('id', id)
    setAds(as => as.map(a => a.id === id ? { ...a, is_active: !is_active } : a))
  }

  // ─── ログイン画面 ──────────────────────────────────────
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">管理者ID</label>
              <input type="text" required className="input" placeholder="admin"
                value={loginId} onChange={e => setLoginId(e.target.value)} autoComplete="username" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">パスワード</label>
              <input type="password" required className="input" placeholder="••••••••"
                value={loginPw} onChange={e => setLoginPw(e.target.value)} autoComplete="current-password" />
            </div>
            {loginErr && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-center">{loginErr}</div>
            )}
            <button type="submit" className="btn-primary w-full">ログイン</button>
          </form>
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
          <button key={t.key} onClick={() => { setTab(t.key); cancelEdit() }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
              tab === t.key ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {t.label}
            {t.count ? <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{t.count}</span> : null}
          </button>
        ))}
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm flex justify-between ${
          msg.includes('エラー') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'
        }`}>
          {msg}
          <button onClick={() => setMsg('')} className="ml-2 opacity-60">✕</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-400">読み込み中…</div>
      ) : (
        <>
          {/* ─── 問い合わせ ─── */}
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
                    <span className="text-xs text-gray-400 flex-shrink-0">{new Date(c.created_at).toLocaleDateString('ja-JP')}</span>
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

          {/* ─── コラム管理 ─── */}
          {tab === 'columns' && (
            <div>
              {/* 新規作成 or 編集フォーム */}
              <div className="card mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-sm text-gray-800">
                    {editingId ? '✏️ 記事を編集中' : '新規記事を作成'}
                  </h2>
                  {editingId && (
                    <button onClick={cancelEdit} className="text-xs text-gray-500 border border-gray-200 px-3 py-1 rounded-lg hover:bg-gray-50">
                      キャンセル（新規作成に戻る）
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">スラッグ（URL用・英数字）</label>
                      <input className="input text-sm" placeholder="tokyo-anzen-2024"
                        value={col.slug} onChange={e => setCol({...col, slug: e.target.value})}
                        disabled={!!editingId} />
                      {editingId && <p className="text-xs text-gray-400 mt-0.5">編集時はスラッグを変更できません</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">ステータス</label>
                      <select className="input text-sm" value={col.status}
                        onChange={e => setCol({...col, status: e.target.value as 'draft'|'published'})}>
                        <option value="draft">下書き</option>
                        <option value="published">公開</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">タイトル</label>
                    <input className="input text-sm" placeholder="記事タイトル"
                      value={col.title} onChange={e => setCol({...col, title: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">概要（一覧表示用・100文字程度）</label>
                    <input className="input text-sm" placeholder="概要文"
                      value={col.description} onChange={e => setCol({...col, description: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">タグ（カンマ区切り）</label>
                    <input className="input text-sm" placeholder="治安, 東京, 引越し"
                      value={col.tags} onChange={e => setCol({...col, tags: e.target.value})} />
                  </div>

                  {/* サムネイル */}
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">サムネイル画像</label>
                    <div className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input type="file" accept="image/*" ref={fileInputRef}
                          onChange={handleImageUpload} className="hidden" />
                        <button type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="btn-secondary text-xs py-2 px-4 disabled:opacity-50">
                          {uploading ? 'アップロード中…' : '📷 画像を選択'}
                        </button>
                        {col.thumbnail && (
                          <div className="mt-2 flex items-center gap-2">
                            <img src={col.thumbnail} alt="サムネイル" className="w-20 h-14 object-cover rounded-lg border" />
                            <button type="button" onClick={() => setCol(c => ({...c, thumbnail:''}))}
                              className="text-xs text-red-500 hover:underline">削除</button>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <input className="input text-xs" placeholder="または画像URLを直接入力"
                          value={col.thumbnail} onChange={e => setCol({...col, thumbnail: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-500 mb-1">本文（HTMLで記述）</label>
                    <textarea className="input text-sm font-mono resize-y" rows={12}
                      placeholder="<h2>見出し</h2><p>本文…</p>"
                      value={col.content} onChange={e => setCol({...col, content: e.target.value})} />
                  </div>

                  <button onClick={saveColumn} disabled={saving}
                    className={`text-sm font-medium px-5 py-2.5 rounded-lg transition ${
                      editingId
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } disabled:opacity-50`}>
                    {saving ? '保存中…' : editingId ? '✏️ 記事を更新する' : '記事を保存'}
                  </button>
                </div>
              </div>

              {/* 記事一覧 */}
              <h3 className="font-bold text-sm text-gray-700 mb-3">記事一覧（{columns.length}件）</h3>
              <div className="space-y-2">
                {columns.length === 0 && <p className="text-gray-400 text-sm">記事がありません</p>}
                {columns.map(c => (
                  <div key={c.id} className={`card flex items-center gap-4 ${editingId === c.id ? 'border-amber-300 bg-amber-50' : ''}`}>
                    {c.thumbnail && (
                      <img src={c.thumbnail} alt={c.title}
                        className="w-16 h-12 object-cover rounded-lg flex-shrink-0 border" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`badge ${c.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {c.status === 'published' ? '公開中' : '下書き'}
                        </span>
                        {editingId === c.id && (
                          <span className="badge bg-amber-100 text-amber-700">編集中</span>
                        )}
                        <span className="text-sm font-medium truncate">{c.title}</span>
                      </div>
                      <span className="text-xs text-gray-400">/{c.slug}</span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {/* 編集ボタン */}
                      <button onClick={() => startEdit(c)}
                        className="text-xs text-amber-600 border border-amber-200 px-2 py-1 rounded-lg hover:bg-amber-50">
                        ✏️ 編集
                      </button>
                      {/* 公開・下書き切替 */}
                      {c.status === 'draft' ? (
                        <button onClick={() => updateStatus(c.id, 'published')}
                          className="text-xs text-green-600 border border-green-200 px-2 py-1 rounded-lg hover:bg-green-50">
                          公開する
                        </button>
                      ) : (
                        <button onClick={() => updateStatus(c.id, 'draft')}
                          className="text-xs text-gray-500 border border-gray-200 px-2 py-1 rounded-lg hover:bg-gray-50">
                          下書きに戻す
                        </button>
                      )}
                      <a href={`/columns/${c.slug}`} target="_blank"
                        className="text-xs text-blue-600 border border-blue-200 px-2 py-1 rounded-lg hover:bg-blue-50">
                        表示
                      </a>
                      <button onClick={() => deleteColumn(c.id)}
                        className="text-xs text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50">
                        削除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── 広告枠管理 ─── */}
          {tab === 'ads' && (
            <div>
              <div className="card mb-6">
                <h2 className="font-bold text-sm text-gray-800 mb-4">新規広告枠を追加</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">広告名（管理用）</label>
                      <input className="input text-sm" placeholder="ヘッダー下バナー"
                        value={newAd.name} onChange={e => setNewAd({...newAd, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">表示位置</label>
                      <select className="input text-sm" value={newAd.position}
                        onChange={e => setNewAd({...newAd, position: e.target.value as Ad['position']})}>
                        <option value="header">ヘッダー下</option>
                        <option value="sidebar">サイドバー</option>
                        <option value="inline">記事内</option>
                        <option value="footer">フッター上</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">種別</label>
                      <select className="input text-sm" value={newAd.type}
                        onChange={e => setNewAd({...newAd, type: e.target.value as Ad['type']})}>
                        <option value="adsense">Google AdSense</option>
                        <option value="affiliate">アフィリエイト</option>
                        <option value="direct">直接広告</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">表示ページ</label>
                      <input className="input text-sm" placeholder="all"
                        value={newAd.page} onChange={e => setNewAd({...newAd, page: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">広告コード（HTMLタグ）</label>
                    <textarea className="input text-sm font-mono resize-none" rows={4}
                      placeholder="<script>/* AdSenseタグ */</script>"
                      value={newAd.code} onChange={e => setNewAd({...newAd, code: e.target.value})} />
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
                    <button onClick={() => toggleAd(a.id, a.is_active)}
                      className={`text-xs px-3 py-1 rounded-lg border transition ${
                        a.is_active ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'
                      }`}>
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
