import React, { useState, useEffect } from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, MAJORITY, TOTAL, getComponentFonts } from './shared.jsx'

const VIEW_LABELS = ['வீடியோ', 'சட்டமன்றம்', 'மக்களின் விருப்பம் 1', 'மக்களின் விருப்பம் 2']

// View 1: மும்முனை போட்டி image
function View1({ settings }) {
  const imgUrl = settings.view1_image 
    ? settings.view1_image.trim().replace('https://ibb.co/', 'https://i.ibb.co/')
    : 'https://i.ibb.co/nNfS4Wvd/5857325f-c3a8-4ae1-96b6-c2f8b225459b.png'
  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'center')
  return (
    <div style={{ height: '100%', borderRadius: 14, overflow: 'hidden', position: 'relative', background: '#0F172A', fontFamily: ff }}>
      <img src={imgUrl} alt="view1"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
        padding: '40px 20px 16px', textAlign: 'center',
      }}>
        <div style={{ fontSize: fm + 6, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          {settings.view1_title || 'மும்முனைப் போட்டி 2026'}
        </div>
        <div style={{ fontSize: fm + 2, color: '#FCD34D', fontWeight: 700 }}>
          {settings.view1_subtitle || 'யார் அந்த நாற்காலிக்கு? 🏛️'}
        </div>
      </div>
    </div>
  )
}

