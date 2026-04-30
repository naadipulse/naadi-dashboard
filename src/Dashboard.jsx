import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

const MAJORITY = 118
const TOTAL = 234

const PARTY_CONFIG = {
  'DMK+':    { color: '#EF4444', label: 'திமுக+',  short: 'DMK',   leader: 'ஸ்டாலின்',  photo: 'https://i.ibb.co/fGKGZ6PK/stalin.jpg' },
  'AIADMK+': { color: '#22C55E', label: 'அதிமுக+', short: 'ADMK',  leader: 'எடப்பாடி', photo: 'https://i.ibb.co/Xrt4nYLB/edappadi.jpg' },
  'TVK':     { color: '#F59E0B', label: 'தவெக',    short: 'TVK',   leader: 'விஜய்',     photo: 'https://i.ibb.co/CpGmHqFQ/vijay.jpg' },
  'Others':  { color: '#94A3B8', label: 'மற்றவை',  short: 'OTH',   leader: 'சீமான்',   photo: 'https://i.ibb.co/NnpMmcHn/seeman.jpg' },
  'pending': { color: '#1E293B', label: 'நிலுவை',  short: '—',     leader: '',          photo: '' },
}

// Generate 234 constituency cells
const ALL_SEATS = Array.from({ length: 234 }, (_, i) => ({
  id: i + 1,
  name: `AC-${i + 1}`,
  party: 'pending',
}))

