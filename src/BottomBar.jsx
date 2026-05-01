import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSettings, useTally, PARTY_DEFAULTS, AnimNum, Photo, MAJORITY, TOTAL } from './shared.jsx'

const BOTTOM_PARTIES = {
  ...PARTY_DEFAULTS,
  'Others': { ...PARTY_DEFAULTS['Others'], label: 'நாதக', short: 'NTK', color: '#4B5563' }
}

export default function BottomBar() {
  const settings = useSettings()
  const { gT, totalDeclared } = useTally()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })

  const logoUrl = settings.naadi_logo
    ? settings.naadi_logo.replace('https://ibb.co/', 'https://i.ibb.co/')
    : null

  return (
    <div style={{ fontFamily: ff, display: 'flex', height: '100%', borderTop: '3px solid #DC2626' }}>

      {/* Box 1 — முன்னிலை */}
      <div style={{
        background: '#1E293B', minWidth: 120,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderRight: '2px solid #334155', padding: '0 12px',
      }}>
        <div style={{ fontSize: fsm, color: '#94A3B8', fontWeight: 700 }}>முன்னிலை</div>
        <AnimNum val={totalDeclared} color="#F59E0B" size={fs * 0.85} font={ff} />
        <div style={{ width: '85%', height: 4, background: '#334155', borderRadius: 999, marginTop: 4 }}>
          <div style={{ height: '100%', background: '#F59E0B', borderRadius: 999, width: `${(totalDeclared / TOTAL) * 100}%`, transition: 'width 1s ease' }} />
        </div>
        <div style={{ fontSize: fm, color: '#94A3B8', fontWeight: 700, marginTop: 3 }}>{TOTAL}</div>
      </div>

      {/* Party boxes — CSS animation, no state */}
      {Object.entries(BOTTOM_PARTIES).map(([p, cfg]) => {
        const tot = gT(p)
        const hasMaj = tot >= MAJORITY
        const photoUrl = settings[PARTY_DEFAULTS[p].photoKey]

        return (
          <div
            key={p}
            style={{
              flex: 1,
              background: cfg.color,
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '0 16px', borderRight: '2px solid rgba(255,255,255,0.2)',
              position: 'relative', overflow: 'hidden',
              animation: 'partyPulse 5s ease-in-out infinite',
              boxShadow: hasMaj ? `inset 0 0 40px rgba(255,255,255,0.15)` : 'none',
            }}>

            {/* Shimmer */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',
              animation: 'shimmer 5s linear infinite',
              zIndex: 0,
            }} />

            <Photo
              photoUrl={photoUrl}
              fallback={cfg.short.slice(0, 2)}
              color="#fff"
              size={Math.max(50, fm * 2.5)}
            />

            <div style={{ zIndex: 1 }}>
              {hasMaj && (
                <div style={{
                  fontSize: fsm - 2, color: '#fff', fontWeight: 800,
                  background: 'rgba(0,0,0,0.2)', borderRadius: 4,
                  padding: '1px 6px', display: 'inline-block', marginBottom: 2,
                  animation: 'blink 1.5s infinite',
                }}>
                  🏆 பெரும்பான்மை!
                </div>
              )}
              <div style={{ fontSize: fm, color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>
                {cfg.label}
              </div>
              <div style={{
                fontSize: fs, fontWeight: 900, lineHeight: 1, color: '#fff',
                animation: 'numPop 5s ease-in-out infinite',
              }}>
                {tot}
              </div>
            </div>
          </div>
        )
      })}

      {/* Naadi Logo + LIVE + Time */}
      <div style={{
        background: '#0F172A', minWidth: 140,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderLeft: '2px solid #334155',
        padding: '0 12px', gap: 5,
      }}>
        {logoUrl ? (
          <img
            src={logoUrl}
            alt="நாடி"
            style={{ height: 32, maxWidth: 120, objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none' }}
          />
        ) : (
          <div style={{
            fontSize: fm + 6, fontWeight: 900,
            background: 'linear-gradient(90deg,#F59E0B,#DC2626)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>நாடி</div>
        )}

        <div style={{
          background: '#DC2626', color: '#fff',
          fontSize: fsm, fontWeight: 900,
          padding: '3px 14px', borderRadius: 4,
          letterSpacing: 1,
          animation: 'blink 1.5s infinite',
        }}>● LIVE</div>

        <div style={{ fontSize: fm, color: '#F59E0B', fontWeight: 700 }}>{timeStr}</div>
      </div>

      <style>{`
        @keyframes partyPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          10% { transform: scale(1.04); filter: brightness(1.2); }
          20% { transform: scale(1); filter: brightness(1); }
        }
        @keyframes numPop {
          0%, 100% { transform: scale(1); color: #fff; }
          10% { transform: scale(1.3); color: #FDE68A; }
          20% { transform: scale(1); color: #fff; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          15% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
