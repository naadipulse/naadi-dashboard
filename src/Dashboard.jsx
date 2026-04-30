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

// Animated number counter
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

// Photo with initials fallback
function Photo({ party, size = 56 }) {
  const [err, setErr] = useState(false)
  const cfg = PC[party] || PC['Others']
  return err || !cfg.photo ? (
    <div style={{ width: size, height: size, borderRadius: '50%', background: cfg.color + '22', border: `3px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.28, fontWeight: 900, color: cfg.color, flexShrink: 0 }}>
      {cfg.short?.slice(0, 2)}
    </div>
  ) : (
    <img src={cfg.photo} alt="" onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `3px solid ${cfg.color}`, flexShrink: 0 }} />
  )
}

// Real Tamil Nadu shape SVG map
// 32 districts with approximate paths within TN boundary
function TNMap({ seats }) {
  // TN outline path - accurate shape
  const TN_OUTLINE = "M 280,10 L 320,15 L 360,25 L 380,45 L 370,70 L 390,90 L 400,120 L 395,150 L 410,175 L 420,200 L 415,230 L 425,260 L 420,290 L 430,320 L 425,350 L 415,375 L 400,400 L 385,420 L 365,440 L 345,460 L 320,475 L 295,490 L 270,500 L 250,495 L 235,480 L 225,460 L 230,440 L 220,415 L 210,390 L 215,365 L 205,340 L 200,310 L 195,280 L 200,250 L 190,220 L 185,190 L 195,165 L 200,140 L 190,115 L 195,90 L 210,70 L 225,50 L 245,30 L 265,15 Z"

  // District regions within TN - approximate center points and labels
  const DISTRICTS = [
    { name: 'Chennai', cx: 340, cy: 80, seats: 18 },
    { name: 'Thiruvallur', cx: 295, cy: 75, seats: 6 },
    { name: 'Kancheepuram', cx: 310, cy: 115, seats: 5 },
    { name: 'Chengalpattu', cx: 330, cy: 140, seats: 5 },
    { name: 'Ranipet', cx: 270, cy: 95, seats: 4 },
    { name: 'Vellore', cx: 255, cy: 120, seats: 5 },
    { name: 'Tirupattur', cx: 250, cy: 145, seats: 3 },
    { name: 'Villupuram', cx: 310, cy: 185, seats: 6 },
    { name: 'Kallakurichi', cx: 285, cy: 175, seats: 4 },
    { name: 'Cuddalore', cx: 350, cy: 195, seats: 6 },
    { name: 'Salem', cx: 250, cy: 175, seats: 8 },
    { name: 'Namakkal', cx: 240, cy: 200, seats: 4 },
    { name: 'Dharmapuri', cx: 230, cy: 160, seats: 4 },
    { name: 'Krishnagiri', cx: 235, cy: 140, seats: 4 },
    { name: 'Erode', cx: 220, cy: 215, seats: 7 },
    { name: 'Tiruppur', cx: 225, cy: 245, seats: 7 },
    { name: 'Coimbatore', cx: 210, cy: 270, seats: 10 },
    { name: 'Nilgiris', cx: 215, cy: 235, seats: 3 },
    { name: 'Thanjavur', cx: 315, cy: 240, seats: 8 },
    { name: 'Nagapattinam', cx: 345, cy: 255, seats: 5 },
    { name: 'Tiruvarur', cx: 335, cy: 270, seats: 4 },
    { name: 'Mayiladuthurai', cx: 355, cy: 240, seats: 4 },
    { name: 'Ariyalur', cx: 300, cy: 225, seats: 3 },
    { name: 'Perambalur', cx: 285, cy: 210, seats: 2 },
    { name: 'Trichy', cx: 290, cy: 240, seats: 8 },
    { name: 'Karur', cx: 260, cy: 245, seats: 3 },
    { name: 'Pudukkottai', cx: 305, cy: 275, seats: 5 },
    { name: 'Madurai', cx: 265, cy: 320, seats: 9 },
    { name: 'Theni', cx: 245, cy: 340, seats: 4 },
    { name: 'Dindigul', cx: 255, cy: 295, seats: 6 },
    { name: 'Sivagangai', cx: 300, cy: 315, seats: 4 },
    { name: 'Ramanathapuram', cx: 320, cy: 345, seats: 4 },
    { name: 'Virudhunagar', cx: 275, cy: 360, seats: 6 },
    { name: 'Tirunelveli', cx: 255, cy: 390, seats: 7 },
    { name: 'Tenkasi', cx: 245, cy: 415, seats: 4 },
    { name: 'Thoothukudi', cx: 290, cy: 400, seats: 5 },
    { name: 'Kanyakumari', cx: 265, cy: 460, seats: 5 },
  ]

  // Assign seat colors based on constituencies data
  // Map seats array index to districts proportionally
  const getDistrictColor = (districtIdx) => {
    const district = DISTRICTS[districtIdx]
    if (!district) return '#E5E7EB'
    const startIdx = DISTRICTS.slice(0, districtIdx).reduce((s, d) => s + d.seats, 0)
    const distSeats = seats.slice(startIdx, startIdx + district.seats)
    const counts = {}
    distSeats.forEach(s => { if (s.party !== 'pending') counts[s.party] = (counts[s.party] || 0) + 1 })
    if (Object.keys(counts).length === 0) return '#E5E7EB'
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    return PC[dominant]?.color || '#E5E7EB'
  }

  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <div style={{ fontSize: 13, color: '#374151', fontWeight: 700, marginBottom: 6 }}>
        தமிழ்நாடு | 234 தொகுதிகள்
      </div>
      <svg viewBox="180 10 250 500" width="100%" height="100%" style={{ maxWidth: 280, maxHeight: 420, display: 'block', margin: '0 auto' }}>
        <defs>
          <clipPath id="tn-clip">
            <path d={TN_OUTLINE} />
          </clipPath>
          <filter id="shadow">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.2" />
          </filter>
        </defs>

        {/* Background TN shape */}
        <path d={TN_OUTLINE} fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" filter="url(#shadow)" />

        {/* District cells */}
        {DISTRICTS.map((d, i) => {
          const color = getDistrictColor(i)
          const isDeclared = color !== '#E5E7EB'
          return (
            <g key={i}>
              <circle
                cx={d.cx} cy={d.cy}
                r={Math.sqrt(d.seats) * 7}
                fill={color}
                fillOpacity={isDeclared ? 0.85 : 0.3}
                stroke={isDeclared ? color : '#D1D5DB'}
                strokeWidth={1}
                style={{ transition: 'fill 1s ease, fill-opacity 1s ease' }}
              />
              {d.seats >= 6 && (
                <text x={d.cx} y={d.cy + 4} textAnchor="middle" fontSize={8} fill={isDeclared ? '#fff' : '#9CA3AF'} fontWeight="bold">
                  {d.name.length > 6 ? d.name.slice(0, 5) : d.name}
                </text>
              )}
            </g>
          )
        })}

        {/* TN outline on top */}
        <path d={TN_OUTLINE} fill="none" stroke="#374151" strokeWidth="1.5" />
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
        {Object.entries(PC).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 12, height: 12, background: v.color, borderRadius: 3 }} />
            <span style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>{v.short}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 12, height: 12, background: '#E5E7EB', border: '1px solid #D1D5DB', borderRadius: 3 }} />
          <span style={{ fontSize: 11, color: '#374151', fontWeight: 600 }}>நிலுவை</span>
        </div>
      </div>
    </div>
  )
}

// Animated cycling party card
function FlashCard({ tally }) {
  const [idx, setIdx] = useState(0)
  const [fade, setFade] = useState(true)
  const parties = Object.keys(PC)

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % parties.length)
        setFade(true)
      }, 300)
    }, 4000)
    return () => clearInterval(iv)
  }, [])

  const party = parties[idx]
  const cfg = PC[party]
  const data = tally.find(t => t.party === party) || { won: 0, leadingg: 0 }
  const total = data.won + (data.leadingg || 0)
  const hasMaj = total >= MAJORITY
  const pct = Math.min((total / MAJORITY) * 100, 100)

  return (
    <div style={{
      background: hasMaj ? cfg.light : '#fff',
      border: `3px solid ${hasMaj ? cfg.color : '#E5E7EB'}`,
      borderRadius: 16,
      padding: '20px 24px',
      boxShadow: hasMaj ? `0 0 24px ${cfg.color}44` : '0 4px 16px rgba(0,0,0,0.08)',
      transition: 'opacity 0.3s, border-color 0.5s',
      opacity: fade ? 1 : 0,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Color accent top bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: cfg.color }} />

      {hasMaj && (
        <div style={{ textAlign: 'center', background: cfg.color, color: '#fff', fontSize: 13, fontWeight: 800, borderRadius: 8, padding: '4px 0', marginBottom: 12, animation: 'pulse 1.5s infinite' }}>
          🏆 பெரும்பான்மை பெற்றது!
        </div>
      )}

      {/* Leader info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <Photo party={party} size={64} />
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: cfg.color }}>{cfg.label}</div>
          <div style={{ fontSize: 14, color: '#6B7280', fontWeight: 600 }}>{cfg.leader}</div>
        </div>
        {/* Dots */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
          {parties.map((_, i) => (
            <div key={i} style={{ width: i === idx ? 18 : 7, height: 7, borderRadius: 4, background: i === idx ? cfg.color : '#E5E7EB', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>

      {/* Big numbers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ textAlign: 'center', background: cfg.light, borderRadius: 10, padding: '10px 6px' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginBottom: 4 }}>மொத்தம்</div>
          <AnimNum val={total} color={cfg.color} size={42} />
        </div>
        <div style={{ textAlign: 'center', background: '#F0FDF4', borderRadius: 10, padding: '10px 6px' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginBottom: 4 }}>வென்றது ✅</div>
          <AnimNum val={data.won} color="#16A34A" size={34} />
        </div>
        <div style={{ textAlign: 'center', background: '#FEF3C7', borderRadius: 10, padding: '10px 6px' }}>
          <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginBottom: 4 }}>முன்னிலை 📈</div>
          <AnimNum val={data.leadingg || 0} color="#D97706" size={34} />
        </div>
      </div>

      {/* Progress to majority */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>பெரும்பான்மை நோக்கி</span>
          <span style={{ fontSize: 13, color: cfg.color, fontWeight: 700 }}>{total} / 118</span>
        </div>
        <div style={{ background: '#E5E7EB', borderRadius: 999, height: 12, overflow: 'hidden' }}>
          <div style={{ background: cfg.color, width: `${pct}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease' }} />
        </div>
      </div>
    </div>
  )
}

// Constituency rows - left panel
function ConstRows({ items }) {
  const dec = items.filter(c => c.leading_party && c.leading_party !== 'pending').slice(0, 10)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, height: '100%', overflow: 'hidden' }}>
      <div style={{ fontSize: 14, color: '#fff', fontWeight: 800, padding: '6px 10px', background: '#374151', borderRadius: 8, marginBottom: 4 }}>
        📍 சமீபத்திய முடிவுகள்
      </div>
      {dec.length === 0 && (
        <div style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: 20 }}>⏳ முடிவுகள் வரவில்லை...</div>
      )}
      {dec.map((c, i) => {
        const lp = PC[c.leading_party] || PC['Others']
        return (
          <div key={c.id} style={{
            background: '#fff',
            borderLeft: `4px solid ${lp.color}`,
            borderRadius: '0 10px 10px 0',
            padding: '8px 12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            animation: `slideIn 0.4s ease ${i * 0.05}s both`,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{c.name_tamil || c.name}</div>
              {c.lead_margin > 0 && <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600 }}>+{c.lead_margin} votes</div>}
            </div>
            <div style={{ background: lp.color, color: '#fff', fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 14, whiteSpace: 'nowrap' }}>
              {c.status === 'declared' ? '✅' : '📈'} {lp.short}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Right panel - party totals
function PartyPanel({ tally }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%', overflow: 'hidden' }}>
      <div style={{ fontSize: 14, color: '#fff', fontWeight: 800, padding: '6px 10px', background: '#374151', borderRadius: 8, marginBottom: 4 }}>
        கட்சிவாரி நிலவரம்
      </div>
      {Object.keys(PC).map(p => {
        const cfg = PC[p]
        const data = tally.find(t => t.party === p) || { won: 0, leadingg: 0 }
        const total = data.won + (data.leadingg || 0)
        const hasMaj = total >= MAJORITY
        const pct = Math.min((total / MAJORITY) * 100, 100)
        return (
          <div key={p} style={{
            background: hasMaj ? cfg.light : '#fff',
            border: `2px solid ${hasMaj ? cfg.color : '#E5E7EB'}`,
            borderRadius: 12, padding: '10px 14px',
            boxShadow: hasMaj ? `0 0 16px ${cfg.color}44` : '0 2px 6px rgba(0,0,0,0.06)',
            transition: 'all 0.5s',
          }}>
            {hasMaj && <div style={{ textAlign: 'center', background: cfg.color, color: '#fff', fontSize: 11, fontWeight: 800, borderRadius: 6, padding: '2px 0', marginBottom: 8, animation: 'pulse 1.5s infinite' }}>🏆 பெரும்பான்மை!</div>}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Photo party={p} size={42} />
              <div style={{ flex: 1 }}>
                <div style={{ color: cfg.color, fontWeight: 900, fontSize: 16 }}>{cfg.label}</div>
                <div style={{ color: '#6B7280', fontSize: 12 }}>{cfg.leader}</div>
              </div>
              <AnimNum val={total} color={cfg.color} size={36} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, textAlign: 'center', background: '#F0FDF4', borderRadius: 8, padding: '4px 0' }}>
                <div style={{ fontSize: 10, color: '#6B7280' }}>வென்றது</div>
                <AnimNum val={data.won} color="#16A34A" size={22} />
              </div>
              <div style={{ flex: 1, textAlign: 'center', background: '#FEF3C7', borderRadius: 8, padding: '4px 0' }}>
                <div style={{ fontSize: 10, color: '#6B7280' }}>முன்னிலை</div>
                <AnimNum val={data.leadingg || 0} color="#D97706" size={22} />
              </div>
            </div>
            <div style={{ background: '#E5E7EB', borderRadius: 999, height: 8, overflow: 'hidden' }}>
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
  )
}

export default function Dashboard() {
  const [tally, setTally] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [seats, setSeats] = useState(Array.from({ length: 234 }, (_, i) => ({ id: i + 1, party: 'pending' })))
  const [time, setTime] = useState(new Date())
  const [winner, setWinner] = useState(null)
  const [showWinner, setShowWinner] = useState(false)

  useEffect(() => {
    fetchTally(); fetchConstituencies()
    const t1 = supabase.channel('tally').on('postgres_changes', { event: '*', schema: 'public', table: 'overall_tally' }, fetchTally).subscribe()
    const t2 = supabase.channel('const').on('postgres_changes', { event: '*', schema: 'public', table: 'constituencies' }, fetchConstituencies).subscribe()
    const poll = setInterval(() => { fetchTally(); fetchConstituencies() }, 5000)
    const clk = setInterval(() => setTime(new Date()), 1000)
    return () => { t1.unsubscribe(); t2.unsubscribe(); clearInterval(poll); clearInterval(clk) }
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
    if (!data) return
    setConstituencies(data)
    setSeats(prev => {
      const u = [...prev]
      data.forEach(c => {
        if (c.id && c.leading_party && c.leading_party !== 'pending') {
          const i = c.id - 1
          if (i >= 0 && i < 234) u[i] = { ...u[i], party: c.leading_party }
        }
      })
      return u
    })
  }

  const gT = p => { const d = tally.find(t => t.party === p); return d ? d.won + (d.leadingg || 0) : 0 }
  const totalDeclared = tally.reduce((s, t) => s + t.won + (t.leadingg || 0), 0)
  const winnerCfg = PC[winner]
  const ticker = [...Object.keys(PC).map(p => `${PC[p].short}: ${gT(p)} இடங்கள்`), '🏆 பெரும்பான்மை: 118', '234 தொகுதிகள் | நாடி @naadipulse']

  return (
    <div style={{ background: '#F1F5F9', minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* WINNER POPUP */}
      {showWinner && winnerCfg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', border: `4px solid ${winnerCfg.color}`, borderRadius: 24, padding: '50px 80px', background: '#fff', boxShadow: `0 0 80px ${winnerCfg.color}55` }}>
            <div style={{ fontSize: 80 }}>🏆</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: winnerCfg.color, marginTop: 12 }}>{winnerCfg.label}</div>
            <div style={{ color: '#374151', fontSize: 22, marginTop: 8 }}>பெரும்பான்மை பெற்றது!</div>
          </div>
        </div>
      )}

      {/* TOP RED BAR */}
      <div style={{ background: 'linear-gradient(90deg,#B91C1C,#7F1D1D)', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: '#fff', color: '#DC2626', fontWeight: 900, fontSize: 12, padding: '2px 10px', borderRadius: 4, animation: 'blink 1.5s infinite' }}>● LIVE</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {Object.keys(PC).map(p => (
            <div key={p} style={{ background: PC[p].color, borderRadius: 8, padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{PC[p].short}</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{gT(p)}</span>
            </div>
          ))}
          <span style={{ color: '#fff', fontSize: 13, marginLeft: 6 }}>{time.toLocaleTimeString('en-IN')} | May 4</span>
        </div>
      </div>

      {/* TICKER */}
      <div style={{ height: 34, background: '#1E293B', display: 'flex', overflow: 'hidden' }}>
        <div style={{ background: '#EF4444', color: '#fff', fontWeight: 900, fontSize: 12, padding: '0 14px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: 1 }}>BREAKING</div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap', gap: 50, color: '#FCD34D', fontSize: 13, fontWeight: 600 }}>
            {[...ticker, ...ticker].map((m, i) => <span key={i}>{m}</span>)}
          </div>
        </div>
      </div>

      {/* NAADI HEADER */}
      <div style={{ background: '#fff', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderBottom: '3px solid #E5E7EB' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(90deg,#F59E0B,#DC2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>நாடி | NAADI</div>
          <div style={{ fontSize: 12, color: '#9CA3AF' }}>@naadipulse • தரவு மட்டுமே பேசுகிறது</div>
        </div>
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {Object.keys(PC).map(p => (
            <div key={p} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: PC[p].color, fontWeight: 700 }}>{PC[p].short}</div>
              <AnimNum val={gT(p)} color={PC[p].color} size={30} />
            </div>
          ))}
          <div style={{ width: 2, height: 44, background: '#E5E7EB' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>முடிவு வந்தவை</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#F59E0B' }}>{totalDeclared}<span style={{ fontSize: 14, color: '#9CA3AF' }}>/234</span></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>பெரும்பான்மை</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#DC2626' }}>118</div>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 290px', gap: 10, padding: '10px 12px' }}>

        {/* LEFT — constituency rows */}
        <div style={{ background: '#F8FAFC', borderRadius: 14, padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <ConstRows items={constituencies} />
        </div>

        {/* CENTER — Flash card + TN Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Animated Flash Card */}
          <FlashCard tally={tally} />

          {/* TN Map */}
          <div style={{ background: '#fff', borderRadius: 14, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TNMap seats={seats} />
          </div>
        </div>

        {/* RIGHT — party totals */}
        <div style={{ background: '#F8FAFC', borderRadius: 14, padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <PartyPanel tally={tally} />
        </div>
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
    </div>
  )
}
