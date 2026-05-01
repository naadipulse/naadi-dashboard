import React from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, AnimNum, Photo, MAJORITY, TOTAL } from './shared.jsx'

// Helper component for the Naadi Card
function NaadiCard({ fontSmall }) {
  // Replace this with your actual logo URL
  const logoUrl = 'path_to_your_naadi_logo.png' 
  return (
    <div style={{
      background: '#1E293B',
      minWidth: 160,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '10px 14px',
      borderLeft: '3px solid #64748B' // Separator from the last party card
    }}>
      <div style={{
        width: 80, height: 80,
        backgroundImage: `url(${logoUrl})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        marginBottom: 8
      }} />
      <div style={{ fontSize: fontSmall + 1, color: '#94A3B8', fontWeight: 900, textTransform: 'uppercase' }}>LIVE time</div>
    </div>
  )
}

export default function BottomBar() {
  const settings = useSettings()
  const { gT, totalDeclared } = useTally() // Removed gW, gL as they are not needed now

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  // Updated Party Configuration mapping
  const partyConfigMap = {
    ...PARTY_DEFAULTS,
    // Add specific photo mappings based on your useSettings values
    'DMK+': { ...PARTY_DEFAULTS['DMK+'], label: 'திமுக+', photoKey: 'photo_stalin' }, // Example
    'ADMK+': { ...PARTY_DEFAULTS['ADMK+'], label: 'அதிமுக+', photoKey: 'photo_eps' },
    'TVK': { ...PARTY_DEFAULTS['TVK'], label: 'தவெக', photoKey: 'photo_tvk_leader' }, // Update leader image
    'MATTRAVAI': { ...PARTY_DEFAULTS['MATTRAVAI'], label: 'நாம் தமிழர்', photoKey: 'photo_seeman' } // Rename and map photo
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* MAIN DATA BAR - INCREASED HEIGHT */}
      <div style={{ 
        fontFamily: ff, 
        display: 'flex', 
        height: 140, // Signficant height increase
        background: '#0F172A',
        borderTop: '5px solid #DC2626', // Thicker line
        overflow: 'hidden'
      }}>

        {/* Box 1 — Status */}
        <div style={{
          background: 'linear-gradient(180deg, #1E293B 0%, #0F172A 100%)',
          minWidth: 160,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          borderRight: '3px solid #334155', padding: '0 10px',
        }}>
          <div style={{ fontSize: fsm, color: '#94A3B8', fontWeight: 900 }}>முடிவுகள்</div>
          <AnimNum val={totalDeclared} color="#F59E0B" size={fs + 6} font={ff} />
          <div style={{ fontSize: fsm - 2, color: '#64748B' }}>மொத்தம்: {TOTAL}</div>
        </div>

        {/* Party boxes - Dynamic but configured */}
        {[
          partyConfigMap['DMK+'],
          partyConfigMap['ADMK+'],
          partyConfigMap['TVK'],
          partyConfigMap['MATTRAVAI']
        ].map((cfg) => {
          if (!cfg) return null; // Safety check

          const partyKey = Object.keys(partyConfigMap).find(key => partyConfigMap[key] === cfg);
          const tot = gT(partyKey) || 0; // Totals from Supabase
          const hasMaj = tot >= MAJORITY
          const photoUrl = settings[cfg.photoKey]

          return (
            <div key={partyKey} style={{
              flex: 1, 
              background: `linear-gradient(135deg, ${cfg.color}CC 0%, ${cfg.color}EE 100%)`, // Diagonal gradient for depth
              display: 'flex', alignItems: 'center', 
              padding: '0 25px', // Increased padding
              borderRight: '2px solid rgba(0,0,0,0.2)', position: 'relative',
              overflow: 'hidden' // So photo doesn't bleed
            }}>
              {/* Majority Shimmer effect (optional but nice) */}
              {hasMaj && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.12) 50%,transparent 100%)', animation: 'shimmer 2s linear infinite', zIndex: 0 }} />}

              {/* Photo - Larger */}
              <Photo photoUrl={photoUrl} size={fs * 2.2} fallback={cfg.label.slice(0, 1)} />

              {/* Label + Number — Horizontal Layout */}
              <div style={{ display: 'flex', alignItems: 'baseline', marginLeft: 20, zIndex: 1 }}>
                <div style={{ fontSize: fm + 4, color: '#fff', fontWeight: 900, lineHeight: 1, marginRight: 10 }}>
                  {cfg.label}
                </div>
                {hasMaj && (
                  <span style={{ fontSize: 14, color: '#FFD700', fontWeight: 900, padding: '2px 8px', background: 'rgba(0,0,0,0.3)', borderRadius: 4, marginRight: 10 }}>
                    🏆
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                   <AnimNum val={tot} color="#fff" size={fs * 1.6} font={ff} />
                </div>
              </div>
            </div>
          )
        })}

        {/* NEW NAADI CARD */}
        <NaadiCard fontSmall={fsm} />

      </div>

      {/* BOTTOM TICKER (The 74px Space) */}
      <div style={{ 
        height: 48, // Slightly more height
        background: '#000', 
        color: '#fff', 
        display: 'flex', 
        alignItems: 'center',
        borderTop: '1px solid #334155',
        overflow: 'hidden'
      }}>
        <div style={{ background: '#DC2626', height: '100%', padding: '0 20px', display: 'flex', alignItems: 'center', fontWeight: 900, fontSize: 14, zIndex: 2 }}>
          FLASH
        </div>
        <div className="ticker-scroll" style={{ whiteSpace: 'nowrap', fontSize: 20, fontWeight: 500, paddingLeft: '100%' }}>
          தமிழக தேர்தல் முடிவுகள் 2026 - நேரலை செய்திகள்... மும்முனை போட்டியில் கடும் இழுபறி... உடனுக்குடன் தெரிந்துகொள்ள இணைந்திருங்கள்... தவெக, நாம் தமிழர் முக்கிய இடங்களில் முன்னிலை...
        </div>
      </div>

      <style>{`
        .ticker-scroll {
          animation: marquee 35s linear infinite; // Slightly slower
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes shimmer{0%{transform:translateX(-150%)}100%{transform:translateX(150%)}}
      `}</style>
    </div>
  )
}