// Animated number
function AnimNum({ value, color, size = 42 }) {
  const [n, setN] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const s = prev.current, e = value
    if (s === e) return
    const t0 = Date.now()
    const run = () => {
      const p = Math.min((Date.now() - t0) / 600, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      setN(Math.round(s + (e - s) * ease))
      if (p < 1) requestAnimationFrame(run)
      else prev.current = e
    }
    requestAnimationFrame(run)
  }, [value])
  return <span style={{ color, fontSize: size, fontWeight: 900, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
}

// Photo with fallback
function Photo({ party, size = 44 }) {
  const [err, setErr] = useState(false)
  const cfg = PARTY_CONFIG[party] || {}
  if (!cfg.photo || err) {
    return (
      <div style={{ width: size, height: size, borderRadius: '50%', background: `${cfg.color}22`, border: `2px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.3, fontWeight: 900, color: cfg.color, flexShrink: 0 }}>
        {cfg.short?.slice(0, 2)}
      </div>
    )
  }
  return (
    <img src={cfg.photo} alt={cfg.leader} onError={() => setErr(true)}
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `2px solid ${cfg.color}`, flexShrink: 0 }} />
  )
}

// Ticker
function Ticker({ tally }) {
  const g = p => { const t = tally.find(x => x.party === p); return t ? t.won + (t.leadingg || 0) : 0 }
  const msgs = [`🔴 திமுக+: ${g('DMK+')}`, `🟢 அதிமுக+: ${g('AIADMK+')}`, `🟡 தவெக: ${g('TVK')}`, `⚫ மற்றவை: ${g('Others')}`, `🏆 பெரும்பான்மை: 118`, `📊 234 தொகுதிகள் | நாடி @naadipulse`]
  return (
    <div style={{ height: 28, background: '#0A0A0A', borderBottom: '1px solid #1E293B', display: 'flex', overflow: 'hidden' }}>
      <div style={{ background: '#EF4444', color: '#fff', fontWeight: 800, fontSize: 10, padding: '0 10px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}>🔴 LIVE</div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', animation: 'ticker 25s linear infinite', whiteSpace: 'nowrap', gap: 40, color: '#FCD34D', fontSize: 11, fontWeight: 600 }}>
          {[...msgs, ...msgs].map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>
    </div>
  )
}

// TN Grid Map — 234 cells in approximate TN shape
function TNMap({ seats }) {
  // 13 cols × 18 rows roughly = 234 cells in TN shape
  const COLS = 15
  const ROWS = 16

  // TN shape mask — which cells are active (approximate shape)
  const MASK = [
    [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  ]

  // Map seat index to grid position
  let seatIdx = 0
  const cells = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (MASK[r][c]) {
        const seat = seats[seatIdx] || { id: seatIdx + 1, party: 'pending' }
        cells.push({ row: r, col: c, seat, idx: seatIdx })
        seatIdx++
      }
    }
  }

  const CELL = 22

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ fontSize: 10, color: '#64748B', textAlign: 'center', marginBottom: 6, letterSpacing: 1 }}>தமிழ்நாடு | 234 தொகுதிகள்</div>
      <svg
        width={COLS * CELL}
        height={ROWS * CELL}
        style={{ display: 'block', margin: '0 auto' }}
      >
        {cells.map(({ row, col, seat, idx }) => {
          const cfg = PARTY_CONFIG[seat.party] || PARTY_CONFIG['pending']
          const x = col * CELL
          const y = row * CELL
          const isDeclared = seat.party !== 'pending'

          return (
            <g key={idx}>
              <rect
                x={x + 1} y={y + 1}
                width={CELL - 2} height={CELL - 2}
                rx={2}
                fill={cfg.color}
                opacity={isDeclared ? 1 : 0.15}
                style={{ transition: 'fill 0.8s ease, opacity 0.8s ease' }}
              />
              {isDeclared && CELL > 16 && (
                <text
                  x={x + CELL / 2} y={y + CELL / 2 + 3}
                  textAnchor="middle"
                  fontSize={7}
                  fill="white"
                  fontWeight="bold"
                  opacity={0.8}
                >
                  {cfg.short}
                </text>
              )}
            </g>
          )
        })}
        {/* 118 majority line indicator */}
        <text x={COLS * CELL / 2} y={ROWS * CELL - 2} textAnchor="middle" fontSize={8} fill="#F59E0B" fontWeight="bold">
          🎯 பெரும்பான்மை: 118
        </text>
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 8 }}>
        {Object.entries(PARTY_CONFIG).filter(([k]) => k !== 'pending').map(([party, cfg]) => (
          <div key={party} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, background: cfg.color, borderRadius: 2 }} />
            <span style={{ fontSize: 9, color: '#94A3B8' }}>{cfg.short}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 10, height: 10, background: '#1E293B', borderRadius: 2, border: '1px solid #333' }} />
          <span style={{ fontSize: 9, color: '#94A3B8' }}>நிலுவை</span>
        </div>
      </div>
    </div>
  )
}

// Animated constituency rows — shows latest results one by one
function ConstRows({ constituencies }) {
  const [visible, setVisible] = useState([])

  useEffect(() => {
    const declared = constituencies.filter(c => c.leading_party !== 'pending' && c.leading_party)
    // Show latest 8, animate in
    setVisible(declared.slice(0, 8))
  }, [constituencies])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, overflow: 'hidden' }}>
      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, marginBottom: 4, letterSpacing: 1 }}>📍 சமீபத்திய முடிவுகள்</div>
      {visible.length === 0 && (
        <div style={{ color: '#334155', fontSize: 11, textAlign: 'center', padding: 20 }}>⏳ முடிவுகள் வரவில்லை...</div>
      )}
      {visible.map((c, i) => {
        const lp = PARTY_CONFIG[c.leading_party] || PARTY_CONFIG['Others']
        return (
          <div key={c.id} style={{
            background: '#0F172A',
            border: `1px solid ${lp.color}33`,
            borderLeft: `3px solid ${lp.color}`,
            borderRadius: 8,
            padding: '6px 10px',
            animation: `slideIn 0.4s ease ${i * 0.05}s both`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{c.name_tamil}</div>
              <div style={{ fontSize: 9, color: '#475569' }}>{c.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ background: lp.color + '22', border: `1px solid ${lp.color}`, color: lp.color, fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10 }}>
                {c.status === 'declared' ? '✅' : '📈'} {lp.label}
              </div>
              {c.lead_margin > 0 && (
                <div style={{ fontSize: 9, color: '#F59E0B', marginTop: 2 }}>+{c.lead_margin}</div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Party total panel — right side
function PartyPanel({ tally }) {
  const sorted = ['DMK+', 'AIADMK+', 'TVK', 'Others'].sort((a, b) => {
    const gT = p => { const x = tally.find(t => t.party === p); return x ? x.won + (x.leadingg || 0) : 0 }
    return gT(b) - gT(a)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: 1 }}>கட்சிவாரி நிலவரம்</div>
      {sorted.map((party, rank) => {
        const cfg = PARTY_CONFIG[party]
        const data = tally.find(t => t.party === party) || { won: 0, leadingg: 0 }
        const total = data.won + (data.leadingg || 0)
        const hasMajority = total >= MAJORITY

        return (
          <div key={party} style={{
            background: hasMajority ? `${cfg.color}11` : '#0F172A',
            border: `1px solid ${hasMajority ? cfg.color : '#1E293B'}`,
            borderRadius: 10,
            padding: '8px 10px',
            boxShadow: hasMajority ? `0 0 12px ${cfg.color}33` : 'none',
            transition: 'all 0.5s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Photo party={party} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: cfg.color, fontWeight: 800, fontSize: 13 }}>{cfg.label}</span>
                  {hasMajority && <span style={{ background: cfg.color, color: '#fff', fontSize: 9, fontWeight: 800, padding: '1px 6px', borderRadius: 10, animation: 'pulse 1.5s infinite' }}>🏆</span>}
                  {rank === 0 && !hasMajority && total > 0 && <span style={{ color: '#F59E0B', fontSize: 9 }}>முன்னிலை</span>}
                </div>
                <div style={{ fontSize: 9, color: '#475569' }}>{cfg.leader}</div>
              </div>
            </div>

            {/* Big number row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#475569' }}>மொத்தம்</div>
                <AnimNum value={total} color={cfg.color} size={36} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#475569' }}>வென்றது</div>
                <AnimNum value={data.won} color="#22C55E" size={22} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: '#475569' }}>முன்னிலை</div>
                <AnimNum value={data.leadingg || 0} color="#F59E0B" size={22} />
              </div>
            </div>

            {/* Progress bar toward majority */}
            <div style={{ marginTop: 6, background: '#1E293B', borderRadius: 999, height: 4, overflow: 'hidden', position: 'relative' }}>
              <div style={{ background: cfg.color, width: `${Math.min((total / MAJORITY) * 100, 100)}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
              <span style={{ fontSize: 8, color: '#334155' }}>0</span>
              <span style={{ fontSize: 8, color: '#F59E0B' }}>118</span>
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
  const [seats, setSeats] = useState(ALL_SEATS.map(s => ({ ...s })))
  const [time, setTime] = useState(new Date())
  const [winner, setWinner] = useState(null)
  const [showWinner, setShowWinner] = useState(false)
  const [isDark] = useState(true)

  useEffect(() => {
    fetchTally(); fetchConstituencies()
    const t1 = supabase.channel('t1').on('postgres_changes', { event: '*', schema: 'public', table: 'overall_tally' }, fetchTally).subscribe()
    const t2 = supabase.channel('t2').on('postgres_changes', { event: '*', schema: 'public', table: 'constituencies' }, () => fetchConstituencies()).subscribe()
    const poll = setInterval(() => { fetchTally(); fetchConstituencies() }, 5000)
    const clock = setInterval(() => setTime(new Date()), 1000)
    return () => { t1.unsubscribe(); t2.unsubscribe(); clearInterval(poll); clearInterval(clock) }
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
    if (data) {
      setConstituencies(data)
      // Update seat colors for map
      setSeats(prev => {
        const updated = [...prev]
        data.forEach(c => {
          // Match by name or id
          const idx = updated.findIndex(s => s.name === c.name || s.id === c.id)
          if (idx >= 0 && c.leading_party && c.leading_party !== 'pending') {
            updated[idx] = { ...updated[idx], party: c.leading_party }
          }
        })
        return updated
      })
    }
  }

  const totalDeclared = tally.reduce((s, t) => s + t.won + (t.leadingg || 0), 0)
  const winnerCfg = PARTY_CONFIG[winner]

  return (
    <div style={{ background: '#060B14', minHeight: '100vh', color: '#fff', fontFamily: "'Segoe UI', Tahoma, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* WINNER POPUP */}
      {showWinner && winnerCfg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.5s' }}>
          <div style={{ textAlign: 'center', border: `3px solid ${winnerCfg.color}`, borderRadius: 20, padding: '40px 60px', background: `${winnerCfg.color}11`, boxShadow: `0 0 80px ${winnerCfg.color}44` }}>
            <div style={{ fontSize: 64 }}>🏆</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: winnerCfg.color, margin: '12px 0 6px' }}>{winnerCfg.label}</div>
            <div style={{ color: '#fff', fontSize: 20 }}>பெரும்பான்மை பெற்றது!</div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ background: 'linear-gradient(90deg, #DC2626, #7f1d1d)', padding: '6px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ background: '#fff', color: '#DC2626', fontWeight: 900, fontSize: 10, padding: '1px 7px', borderRadius: 3, animation: 'blink 1.5s infinite' }}>● LIVE</span>
          <span style={{ fontWeight: 700, fontSize: 12 }}>தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Overall tally pills */}
          {['DMK+', 'AIADMK+', 'TVK'].map(p => {
            const cfg = PARTY_CONFIG[p]
            const d = tally.find(t => t.party === p) || { won: 0, leadingg: 0 }
            const tot = d.won + (d.leadingg || 0)
            return (
              <div key={p} style={{ background: `${cfg.color}22`, border: `1px solid ${cfg.color}`, borderRadius: 6, padding: '2px 8px', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 9, color: cfg.color, fontWeight: 700 }}>{cfg.short}</span>
                <span style={{ fontSize: 14, fontWeight: 900, color: cfg.color }}>{tot}</span>
              </div>
            )
          })}
          <span style={{ fontSize: 11, color: '#fff' }}>{time.toLocaleTimeString('en-IN')}</span>
        </div>
      </div>

      <Ticker tally={tally} />

      {/* NAADI HEADER */}
      <div style={{ padding: '6px 16px', borderBottom: '1px solid #0F172A', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#080E1A' }}>
        <div style={{ fontSize: 18, fontWeight: 900, background: 'linear-gradient(90deg, #F59E0B, #DC2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>நாடி | NAADI</div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#475569' }}>முடிவு வந்தவை</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#F59E0B' }}>{totalDeclared}<span style={{ fontSize: 10, color: '#475569' }}>/234</span></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: '#475569' }}>பெரும்பான்மை</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#F59E0B' }}>118</div>
          </div>
        </div>
      </div>

      {/* MAIN 3-COLUMN LAYOUT */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 220px', gap: 10, padding: '10px 12px', flex: 1, overflow: 'hidden' }}>

        {/* LEFT — Animated constituency rows */}
        <div style={{ overflow: 'hidden' }}>
          <ConstRows constituencies={constituencies} />
        </div>

        {/* CENTER — TN Map */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <TNMap seats={seats} />

          {/* Majority progress bars below map */}
          <div style={{ width: '100%', maxWidth: 340, marginTop: 12 }}>
            {['DMK+', 'AIADMK+', 'TVK'].map(p => {
              const cfg = PARTY_CONFIG[p]
              const d = tally.find(t => t.party === p) || { won: 0, leadingg: 0 }
              const tot = d.won + (d.leadingg || 0)
              return (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <span style={{ color: cfg.color, fontWeight: 700, fontSize: 10, width: 44, flexShrink: 0 }}>{cfg.short}</span>
                  <div style={{ flex: 1, background: '#0F172A', borderRadius: 999, height: 14, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ background: cfg.color, width: `${Math.min((tot / TOTAL) * 100, 100)}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease', display: 'flex', alignItems: 'center', paddingLeft: 4 }}>
                      {tot > 5 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>{tot}</span>}
                    </div>
                    {/* 118 marker */}
                    <div style={{ position: 'absolute', top: 0, left: `${(118 / TOTAL) * 100}%`, width: 1.5, height: '100%', background: '#F59E0B' }} />
                  </div>
                  <span style={{ color: cfg.color, fontWeight: 700, fontSize: 11, width: 20 }}>{tot}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* RIGHT — Party totals */}
        <div style={{ overflow: 'hidden' }}>
          <PartyPanel tally={tally} />
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  )
}
