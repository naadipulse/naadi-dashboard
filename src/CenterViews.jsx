import React, { useState, useEffect } from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, MAJORITY, TOTAL } from './shared.jsx'

const VIEW_LABELS = ['வீடியோ', 'சட்டமன்றம்', 'Flash 1', 'Flash 2']

// View 1: மும்முனை போட்டி image
function View1({ settings }) {
  const imgUrl = settings.view1_image || 'https://i.ibb.co/nNfS4Wvd/5857325f-c3a8-4ae1-96b6-c2f8b225459b.png'
  const fm = parseInt(settings.font_medium) || 22
  const ff = settings.font_family || 'Segoe UI'
  return (
    <div style={{ height: '100%', borderRadius: 14, overflow: 'hidden', position: 'relative', background: '#0F172A', fontFamily: ff }}>
      <img src={imgUrl} alt="view1"
        style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
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

// View 2: Parliament dots — left to right fill by party rank
function View2({ tally, settings }) {
  const fm = parseInt(settings.font_medium) || 22
  const fsm = parseInt(settings.font_small) || 13
  const ff = settings.font_family || 'Segoe UI'

  const get = p => { const d = tally.find(t => t.party === p); return d ? d.won + (d.leadingg || 0) : 0 }

  // Sort parties by seats descending
  const sortedParties = Object.keys(PARTY_DEFAULTS).sort((a, b) => get(b) - get(a))

  // Build seat list: highest party first from left
  const seatList = []
  sortedParties.forEach(p => {
    const tot = get(p)
    for (let i = 0; i < tot; i++) seatList.push(p)
  })
  while (seatList.length < TOTAL) seatList.push('pending')

  // Arc rows — 7 rows, inner to outer
  const ARC_ROWS = [
    { r: 110, count: 17 },
    { r: 148, count: 24 },
    { r: 186, count: 31 },
    { r: 224, count: 38 },
    { r: 262, count: 44 },
    { r: 300, count: 50 },
    { r: 338, count: 30 },
  ]

  const CX = 460, CY = 420
  const dots = []
  let idx = 0
  ARC_ROWS.forEach(({ r, count }) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.PI + (i / (count - 1)) * Math.PI
      dots.push({
        x: CX + r * Math.cos(angle),
        y: CY + r * Math.sin(angle),
        party: seatList[idx++] || 'pending',
      })
    }
  })

  const W = 920, H = 450
  const totalDeclared = tally.reduce((s, t) => s + t.won + (t.leadingg || 0), 0)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', fontFamily: ff, background: '#fff', borderRadius: 14, padding: '10px 16px' }}>
      <div style={{ fontSize: fm, fontWeight: 800, color: '#374151' }}>
        🏛️ சட்டமன்றம் — 234 இடங்கள்
      </div>

      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: 'visible', flex: 1 }}>
        {/* Dots first */}
        {dots.map((d, i) => {
          const cfg = PARTY_DEFAULTS[d.party]
          const isDeclared = d.party !== 'pending'
          return (
            <circle key={i}
              cx={d.x} cy={d.y} r={10}
              fill={isDeclared ? cfg?.color : '#E5E7EB'}
              opacity={isDeclared ? 1 : 0.5}
              style={{ transition: `fill 0.8s ease ${i * 0.002}s` }}
            />
          )
        })}

        {/* 118 majority line ON TOP of dots */}
        <line
          x1={CX} y1={CY - 360}
          x2={CX} y2={CY + 5}
          stroke="#1E293B" strokeWidth={3}
          strokeDasharray="8,5"
        />
        <rect x={CX - 30} y={CY - 385} width={60} height={26} rx={5} fill="#F59E0B" />
        <text x={CX} y={CY - 367} textAnchor="middle" fontSize={16} fill="#fff" fontWeight="bold">118</text>
      </svg>

      {/* Party totals */}
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        {sortedParties.map(p => {
          const cfg = PARTY_DEFAULTS[p]
          const tot = get(p)
          const pct = ((tot / TOTAL) * 100).toFixed(1)
          const hasMaj = tot >= MAJORITY
          return (
            <div key={p} style={{
              textAlign: 'center', background: hasMaj ? cfg.color : cfg.light,
              border: `2px solid ${cfg.color}`,
              borderRadius: 10, padding: '6px 16px', minWidth: 75,
              boxShadow: hasMaj ? `0 0 16px ${cfg.color}66` : 'none',
            }}>
              <div style={{ fontSize: fsm, color: hasMaj ? '#fff' : cfg.color, fontWeight: 700 }}>{cfg.label}</div>
              <div style={{ fontSize: fm + 10, fontWeight: 900, color: hasMaj ? '#fff' : cfg.color, lineHeight: 1 }}>{tot}</div>
              <div style={{ fontSize: fsm - 1, color: hasMaj ? 'rgba(255,255,255,0.8)' : '#9CA3AF' }}>{pct}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// View 3 & 4: Dynamic Flash News
function FlashView({ settings, viewNum }) {
  const fm = parseInt(settings.font_medium) || 22
  const fsm = parseInt(settings.font_small) || 13
  const ff = settings.font_family || 'Segoe UI'

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
        <div style={{ fontSize: fm, fontWeight: 700, color: '#94A3B8' }}>Flash News {viewNum}</div>
        <div style={{ fontSize: fsm, color: '#CBD5E1', marginTop: 8, textAlign: 'center', maxWidth: 280 }}>
          Admin panel → Flash {viewNum} tab-ல் content add பண்ணுங்க
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
