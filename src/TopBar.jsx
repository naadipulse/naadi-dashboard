import React, { useState, useEffect } from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, AnimNum } from './shared.jsx'

export default function TopBar() {
  const settings = useSettings()
  const { gT, totalDeclared } = useTally()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const ff = settings.font_family

  return (
    <div style={{ fontFamily: ff, width: '100%' }}>
      {/* Main top bar */}
      <div style={{ background: 'linear-gradient(90deg,#B91C1C,#7F1D1D)', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: '#fff', color: '#DC2626', fontWeight: 900, fontSize: fm - 2, padding: '2px 10px', borderRadius: 4, animation: 'blink 1.5s infinite' }}>● LIVE</span>
          <span style={{ fontWeight: 700, fontSize: fm + 2, color: '#fff' }}>
            தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை
          </span>
        </div>
         {/*
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Object.entries(PARTY_DEFAULTS).map(([p, cfg]) => (
            <div key={p} style={{ background: cfg.color, borderRadius: 8, padding: '4px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: fm - 2, color: '#fff', fontWeight: 700 }}>{cfg.short}</span>
              <AnimNum val={gT(p)} color="#fff" size={fs * 0.5} font={ff} />
            </div>
            */}
          ))}
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '4px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: fm - 4, color: 'rgba(255,255,255,0.7)' }}>முடிவு</div>
            <AnimNum val={totalDeclared} color="#FCD34D" size={fs * 0.45} font={ff} />
            <span style={{ fontSize: fm - 4, color: 'rgba(255,255,255,0.5)' }}>/234</span>
          </div>
          <span style={{ color: '#fff', fontSize: fm - 2, marginLeft: 4, fontWeight: 600 }}>
            {time.toLocaleTimeString('en-IN')} | May 4, 2026
          </span>
        </div>
      </div>

      {/* Ticker */}
      <div style={{ height: 34, background: '#1E293B', display: 'flex', overflow: 'hidden' }}>
        <div style={{ background: '#EF4444', color: '#fff', fontWeight: 900, fontSize: fm - 2, padding: '0 14px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}>BREAKING</div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap', gap: 50, color: '#FCD34D', fontSize: fm, fontWeight: 600 }}>
            {[
              ...Object.entries(PARTY_DEFAULTS).map(([p, cfg]) => `${cfg.short}: ${gT(p)} இடங்கள்`),
              '🏆 பெரும்பான்மை: 118',
              '234 தொகுதிகள் | நாடி @naadipulse',
              ...Object.entries(PARTY_DEFAULTS).map(([p, cfg]) => `${cfg.short}: ${gT(p)} இடங்கள்`),
              '🏆 பெரும்பான்மை: 118',
              '234 தொகுதிகள் | நாடி @naadipulse',
            ].map((m, i) => <span key={i}>{m}</span>)}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      `}</style>
    </div>
  )
}
