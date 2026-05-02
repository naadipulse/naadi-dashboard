import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import { useSettings, PARTY_DEFAULTS } from './shared.jsx'

const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'naadi2026'

const FONTS = ['Segoe UI', 'Arial', 'Roboto', 'Noto Sans Tamil', 'Lato', 'Poppins', 'Open Sans', 'Tahoma']

const COMPONENTS = [
  { key: 'top',    label: '🔝 Top Bar',    prefix: 'top' },
  { key: 'left',   label: '⬅️ Left Panel',  prefix: 'left' },
  { key: 'center', label: '🎯 Center',      prefix: 'center' },
  { key: 'bottom', label: '⬇️ Bottom Bar',  prefix: 'bottom' },
  { key: 'right',  label: '➡️ Right Panel', prefix: 'right' },
]

function FontsTab({ settings, saveSetting, loading, setMsg }) {
  const [activeComp, setActiveComp] = useState('top')
  const comp = COMPONENTS.find(c => c.key === activeComp)
  const prefix = comp.prefix

  const [vals, setVals] = useState({})
  const [fontFamily, setFontFamily] = useState('Segoe UI')

  useEffect(() => {
    const v = {}
    COMPONENTS.forEach(c => {
      v[`${c.prefix}_font_large`]  = parseInt(settings[`${c.prefix}_font_large`])  || parseInt(settings.font_large)  || 52
      v[`${c.prefix}_font_medium`] = parseInt(settings[`${c.prefix}_font_medium`]) || parseInt(settings.font_medium) || 22
      v[`${c.prefix}_font_small`]  = parseInt(settings[`${c.prefix}_font_small`])  || parseInt(settings.font_small)  || 13
    })
    setVals(v)
    setFontFamily(settings.font_family || 'Segoe UI')
  }, [settings])

  const set = (key, val) => setVals(prev => ({ ...prev, [key]: val }))

  const save = async () => {
    try {
      await saveSetting('font_family', fontFamily)
      for (const [k, v] of Object.entries(vals)) {
        await saveSetting(k, v)
      }
      setMsg('✅ Font settings saved!')
    } catch (e) { setMsg('❌ ' + e.message) }
  }

  const fl = vals[`${prefix}_font_large`]  || 52
  const fm = vals[`${prefix}_font_medium`] || 22
  const fs = vals[`${prefix}_font_small`]  || 13

  return (
    <div style={{ background: '#111827', borderRadius: 12, padding: 20, border: '1px solid #1E293B' }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#F59E0B', marginBottom: 16 }}>🔤 Font Size — Per Component</div>

      {/* Font Family */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>Font Family (all views)</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {FONTS.map(f => (
            <button key={f} onClick={() => setFontFamily(f)}
              style={{ background: fontFamily === f ? '#DC2626' : '#1E293B', color: '#fff', border: `1px solid ${fontFamily === f ? '#DC2626' : '#334155'}`, borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: f }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Component selector */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {COMPONENTS.map(c => (
          <button key={c.key} onClick={() => setActiveComp(c.key)}
            style={{ background: activeComp === c.key ? '#DC2626' : '#1E293B', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Sliders for selected component */}
      <div style={{ background: '#0F172A', borderRadius: 10, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, color: '#F59E0B', fontWeight: 700, marginBottom: 14 }}>{comp.label} Font Sizes</div>

        {[
          { key: `${prefix}_font_large`,  label: 'Large (numbers)',  min: 20, max: 90, val: fl, preview: '158', color: '#DC2626' },
          { key: `${prefix}_font_medium`, label: 'Medium (labels)',  min: 10, max: 40, val: fm, preview: 'திமுக+ | தவெக', color: '#16A34A' },
          { key: `${prefix}_font_small`,  label: 'Small (sub text)', min: 8,  max: 22, val: fs, preview: 'வென்றது • முன்னிலை', color: '#94A3B8' },
        ].map(({ key, label, min, max, val, preview, color }) => (
          <div key={key} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#94A3B8' }}>{label}</span>
              <span style={{ fontSize: 13, color: '#F59E0B', fontWeight: 700 }}>{val}px</span>
            </div>
            <input type="range" min={min} max={max} value={val}
              onChange={e => set(key, parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#DC2626' }} />
            <div style={{ fontSize: val, fontWeight: 900, color, textAlign: 'center', marginTop: 6, fontFamily, overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {preview}
            </div>
          </div>
        ))}
      </div>

      <button onClick={save} disabled={loading}
        style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', width: '100%', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
        {loading ? '⏳...' : '✅ Save All Font Settings'}
      </button>
    </div>
  )
}

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState('tally')
  const settings = useSettings()

  // Tally
  const [manualData, setManualData] = useState({
    'DMK+': { won: 0, leadingg: 0 },
    'AIADMK+': { won: 0, leadingg: 0 },
    'TVK': { won: 0, leadingg: 0 },
    'Others': { won: 0, leadingg: 0 },
  })
  const [llmText, setLlmText] = useState('')
  const [mode, setMode] = useState('manual')
  const [loading, setLoading] = useState(false)

  // Font/Photo settings
  const [fontLarge, setFontLarge] = useState(52)
  const [fontMedium, setFontMedium] = useState(22)
  const [fontSmall, setFontSmall] = useState(13)
  const [fontFamily, setFontFamily] = useState('Segoe UI')
  const [photos, setPhotos] = useState({ photo_dmk: '', photo_aiadmk: '', photo_tvk: '', photo_others: '' })

  // VIP constituencies
  const [allConstituencies, setAllConstituencies] = useState([])
  const [vipIds, setVipIds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    fetchAllConstituencies()
  }, [])

  useEffect(() => {
    if (settings) {
      setFontLarge(parseInt(settings.font_large) || 52)
      setFontMedium(parseInt(settings.font_medium) || 22)
      setFontSmall(parseInt(settings.font_small) || 13)
      setFontFamily(settings.font_family || 'Segoe UI')
      setPhotos({
        photo_dmk: settings.photo_dmk || '',
        photo_aiadmk: settings.photo_aiadmk || '',
        photo_tvk: settings.photo_tvk || '',
        photo_others: settings.photo_others || '',
      })
      if (settings.vip_constituencies) {
        setVipIds(settings.vip_constituencies.split(',').map(Number).filter(Boolean))
      }
    }
  }, [settings])

  const fetchAllConstituencies = async () => {
    const { data } = await supabase.from('constituencies').select('id, name, name_tamil, district').order('id')
    if (data) setAllConstituencies(data)
  }

  const login = () => {
    if (pw === ADMIN_PASSWORD) setAuth(true)
    else setMsg('❌ Wrong password!')
  }

  const saveSetting = async (key, value) => {
    await supabase.from('settings').upsert({ key, value: String(value) })
  }

  const saveAllSettings = async () => {
    setLoading(true)
    setMsg('💾 Saving...')
    try {
      await Promise.all([
        saveSetting('font_large', fontLarge),
        saveSetting('font_medium', fontMedium),
        saveSetting('font_small', fontSmall),
        saveSetting('font_family', fontFamily),
        ...Object.entries(photos).map(([k, v]) => saveSetting(k, v)),
      ])
      setMsg('✅ Settings saved!')
    } catch (e) { setMsg('❌ Error: ' + e.message) }
    setLoading(false)
  }

  const saveVipConstituencies = async () => {
    setLoading(true)
    setMsg('💾 Saving VIP list...')
    try {
      await saveSetting('vip_constituencies', vipIds.join(','))
      setMsg('✅ VIP தொகுதிகள் saved! Left panel updated!')
    } catch (e) { setMsg('❌ Error: ' + e.message) }
    setLoading(false)
  }

  const saveTally = async () => {
    setLoading(true)
    setMsg('💾 Saving...')
    try {
      for (const [party, vals] of Object.entries(manualData)) {
        await supabase.from('overall_tally')
          .update({ won: parseInt(vals.won) || 0, leadingg: parseInt(vals.leadingg) || 0, updated_at: new Date() })
          .eq('party', party)
      }
      setMsg('✅ Tally updated!')
    } catch (e) { setMsg('❌ Error: ' + e.message) }
    setLoading(false)
  }

  const parseLLM = async () => {
    if (!llmText.trim()) return
    setLoading(true)
    setMsg('🤖 Claude parsing...')
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          messages: [{ role: 'user', content: `Parse election data and return ONLY JSON:\n"${llmText}"\nFormat: {"DMK+":{"won":0,"leadingg":0},"AIADMK+":{"won":0,"leadingg":0},"TVK":{"won":0,"leadingg":0},"Others":{"won":0,"leadingg":0}}` }]
        })
      })
      const data = await res.json()
      const parsed = JSON.parse(data.content[0].text.replace(/```json|```/g, '').trim())
      for (const [party, vals] of Object.entries(parsed)) {
        await supabase.from('overall_tally')
          .update({ won: vals.won || 0, leadingg: vals.leadingg || 0, updated_at: new Date() })
          .eq('party', party)
      }
      setMsg('✅ Parsed & updated!')
      setLlmText('')
    } catch (e) { setMsg('❌ Error: ' + e.message) }
    setLoading(false)
  }

  // Search constituencies
  const handleSearch = (q) => {
    setSearchQuery(q)
    if (q.length < 2) { setSearchResults([]); return }
    const results = allConstituencies.filter(c =>
      c.name?.toLowerCase().includes(q.toLowerCase()) ||
      c.name_tamil?.includes(q) ||
      c.district?.includes(q)
    ).slice(0, 8)
    setSearchResults(results)
  }

  const addVip = (id) => {
    if (!vipIds.includes(id)) setVipIds([...vipIds, id])
    setSearchQuery('')
    setSearchResults([])
  }

  const removeVip = (id) => setVipIds(vipIds.filter(v => v !== id))

  const getConstituency = (id) => allConstituencies.find(c => c.id === id)

  if (!auth) return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Segoe UI' }}>
      <div style={{ background: '#111827', border: '1px solid #1E293B', borderRadius: 16, padding: 32, width: 320, textAlign: 'center' }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#F59E0B', marginBottom: 8 }}>நாடி Admin</div>
        <div style={{ fontSize: 12, color: '#64748B', marginBottom: 24 }}>Election Dashboard Control</div>
        <input type="password" placeholder="Password" value={pw}
          onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && login()}
          style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#fff', padding: '10px 16px', fontSize: 16, width: '100%', marginBottom: 12 }} />
        <button onClick={login} style={{ background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, padding: 12, width: '100%', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Login</button>
        {msg && <div style={{ color: '#EF4444', fontSize: 13, marginTop: 8 }}>{msg}</div>}
      </div>
    </div>
  )

  const tabStyle = (t) => ({
    padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13,
    background: tab === t ? '#DC2626' : '#1E293B',
    color: tab === t ? '#fff' : '#94A3B8', border: 'none',
  })

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', color: '#fff', fontFamily: 'Segoe UI', padding: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B', marginBottom: 4 }}>நாடி Admin Panel</div>
      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Election Dashboard Control</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button style={tabStyle('tally')} onClick={() => setTab('tally')}>📊 Tally</button>
        <button style={tabStyle('vip')} onClick={() => setTab('vip')}>⭐ VIP தொகுதிகள்</button>
        <button style={tabStyle('fonts')} onClick={() => setTab('fonts')}>🔤 Font Size</button>
        <button style={tabStyle('photos')} onClick={() => setTab('photos')}>📸 Photos</button>
      </div>

      {/* TALLY TAB */}
      {tab === 'tally' && (
        <div style={{ background: '#111827', borderRadius: 12, padding: 20, border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={() => setMode('manual')} style={{ ...tabStyle('x'), background: mode === 'manual' ? '#DC2626' : '#1E293B', color: '#fff' }}>✏️ Manual</button>
            <button onClick={() => setMode('llm')} style={{ ...tabStyle('x'), background: mode === 'llm' ? '#DC2626' : '#1E293B', color: '#fff' }}>🤖 LLM</button>
          </div>
          {mode === 'manual' && (
            <>
              {Object.entries(PARTY_DEFAULTS).map(([party, cfg]) => (
                <div key={party} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12, alignItems: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>வென்றது ✅</div>
                    <input type="number" min="0" value={manualData[party]?.won || 0}
                      onChange={e => setManualData({ ...manualData, [party]: { ...manualData[party], won: e.target.value } })}
                      style={{ background: '#1E293B', border: `1px solid ${cfg.color}66`, borderRadius: 8, color: '#fff', padding: '8px 12px', fontSize: 18, fontWeight: 700, width: '100%', textAlign: 'center' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: '#64748B', marginBottom: 4 }}>முன்னிலை 📈</div>
                    <input type="number" min="0" value={manualData[party]?.leadingg || 0}
                      onChange={e => setManualData({ ...manualData, [party]: { ...manualData[party], leadingg: e.target.value } })}
                      style={{ background: '#1E293B', border: `1px solid ${cfg.color}66`, borderRadius: 8, color: '#fff', padding: '8px 12px', fontSize: 18, fontWeight: 700, width: '100%', textAlign: 'center' }} />
                  </div>
                </div>
              ))}
              <button onClick={saveTally} disabled={loading} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', width: '100%', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                {loading ? '⏳...' : '✅ Save & Update Dashboard'}
              </button>
            </>
          )}
          {mode === 'llm' && (
            <>
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>ECI data paste பண்ணுங்க</div>
              <textarea value={llmText} onChange={e => setLlmText(e.target.value)} placeholder="Paste election data..."
                style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#fff', padding: 12, fontSize: 14, width: '100%', minHeight: 100, resize: 'vertical', marginBottom: 12 }} />
              <button onClick={parseLLM} disabled={loading} style={{ background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, padding: 12, width: '100%', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                {loading ? '⏳ Processing...' : '🚀 Parse & Update'}
              </button>
            </>
          )}
        </div>
      )}

      {/* VIP CONSTITUENCIES TAB */}
      {tab === 'vip' && (
        <div style={{ background: '#111827', borderRadius: 12, padding: 20, border: '1px solid #1E293B' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>⭐ VIP தொகுதிகள்</div>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>
            Left panel-ல் 2 at a time show ஆகும் • இப்போ {vipIds.length} தொகுதிகள்
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="தொகுதி பெயர் search பண்ணுங்க... (Tamil or English)"
              style={{ background: '#1E293B', border: '1px solid #F59E0B', borderRadius: 8, color: '#fff', padding: '10px 16px', fontSize: 14, width: '100%' }}
            />
            {/* Search results dropdown */}
            {searchResults.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1E293B', border: '1px solid #334155', borderRadius: 8, zIndex: 100, maxHeight: 280, overflow: 'auto', marginTop: 4 }}>
                {searchResults.map(c => (
                  <div key={c.id}
                    onClick={() => addVip(c.id)}
                    style={{ padding: '10px 16px', cursor: 'pointer', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                    onMouseEnter={e => e.target.style.background = '#374151'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: vipIds.includes(c.id) ? '#22C55E' : '#fff' }}>
                        {vipIds.includes(c.id) ? '✅ ' : ''}{c.name_tamil}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748B' }}>{c.name} • {c.district}</div>
                    </div>
                    {!vipIds.includes(c.id) && (
                      <span style={{ fontSize: 18, color: '#F59E0B' }}>+</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current VIP list */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#94A3B8', marginBottom: 8 }}>தேர்ந்தெடுக்கப்பட்ட தொகுதிகள்:</div>
            {vipIds.length === 0 ? (
              <div style={{ color: '#475569', fontSize: 13, padding: 12, background: '#1E293B', borderRadius: 8 }}>
                இன்னும் தொகுதிகள் select பண்ணவில்லை
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {vipIds.map((id, i) => {
                  const c = getConstituency(id)
                  if (!c) return null
                  return (
                    <div key={id} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      background: '#1E293B', borderRadius: 8, padding: '10px 14px',
                      border: '1px solid #334155',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700, width: 24 }}>{i + 1}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{c.name_tamil}</div>
                          <div style={{ fontSize: 11, color: '#64748B' }}>{c.name} • {c.district}</div>
                        </div>
                      </div>
                      <button onClick={() => removeVip(id)} style={{ background: '#DC2626', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Reorder hint */}
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 12 }}>
            💡 Add பண்ணிய order-ல் rotate ஆகும் • 2 at a time • 5 seconds each
          </div>

          <button onClick={saveVipConstituencies} disabled={loading} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', width: '100%', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? '⏳...' : `✅ Save VIP List (${vipIds.length} தொகுதிகள்)`}
          </button>
        </div>
      )}

      {/* FONTS TAB */}
      {tab === 'fonts' && (
        <FontsTab settings={settings} saveSetting={saveSetting} loading={loading} setMsg={setMsg} />
      )}

      {/* PHOTOS TAB */}
      {tab === 'photos' && (
        <div style={{ background: '#111827', borderRadius: 12, padding: 20, border: '1px solid #1E293B' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>📸 Leader Photos</div>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>imgbb.com direct link paste பண்ணுங்க</div>
          {[
            { key: 'photo_dmk', label: 'திமுக+ (Stalin)', color: '#DC2626' },
            { key: 'photo_aiadmk', label: 'அதிமுக+ (Edappadi)', color: '#16A34A' },
            { key: 'photo_tvk', label: 'தவெக (Vijay)', color: '#D97706' },
            { key: 'photo_others', label: 'நாதக (Seeman)', color: '#7C3AED' },
          ].map(({ key, label, color }) => (
            <div key={key} style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${color}`, flexShrink: 0, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {photos[key] ? <img src={photos[key]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 10, color, fontWeight: 700 }}>NO</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color, fontWeight: 700, marginBottom: 6 }}>{label}</div>
                <input type="text" value={photos[key]} onChange={e => setPhotos({ ...photos, [key]: e.target.value })} placeholder="https://i.ibb.co/..."
                  style={{ background: '#1E293B', border: `1px solid ${color}44`, borderRadius: 8, color: '#fff', padding: '8px 12px', fontSize: 13, width: '100%' }} />
              </div>
            </div>
          ))}
          <button onClick={saveAllSettings} disabled={loading} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', width: '100%', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? '⏳...' : '✅ Save Photos'}
          </button>
        </div>
      )}

      {msg && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: msg.includes('✅') ? '#16A34A22' : '#DC262622', border: `1px solid ${msg.includes('✅') ? '#16A34A' : '#DC2626'}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: msg.includes('✅') ? '#22C55E' : '#EF4444' }}>
          {msg}
        </div>
      )}

      {/* OBS URLs */}
      <div style={{ marginTop: 24, background: '#111827', borderRadius: 12, padding: 16, border: '1px solid #1E293B' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#F59E0B', marginBottom: 10 }}>📺 OBS Browser Source URLs</div>
        {['/', '/top', '/left', '/center', '/bottom', '/admin'].map(url => (
          <div key={url} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1E293B', fontSize: 13 }}>
            <span style={{ color: '#94A3B8' }}>{url === '/' ? 'Full Dashboard' : url.slice(1).charAt(0).toUpperCase() + url.slice(2) + ' only'}</span>
            <span style={{ color: '#38BDF8', fontFamily: 'monospace' }}>naadi-dashboard-f9z6.vercel.app{url}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
