import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings, useTally, PARTY_DEFAULTS, AnimNum, Photo, MAJORITY, TOTAL } from './shared.jsx'

// Override Others label to நாதக for bottom bar
const BOTTOM_PARTIES = {
  ...PARTY_DEFAULTS,
  'Others': { ...PARTY_DEFAULTS['Others'], label: 'நாதக', short: 'NTK' }
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
        background: '#1E293B', minWidth: 120,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        borderRight: '2px solid #334155', padding: '0 12px',
      }}>
        <div style={{ fontSize: fsm, color: '#94A3B8', fontWeight: 700, letterSpacing: 1 }}>முன்னிலை</div>
        <AnimNum val={totalDeclared} color="#F59E0B" size={fs * 0.85} font={ff} />
        <div style={{ width: '85%', height: 4, background: '#334155', borderRadius: 999, marginTop: 4 }}>
          <div style={{ height: '100%', background: '#F59E0B', borderRadius: 999, width: `${(totalDeclared / TOTAL) * 100}%`, transition: 'width 1s ease' }} />
        </div>
        <div style={{ fontSize: fm, color: '#94A3B8', fontWeight: 700, marginTop: 3 }}>{TOTAL}</div>
      </div>

      {/* Party boxes with framer-motion */}
      {Object.entries(BOTTOM_PARTIES).map(([p, cfg]) => {
        const tot = gT(p), won = gW(p), lead = gL(p)
        const hasMaj = tot >= MAJORITY
        const photoUrl = settings[PARTY_DEFAULTS[p].photoKey]

        return (
          <motion.div
            key={p}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              flex: 1, background: cfg.color,
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '0 16px', borderRight: '2px solid rgba(255,255,255,0.2)',
              position: 'relative', overflow: 'hidden',
              boxShadow: hasMaj ? `inset 0 0 40px rgba(255,255,255,0.15)` : 'none',
            }}>

            {hasMaj && (
              <motion.div
                style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)', zIndex: 0 }}
                animate={{ x: ['-150%', '150%'] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              />
            )}

            {/* Photo */}
            <Photo photoUrl={photoUrl} fallback={cfg.short.slice(0, 2)} color="#fff" size={Math.max(50, fm * 2.5)} />

            {/* Label + Number only */}
            <div style={{ zIndex: 1, textAlign: 'left' }}>
              {hasMaj && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  style={{ fontSize: fsm - 2, color: '#fff', fontWeight: 800, background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: '1px 6px', display: 'inline-block', marginBottom: 2 }}>
                  🏆 பெரும்பான்மை!
                </motion.div>
              )}
              <div style={{ fontSize: fm, color: 'rgba(255,255,255,0.9)', fontWeight: 800 }}>{cfg.label}</div>
              {/* Animated number with flash on change */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tot}
                  initial={{ scale: 1.4, color: '#FDE68A' }}
                  animate={{ scale: 1, color: '#ffffff' }}
                  transition={{ duration: 0.4 }}
                  style={{ fontSize: fs, fontWeight: 900, lineHeight: 1 }}
                >
                  {tot}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
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
        {/* Logo or text */}
        {settings.naadi_logo && settings.naadi_logo.startsWith('http') ? (
          <img
            src={settings.naadi_logo}
            alt="நாடி"
            style={{ height: 40, maxWidth: 120, objectFit: 'contain' }}
            onError={e => e.target.style.display = 'none'}
          />
        ) : (
          <div style={{
            fontSize: fm + 6, fontWeight: 900,
            background: 'linear-gradient(90deg,#F59E0B,#DC2626)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>நாடி</div>
        )}

        {/* LIVE */}
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{
            background: '#DC2626', color: '#fff',
            fontSize: fsm, fontWeight: 900,
            padding: '3px 14px', borderRadius: 4,
            letterSpacing: 1,
          }}>
          ● LIVE
        </motion.div>

        {/* Time */}
        <div style={{ fontSize: fm, color: '#F59E0B', fontWeight: 700 }}>{timeStr}</div>
        <div style={{ fontSize: fsm - 2, color: '#475569', letterSpacing: 1 }}>TAMILNADU</div>
      </div>

      <style>{`
        @keyframes shimmer{0%{transform:translateX(-150%)}100%{transform:translateX(150%)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </div>
  )
}
