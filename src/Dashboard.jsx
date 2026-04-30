import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

const MAJORITY = 118
const TOTAL = 234

const PC = {
  'DMK+':    { color: '#DC2626', light: '#FEE2E2', label: 'திமுக+',  short: 'DMK',  leader: 'மு.க.ஸ்டாலின்', photo: 'https://i.ibb.co/fGKGZ6PK/stalin.jpg' },
  'AIADMK+': { color: '#16A34A', light: '#DCFCE7', label: 'அதிமுக+', short: 'ADMK', leader: 'எடப்பாடி',       photo: 'https://i.ibb.co/Xrt4nYLB/edappadi.jpg' },
  'TVK':     { color: '#D97706', light: '#FEF3C7', label: 'தவெக',    short: 'TVK',  leader: 'விஜய்',           photo: 'https://i.ibb.co/CpGmHqFQ/vijay.jpg' },
  'Others':  { color: '#7C3AED', light: '#EDE9FE', label: 'மற்றவை',  short: 'OTH',  leader: 'சீமான்',          photo: 'https://i.ibb.co/NnpMmcHn/seeman.jpg' },
}

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

function AnimNum({ val, color, size = 48 }) {
  const [n, setN] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const s = prev.current, e = val
    if (s === e) return
    const t0 = Date.now()
    const run = () => {
      const p = Math.min((Date.now() - t0) / 800, 1)
      setN(Math.round(s + (e - s) * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(run)
      else prev.current = e
    }
    requestAnimationFrame(run)
  }, [val])
  return <span style={{ color, fontSize: size, fontWeight: 900, lineHeight: 1 }}>{n}</span>
}

