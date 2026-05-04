import React, { useState, useEffect } from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, Photo, AnimNum, getComponentFonts, MAJORITY } from './shared.jsx'

export default function LeftPanel() {
  const settings = useSettings()
  const { gW, gP, tally } = useTally()
  const [animationTick, setAnimationTick] = useState(0)

  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'left')

  // Trigger animation every 5 seconds for vote updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTick(prev => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const parties = ['DMK+', 'AIADMK+', 'TVK', 'Others']

  return (
    <div style={{ fontFamily: ff, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      
      {/* SECTION 1: VETTRI (WON) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontSize: fm - 4, fontWeight: 800, color: '#fff',
          padding: '8px 12px', background: '#1E293B',
          borderRadius: 8, textAlign: 'center', flexShrink: 0,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          🏆 வெற்றி (Won)
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {parties.map((p) => {
            const cfg = PARTY_DEFAULTS[p]
            const won = gW(p)
            const photoUrl = settings[cfg.photoKey]
            const isMaj = won >= MAJORITY

            return (
              <div key={`won-${p}`} style={{
                background: cfg.color, borderRadius: 10, padding: '0 15px 0 0',
                display: 'flex', alignItems: 'center', gap: 10, color: '#fff',
                position: 'relative', overflow: 'hidden', flex: 1,
                boxShadow: isMaj ? `0 0 15px ${cfg.color}` : '0 2px 6px rgba(0,0,0,0.1)',
              }}>
                <Photo photoUrl={photoUrl} fallback={cfg.short} color="#fff" size={90} style={{ height: '100%', width: 85, zIndex: 1, objectFit: 'cover' }} />
                <div style={{ zIndex: 1, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: fm + 4, fontWeight: 900 }}>{cfg.label}</div>
                  <div key={`w-${won}-${animationTick}`} style={{
                    fontSize: fs - 10, fontWeight: 950, animation: 'numFlip 0.8s ease-out',
                    display: 'inline-block', backfaceVisibility: 'hidden', transformStyle: 'preserve-3d'
                  }}>
                    <AnimNum val={won} color="#fff" size={fs - 10} font={ff} />
                  </div>
                </div>
                {isMaj && <div style={{ position: 'absolute', right: 5, top: 5, fontSize: 18, zIndex: 2 }}>👑</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* SECTION 2: VOTE SHARE (%) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          fontSize: fm - 4, fontWeight: 800, color: '#fff',
          padding: '8px 12px', background: '#1E293B',
          borderRadius: 8, textAlign: 'center', flexShrink: 0,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          📊 வாக்கு சதவீதம் (Vote %)
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {parties.map((p) => {
            const cfg = PARTY_DEFAULTS[p]
            const pct = gP(p)
            return (
              <div key={`pct-${p}`} style={{
                background: '#fff', borderRadius: 10, padding: '8px 15px',
                borderLeft: `6px solid ${cfg.color}`,
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: fm, fontWeight: 900, color: cfg.color }}>{cfg.label}</div>
                  <div key={`p-${pct}-${animationTick}`} style={{
                    fontSize: fm + 2, fontWeight: 900, color: '#111827',
                    animation: 'numFlip 0.8s ease-out', display: 'inline-block'
                  }}>
                    {pct.toFixed(1)}<span style={{ fontSize: fsm, marginLeft: 1, color: '#64748B' }}>%</span>
                  </div>
                </div>
                <div style={{ height: 6, background: '#F1F5F9', borderRadius: 3, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${pct}%`, height: '100%', background: cfg.color,
                    transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes numFlip {
          0% { transform: rotateX(-180deg); opacity: 0; }
          100% { transform: rotateX(0deg); opacity: 1; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          15% { transform: translateX(150%); }
          100% { transform: translateX(150%); }
        }
      `}</style>
    </div>
  )
}
