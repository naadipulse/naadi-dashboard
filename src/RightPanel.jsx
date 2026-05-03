import React, { useState, useEffect, useMemo } from 'react'
import { useSettings, useConstituencies, PARTY_DEFAULTS, getComponentFonts } from './shared.jsx'

const DISTRICTS = [
  'சென்னை', 'திருவள்ளூர்', 'காஞ்சிபுரம்', 'செங்கல்பட்டு',
  'இராணிப்பேட்டை', 'வேலூர்', 'திருப்பத்தூர்', 'விழுப்புரம்',
  'கள்ளக்குறிச்சி', 'கடலூர்', 'சேலம்', 'நாமக்கல்',
  'தருமபுரி', 'கிருஷ்ணகிரி', 'ஈரோடு', 'திருப்பூர்',
  'கோயம்புத்தூர்', 'நீலகிரி', 'தஞ்சாவூர்', 'நாகப்பட்டினம்',
  'திருவாரூர்', 'மயிலாடுதுறை', 'அரியலூர்', 'பெரம்பலூர்',
  'திருச்சிராப்பள்ளி', 'கரூர்', 'புதுக்கோட்டை', 'மதுரை',
  'தேனி', 'திண்டுக்கல்', 'சிவகங்கை', 'இராமநாதபுரம்',
  'விருதுநகர்', 'திருநெல்வேலி', 'தென்காசி', 'தூத்துக்குடி',
  'கன்னியாகுமரி', 'திருவண்ணாமலை'
]

export default function RightPanel() {
  const settings = useSettings()
  const constituencies = useConstituencies()
  const [slideIdx, setSlideIdx] = useState(0)
  const [fade, setFade] = useState(true)

  // Generate slides: max 8 constituencies per slide for YouTube visibility
  const slides = useMemo(() => {
    const s = []
    DISTRICTS.forEach(d => {
      const dConsts = constituencies.filter(c => c.district === d)
      if (dConsts.length === 0) {
        s.push({ district: d, items: [], page: 1, total: 1, all: [] })
      } else {
        const total = Math.ceil(dConsts.length / 8)
        for (let i = 0; i < dConsts.length; i += 8) {
          s.push({
            district: d,
            items: dConsts.slice(i, i + 8),
            page: Math.floor(i / 8) + 1,
            total: total,
            all: dConsts
          })
        }
      }
    })
    return s
  }, [constituencies])

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setSlideIdx(i => (i + 1) % (slides.length || 1))
        setFade(true)
      }, 400)
    }, 5000)
    return () => clearInterval(iv)
  }, [slides.length])

  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'right')

  const currentSlide = slides[slideIdx] || { district: DISTRICTS[0], items: [], page: 1, total: 1, all: [] }
  const activeDistrictIdx = DISTRICTS.indexOf(currentSlide.district)

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
        <div>
          <div style={{ fontSize: fm, fontWeight: 900, color: '#fff' }}>
            {currentSlide.district} {currentSlide.total > 1 ? `(${currentSlide.page}/${currentSlide.total})` : ''}
          </div>
          <div style={{ fontSize: fsm - 1, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
            {currentSlide.all.filter(c => c.status === 'declared').length}/{currentSlide.all.length} முடிவு
          </div>
        </div>
        {/* District dots */}
        <div style={{ display: 'flex', gap: 4 }}>
          {DISTRICTS.map((_, i) => (
            <div key={i} style={{
              width: i === activeDistrictIdx ? 12 : 4,
              height: 4, borderRadius: 2,
              background: i === activeDistrictIdx ? '#FCD34D' : 'rgba(255,255,255,0.4)',
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
      <div className={fade ? 'flip-in' : 'flip-out'} style={{
        flex: 1, 
        overflowY: 'auto',
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}>
        {currentSlide.items.length === 0 ? (
          <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF', fontSize: fsm }}>
            ⏳ முடிவுகள் வரவில்லை
          </div>
        ) : (
          currentSlide.items.map((c, i) => {
            const lp = PARTY_DEFAULTS[c.leading_party] || null
            const isWon = c.status === 'declared'
            return (
              <div key={c.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr 40px 60px',
                padding: '8px 12px',
                borderBottom: '1px solid #F3F4F6',
                background: isWon ? lp?.light || '#FCD34D22' : (i % 2 === 0 ? '#fff' : '#FAFAFA'),
                borderLeft: `4px solid ${lp ? lp.color : '#E5E7EB'}`,
                animation: `slideIn 0.3s ease ${i * 0.04}s both`,
              }}>
                {/* Constituency info */}
                <div>
                  <div style={{ fontSize: fsm + 1, fontWeight: 800, color: '#111827' }}>
                    {isWon && '✅ '}{c.name_tamil || c.name}
                  </div>
                  <div style={{ fontSize: fsm - 2, color: lp?.color || '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                    {lp ? lp.label : '—'}
                    {c.lead_margin > 0 && (
                      <span style={{ marginLeft: 8, color: '#6B7280' }}>+{c.lead_margin.toLocaleString('en-IN')}</span>
                    )}
                  </div>
                </div>

                {/* Party symbol */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {lp ? (
                    <div style={{
                      width: 32, height: 32, borderRadius: 4,
                      background: lp.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, color: '#fff', fontWeight: 800,
                      boxShadow: isWon ? `0 0 12px ${lp.color}66` : 'none',
                    }}>
                      {lp.short.slice(0, 2)}
                    </div>
                  ) : (
                    <div style={{ width: 32, height: 32, borderRadius: 4, background: '#E5E7EB' }} />
                  )}
                </div>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <span style={{
                    fontSize: fsm + 2, fontWeight: 700,
                    color: lp?.color || '#9CA3AF',
                  }}>
                    {isWon ? '🏆' : '📈'}
                  </span>
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
        textAlign: 'center',
        fontSize: fsm - 2, color: '#9CA3AF',
      }}>
        {activeDistrictIdx + 1} / {DISTRICTS.length} மாவட்டம்
      </div>

      <style>{`
        .flip-in {
          animation: flipInX 0.5s ease forwards;
          backface-visibility: hidden;
        }
        .flip-out {
          animation: flipOutX 0.4s ease forwards;
          backface-visibility: hidden;
        }
        @keyframes flipInX { from { transform: rotateX(-90deg); opacity: 0; } to { transform: rotateX(0deg); opacity: 1; } }
        @keyframes flipOutX { from { transform: rotateX(0deg); opacity: 1; } to { transform: rotateX(90deg); opacity: 0; } }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}