function Photo({ party, size = 56 }) {
  const [err, setErr] = useState(false)
  const cfg = PC[party] || PC['Others']
  return err || !cfg.photo ? (
    <div style={{ width: size, height: size, borderRadius: '50%', background: cfg.color + '22', border: `3px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.28, fontWeight: 900, color: cfg.color, flexShrink: 0 }}>{cfg.short?.slice(0, 2)}</div>
  ) : (
    <img src={cfg.photo} alt="" onError={() => setErr(true)} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `3px solid ${cfg.color}`, flexShrink: 0 }} />
  )
}

// VIEW 1: Constituency results
function View1({ constituencies }) {
  const dec = constituencies.filter(c => c.leading_party && c.leading_party !== 'pending')
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 5, overflow: 'hidden' }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ background: '#EF4444', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 4, animation: 'blink 1.5s infinite' }}>LIVE</span>
        📍 தொகுதிவாரி முடிவுகள்
      </div>
      {dec.length === 0 && <div style={{ color: '#9CA3AF', fontSize: 14, textAlign: 'center', padding: 30 }}>⏳ முடிவுகள் வரவில்லை...</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflow: 'hidden', flex: 1 }}>
        {dec.slice(0, 10).map((c, i) => {
          const lp = PC[c.leading_party] || PC['Others']
          return (
            <div key={c.id} style={{
              background: '#fff', borderLeft: `4px solid ${lp.color}`,
              borderRadius: '0 10px 10px 0', padding: '8px 14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              animation: `slideIn 0.4s ease ${i * 0.06}s both`,
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{c.name_tamil || c.name}</div>
                {c.lead_margin > 0 && <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600 }}>+{c.lead_margin} votes</div>}
              </div>
              <div style={{ background: lp.color, color: '#fff', fontSize: 13, fontWeight: 800, padding: '5px 12px', borderRadius: 16 }}>
                {c.status === 'declared' ? '✅' : '📈'} {lp.short}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// VIEW 2: Animation video placeholder
function View2() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0F172A', borderRadius: 14 }}>
      <div style={{ fontSize: 60, marginBottom: 16, animation: 'spin 3s linear infinite' }}>🎬</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>நாடி LIVE 2026</div>
      <div style={{ fontSize: 14, color: '#94A3B8', textAlign: 'center', maxWidth: 280 }}>
        இங்கே உங்கள் animation video embed பண்ணலாம்
      </div>
      <div style={{ marginTop: 16, fontSize: 13, color: '#475569', background: '#1E293B', padding: '8px 16px', borderRadius: 8 }}>
        VIDEO_URL இங்கே போடுங்க
      </div>
      {/* Pulsing dots */}
      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626', animation: `pulseDot 1.5s ease ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  )
}

// VIEW 3: Parliament semicircle 234 dots
function View3({ tally }) {
  const partiesOrder = Object.keys(PC)
  
  // Build seats array sorted by party
  const seatsByParty = []
  partiesOrder.forEach(p => {
    const d = tally.find(t => t.party === p) || { won: 0, leadingg: 0 }
    const tot = d.won + (d.leadingg || 0)
    for (let i = 0; i < tot; i++) seatsByParty.push(p)
  })
  // Fill remaining with pending
  while (seatsByParty.length < TOTAL) seatsByParty.push('pending')

  // Semicircle layout - 3 rows
  const ROWS = [
    { r: 180, count: 60, startAngle: Math.PI, endAngle: 2 * Math.PI },
    { r: 140, count: 80, startAngle: Math.PI, endAngle: 2 * Math.PI },
    { r: 100, count: 94, startAngle: Math.PI, endAngle: 2 * Math.PI },
  ]

  const dots = []
  let idx = 0
  ROWS.forEach(({ r, count, startAngle, endAngle }) => {
    for (let i = 0; i < count; i++) {
      const angle = startAngle + (i / count) * (endAngle - startAngle)
      dots.push({
        x: 220 + r * Math.cos(angle),
        y: 200 + r * Math.sin(angle),
        party: seatsByParty[idx++] || 'pending',
      })
    }
  })

  const totals = {}
  Object.keys(PC).forEach(p => {
    const d = tally.find(t => t.party === p) || { won: 0, leadingg: 0 }
    totals[p] = d.won + (d.leadingg || 0)
  })

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
        🏛️ சட்டமன்றம் — 234 இடங்கள்
      </div>
      <svg width={440} height={220} style={{ overflow: 'visible' }}>
        {dots.map((d, i) => {
          const cfg = PC[d.party]
          const isDeclared = d.party !== 'pending'
          return (
            <circle key={i}
              cx={d.x} cy={d.y} r={5}
              fill={isDeclared ? cfg?.color : '#E5E7EB'}
              stroke={isDeclared ? cfg?.color : '#D1D5DB'}
              strokeWidth={0.5}
              style={{ transition: `fill 0.8s ease ${i * 0.002}s` }}
            />
          )
        })}
        {/* 118 label */}
        <text x={220} y={215} textAnchor="middle" fontSize={12} fill="#374151" fontWeight="bold">
          🎯 பெரும்பான்மை: 118
        </text>
        {/* Majority line */}
        <line x1={40} y1={200} x2={220} y2={200} stroke="#374151" strokeWidth={1.5} strokeDasharray="4,3" />
        <line x1={220} y1={200} x2={400} y2={200} stroke="#374151" strokeWidth={1.5} strokeDasharray="4,3" />
      </svg>

      {/* Party totals below semicircle */}
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        {Object.entries(PC).map(([p, cfg]) => (
          <div key={p} style={{ textAlign: 'center', background: cfg.light, border: `2px solid ${cfg.color}`, borderRadius: 10, padding: '8px 14px', minWidth: 70 }}>
            <div style={{ fontSize: 11, color: cfg.color, fontWeight: 700 }}>{cfg.short}</div>
            <AnimNum val={totals[p] || 0} color={cfg.color} size={28} />
          </div>
        ))}
      </div>
    </div>
  )
}

// VIEW 4: District-wise results
function View4({ constituencies }) {
  const districtData = DISTRICTS.slice(0, 16).map((name, i) => {
    // Simulate district results from constituency data
    const sample = constituencies.slice(i * 6, (i + 1) * 6)
    const counts = {}
    sample.forEach(c => { if (c.leading_party && c.leading_party !== 'pending') counts[c.leading_party] = (counts[c.leading_party] || 0) + 1 })
    const leading = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return { name, leading: leading ? leading[0] : null, count: leading ? leading[1] : 0 }
  })

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
        🗺️ மாவட்டவாரி நிலவரம்
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, flex: 1, overflow: 'hidden' }}>
        {districtData.map((d, i) => {
          const cfg = d.leading ? PC[d.leading] : null
          return (
            <div key={i} style={{
              background: '#fff',
              border: `2px solid ${cfg ? cfg.color : '#E5E7EB'}`,
              borderRadius: 8, padding: '6px 10px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              animation: `slideIn 0.3s ease ${i * 0.03}s both`,
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>{d.name}</div>
                {d.leading && <div style={{ fontSize: 10, color: cfg?.color, fontWeight: 600 }}>{cfg?.label}</div>}
              </div>
              {d.leading ? (
                <div style={{ background: cfg?.color, color: '#fff', fontSize: 12, fontWeight: 800, width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{d.count}</div>
              ) : (
                <div style={{ color: '#D1D5DB', fontSize: 11 }}>—</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// VIEW 5: Exit poll vs actual
function View5({ tally }) {
  const exitPolls = {
    'DMK+':    { matrize: '122-132', peoples: '125-145', jvc: '75-95', axis: '92-110' },
    'AIADMK+': { matrize: '87-110',  peoples: '65-80',   jvc: '128-147', axis: '22-32' },
    'TVK':     { matrize: '10-12',   peoples: '18-24',   jvc: '8-15',    axis: '98-120' },
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#374151', marginBottom: 8 }}>
        📊 Exit Poll vs உண்மை
      </div>
      <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', flex: 1, boxShadow: '0 2px 6px rgba(0,0,0,0.07)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#374151', color: '#fff' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700 }}>கட்சி</th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 600, fontSize: 11 }}>Matrize</th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 600, fontSize: 11 }}>JVC</th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 600, fontSize: 11 }}>Axis</th>
              <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, background: '#1D4ED8', fontSize: 12 }}>உண்மை</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(exitPolls).map(([party, polls], i) => {
              const cfg = PC[party]
              const d = tally.find(t => t.party === party) || { won: 0, leadingg: 0 }
              const actual = d.won + (d.leadingg || 0)
              return (
                <tr key={party} style={{ background: i % 2 === 0 ? cfg.light : '#fff', borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ color: cfg.color, fontWeight: 800, fontSize: 14 }}>{cfg.label}</span>
                  </td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#374151', fontSize: 12 }}>{polls.matrize}</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#374151', fontSize: 12 }}>{polls.jvc}</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#374151', fontSize: 12, fontWeight: 600 }}>{polls.axis}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <span style={{ background: cfg.color, color: '#fff', fontSize: 18, fontWeight: 900, padding: '2px 10px', borderRadius: 8 }}>
                      {actual}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 8 }}>
        ஆதாரம்: Matrize (Republic TV) | JVC (Times Now) | Axis (India Today)
      </div>
    </div>
  )
}

// View indicator dots
function ViewDots({ current, total }) {
  const labels = ['தொகுதி', 'வீடியோ', 'சட்டமன்றம்', 'மாவட்டம்', 'Exit Poll']
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 6, alignItems: 'center' }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
          <div style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? '#DC2626' : '#D1D5DB', transition: 'all 0.4s' }} />
          <span style={{ fontSize: 9, color: i === current ? '#DC2626' : '#9CA3AF', fontWeight: i === current ? 700 : 400 }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [tally, setTally] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [time, setTime] = useState(new Date())
  const [winner, setWinner] = useState(null)
  const [showWinner, setShowWinner] = useState(false)
  const [viewIdx, setViewIdx] = useState(0)
  const [viewFade, setViewFade] = useState(true)
  const TOTAL_VIEWS = 5

  useEffect(() => {
    fetchTally(); fetchConstituencies()
    const t1 = supabase.channel('tally').on('postgres_changes', { event: '*', schema: 'public', table: 'overall_tally' }, fetchTally).subscribe()
    const t2 = supabase.channel('const').on('postgres_changes', { event: '*', schema: 'public', table: 'constituencies' }, fetchConstituencies).subscribe()
    const poll = setInterval(() => { fetchTally(); fetchConstituencies() }, 5000)
    const clk = setInterval(() => setTime(new Date()), 1000)

    // View rotation every 5 seconds
    const viewTimer = setInterval(() => {
      setViewFade(false)
      setTimeout(() => {
        setViewIdx(v => (v + 1) % TOTAL_VIEWS)
        setViewFade(true)
      }, 400)
    }, 5000)

    return () => { t1.unsubscribe(); t2.unsubscribe(); clearInterval(poll); clearInterval(clk); clearInterval(viewTimer) }
  }, [])

  const fetchTally = async () => {
    const { data } = await supabase.from('overall_tally').select('*')
    if (data) {
      setTally(data)
      const w = data.find(t => t.won + (t.leadingg || 0) >= MAJORITY)
      if (w && !winner) { setWinner(w.party); setShowWinner(true); setTimeout(() => setShowWinner(false), 8000) }
    }
  }

  const fetchConstituencies = async () => {
    const { data } = await supabase.from('constituencies').select('*').order('updated_at', { ascending: false })
    if (data) setConstituencies(data)
  }

  const gT = p => { const d = tally.find(t => t.party === p); return d ? d.won + (d.leadingg || 0) : 0 }
  const gW = p => tally.find(t => t.party === p)?.won || 0
  const gL = p => tally.find(t => t.party === p)?.leadingg || 0
  const totalDeclared = tally.reduce((s, t) => s + t.won + (t.leadingg || 0), 0)
  const winnerCfg = PC[winner]

  // Sort parties by total for left panel (top 3)
  const sortedParties = Object.keys(PC).sort((a, b) => gT(b) - gT(a))
  const top3 = sortedParties.slice(0, 3)

  const ticker = [...Object.keys(PC).map(p => `${PC[p].short}: ${gT(p)} இடங்கள்`), '🏆 பெரும்பான்மை: 118', '234 தொகுதிகள் | நாடி @naadipulse']

  const views = [
    <View1 constituencies={constituencies} />,
    <View2 />,
    <View3 tally={tally} />,
    <View4 constituencies={constituencies} />,
    <View5 tally={tally} />,
  ]

  return (
    <div style={{ background: '#F1F5F9', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, sans-serif", display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* WINNER */}
      {showWinner && winnerCfg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', border: `4px solid ${winnerCfg.color}`, borderRadius: 24, padding: '50px 80px', background: '#fff', boxShadow: `0 0 80px ${winnerCfg.color}55` }}>
            <div style={{ fontSize: 80 }}>🏆</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: winnerCfg.color, marginTop: 12 }}>{winnerCfg.label}</div>
            <div style={{ color: '#374151', fontSize: 22, marginTop: 8 }}>பெரும்பான்மை பெற்றது!</div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ background: 'linear-gradient(90deg,#B91C1C,#7F1D1D)', padding: '7px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: '#fff', color: '#DC2626', fontWeight: 900, fontSize: 12, padding: '2px 10px', borderRadius: 4, animation: 'blink 1.5s infinite' }}>● LIVE</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Object.keys(PC).map(p => (
            <div key={p} style={{ background: PC[p].color, borderRadius: 8, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{PC[p].short}</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{gT(p)}</span>
            </div>
          ))}
          <span style={{ color: '#fff', fontSize: 12, marginLeft: 6 }}>{time.toLocaleTimeString('en-IN')} | May 4</span>
        </div>
      </div>

      {/* TICKER */}
      <div style={{ height: 32, background: '#1E293B', display: 'flex', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ background: '#EF4444', color: '#fff', fontWeight: 900, fontSize: 12, padding: '0 14px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}>BREAKING</div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap', gap: 50, color: '#FCD34D', fontSize: 13, fontWeight: 600 }}>
            {[...ticker, ...ticker].map((m, i) => <span key={i}>{m}</span>)}
          </div>
        </div>
      </div>

      {/* NAADI HEADER */}
      <div style={{ background: '#fff', padding: '7px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderBottom: '3px solid #E5E7EB', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(90deg,#F59E0B,#DC2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>நாடி | NAADI</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>@naadipulse • தரவு மட்டுமே பேசுகிறது</div>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {Object.keys(PC).map(p => (
            <div key={p} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: PC[p].color, fontWeight: 700 }}>{PC[p].short}</div>
              <AnimNum val={gT(p)} color={PC[p].color} size={28} />
            </div>
          ))}
          <div style={{ width: 2, height: 36, background: '#E5E7EB' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6B7280' }}>முடிவு</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B' }}>{totalDeclared}<span style={{ fontSize: 12, color: '#9CA3AF' }}>/234</span></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6B7280' }}>பெரும்பான்மை</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#DC2626' }}>118</div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', gap: 10, padding: '8px 12px 8px', minHeight: 0 }}>

        {/* LEFT — fixed top 3 party cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
          {top3.map((p, rank) => {
            const cfg = PC[p]
            const tot = gT(p), won = gW(p), lead = gL(p)
            const hasMaj = tot >= MAJORITY
            const pct = Math.min((tot / MAJORITY) * 100, 100)
            return (
              <div key={p} style={{
                background: hasMaj ? cfg.light : '#fff',
                border: `2px solid ${hasMaj ? cfg.color : '#E5E7EB'}`,
                borderRadius: 14, padding: '12px 16px',
                boxShadow: hasMaj ? `0 0 20px ${cfg.color}44` : '0 3px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.5s',
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* Top accent */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: cfg.color }} />
                {rank === 0 && tot > 0 && (
                  <div style={{ position: 'absolute', top: 6, right: 10, fontSize: 10, color: '#F59E0B', fontWeight: 800 }}>🥇 முன்னிலை</div>
                )}
                {hasMaj && (
                  <div style={{ textAlign: 'center', background: cfg.color, color: '#fff', fontSize: 11, fontWeight: 800, borderRadius: 6, padding: '2px 0', marginBottom: 8, animation: 'pulse 1.5s infinite' }}>🏆 பெரும்பான்மை!</div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Photo party={p} size={46} />
                  <div>
                    <div style={{ color: cfg.color, fontWeight: 900, fontSize: 17 }}>{cfg.label}</div>
                    <div style={{ color: '#6B7280', fontSize: 12 }}>{cfg.leader}</div>
                  </div>
                </div>
                {/* Numbers */}
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 10 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>மொத்தம்</div>
                    <AnimNum val={tot} color={cfg.color} size={40} />
                  </div>
                  <div style={{ width: 1, background: '#E5E7EB' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>வென்றது</div>
                    <AnimNum val={won} color="#16A34A" size={26} />
                  </div>
                  <div style={{ width: 1, background: '#E5E7EB' }} />
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>முன்னிலை</div>
                    <AnimNum val={lead} color="#D97706" size={26} />
                  </div>
                </div>
                {/* Progress bar */}
                <div style={{ background: '#E5E7EB', borderRadius: 999, height: 10, overflow: 'hidden' }}>
                  <div style={{ background: cfg.color, width: `${pct}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>0</span>
                  <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>🎯 118</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* CENTER — rotating 5 views */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
          <ViewDots current={viewIdx} total={TOTAL_VIEWS} />
          <div style={{
            flex: 1,
            background: '#fff',
            borderRadius: 14,
            padding: '14px 16px',
            boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            opacity: viewFade ? 1 : 0,
            transform: viewFade ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}>
            {views[viewIdx]}
          </div>
        </div>
      </div>

      {/* BOTTOM BAR — constant big numbers */}
      <div style={{ background: '#1E293B', padding: '10px 20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexShrink: 0, borderTop: '3px solid #334155' }}>
        {Object.keys(PC).map(p => {
          const cfg = PC[p]
          const tot = gT(p)
          const hasMaj = tot >= MAJORITY
          return (
            <div key={p} style={{
              textAlign: 'center',
              background: hasMaj ? cfg.color : 'transparent',
              borderRadius: 12, padding: hasMaj ? '8px 20px' : '4px 16px',
              border: `2px solid ${hasMaj ? cfg.color : cfg.color + '44'}`,
              transition: 'all 0.5s',
              boxShadow: hasMaj ? `0 0 20px ${cfg.color}66` : 'none',
              position: 'relative',
            }}>
              {hasMaj && <div style={{ fontSize: 10, color: hasMaj ? '#fff' : cfg.color, fontWeight: 800, marginBottom: 2 }}>🏆 பெரும்பான்மை!</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Photo party={p} size={36} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 12, color: hasMaj ? '#fff' : cfg.color, fontWeight: 700 }}>{cfg.label}</div>
                  <AnimNum val={tot} color={hasMaj ? '#fff' : cfg.color} size={38} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4, justifyContent: 'center' }}>
                <span style={{ fontSize: 11, color: hasMaj ? '#fff' : '#94A3B8' }}>✅ {gW(p)}</span>
                <span style={{ fontSize: 11, color: hasMaj ? '#fff' : '#94A3B8' }}>📈 {gL(p)}</span>
              </div>
            </div>
          )
        })}

        {/* Center stats */}
        <div style={{ textAlign: 'center', borderLeft: '1px solid #334155', borderRight: '1px solid #334155', padding: '4px 24px' }}>
          <div style={{ fontSize: 12, color: '#94A3B8' }}>முடிவு வந்தவை</div>
          <div style={{ fontSize: 32, fontWeight: 900, color: '#F59E0B' }}>{totalDeclared}<span style={{ fontSize: 14, color: '#64748B' }}>/234</span></div>
          <div style={{ fontSize: 11, color: '#64748B' }}>பெரும்பான்மை: <span style={{ color: '#F59E0B', fontWeight: 700 }}>118</span></div>
        </div>
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulseDot{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.5);opacity:0.5}}
      `}</style>
    </div>
  )
}
