import React from 'react'
import { useSettings, useTally, useConstituencies, PARTY_DEFAULTS, AnimNum, Photo, MAJORITY } from './shared.jsx'

const DISTRICTS = [
  { name: 'மதுரை', key: 'madurai' },
  { name: 'சிவகங்கை', key: 'sivagangai' },
  { name: 'திருநெல்வேலி', key: 'tirunelveli' },
  { name: 'கோவை', key: 'coimbatore' },
  { name: 'சேலம்', key: 'salem' },
  { name: 'திருச்சி', key: 'trichy' },
  { name: 'வேலூர்', key: 'vellore' },
  { name: 'தஞ்சாவூர்', key: 'thanjavur' },
  { name: 'விருதுநகர்', key: 'virudhunagar' },
  { name: 'தூத்துக்குடி', key: 'tuticorin' },
]

export default function LeftPanel() {
  const settings = useSettings()
  const { gT, gW, gL } = useTally()
  const constituencies = useConstituencies()

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  // Group constituencies by district
  const districtResults = DISTRICTS.map(district => {
    const distConsts = constituencies.filter(c =>
      c.name?.toLowerCase().includes(district.key) ||
      c.name_tamil?.includes(district.name)
    )
    return { ...district, constituencies: distConsts }
  })

  // Get sorted parties for top display
  const sorted = Object.keys(PARTY_DEFAULTS).sort((a, b) => gT(b) - gT(a))
  const top3 = sorted.slice(0, 3)

  return (
    <div style={{ fontFamily: ff, display: 'flex', flexDirection: 'column', gap: 8, height: '100%', padding: 8, background: 'transparent', overflow: 'hidden' }}>

      {/* Top 3 party cards */}
      {top3.map((p, rank) => {
        const cfg = PARTY_DEFAULTS[p]
        const tot = gT(p), won = gW(p), lead = gL(p)
        const hasMaj = tot >= MAJORITY
        const pct = Math.min((tot / MAJORITY) * 100, 100)
        const photoUrl = settings[cfg.photoKey]

        return (
          <div key={p} style={{
            background: hasMaj ? cfg.light : '#fff',
            border: `2px solid ${hasMaj ? cfg.color : '#E5E7EB'}`,
            borderRadius: 12, padding: '10px 14px',
            boxShadow: hasMaj ? `0 0 20px ${cfg.color}44` : '0 2px 6px rgba(0,0,0,0.08)',
            transition: 'all 0.5s',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: cfg.color }} />
            {rank === 0 && tot > 0 && (
              <div style={{ position: 'absolute', top: 7, right: 8, fontSize: fsm - 2, color: '#F59E0B', fontWeight: 800 }}>🥇 முன்னிலை</div>
            )}
            {hasMaj && (
              <div style={{ textAlign: 'center', background: cfg.color, color: '#fff', fontSize: fsm - 1, fontWeight: 800, borderRadius: 5, padding: '1px 0', marginBottom: 6, animation: 'pulse 1.5s infinite' }}>
                🏆 பெரும்பான்மை!
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 }}>
              <Photo photoUrl={photoUrl} fallback={cfg.short.slice(0, 2)} color={cfg.color} size={38} />
              <div>
                <div style={{ color: cfg.color, fontWeight: 900, fontSize: fm }}>{cfg.label}</div>
                <div style={{ color: '#6B7280', fontSize: fsm - 2 }}>{cfg.leader}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: fsm - 2, color: '#6B7280' }}>மொத்தம்</div>
                <AnimNum val={tot} color={cfg.color} size={fs - 4} font={ff} />
              </div>
              <div style={{ width: 1, background: '#E5E7EB' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: fsm - 2, color: '#6B7280' }}>வென்றது</div>
                <AnimNum val={won} color="#16A34A" size={fm + 2} font={ff} />
              </div>
              <div style={{ width: 1, background: '#E5E7EB' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: fsm - 2, color: '#6B7280' }}>முன்னிலை</div>
                <AnimNum val={lead} color="#D97706" size={fm + 2} font={ff} />
              </div>
            </div>
            <div style={{ background: '#E5E7EB', borderRadius: 999, height: 6, overflow: 'hidden' }}>
              <div style={{ background: cfg.color, width: `${pct}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease' }} />
            </div>
          </div>
        )
      })}

      {/* District wise results — Polimer News style */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: fm - 2, fontWeight: 800, color: '#374151', padding: '4px 8px', background: '#F3F4F6', borderRadius: 6 }}>
          மாவட்டவாரி முன்னிலை
        </div>

        {districtResults.map((district, di) => {
          const declared = district.constituencies.filter(c => c.leading_party && c.leading_party !== 'pending')

          return (
            <div key={di} style={{ background: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {/* District header */}
              <div style={{ background: '#DC2626', padding: '4px 10px' }}>
                <span style={{ fontSize: fm - 2, fontWeight: 800, color: '#fff' }}>{district.name}</span>
              </div>

              {/* Constituency rows */}
              {declared.length === 0 ? (
                <div style={{ padding: '6px 10px', fontSize: fsm - 2, color: '#9CA3AF' }}>⏳ தொடங்கவில்லை</div>
              ) : (
                declared.slice(0, 3).map((c, i) => {
                  const lp = PARTY_DEFAULTS[c.leading_party] || PARTY_DEFAULTS['Others']
                  return (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '5px 10px', borderTop: i > 0 ? '1px solid #F3F4F6' : 'none',
                      animation: `slideIn 0.3s ease ${i * 0.05}s both`,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: fsm - 1, fontWeight: 600, color: '#111827' }}>
                          {c.name_tamil || c.name}
                        </div>
                        <div style={{ fontSize: fsm - 3, color: '#9CA3AF' }}>
                          {c.status === 'declared' ? 'முடிவு' : 'முன்னிலை'}
                          {c.lead_margin > 0 && ` +${c.lead_margin}`}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {/* Party symbol placeholder */}
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: lp.color + '22', border: `1px solid ${lp.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, color: lp.color, fontWeight: 700 }}>
                          {lp.short.slice(0, 2)}
                        </div>
                        <span style={{ fontSize: fsm - 1, color: lp.color, fontWeight: 800 }}>முன்னிலை</span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
    </div>
  )
}
