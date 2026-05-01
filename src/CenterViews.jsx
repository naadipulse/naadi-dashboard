import React, { useState, useEffect } from 'react'
import { useSettings, useTally, useConstituencies, PARTY_DEFAULTS, AnimNum, MAJORITY, TOTAL } from './shared.jsx'

const DISTRICTS = [
  'சென்னை','திருவள்ளூர்','காஞ்சிபுரம்','செங்கல்பட்டு','ரானிப்பேட்டை',
  'வேலூர்','திருப்பத்தூர்','விழுப்புரம்','கள்ளக்குறிச்சி','கடலூர்',
  'சேலம்','நாமக்கல்','தர்மபுரி','கிருஷ்ணகிரி','ஈரோடு',
  'திருப்பூர்','கோவை','நீலகிரி','தஞ்சாவூர்','நாகப்பட்டினம்',
  'திருவாரூர்','மயிலாடுதுறை','அரியலூர்','பெரம்பலூர்','திருச்சி',
  'கரூர்','புதுக்கோட்டை','மதுரை','தேனி','திண்டுக்கல்',
  'சிவகங்கை','ராமநாதபுரம்','விருதுநகர்','திருநெல்வேலி','தென்காசி',
  'தூத்துக்குடி','கன்னியாகுமரி'
]

const VIEW_LABELS = ['தொகுதி', 'வீடியோ', 'சட்டமன்றம்', 'மாவட்டம்', 'Exit Poll']

// View 1: Constituency rows
function View1({ constituencies, fm, fsm, ff }) {
  const dec = constituencies.filter(c => c.leading_party && c.leading_party !== 'pending').slice(0, 10)
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 5, overflow: 'hidden' }}>
      <div style={{ fontSize: fm, fontWeight: 800, color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ background: '#EF4444', color: '#fff', fontSize: fsm, padding: '2px 8px', borderRadius: 4, animation: 'blink 1.5s infinite' }}>LIVE</span>
        📍 தொகுதிவாரி முடிவுகள்
      </div>
      {dec.length === 0 && <div style={{ color: '#9CA3AF', fontSize: fm, textAlign: 'center', padding: 30 }}>⏳ முடிவுகள் வரவில்லை...</div>}
      {dec.map((c, i) => {
        const lp = PARTY_DEFAULTS[c.leading_party] || PARTY_DEFAULTS['Others']
        return (
          <div key={c.id} style={{
            background: '#fff', borderLeft: `4px solid ${lp.color}`,
            borderRadius: '0 10px 10px 0', padding: '8px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            animation: `slideIn 0.4s ease ${i * 0.05}s both`,
            fontFamily: ff,
          }}>
            <div>
              <div style={{ fontSize: fm, fontWeight: 700, color: '#111827' }}>{c.name_tamil || c.name}</div>
              {c.lead_margin > 0 && <div style={{ fontSize: fsm, color: '#F59E0B', fontWeight: 600 }}>+{c.lead_margin} votes</div>}
            </div>
            <div style={{ background: lp.color, color: '#fff', fontSize: fm - 1, fontWeight: 800, padding: '5px 12px', borderRadius: 16 }}>
              {c.status === 'declared' ? '✅' : '📈'} {lp.short}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// View 2: மும்முனை போட்டி image
function View2({ fm, ff }) {
  return (
    <div style={{
      height: '100%',
      borderRadius: 14,
      overflow: 'hidden',
      position: 'relative',
      fontFamily: ff,
      background: '#0F172A',
    }}>
      {/* Background image - full contain */}
      <img
        src="https://i.ibb.co/sdQrcBGx/3moonai.jpg"
        alt="மும்முனை போட்டி"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          display: 'block',
        }}
        onError={e => {
          // Try direct URL format
          e.target.src = 'https://i.ibb.co/sdQrcBGx/image.jpg'
        }}
      />
      {/* Bottom overlay */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
        padding: '40px 20px 16px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: fm + 6, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
          மும்முனைப் போட்டி 2026
        </div>
        <div style={{ fontSize: fm + 2, color: '#FCD34D', fontWeight: 700 }}>
          யார் அந்த நாற்காலிக்கு? 🏛️
        </div>
      </div>
    </div>
  )
}

// View 3: Semicircle parliament dots
function View3({ tally, fm, fsm, ff }) {
  const get = p => { const d = tally.find(t => t.party === p); return d ? d.won + (d.leadingg || 0) : 0 }

  const seatList = []
  Object.keys(PARTY_DEFAULTS).forEach(p => {
    const tot = get(p)
    for (let i = 0; i < tot; i++) seatList.push(p)
  })
  while (seatList.length < TOTAL) seatList.push('pending')

  const ROWS = [
    { r: 170, count: 60 },
    { r: 130, count: 80 },
    { r: 90,  count: 94 },
  ]

  const dots = []
  let idx = 0
  ROWS.forEach(({ r, count }) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.PI + (i / count) * Math.PI
      dots.push({
        x: 210 + r * Math.cos(angle),
        y: 190 + r * Math.sin(angle),
        party: seatList[idx++] || 'pending',
      })
    }
  })

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: ff }}>
      <div style={{ fontSize: fm, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
        🏛️ சட்டமன்றம் — 234 இடங்கள்
      </div>
      <svg width={420} height={210} style={{ overflow: 'visible' }}>
        {dots.map((d, i) => {
          const cfg = PARTY_DEFAULTS[d.party]
          const isDeclared = d.party !== 'pending'
          return (
            <circle key={i} cx={d.x} cy={d.y} r={5}
              fill={isDeclared ? cfg?.color : '#E5E7EB'}
              stroke={isDeclared ? cfg?.color : '#D1D5DB'}
              strokeWidth={0.5}
              style={{ transition: `fill 0.8s ease ${i * 0.002}s` }}
            />
          )
        })}
        <line x1={40} y1={190} x2={380} y2={190} stroke="#D1D5DB" strokeWidth={1} strokeDasharray="4,3" />
        <text x={210} y={208} textAnchor="middle" fontSize={fsm} fill="#374151" fontWeight="bold">
          🎯 பெரும்பான்மை: 118
        </text>
      </svg>
      <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {Object.entries(PARTY_DEFAULTS).map(([p, cfg]) => (
          <div key={p} style={{ textAlign: 'center', background: cfg.light, border: `2px solid ${cfg.color}`, borderRadius: 10, padding: '6px 14px', minWidth: 65 }}>
            <div style={{ fontSize: fsm, color: cfg.color, fontWeight: 700 }}>{cfg.short}</div>
            <AnimNum val={get(p)} color={cfg.color} size={fm + 6} font={ff} />
          </div>
        ))}
      </div>
    </div>
  )
}

