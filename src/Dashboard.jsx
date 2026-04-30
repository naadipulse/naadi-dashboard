import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

const MAJORITY = 118
const TOTAL = 234

const PC = {
  'DMK+':    { color: '#DC2626', bg: '#FEE2E2', label: 'திமுக+',  short: 'DMK',  leader: 'மு.க.ஸ்டாலின்', photo: 'https://i.ibb.co/fGKGZ6PK/stalin.jpg' },
  'AIADMK+': { color: '#16A34A', bg: '#DCFCE7', label: 'அதிமுக+', short: 'ADMK', leader: 'எடப்பாடி',       photo: 'https://i.ibb.co/Xrt4nYLB/edappadi.jpg' },
  'TVK':     { color: '#D97706', bg: '#FEF3C7', label: 'தவெக',    short: 'TVK',  leader: 'விஜய்',           photo: 'https://i.ibb.co/CpGmHqFQ/vijay.jpg' },
  'Others':  { color: '#6B7280', bg: '#F3F4F6', label: 'மற்றவை',  short: 'OTH',  leader: 'சீமான்',          photo: 'https://i.ibb.co/NnpMmcHn/seeman.jpg' },
}

function AnimNum({ val, color, size = 48 }) {
  const [n, setN] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const s = prev.current, e = val
    if (s === e) return
    const t0 = Date.now()
    const run = () => {
      const p = Math.min((Date.now() - t0) / 700, 1)
      setN(Math.round(s + (e - s) * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(run)
      else prev.current = e
    }
    requestAnimationFrame(run)
  }, [val])
  return <span style={{ color, fontSize: size, fontWeight: 900, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{n}</span>
}

function Photo({ party, size = 56 }) {
  const [err, setErr] = useState(false)
  const cfg = PC[party] || PC['Others']
  if (err || !cfg.photo) return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: cfg.color + '22', border: `3px solid ${cfg.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.28, fontWeight: 900, color: cfg.color, flexShrink: 0 }}>
      {cfg.short?.slice(0, 2)}
    </div>
  )
  return <img src={cfg.photo} alt="" onError={() => setErr(true)} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `3px solid ${cfg.color}`, flexShrink: 0 }} />
}

function TNGrid({ seats }) {
  const COLS = 15, ROWS = 16
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
  let idx = 0
  const cells = []
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (MASK[r][c]) cells.push({ r, c, seat: seats[idx++] || { party: 'pending' } })

  const SZ = 24
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 14, color: '#374151', fontWeight: 700, marginBottom: 8, letterSpacing: 1 }}>
        தமிழ்நாடு — 234 தொகுதிகள்
      </div>
      <svg width={COLS * SZ} height={ROWS * SZ} style={{ display: 'block', margin: '0 auto', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }}>
        {cells.map(({ r, c, seat }, i) => {
          const party = seat.party || 'pending'
          const cfg = PC[party]
          const declared = party !== 'pending'
          return (
            <rect key={i} x={c * SZ + 1} y={r * SZ + 1} width={SZ - 2} height={SZ - 2} rx={3}
              fill={declared ? (cfg?.color || '#6B7280') : '#E5E7EB'}
              stroke={declared ? (cfg?.color || '#6B7280') : '#D1D5DB'}
              strokeWidth={0.5}
              style={{ transition: 'fill 1s ease' }}
            />
          )
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 14, marginTop: 10 }}>
        {Object.entries(PC).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 14, height: 14, background: v.color, borderRadius: 3 }} />
            <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>{v.short}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 14, height: 14, background: '#E5E7EB', border: '1px solid #D1D5DB', borderRadius: 3 }} />
          <span style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>நிலுவை</span>
        </div>
      </div>
    </div>
  )
}

function ConstList({ items }) {
  const dec = items.filter(c => c.leading_party && c.leading_party !== 'pending').slice(0, 9)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 13, color: '#374151', fontWeight: 800, marginBottom: 6, padding: '4px 8px', background: '#F3F4F6', borderRadius: 6 }}>
        📍 சமீபத்திய முடிவுகள்
      </div>
      {dec.length === 0 && <div style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: 20 }}>⏳ முடிவுகள் வரவில்லை...</div>}
      {dec.map((c, i) => {
        const lp = PC[c.leading_party] || PC['Others']
        return (
          <div key={c.id} style={{
            background: '#fff',
            borderLeft: `4px solid ${lp.color}`,
            borderRadius: '0 8px 8px 0',
            padding: '7px 10px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            animation: `slideIn 0.3s ease ${i * 0.04}s both`,
            border: `1px solid ${lp.color}33`,
          }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{c.name_tamil || c.name}</div>
              {c.lead_margin > 0 && <div style={{ fontSize: 11, color: '#F59E0B', fontWeight: 600 }}>+{c.lead_margin}</div>}
            </div>
            <div style={{ background: lp.color, color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>
              {c.status === 'declared' ? '✅' : '📈'} {lp.short}
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
  const gW = p => tally.find(t => t.party === p)?.won || 0
  const gL = p => tally.find(t => t.party === p)?.leadingg || 0
  const totalDeclared = tally.reduce((s, t) => s + t.won + (t.leadingg || 0), 0)
  const winnerCfg = PC[winner]

  const tickerMsgs = Object.keys(PC).map(p => `${PC[p].short}: ${gT(p)} இடங்கள்`).concat(['🏆 பெரும்பான்மை: 118', '234 தொகுதிகள் | நாடி @naadipulse'])

  return (
    <div style={{ background: '#F1F5F9', minHeight: '100vh', color: '#111827', fontFamily: "'Segoe UI', Tahoma, sans-serif", display: 'flex', flexDirection: 'column' }}>

      {/* WINNER */}
      {showWinner && winnerCfg && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', border: `4px solid ${winnerCfg.color}`, borderRadius: 24, padding: '50px 70px', background: '#fff', boxShadow: `0 0 80px ${winnerCfg.color}66` }}>
            <div style={{ fontSize: 80 }}>🏆</div>
            <div style={{ fontSize: 42, fontWeight: 900, color: winnerCfg.color }}>{winnerCfg.label}</div>
            <div style={{ color: '#374151', fontSize: 22, marginTop: 8 }}>பெரும்பான்மை பெற்றது!</div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ background: 'linear-gradient(90deg, #DC2626, #991B1B)', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: '#fff', color: '#DC2626', fontWeight: 900, fontSize: 12, padding: '2px 10px', borderRadius: 4, animation: 'blink 1.5s infinite' }}>● LIVE</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff' }}>தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {Object.keys(PC).map(p => (
            <div key={p} style={{ background: 'rgba(255,255,255,0.15)', border: `2px solid ${PC[p].color}`, borderRadius: 8, padding: '3px 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{PC[p].short}</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{gT(p)}</span>
            </div>
          ))}
          <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginLeft: 8 }}>{time.toLocaleTimeString('en-IN')} | May 4</span>
        </div>
      </div>

      {/* TICKER */}
      <div style={{ height: 32, background: '#1E293B', display: 'flex', overflow: 'hidden' }}>
        <div style={{ background: '#DC2626', color: '#fff', fontWeight: 800, fontSize: 12, padding: '0 14px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0 }}>BREAKING</div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', height: '100%', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap', gap: 50, color: '#FCD34D', fontSize: 13, fontWeight: 600 }}>
            {[...tickerMsgs, ...tickerMsgs].map((m, i) => <span key={i}>{m}</span>)}
          </div>
        </div>
      </div>

      {/* NAADI HEADER */}
      <div style={{ background: '#fff', padding: '8px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', borderBottom: '3px solid #E5E7EB' }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, background: 'linear-gradient(90deg,#F59E0B,#DC2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>நாடி | NAADI</div>
          <div style={{ fontSize: 12, color: '#6B7280' }}>@naadipulse • தரவு மட்டுமே பேசுகிறது</div>
        </div>
        <div style={{ display: 'flex', gap: 30, alignItems: 'center' }}>
          {Object.keys(PC).map(p => (
            <div key={p} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 12, color: PC[p].color, fontWeight: 700 }}>{PC[p].short}</div>
              <AnimNum val={gT(p)} color={PC[p].color} size={32} />
            </div>
          ))}
          <div style={{ width: 2, height: 40, background: '#E5E7EB' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>முடிவு வந்தவை</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#F59E0B' }}>{totalDeclared}<span style={{ fontSize: 14, color: '#9CA3AF' }}>/234</span></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, color: '#6B7280', fontWeight: 600 }}>பெரும்பான்மை</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#DC2626' }}>118</div>
          </div>
        </div>
      </div>

      {/* MAIN 3-COL */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: 10, padding: '10px 12px' }}>

        {/* LEFT */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <ConstList items={constituencies} />
        </div>

        {/* CENTER */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <TNGrid seats={seats} />

          {/* Progress bars */}
          <div style={{ width: '100%', maxWidth: 400, marginTop: 14 }}>
            {Object.keys(PC).map(p => {
              const cfg = PC[p]
              const tot = gT(p)
              return (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ color: cfg.color, fontWeight: 800, fontSize: 13, width: 46, flexShrink: 0 }}>{cfg.short}</span>
                  <div style={{ flex: 1, background: '#F3F4F6', borderRadius: 999, height: 20, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ background: cfg.color, width: `${Math.min((tot / TOTAL) * 100, 100)}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease', display: 'flex', alignItems: 'center', paddingLeft: 8 }}>
                      {tot > 5 && <span style={{ fontSize: 11, color: '#fff', fontWeight: 700 }}>{tot}</span>}
                    </div>
                    <div style={{ position: 'absolute', top: 0, left: `${(118 / TOTAL) * 100}%`, width: 3, height: '100%', background: '#374151', zIndex: 2 }} />
                  </div>
                  <span style={{ color: cfg.color, fontWeight: 900, fontSize: 16, width: 30, textAlign: 'right' }}>{tot}</span>
                </div>
              )
            })}
            <div style={{ textAlign: 'center', fontSize: 12, color: '#374151', fontWeight: 600, marginTop: 4 }}>
              🎯 118 — பெரும்பான்மை எல்லை
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
          <div style={{ fontSize: 14, color: '#374151', fontWeight: 800, padding: '4px 8px', background: '#F3F4F6', borderRadius: 6 }}>கட்சிவாரி நிலவரம்</div>
          {Object.keys(PC).map(p => {
            const cfg = PC[p]
            const tot = gT(p), won = gW(p), lead = gL(p)
            const hasMaj = tot >= MAJORITY
            return (
              <div key={p} style={{
                background: hasMaj ? cfg.bg : '#F9FAFB',
                border: `2px solid ${hasMaj ? cfg.color : '#E5E7EB'}`,
                borderRadius: 12, padding: '10px 12px',
                boxShadow: hasMaj ? `0 0 16px ${cfg.color}33` : '0 1px 4px rgba(0,0,0,0.06)',
                transition: 'all 0.5s',
              }}>
                {hasMaj && (
                  <div style={{ textAlign: 'center', background: cfg.color, color: '#fff', fontSize: 11, fontWeight: 800, borderRadius: 6, padding: '2px 0', marginBottom: 8, animation: 'pulse 1.5s infinite' }}>
                    🏆 பெரும்பான்மை பெற்றது!
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Photo party={p} size={44} />
                  <div>
                    <div style={{ color: cfg.color, fontWeight: 900, fontSize: 16 }}>{cfg.label}</div>
                    <div style={{ color: '#6B7280', fontSize: 12 }}>{cfg.leader}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 8 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#6B7280' }}>மொத்தம்</div>
                    <AnimNum val={tot} color={cfg.color} size={38} />
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
                <div style={{ background: '#E5E7EB', borderRadius: 999, height: 8, overflow: 'hidden', position: 'relative' }}>
                  <div style={{ background: cfg.color, width: `${Math.min((tot / MAJORITY) * 100, 100)}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>0</span>
                  <span style={{ fontSize: 10, color: '#374151', fontWeight: 600 }}>🎯 118 பெரும்பான்மை</span>
                  <span style={{ fontSize: 10, color: '#9CA3AF' }}>234</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
      `}</style>
    </div>
  )
}
