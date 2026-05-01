import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import { useSettings, PARTY_DEFAULTS } from './shared'

const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'naadi2026'

const FONTS = [
  'Segoe UI', 'Arial', 'Roboto', 'Noto Sans Tamil',
  'Lato', 'Poppins', 'Open Sans', 'Tahoma'
]

export default function Admin() {
  const [auth, setAuth] = useState(false)
  const [pw, setPw] = useState('')
  const [msg, setMsg] = useState('')
  const [tab, setTab] = useState('tally')
  const settings = useSettings()

  // Tally state
  const [manualData, setManualData] = useState({
    'DMK+':    { won: 0, leadingg: 0 },
    'AIADMK+': { won: 0, leadingg: 0 },
    'TVK':     { won: 0, leadingg: 0 },
    'Others':  { won: 0, leadingg: 0 },
  })
  const [llmText, setLlmText] = useState('')
  const [mode, setMode] = useState('manual')
  const [loading, setLoading] = useState(false)

  // Settings state
  const [fontLarge, setFontLarge] = useState(52)
  const [fontMedium, setFontMedium] = useState(22)
  const [fontSmall, setFontSmall] = useState(13)
  const [fontFamily, setFontFamily] = useState('Segoe UI')
  const [photos, setPhotos] = useState({
    photo_dmk: '', photo_aiadmk: '', photo_tvk: '', photo_others: ''
  })

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
    }
  }, [settings])

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
      setMsg('✅ Settings saved! All views updated!')
    } catch (e) {
      setMsg('❌ Error: ' + e.message)
    }
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
    } catch (e) {
      setMsg('❌ Error: ' + e.message)
    }
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
          messages: [{ role: 'user', content: `Parse election data and return ONLY JSON, no explanation:\n"${llmText}"\n\nFormat: {"DMK+":{"won":0,"leadingg":0},"AIADMK+":{"won":0,"leadingg":0},"TVK":{"won":0,"leadingg":0},"Others":{"won":0,"leadingg":0}}` }]
        })
      })
      const data = await res.json()
      const text = data.content[0].text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(text)
      for (const [party, vals] of Object.entries(parsed)) {
        await supabase.from('overall_tally')
          .update({ won: vals.won || 0, leadingg: vals.leadingg || 0, updated_at: new Date() })
          .eq('party', party)
      }
      setMsg('✅ Parsed & updated!')
      setLlmText('')
    } catch (e) {
      setMsg('❌ Error: ' + e.message)
    }
    setLoading(false)
  }

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
    padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14,
    background: tab === t ? '#DC2626' : '#1E293B',
    color: tab === t ? '#fff' : '#94A3B8', border: 'none',
  })

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', color: '#fff', fontFamily: 'Segoe UI', padding: 20 }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B', marginBottom: 4 }}>நாடி Admin Panel</div>
      <div style={{ fontSize: 12, color: '#64748B', marginBottom: 20 }}>Election Dashboard Control</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <button style={tabStyle('tally')} onClick={() => setTab('tally')}>📊 Tally Update</button>
        <button style={tabStyle('fonts')} onClick={() => setTab('fonts')}>🔤 Font Size</button>
        <button style={tabStyle('photos')} onClick={() => setTab('photos')}>📸 Photos</button>
      </div>

      {/* TALLY TAB */}
      {tab === 'tally' && (
        <div style={{ background: '#111827', borderRadius: 12, padding: 20, border: '1px solid #1E293B' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={() => setMode('manual')} style={{ ...tabStyle(mode === 'manual' ? 'manual' : ''), background: mode === 'manual' ? '#DC2626' : '#1E293B' }}>✏️ Manual</button>
            <button onClick={() => setMode('llm')} style={{ ...tabStyle(mode === 'llm' ? 'llm' : ''), background: mode === 'llm' ? '#DC2626' : '#1E293B' }}>🤖 LLM</button>
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
              <div style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>ECI-யிலிருந்து copy paste பண்ணுங்க</div>
              <textarea value={llmText} onChange={e => setLlmText(e.target.value)} placeholder="ECI data paste பண்ணுங்க..."
                style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: 8, color: '#fff', padding: 12, fontSize: 14, width: '100%', minHeight: 100, resize: 'vertical', marginBottom: 12 }} />
              <button onClick={parseLLM} disabled={loading} style={{ background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, padding: 12, width: '100%', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
                {loading ? '⏳ Processing...' : '🚀 Parse & Update'}
              </button>
            </>
          )}
        </div>
      )}

      {/* FONTS TAB */}
      {tab === 'fonts' && (
        <div style={{ background: '#111827', borderRadius: 12, padding: 20, border: '1px solid #1E293B' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F59E0B', marginBottom: 16 }}>🔤 Font Size Control</div>

          {/* Font Family */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 14, color: '#94A3B8', marginBottom: 8 }}>Font Family</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FONTS.map(f => (
                <button key={f} onClick={() => setFontFamily(f)} style={{ background: fontFamily === f ? '#DC2626' : '#1E293B', color: '#fff', border: `1px solid ${fontFamily === f ? '#DC2626' : '#334155'}`, borderRadius: 8, padding: '6px 14px', fontSize: 13, cursor: 'pointer', fontFamily: f }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Font Large — Party numbers */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: '#94A3B8' }}>கட்சி எண்கள் (Party Numbers)</div>
              <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 700 }}>{fontLarge}px</span>
            </div>
            <input type="range" min={28} max={80} value={fontLarge} onChange={e => setFontLarge(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#DC2626' }} />
            <div style={{ fontSize: fontLarge, fontWeight: 900, color: '#DC2626', textAlign: 'center', marginTop: 8, fontFamily: fontFamily }}>158</div>
          </div>

          {/* Font Medium — Labels */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: '#94A3B8' }}>Label Text (Party names etc)</div>
              <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 700 }}>{fontMedium}px</span>
            </div>
            <input type="range" min={12} max={36} value={fontMedium} onChange={e => setFontMedium(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#DC2626' }} />
            <div style={{ fontSize: fontMedium, fontWeight: 700, color: '#DC2626', textAlign: 'center', marginTop: 8, fontFamily: fontFamily }}>திமுக+ | தவெக</div>
          </div>

          {/* Font Small — Sub text */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 14, color: '#94A3B8' }}>Sub Text (won/leading etc)</div>
              <span style={{ fontSize: 14, color: '#F59E0B', fontWeight: 700 }}>{fontSmall}px</span>
            </div>
            <input type="range" min={9} max={20} value={fontSmall} onChange={e => setFontSmall(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#DC2626' }} />
            <div style={{ fontSize: fontSmall, color: '#94A3B8', textAlign: 'center', marginTop: 8, fontFamily: fontFamily }}>வென்றது • முன்னிலை • @naadipulse</div>
          </div>

          <button onClick={saveAllSettings} disabled={loading} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', width: '100%', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? '⏳...' : '✅ Save — All Views Update!'}
          </button>
        </div>
      )}

      {/* PHOTOS TAB */}
      {tab === 'photos' && (
        <div style={{ background: '#111827', borderRadius: 12, padding: 20, border: '1px solid #1E293B' }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>📸 Leader Photos</div>
          <div style={{ fontSize: 12, color: '#64748B', marginBottom: 16 }}>imgbb.com-ல் upload பண்ணி direct link paste பண்ணுங்க</div>

          {[
            { key: 'photo_dmk', label: 'திமுக+ (Stalin)', color: '#DC2626' },
            { key: 'photo_aiadmk', label: 'அதிமுக+ (Edappadi)', color: '#16A34A' },
            { key: 'photo_tvk', label: 'தவெக (Vijay)', color: '#D97706' },
            { key: 'photo_others', label: 'மற்றவை (Seeman)', color: '#7C3AED' },
          ].map(({ key, label, color }) => (
            <div key={key} style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              {/* Preview */}
              <div style={{ width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${color}`, flexShrink: 0, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {photos[key] ? (
                  <img src={photos[key]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: 10, color, fontWeight: 700 }}>NO</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color, fontWeight: 700, marginBottom: 6 }}>{label}</div>
                <input type="text" value={photos[key]}
                  onChange={e => setPhotos({ ...photos, [key]: e.target.value })}
                  placeholder="https://i.ibb.co/..."
                  style={{ background: '#1E293B', border: `1px solid ${color}44`, borderRadius: 8, color: '#fff', padding: '8px 12px', fontSize: 13, width: '100%' }} />
              </div>
            </div>
          ))}

          <button onClick={saveAllSettings} disabled={loading} style={{ background: '#16A34A', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', width: '100%', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
            {loading ? '⏳...' : '✅ Save Photos — All Views Update!'}
          </button>
        </div>
      )}

      {msg && (
        <div style={{ marginTop: 16, padding: '12px 16px', background: msg.includes('✅') ? '#16A34A22' : '#DC262622', border: `1px solid ${msg.includes('✅') ? '#16A34A' : '#DC2626'}`, borderRadius: 8, fontSize: 14, fontWeight: 600, color: msg.includes('✅') ? '#22C55E' : '#EF4444' }}>
          {msg}
        </div>
      )}

      {/* URLs reference */}
      <div style={{ marginTop: 24, background: '#111827', borderRadius: 12, padding: 16, border: '1px solid #1E293B' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#F59E0B', marginBottom: 10 }}>📺 OBS Browser Source URLs</div>
        {[
          { url: '/', label: 'Full Dashboard' },
          { url: '/top', label: 'Top Bar only' },
          { url: '/left', label: 'Left Cards only' },
          { url: '/center', label: 'Center Views only' },
          { url: '/bottom', label: 'Bottom Bar only' },
          { url: '/admin', label: 'Admin Panel' },
        ].map(({ url, label }) => (
          <div key={url} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #1E293B', fontSize: 13 }}>
            <span style={{ color: '#94A3B8' }}>{label}</span>
            <span style={{ color: '#38BDF8', fontFamily: 'monospace' }}>your-domain.vercel.app{url}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