// View 4: District wise
function View4({ constituencies, fm, fsm, ff }) {
  const districtData = DISTRICTS.slice(0, 18).map((name, i) => {
    const sample = constituencies.slice(i * 6, (i + 1) * 6)
    const counts = {}
    sample.forEach(c => { if (c.leading_party && c.leading_party !== 'pending') counts[c.leading_party] = (counts[c.leading_party] || 0) + 1 })
    const leading = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return { name, leading: leading ? leading[0] : null, count: leading ? leading[1] : 0 }
  })

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: ff }}>
      <div style={{ fontSize: fm, fontWeight: 800, color: '#374151', marginBottom: 8 }}>🗺️ மாவட்டவாரி நிலவரம்</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, flex: 1, overflow: 'hidden' }}>
        {districtData.map((d, i) => {
          const cfg = d.leading ? PARTY_DEFAULTS[d.leading] : null
          return (
            <div key={i} style={{
              background: '#fff', border: `2px solid ${cfg ? cfg.color : '#E5E7EB'}`,
              borderRadius: 8, padding: '6px 10px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              animation: `slideIn 0.3s ease ${i * 0.03}s both`,
            }}>
              <div>
                <div style={{ fontSize: fsm + 1, fontWeight: 700, color: '#111827' }}>{d.name}</div>
                {cfg && <div style={{ fontSize: fsm - 1, color: cfg.color, fontWeight: 600 }}>{cfg.label}</div>}
              </div>
              {cfg ? (
                <div style={{ background: cfg.color, color: '#fff', fontSize: fm - 2, fontWeight: 900, width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d.count}</div>
              ) : (
                <div style={{ color: '#D1D5DB', fontSize: fsm }}>—</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// View 5: Exit poll vs actual
function View5({ tally, fm, fsm, ff }) {
  const exitPolls = {
    'DMK+':    { matrize: '122-132', jvc: '75-95',   axis: '92-110'  },
    'AIADMK+': { matrize: '87-110',  jvc: '128-147', axis: '22-32'   },
    'TVK':     { matrize: '10-12',   jvc: '8-15',    axis: '98-120'  },
  }
  const get = p => { const d = tally.find(t => t.party === p); return d ? d.won + (d.leadingg || 0) : 0 }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontFamily: ff }}>
      <div style={{ fontSize: fm, fontWeight: 800, color: '#374151', marginBottom: 8 }}>📊 Exit Poll vs உண்மை</div>
      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', flex: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#374151', color: '#fff' }}>
              <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: fm, fontWeight: 700 }}>கட்சி</th>
              <th style={{ padding: '10px', textAlign: 'center', fontSize: fsm + 1, fontWeight: 600 }}>Matrize</th>
              <th style={{ padding: '10px', textAlign: 'center', fontSize: fsm + 1, fontWeight: 600 }}>JVC</th>
              <th style={{ padding: '10px', textAlign: 'center', fontSize: fsm + 1, fontWeight: 600 }}>Axis</th>
              <th style={{ padding: '10px', textAlign: 'center', fontSize: fm, fontWeight: 700, background: '#1D4ED8' }}>உண்மை</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(exitPolls).map(([party, polls], i) => {
              const cfg = PARTY_DEFAULTS[party]
              const actual = get(party)
              return (
                <tr key={party} style={{ background: i % 2 === 0 ? cfg.light : '#fff', borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ color: cfg.color, fontWeight: 900, fontSize: fm + 2 }}>{cfg.label}</span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#374151', fontSize: fm - 1 }}>{polls.matrize}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#374151', fontSize: fm - 1 }}>{polls.jvc}</td>
                  <td style={{ padding: '10px', textAlign: 'center', color: '#374151', fontSize: fm - 1, fontWeight: 600 }}>{polls.axis}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{ background: cfg.color, color: '#fff', fontSize: fm + 6, fontWeight: 900, padding: '2px 12px', borderRadius: 8 }}>{actual}</span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function CenterViews() {
  const settings = useSettings()
  const { tally } = useTally()
  const constituencies = useConstituencies()
  const [viewIdx, setViewIdx] = useState(0)
  const [fade, setFade] = useState(true)
  const TOTAL_VIEWS = 5

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false)
      setTimeout(() => { setViewIdx(v => (v + 1) % TOTAL_VIEWS); setFade(true) }, 400)
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  const views = [
    <View1 constituencies={constituencies} fm={fm} fsm={fsm} ff={ff} />,
    <View2 fm={fm} ff={ff} />,
    <View3 tally={tally} fm={fm} fsm={fsm} ff={ff} />,
    <View4 constituencies={constituencies} fm={fm} fsm={fsm} ff={ff} />,
    <View5 tally={tally} fm={fm} fsm={fsm} ff={ff} />,
  ]

  return (
    <div style={{ fontFamily: ff, height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* View dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, alignItems: 'center', padding: '4px 0' }}>
        {VIEW_LABELS.map((label, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }} onClick={() => setViewIdx(i)}>
            <div style={{ width: i === viewIdx ? 28 : 9, height: 9, borderRadius: 5, background: i === viewIdx ? '#DC2626' : '#D1D5DB', transition: 'all 0.4s' }} />
            <span style={{ fontSize: fsm - 1, color: i === viewIdx ? '#DC2626' : '#9CA3AF', fontWeight: i === viewIdx ? 700 : 400 }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Rotating view */}
      <div style={{
        flex: 1, background: '#fff', borderRadius: 14, padding: '14px 16px',
        boxShadow: '0 3px 10px rgba(0,0,0,0.08)', overflow: 'hidden',
        opacity: fade ? 1 : 0, transform: fade ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}>
        {views[viewIdx]}
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.5}}
      `}</style>
    </div>
  )
}
