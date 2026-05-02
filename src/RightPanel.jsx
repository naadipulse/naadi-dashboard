import React, { useState, useEffect } from 'react'
import { useSettings, useConstituencies, PARTY_DEFAULTS } from './shared.jsx'

const DISTRICTS = [
  'சென்னை', 'திருவள்ளூர்', 'காஞ்சிபுரம்', 'செங்கல்பட்டு',
  'ராணிப்பேட்டை', 'வேலூர்', 'திருப்பத்தூர்', 'விழுப்புரம்',
  'கள்ளக்குறிச்சி', 'கடலூர்', 'சேலம்', 'நாமக்கல்',
  'தர்மபுரி', 'கிருஷ்ணகிரி', 'ஈரோடு', 'திருப்பூர்',
  'கோவை', 'நீலகிரி', 'தஞ்சாவூர்', 'நாகப்பட்டினம்',
  'திருவாரூர்', 'மயிலாடுதுறை', 'அரியலூர்', 'பெரம்பலூர்',
  'திருச்சி', 'கரூர்', 'புதுக்கோட்டை', 'மதுரை',
  'தேனி', 'திண்டுக்கல்', 'சிவகங்கை', 'ராமநாதபுரம்',
  'விருதுநகர்', 'திருநெல்வேலி', 'தென்காசி', 'தூத்துக்குடி',
  'கன்னியாகுமரி'
]

export default function RightPanel() {
  const settings = useSettings()
  const constituencies = useConstituencies()
  const [districtIdx, setDistrictIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setDistrictIdx(i => (i + 1) % DISTRICTS.length)
        setFade(true)
      }, 400)
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  const currentDistrict = DISTRICTS[districtIdx]

  // Filter constituencies by district
  const distConsts = constituencies.filter(c =>
    c.district === currentDistrict
  )

  return (
    <div style={{
      fontFamily: ff,
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: 14,
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    }}>

      {/* District header */}
      <div style={{
        background: '#DC2626', padding: '10px 14px',
        borderRadius: '14px 14px 0 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontSize: fm + 4, fontWeight: 900, color: '#fff' }}>
          {currentDistrict}
        </div>
        {/* District dots */}
        <div style={{ display: 'flex', gap: 4 }}>
          {DISTRICTS.map((_, i) => (
            <div key={i} style={{
              width: i === districtIdx ? 12 : 4,
              height: 4, borderRadius: 2,
              background: i === districtIdx ? '#FCD34D' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.4s',
            }} />
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 40px 60px',
        padding: '6px 12px',
        background: '#F3F4F6',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <div style={{ fontSize: fsm - 1, color: '#6B7280', fontWeight: 700 }}>தொகுதி</div>
        <div style={{ fontSize: fsm - 1, color: '#6B7280', fontWeight: 700, textAlign: 'center' }}>கட்சி</div>
        <div style={{ fontSize: fsm - 1, color: '#6B7280', fontWeight: 700, textAlign: 'right' }}>நிலை</div>
      </div>

      {/* Constituency rows */}
      <div style={{
        flex: 1, overflow: 'hidden',
        opacity: fade ? 1 : 0,
        transform: fade ? 'translateX(0)' : 'translateX(8px)',
        transition: 'all 0.4s ease',
      }}>
        {distConsts.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF', fontSize: fsm }}>
            ⏳ முடிவுகள் வரவில்லை
          </div>
        ) : (
          distConsts.map((c, i) => {
            const lp = PARTY_DEFAULTS[c.leading_party] || null
            return (
              <div key={c.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 40px 60px',
                padding: '8px 12px',
                borderBottom: '1px solid #F3F4F6',
                background: i % 2 === 0 ? '#fff' : '#FAFAFA',
                borderLeft: `3px solid ${lp ? lp.color : '#E5E7EB'}`,
                animation: `slideIn 0.3s ease ${i * 0.04}s both`,
              }}>
                {/* Constituency name */}
                <div>
                  <div style={{ fontSize: fsm, fontWeight: 700, color: '#111827' }}>
                    {c.name_tamil || c.name}
                  </div>
                  {c.lead_margin > 0 && (
                    <div style={{ fontSize: fsm - 3, color: '#9CA3AF' }}>+{c.lead_margin}</div>
                  )}
                </div>

                {/* Party symbol */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {lp ? (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: lp.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 9, color: '#fff', fontWeight: 800,
                    }}>
                      {lp.short.slice(0, 3)}
                    </div>
                  ) : (
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#E5E7EB' }} />
                  )}
                </div>

                {/* Status */}
                <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  {c.leading_party && c.leading_party !== 'pending' ? (
                    <span style={{
                      fontSize: fsm - 2, fontWeight: 700,
                      color: lp?.color || '#374151',
                      background: lp ? lp.color + '18' : '#F3F4F6',
                      padding: '2px 6px', borderRadius: 8,
                    }}>
                      {c.status === 'declared' ? '✅' : '📈'} {lp?.short}
                    </span>
                  ) : (
                    <span style={{ fontSize: fsm - 2, color: '#D1D5DB' }}>—</span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer — district count */}
      <div style={{
        padding: '6px 12px',
        background: '#F9FAFB',
        borderTop: '1px solid #E5E7EB',
        borderRadius: '0 0 14px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: fsm - 2, color: '#9CA3AF' }}>
          {districtIdx + 1} / {DISTRICTS.length} மாவட்டம்
        </span>
        <span style={{ fontSize: fsm - 2, color: '#9CA3AF' }}>
          {distConsts.filter(c => c.leading_party !== 'pending').length}/{distConsts.length} முடிவு
        </span>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