// View 2: Parliament chart - proper spacing + correct left-right coloring
function View2({ tally, settings }) {
  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'center')

  const get = p => { const d = tally.find(t => t.party === p); return d ? d.won + (d.leadingg || 0) : 0 }
  const sortedParties = Object.keys(PARTY_DEFAULTS).sort((a, b) => get(b) - get(a))

  const COLORS = {
    'DMK+': '#DC2626', 'AIADMK+': '#16A34A',
    'TVK': '#D97706', 'Others': '#4B5563', 'pending': '#D1D5DB',
  }

  // Build color list - highest party first (leftmost)
  const seatColors = []
  sortedParties.forEach(p => { for (let i = 0; i < get(p); i++) seatColors.push(COLORS[p]) })
  while (seatColors.length < 234) seatColors.push(COLORS['pending'])

  const W = 920, H = 460
  const CX = W / 2, CY = H - 5
  const DOT_R = 8

  // Rows: innermost first, proportional count per row
  const ROWS = [
    { r: 80,  count: 17 },
    { r: 128, count: 24 },
    { r: 176, count: 31 },
    { r: 224, count: 38 },
    { r: 272, count: 44 },
    { r: 324, count: 50 },
    { r: 372, count: 30 },
  ]
  // Total = 17+24+31+38+44+50+30 = 234 ✅

  // Step 1: Generate all dot positions row by row
  const rawDots = []
  ROWS.forEach(({ r, count }) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.PI - (i / (count - 1)) * Math.PI // π to 0 = left to right
      rawDots.push({
        x: CX + r * Math.cos(angle),
        y: CY - r * Math.sin(angle),
        angle: angle,
      })
    }
  })

  // Step 2: Sort ALL dots by x position (left to right)
  const sortedDots = [...rawDots].sort((a, b) => b.angle - a.angle)

  // Step 3: Assign colors to sorted dots
  const dots = sortedDots.map((d, i) => ({
    ...d,
    color: seatColors[i] || COLORS['pending'],
  }))

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', fontFamily: ff, background: '#fff', borderRadius: 14, padding: '10px 16px' }}>
      <div style={{ fontSize: fm, fontWeight: 800, color: '#374151' }}>
        🏛️ சட்டமன்றம் — 234 இடங்கள்
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ flex: 1 }}>
        {/* 118 line behind dots */}
        <line x1={CX} y1={8} x2={CX} y2={H}
          stroke="#374151" strokeWidth={2} strokeDasharray="7,4" opacity={0.4} />
        <rect x={CX - 22} y={6} width={44} height={20} rx={4} fill="#F59E0B" />
        <text x={CX} y={20} textAnchor="middle" fontSize={12} fill="#fff" fontWeight="bold">118</text>

        {/* Dots on top of line */}
        {dots.map((d, i) => (
          <circle key={i}
            cx={d.x} cy={d.y} r={DOT_R}
            fill={d.color}
            style={{ transition: `fill 0.6s ease ${i * 0.002}s` }}
          />
        ))}
      </svg>

      {/* Party totals */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {sortedParties.map(p => {
          const cfg = PARTY_DEFAULTS[p]
          const tot = get(p)
          const hasMaj = tot >= MAJORITY
          return (
            <div key={p} style={{
              textAlign: 'center',
              background: hasMaj ? COLORS[p] : cfg.light,
              border: `2px solid ${COLORS[p]}`,
              borderRadius: 10, padding: '5px 14px', minWidth: 70,
              boxShadow: hasMaj ? `0 0 16px ${COLORS[p]}66` : 'none',
            }}>
              <div style={{ fontSize: fsm, color: hasMaj ? '#fff' : COLORS[p], fontWeight: 700 }}>{cfg.label}</div>
              <div style={{ fontSize: fm + 8, fontWeight: 900, color: hasMaj ? '#fff' : COLORS[p], lineHeight: 1 }}>{tot}</div>
              <div style={{ fontSize: fsm - 1, color: hasMaj ? 'rgba(255,255,255,0.8)' : '#9CA3AF' }}>
                {((tot / 234) * 100).toFixed(1)}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// View 3 & 4: Dynamic Flash News
function FlashView({ settings, viewNum }) {
  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'center')

  const title = settings[`flash${viewNum}_title`]
  const subtitle = settings[`flash${viewNum}_subtitle`]
  const image = settings[`flash${viewNum}_image`]
  const bg = settings[`flash${viewNum}_bg`] || '#0F172A'
  const textColor = settings[`flash${viewNum}_textcolor`] || '#ffffff'

  if (!title && !image) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#F8FAFC', borderRadius: 14, fontFamily: ff,
        border: '2px dashed #E2E8F0',
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📰</div>
        <div style={{ fontSize: fm, fontWeight: 700, color: '#94A3B8' }}>மக்களின் விருப்பம் {viewNum - 2}</div>
        <div style={{ fontSize: fsm, color: '#CBD5E1', marginTop: 8, textAlign: 'center', maxWidth: 280 }}>
          Admin panel → Special Views tab-ல் விவரங்களைச் சேர்க்கவும்.
        </div>
      </div>
    )
  }

  return (
    <div style={{
      height: '100%', borderRadius: 14, overflow: 'hidden',
      position: 'relative', background: bg, fontFamily: ff,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {image && (
        <img src={image} alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
      )}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 40px' }}>
        {title && (
          <div style={{
            fontSize: fm + 14, fontWeight: 900,
            color: textColor,
            lineHeight: 1.2, marginBottom: 16,
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>{title}</div>
        )}
        {subtitle && (
          <div style={{
            fontSize: fm + 4, fontWeight: 700,
            color: '#FCD34D',
            textShadow: '0 1px 6px rgba(0,0,0,0.5)',
          }}>{subtitle}</div>
        )}
      </div>
    </div>
  )
}

export default function CenterViews() {
  const settings = useSettings()
  const { tally } = useTally()
  const [viewIdx, setViewIdx] = useState(0)
  const [fade, setFade] = useState(true)
  const TOTAL_VIEWS = 4

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setViewIdx(v => (v + 1) % TOTAL_VIEWS)
        setFade(true)
      }, 400)
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  const views = [
    <View1 settings={settings} />,
    <View2 tally={tally} settings={settings} />,
    <FlashView settings={settings} viewNum={3} />,
    <FlashView settings={settings} viewNum={4} />,
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, height: '100%' }}>
      {/* View dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, alignItems: 'center', padding: '4px 0', flexShrink: 0 }}>
        {VIEW_LABELS.map((label, i) => (
          <div key={i}
            onClick={() => setViewIdx(i)}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
            <div style={{
              width: i === viewIdx ? 28 : 9, height: 9,
              borderRadius: 5,
              background: i === viewIdx ? '#DC2626' : '#D1D5DB',
              transition: 'all 0.4s',
            }} />
            <span style={{
              fontSize: 10,
              color: i === viewIdx ? '#DC2626' : '#9CA3AF',
              fontWeight: i === viewIdx ? 700 : 400,
            }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Rotating view */}
      <div style={{
        flex: 1, overflow: 'hidden',
        opacity: fade ? 1 : 0,
        transform: fade ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>
        {views[viewIdx]}
      </div>
    </div>
  )
}
