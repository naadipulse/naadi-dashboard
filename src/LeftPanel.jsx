import React from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, AnimNum, Photo, MAJORITY } from './shared.jsx'

export default function LeftPanel() {
  const settings = useSettings()
  const { gT, gW, gL } = useTally()

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  const sorted = Object.keys(PARTY_DEFAULTS).sort((a, b) => gT(b) - gT(a))
  const top3 = sorted.slice(0, 3)

  return (
    <div style={{ fontFamily: ff, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', padding: 10, background: 'transparent' }}>
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
            borderRadius: 14, padding: '12px 16px',
            boxShadow: hasMaj ? `0 0 20px ${cfg.color}44` : '0 3px 8px rgba(0,0,0,0.08)',
            transition: 'all 0.5s', flex: 1,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Accent top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: cfg.color }} />

            {rank === 0 && tot > 0 && (
              <div style={{ position: 'absolute', top: 8, right: 10, fontSize: fsm - 1, color: '#F59E0B', fontWeight: 800 }}>🥇 முன்னிலை</div>
            )}
            {hasMaj && (
              <div style={{ textAlign: 'center', background: cfg.color, color: '#fff', fontSize: fsm, fontWeight: 800, borderRadius: 6, padding: '2px 0', marginBottom: 8, animation: 'pulse 1.5s infinite' }}>
                🏆 பெரும்பான்மை!
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, marginTop: 6 }}>
              <Photo photoUrl={photoUrl} fallback={cfg.short.slice(0, 2)} color={cfg.color} size={Math.max(40, fm * 2)} />
              <div>
                <div style={{ color: cfg.color, fontWeight: 900, fontSize: fm + 2 }}>{cfg.label}</div>
                <div style={{ color: '#6B7280', fontSize: fsm }}>{cfg.leader}</div>
              </div>
            </div>

            {/* Numbers */}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 10 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: fsm, color: '#6B7280' }}>மொத்தம்</div>
                <AnimNum val={tot} color={cfg.color} size={fs} font={ff} />
              </div>
              <div style={{ width: 1, background: '#E5E7EB' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: fsm, color: '#6B7280' }}>வென்றது</div>
                <AnimNum val={won} color="#16A34A" size={fm + 4} font={ff} />
              </div>
              <div style={{ width: 1, background: '#E5E7EB' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: fsm, color: '#6B7280' }}>முன்னிலை</div>
                <AnimNum val={lead} color="#D97706" size={fm + 4} font={ff} />
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ background: '#E5E7EB', borderRadius: 999, height: 10, overflow: 'hidden' }}>
              <div style={{ background: cfg.color, width: `${pct}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
              <span style={{ fontSize: fsm - 2, color: '#9CA3AF' }}>0</span>
              <span style={{ fontSize: fsm - 1, color: '#374151', fontWeight: 600 }}>🎯 118</span>
            </div>
          </div>
        )
      })}

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
      `}</style>
    </div>
  )
}
