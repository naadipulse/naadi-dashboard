import React from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, AnimNum, Photo, MAJORITY, TOTAL } from './shared.jsx'

export default function BottomBar() {
  const settings = useSettings()
  const { gT, gW, gL, totalDeclared } = useTally()

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  return (
    <div style={{ fontFamily: ff, display: 'flex', height: '100%', borderTop: '3px solid #DC2626' }}>

      {/* Box 1 — முன்னிலை */}
      <div style={{
        background: '#1E293B', minWidth: 120,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        borderRight: '2px solid #334155', padding: '0 14px',
      }}>
        <div style={{ fontSize: fsm, color: '#94A3B8', fontWeight: 700, letterSpacing: 1 }}>முன்னிலை</div>
        <AnimNum val={totalDeclared} color="#F59E0B" size={fs * 0.9} font={ff} />
        <div style={{ width: '85%', height: 4, background: '#334155', borderRadius: 999, marginTop: 5 }}>
          <div style={{ height: '100%', background: '#F59E0B', borderRadius: 999, width: `${(totalDeclared / TOTAL) * 100}%`, transition: 'width 1s ease' }} />
        </div>
        <div style={{ fontSize: fsm - 1, color: '#64748B', marginTop: 3 }}>{TOTAL}</div>
      </div>

      {/* Party boxes */}
      {Object.entries(PARTY_DEFAULTS).map(([p, cfg]) => {
        const tot = gT(p), won = gW(p), lead = gL(p)
        const hasMaj = tot >= MAJORITY
        const photoUrl = settings[cfg.photoKey]

        return (
          <div key={p} style={{
            flex: 1, background: cfg.color,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '0 18px', borderRight: '2px solid rgba(255,255,255,0.2)',
            position: 'relative', overflow: 'hidden', transition: 'all 0.5s',
            boxShadow: hasMaj ? `inset 0 0 40px rgba(255,255,255,0.15)` : 'none',
          }}>
            {/* Shimmer on majority */}
            {hasMaj && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.12) 50%,transparent 100%)', animation: 'shimmer 2s linear infinite', zIndex: 0 }} />}

            {/* Photo */}
            <Photo photoUrl={photoUrl} fallback={cfg.short.slice(0, 2)} color="#fff" size={Math.max(48, fm * 2.5)} />

            {/* Label + Big number */}
            <div style={{ flex: 1, zIndex: 1 }}>
              {hasMaj && (
                <div style={{ fontSize: fsm - 1, color: '#fff', fontWeight: 800, background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: '1px 6px', display: 'inline-block', marginBottom: 3, animation: 'pulse 1.5s infinite' }}>
                  🏆 பெரும்பான்மை!
                </div>
              )}
              <div style={{ fontSize: fm, color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>{cfg.label}</div>
              <AnimNum val={tot} color="#fff" size={fs} font={ff} />
            </div>

            {/* Won / Leading */}
            {/*
            <div style={{ textAlign: 'right', zIndex: 1 }}>
              <div style={{ fontSize: fsm, color: 'rgba(255,255,255,0.7)' }}>வென்றது</div>
              <div style={{ fontSize: fm + 4, fontWeight: 900, color: '#fff' }}>{won}</div>              
              <div style={{ fontSize: fsm, color: 'rgba(255,255,255,0.7)', marginTop: 3 }}>முன்னிலை</div>
              <div style={{ fontSize: fm + 4, fontWeight: 900, color: '#FDE68A' }}>{lead}</div>
              
            </div>
            */}
          </div>
        )
      })}

      <style>{`
        @keyframes shimmer{0%{transform:translateX(-150%)}100%{transform:translateX(150%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
      `}</style>
    </div>
  )
}
