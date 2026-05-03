import React from 'react'
import { useSettings, getComponentFonts } from './shared.jsx'

export default function TopBar() {
  const settings = useSettings()
  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'top')

  const logoUrl = settings.naadi_logo 
    ? settings.naadi_logo.trim().replace('https://ibb.co/', 'https://i.ibb.co/')
    : null
  const hasLogo = !!(logoUrl && logoUrl.length > 5)

  return (
    <div style={{ fontFamily: ff, width: '100%' }}>
      {/* Main top bar — title + logo */}
      <div style={{
        background: 'linear-gradient(90deg,#B91C1C,#7F1D1D)',
        padding: '6px 60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            background: '#fff', color: '#DC2626',
            fontWeight: 900, fontSize: fm - 4,
            padding: '2px 10px', borderRadius: 4,
            animation: 'blink 1.5s infinite',
            flexShrink: 0,
          }}>● LIVE</div>

          <span style={{
            fontWeight: 900,
            fontSize: fm + 2,
            color: '#fff',
            letterSpacing: 0.5,
          }}>
            தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை
          </span>
        </div>

        {/* Logo on right */}
        {hasLogo && (
          <img
            src={logoUrl}
            alt="நாடி"
            style={{ 
              maxHeight: '60px', 
              maxWidth: '300px', 
              width: 'auto', 
              height: 'auto', 
              objectFit: 'contain', 
              flexShrink: 0 
            }}
            onError={e => { e.target.style.display = 'none' }}
          />
        )}
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
      `}</style>
    </div>
  )
}
