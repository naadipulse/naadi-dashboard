import React from 'react'
import { useSettings, getComponentFonts } from './shared.jsx'

export default function TopBar() {
  const settings = useSettings()
  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'top')

  return (
    <div style={{ fontFamily: ff, width: '100%' }}>
      {/* Main top bar — title only */}
      <div style={{
        background: 'linear-gradient(90deg,#B91C1C,#7F1D1D)',
        padding: '10px 60px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
      }}>
        <div style={{
          background: '#fff', color: '#DC2626',
          fontWeight: 900, fontSize: fm - 2,
          padding: '3px 12px', borderRadius: 4,
          animation: 'blink 1.5s infinite',
          flexShrink: 0,
        }}>● LIVE</div>

        <span style={{
          fontWeight: 900,
          fontSize: fm + 4,
          color: '#fff',
          letterSpacing: 0.5,
        }}>
          தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை
        </span>
      </div>

      {/* Ticker */}
      <div style={{
        height: 32, background: '#1E293B',
        display: 'flex', overflow: 'hidden',
      }}>
        <div style={{
          background: '#EF4444', color: '#fff',
          fontWeight: 900, fontSize: fm - 4,
          padding: '0 14px',
          display: 'flex', alignItems: 'center',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>BREAKING</div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center',
            height: '100%',
            animation: 'ticker 28s linear infinite',
            whiteSpace: 'nowrap',
            gap: 50,
            color: '#FCD34D',
            fontSize: fm - 2,
            fontWeight: 600,
          }}>
            {[
              '🔴 தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026',
              '📊 234 தொகுதிகள் | பெரும்பான்மை: 118',
              '🗓️ May 4, 2026 | வாக்கு எண்ணிக்கை நாள்',
              '📺 நாடி | @naadipulse | தரவு மட்டுமே பேசுகிறது',
              '🔴 தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026',
              '📊 234 தொகுதிகள் | பெரும்பான்மை: 118',
              '🗓️ May 4, 2026 | வாக்கு எண்ணிக்கை நாள்',
              '📺 நாடி | @naadipulse | தரவு மட்டுமே பேசுகிறது',
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
