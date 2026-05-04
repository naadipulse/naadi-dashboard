import React, { useState, useEffect } from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, Photo, AnimNum, getComponentFonts } from './shared.jsx'

export default function LeftPanel() {
  const settings = useSettings()
  const { gT, tally } = useTally()
  const [animationTick, setAnimationTick] = useState(0)

  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'left')

  // Trigger animation every 5 seconds for vote updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTick(prev => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Get parties sorted by total votes (descending), only those with won seats
  const sortedParties = ['TVK', 'AIADMK+', 'DMK+', 'Others']
    .filter(p => {
      const totalVotes = gT(p)
      return totalVotes > 0
    })
    .sort((a, b) => gT(b) - gT(a))

  return (
    <div style={{ fontFamily: ff, display: 'flex', flexDirection: 'column', gap: 10, height: '100%', padding: '0' }}>
      {/* Header */}
      <div style={{
        fontSize: fm - 2, fontWeight: 800, color: '#fff',
        padding: '10px 12px', background: '#1E293B',
        borderRadius: 8, textAlign: 'center', flexShrink: 0,
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        🏆 வெற்றி
      </div>

      {/* Party Cards - Scrollable */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto', paddingRight: 4 }}>
        {sortedParties.map((p, idx) => {
          const cfg = PARTY_DEFAULTS[p]
          const votes = gT(p)
          const photoUrl = settings[cfg.photoKey]

          return (
            <div
              key={`${p}-${idx}`}
              style={{
                background: cfg.color,
                borderRadius: 10,
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                flexShrink: 0,
                transition: 'transform 0.3s ease, order 0.3s ease',
              }}>

              {/* Shimmer Effect */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)',
                animation: 'shimmer 5s linear infinite',
                zIndex: 0,
              }} />

              {/* Party Photo */}
              <Photo
                photoUrl={photoUrl}
                fallback={cfg.short.slice(0, 2)}
                color="#fff"
                size={60}
                style={{ zIndex: 1, flexShrink: 0 }}
              />

              {/* Party Info */}
              <div style={{ zIndex: 1, flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: fm - 2,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.95)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {cfg.label}
                </div>
                <div
                  key={`${votes}-${animationTick}`}
                  style={{
                    fontSize: fs - 8,
                    fontWeight: 900,
                    color: '#fff',
                    lineHeight: '1',
                    animation: 'numFlip 0.8s ease-out',
                    display: 'inline-block',
                    backfaceVisibility: 'hidden',
                    transformOrigin: 'center center',
                    transformStyle: 'preserve-3d'
                  }}>
                  <AnimNum val={votes} color="#fff" size={fs - 8} font={ff} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
