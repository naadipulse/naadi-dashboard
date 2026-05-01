import React, { useState, useEffect } from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, AnimNum, Photo, MAJORITY, TOTAL } from './shared.jsx'

// Override Others label to NTK for bottom bar
const BOTTOM_PARTIES = {
  ...PARTY_DEFAULTS,
  'Others': { ...PARTY_DEFAULTS['Others'], label: 'NTK', short: 'NTK' }
}

export default function BottomBar() {
  const settings = useSettings()
  const { gT, gW, gL, totalDeclared } = useTally()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

  return (
    <div style={{ fontFamily: ff, display: 'flex', height: '100%', borderTop: '3px solid #DC2626' }}>

      {/* Box 1 — முன்னிலை count */}
      <div style={{
        background: '#1E293B', minWidth: 110,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderRight: '2px solid #334155', padding: '0 12px',
      }}>
        <div style={{ fontSize: fsm - 1, color: '#94A3B8', fontWeight: 700, letterSpacing: 1 }}>முன்னிலை</div>
        <AnimNum val={totalDeclared} color="#F59E0B" size={fs * 0.85} font={ff} />
        <div style={{ width: '85%', height: 4, background: '#334155', borderRadius: 999, marginTop: 4 }}>
          <div style={{ height: '100%', background: '#F59E0B', borderRadius: 999, width: `${(totalDeclared / TOTAL) * 100}%`, transition: 'width 1s ease' }} />
        </div>
        <div style={{ fontSize: fsm - 2, color: '#64748B', marginTop: 2 }}>{TOTAL}</div>
      </div>

      {/* Party boxes */}
      {Object.entries(BOTTOM_PARTIES).map(([p, cfg]) => {
        const tot = gT(p), won = gW(p), lead = gL(p)
        const hasMaj = tot >= MAJORITY
        const photoUrl = settings[PARTY_DEFAULTS[p].photoKey]

        return (
          <div key={p} style={{
            flex: 1, background: cfg.color,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '0 14px', borderRight: '2px solid rgba(255,255,255,0.2)',
            position: 'relative', overflow: 'hidden',
            boxShadow: hasMaj ? `inset 0 0 40px rgba(255,255,255,0.15)` : 'none',
          }}>
            {hasMaj && (
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)', animation: 'shimmer 2s linear infinite', zIndex: 0 }} />
            )}

            {/* Photo */}
            <Photo photoUrl={photoUrl} fallback={cfg.short.slice(0, 2)} color="#fff" size={Math.max(44, fm * 2.2)} />

            {/* Label + Number */}
            <div style={{ flex: 1, zIndex: 1 }}>
              {hasMaj && (
                <div style={{ fontSize: fsm - 2, color: '#fff', fontWeight: 800, background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: '1px 6px', display: 'inline-block', marginBottom: 2, animation: 'pulse 1.5s infinite' }}>
                  🏆 பெரும்பான்மை!
                </div>
              )}
              <div style={{ fontSize: fm - 1, color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>{cfg.label}</div>
              <AnimNum val={tot} color="#fff" size={fs - 2} font={ff} />
            </div>

            {/* Won / Leading */}
            <div style={{ textAlign: 'right', zIndex: 1 }}>
              <div style={{ fontSize: fsm - 2, color: 'rgba(255,255,255,0.7)' }}>வென்றது</div>
              <div style={{ fontSize: fm + 2, fontWeight: 900, color: '#fff' }}>{won}</div>
              <div style={{ fontSize: fsm - 2, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>முன்னிலை</div>
              <div style={{ fontSize: fm + 2, fontWeight: 900, color: '#FDE68A' }}>{lead}</div>
            </div>
          </div>
        )
      })}

      {/* Naadi Logo + LIVE + Time */}
      <div style={{
        background: '#0F172A',
        minWidth: 130,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderLeft: '2px solid #334155',
        padding: '0 12px', gap: 4,
      }}>
        {/* Naadi Logo */}
        <div style={{
          fontSize: fm + 2, fontWeight: 900,
          background: 'linear-gradient(90deg,#F59E0B,#DC2626)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>நாடி</div>

        {/* LIVE badge */}
        <div style={{
          background: '#DC2626', color: '#fff',
          fontSize: fsm - 1, fontWeight: 900,
          padding: '2px 10px', borderRadius: 4,
          animation: 'blink 1.5s infinite',
          letterSpacing: 1,
        }}>● LIVE</div>

        {/* Time */}
        <div style={{ fontSize: fsm, color: '#94A3B8', fontWeight: 600 }}>
          {timeStr}
        </div>

        {/* Date */}
        <div style={{ fontSize: fsm - 3, color: '#475569' }}>May 4, 2026</div>
      </div>

      <style>{`
        @keyframes shimmer{0%{transform:translateX(-150%)}100%{transform:translateX(150%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </div>
  )
}
