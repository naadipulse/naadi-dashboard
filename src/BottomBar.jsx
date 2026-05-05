import React, { useState, useEffect } from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, INDIVIDUAL_PARTIES, AnimNum, Photo, MAJORITY, TOTAL, getComponentFonts } from './shared.jsx'

export default function BottomBar({ mode = 'alliance' }) {
  const settings = useSettings()
  const { gT, totalDeclared } = useTally()
  const partiesCfg = mode === 'individual' ? INDIVIDUAL_PARTIES : PARTY_DEFAULTS
  const [time, setTime] = useState(new Date())
  const [animationTick, setAnimationTick] = useState(0); // New state for animation trigger

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // New useEffect to trigger animation every 5 seconds
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAnimationTick(prev => prev + 1);
    }, 5000); // Trigger every 5 seconds
    return () => clearInterval(animationInterval);
  }, []); // Run once on mount

  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'bottom')

  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true
  })

  const logoUrl = settings.naadi_logo
    ? settings.naadi_logo.trim().replace('https://ibb.co/', 'https://i.ibb.co/')
    : null
  const hasLogo = !!(logoUrl && logoUrl.length > 5)

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
        <div key={`${totalDeclared}-${animationTick}`} style={{ 
          animation: 'numFlip 0.8s ease-out', 
          perspective: '1200px',
          display: 'inline-block',
          backfaceVisibility: 'hidden',
          transformOrigin: 'center center',
          transformStyle: 'preserve-3d'
        }}>
          <AnimNum val={totalDeclared} color="#F59E0B" size={fs * 0.85} font={ff} />
        </div>
        <div style={{ width: '85%', height: 4, background: '#334155', borderRadius: 999, marginTop: 4 }}>
          <div style={{ height: '100%', background: '#F59E0B', borderRadius: 999, width: `${(totalDeclared / TOTAL) * 100}%`, transition: 'width 1s ease' }} />
        </div>
        <div style={{ fontSize: fm, color: '#94A3B8', fontWeight: 700, marginTop: 3 }}>{TOTAL}</div>
      </div>

      {/* Party boxes — sorted by votes, CSS animation, no state */}
      {Object.entries(partiesCfg)
        .filter(([p]) => mode === 'individual' || p !== 'Others')
        .sort((a, b) => gT(b[0]) - gT(a[0]))
        .slice(0, mode === 'individual' ? 6 : 3)
        .map(([p, cfg]) => {
        const tot = gT(p)
        const hasMaj = tot >= MAJORITY
        const photoUrl = settings[cfg.photoKey]
        const partyLogo = settings[cfg.logoKey] || cfg.logo

        return (
          <div
            key={p}
            style={{
              flex: 1,
              background: cfg.color,
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '0 12px 0 0', borderRight: '2px solid rgba(255,255,255,0.2)',
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
              size={110}
              style={{ height: '100%', width: 'auto', minWidth: 100, zIndex: 1 }}
            />

            {partyLogo && (
              <img src={partyLogo} alt="" 
                style={{ height: '80%', width: 'auto', position: 'absolute', bottom: 5, right: 10, opacity: 0.6, zIndex: 1 }} />
            )}

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
              <div style={{ fontSize: fm + 2, color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>
                {cfg.label}
              </div>
              <div
                key={`${tot}-${animationTick}`} // Modified key to include animationTick
                style={{
                  fontSize: fs + 6, fontWeight: 900, lineHeight: '1', color: '#fff',
                  animation: 'numFlip 0.8s ease-out', 
                  perspective: '1200px',
                  display: 'inline-block',
                  backfaceVisibility: 'hidden',
                  transformOrigin: 'center center',
                  transformStyle: 'preserve-3d'
                }}>
                <AnimNum val={tot} color="#fff" size={fs + 6} font={ff} />
              </div>
            </div>
          </div>
        )
      })}

      {/* Naadi Logo + LIVE + Time */}
      <div style={{
        background: '#0F172A', minWidth: 180,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderLeft: '2px solid #334155',
        padding: '2px 15px', gap: 1,
        overflow: 'hidden'
      }}>
        {hasLogo ? (
          <div style={{ height: '50%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={logoUrl}
              alt="நாடி"
              style={{ 
                height: '100%', 
                width: 'auto', 
                maxWidth: '100%', 
                objectFit: 'contain' 
              }}
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
        ) : (
          <div style={{
            fontSize: fm + 6, fontWeight: 900,
            background: 'linear-gradient(90deg,#F59E0B,#DC2626)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>நாடி</div>
        )}

        <div style={{
          background: '#DC2626', color: '#fff',
          fontSize: fsm - 2, fontWeight: 900,
          padding: '1px 10px', borderRadius: 4,
          letterSpacing: 1,
          animation: 'blink 1.5s infinite',
        }}>● LIVE</div>

        <div style={{ fontSize: fm - 2, color: '#F59E0B', fontWeight: 700 }}>{timeStr}</div>
      </div>

      <style>{`
        @keyframes partyPulse {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          10% { transform: scale(1.04); filter: brightness(1.2); }
          20% { transform: scale(1); filter: brightness(1); }
        }
        @keyframes numFlip {
          0% { transform: rotateX(-180deg); opacity: 0; }
          100% { transform: rotateX(0deg); opacity: 1; }
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
