import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings, useTally, PARTY_DEFAULTS, AnimNum, Photo, MAJORITY, TOTAL } from './shared.jsx'

export default function BottomBar() {
  const settings = useSettings()
  const { gT, totalDeclared } = useTally()
  const [key, setKey] = useState(0)

  // Force a re-animation every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => setKey(prev => prev + 1), 5000)
    return () => clearInterval(timer)
  }, [])

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  // Mapping configurations to match your instructions
  const partyConfigMap = {
    'DMK+': { color: '#DC2626', label: 'திமுக+', photoKey: 'photo_stalin' },
    'ADMK+': { color: '#16A34A', label: 'அதிமுக+', photoKey: 'photo_eps' },
    'TVK': { color: '#F59E0B', label: 'தவெக', photoKey: 'photo_tvk_leader' },
    'NTK': { color: '#22C55E', label: 'நாம் தமிழர்', photoKey: 'photo_seeman' }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'transparent' }}>
      
      {/* MAIN DATA BAR - 140px Height */}
      <div style={{ 
        fontFamily: ff, 
        display: 'flex', 
        height: 140, 
        background: '#0F172A',
        borderTop: '5px solid #DC2626',
        overflow: 'hidden'
      }}>

        {/* Status Box */}
        <div style={{
          background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          minWidth: 160,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          borderRight: '3px solid #334155'
        }}>
          <div style={{ fontSize: fsm, color: '#94A3B8', fontWeight: 900 }}>முடிவுகள்</div>
          <AnimNum val={totalDeclared} color="#F59E0B" size={fs + 6} font={ff} />
        </div>

        {/* Animated Party Containers */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={key} // Resets animation every 5s
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flex: 1 }}
          >
            {Object.entries(partyConfigMap).map(([pKey, cfg]) => {
              const tot = gT(pKey === 'NTK' ? 'MATTRAVAI' : pKey) || 0;
              const photoUrl = settings[cfg.photoKey];

              return (
                <div key={pKey} style={{
                  flex: 1, 
                  background: cfg.color, // Keeping exact colors as requested
                  display: 'flex', alignItems: 'center', padding: '0 25px',
                  borderRight: '2px solid rgba(0,0,0,0.1)'
                }}>
                  <Photo photoUrl={photoUrl} size={fs * 2.2} />
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', marginLeft: 15 }}>
                    <div style={{ fontSize: fm + 4, color: '#fff', fontWeight: 900, marginRight: 12 }}>
                      {cfg.label}
                    </div>
                    <div style={{ fontSize: fs * 1.6, color: '#fff', fontWeight: 900 }}>
                      {tot}
                    </div>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </AnimatePresence>

        {/* NAADI Logo Card */}
        <div style={{
          background: '#1E293B', minWidth: 160,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: 60, height: 60, background: '#fff', borderRadius: '50%', marginBottom: 5 }} /> 
          <div style={{ fontSize: fsm, color: '#94A3B8', fontWeight: 900 }}>LIVE time</div>
        </div>

      </div>

      {/* Bottom Ticker - 48px Height */}
      <div style={{ height: 48, background: '#000', color: '#fff', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{ background: '#DC2626', height: '100%', padding: '0 20px', display: 'flex', alignItems: 'center', fontWeight: 900, zIndex: 10 }}>FLASH</div>
        <marquee style={{ fontSize: 20 }}>தமிழக தேர்தல் முடிவுகள் 2026 நேரலை... {TOTAL} தொகுதிகளின் முன்னிலை விவரங்கள்...</marquee>
      </div>
    </div>
  )
}
