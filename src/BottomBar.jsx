import React from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, AnimNum, Photo, MAJORITY, TOTAL } from './shared.jsx'

export default function BottomBar() {
  const settings = useSettings()
  const { gT, gW, gL, totalDeclared } = useTally()

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* MAIN DATA BAR */}
      <div style={{ 
        fontFamily: ff, 
        display: 'flex', 
        flex: 1, 
        background: '#0F172A',
        borderTop: '4px solid #DC2626',
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
          <AnimNum val={totalDeclared} color="#F59E0B" size={fs} font={ff} />
          <div style={{ fontSize: fsm - 2, color: '#64748B' }}>மொத்தம்: {TOTAL}</div>
        </div>

        {/* Party boxes */}
        {Object.entries(PARTY_DEFAULTS).map(([p, cfg]) => {
          const tot = gT(p), won = gW(p), lead = gL(p)
          const hasMaj = tot >= MAJORITY
          const photoUrl = settings[cfg.photoKey]

          return (
            <div key={p} style={{
              flex: 1, 
              background: `linear-gradient(90deg, ${cfg.color} 0%, ${cfg.color}CC 100%)`,
              display: 'flex', alignItems: 'center', padding: '0 15px',
              borderRight: '2px solid rgba(0,0,0,0.2)', position: 'relative'
            }}>
              <Photo photoUrl={photoUrl} size={fs * 1.5} />

              <div style={{ marginLeft: 15, flex: 1 }}>
                <div style={{ fontSize: fm, color: '#fff', fontWeight: 900, lineHeight: 1 }}>{cfg.label}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                   <AnimNum val={tot} color="#fff" size={fs * 1.2} font={ff} />
                   {hasMaj && <span style={{ fontSize: 12, color: '#FFD700', fontWeight: 900 }}>🏆 WIN</span>}
                </div>
              </div>

              {/* High-Contrast Breakdown */}
              <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.3)', padding: '5px 10px', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: '#CBD5E1', fontWeight: 800 }}>வெற்றி: <span style={{color: '#fff', fontSize: 16}}>{won}</span></div>
                <div style={{ fontSize: 10, color: '#FDE68A', fontWeight: 800 }}>முன்னிலை: <span style={{fontSize: 16}}>{lead}</span></div>
              </div>
            </div>
          )
        })}
      </div>

      {/* BOTTOM TICKER (The 74px Space) */}
      <div style={{ 
        height: 40, 
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
        <div className="ticker-scroll" style={{ whiteSpace: 'nowrap', fontSize: 18, fontWeight: 500, paddingLeft: '100%' }}>
          தமிழக தேர்தல் முடிவுகள் 2026 - நேரலை செய்திகள்... மும்முனை போட்டியில் கடும் இழுபறி... உடனுக்குடன் தெரிந்துகொள்ள இணைந்திருங்கள்...
        </div>
      </div>

      <style>{`
        .ticker-scroll {
          animation: marquee 30s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  )
}
