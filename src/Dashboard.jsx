import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

const MAJORITY = 118
const TOTAL = 234

const PARTIES = [
  {
    id: 'DMK+', label: 'திமுக+', leader: 'மு.க.ஸ்டாலின்',
    color: '#EF4444', darkColor: '#991B1B', bg: '#FEF2F2',
    photo: 'https://i.ibb.co/fGKGZ6PK/stalin.jpg', initials: 'ஸ்டா',
  },
  {
    id: 'AIADMK+', label: 'அதிமுக+', leader: 'எடப்பாடி பழனிசாமி',
    color: '#22C55E', darkColor: '#15803D', bg: '#F0FDF4',
    photo: 'https://i.ibb.co/Xrt4nYLB/edappadi.jpg', initials: 'எப',
  },
  {
    id: 'TVK', label: 'தவெக', leader: 'விஜய்',
    color: '#F59E0B', darkColor: '#B45309', bg: '#FFFBEB',
    photo: 'https://i.ibb.co/CpGmHqFQ/vijay.jpg', initials: 'வி',
  },
  {
    id: 'Others', label: 'மற்றவை', leader: 'சீமான் & பிறர்',
    color: '#94A3B8', darkColor: '#475569', bg: '#F8FAFC',
    photo: 'https://i.ibb.co/NnpMmcHn/seeman.jpg', initials: 'சீ',
  },
]

// Animated number
function AnimNum({ value, color, size = 48 }) {
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const start = prev.current, end = value
    if (start === end) return
    const t0 = Date.now(), dur = 700
    const tick = () => {
      const p = Math.min((Date.now() - t0) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(start + (end - start) * e))
      if (p < 1) requestAnimationFrame(tick)
      else prev.current = end
    }
    requestAnimationFrame(tick)
  }, [value])
  return <span style={{ color, fontSize: size, fontWeight: 900, lineHeight: 1 }}>{display}</span>
}

// Ticker
function Ticker({ tally }) {
  const get = id => { const p = tally.find(t => t.party === id); return p ? p.won + (p.leadingg || 0) : 0 }
  const msgs = [
    `🔴 திமுக+: ${get('DMK+')} இடங்கள்`,
    `🟢 அதிமுக+: ${get('AIADMK+')} இடங்கள்`,
    `🟡 தவெக: ${get('TVK')} இடங்கள்`,
    `⚫ மற்றவை: ${get('Others')} இடங்கள்`,
    `🏆 பெரும்பான்மை: 118 இடங்கள் தேவை`,
    `📊 234 தொகுதிகள் | நாடி | @naadipulse`,
    `⏰ May 4, 2026 | தமிழ்நாடு சட்டமன்றத் தேர்தல்`,
  ]
  return (
    <div style={{ display: 'flex', height: 32, overflow: 'hidden', background: '#0F0F0F', borderBottom: '1px solid #222' }}>
      <div style={{ background: '#EF4444', color: '#fff', fontWeight: 800, fontSize: 11, padding: '0 12px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: 1 }}>
        🔴 LIVE
      </div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', height: '100%', animation: 'ticker 28s linear infinite', whiteSpace: 'nowrap', gap: 48, color: '#FCD34D', fontSize: 12, fontWeight: 600 }}>
          {[...msgs, ...msgs].map((m, i) => <span key={i}>{m}</span>)}
        </div>
      </div>
    </div>
  )
}

// Flash card — cycles party by party every 5s with row animation
function FlashCard({ tally }) {
  const [idx, setIdx] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true)
      setTimeout(() => {
        setIdx(i => (i + 1) % PARTIES.length)
        setAnimating(false)
      }, 400)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const party = PARTIES[idx]
  const data = tally.find(t => t.party === party.id) || { won: 0, leadingg: 0 }
  const total = data.won + (data.leadingg || 0)
  const hasMajority = total >= MAJORITY

  return (
    <div style={{
      background: '#111',
      border: `2px solid ${party.color}33`,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      minHeight: 220,
    }}>
      {/* Party color accent top */}
      <div style={{ height: 4, background: party.color, width: '100%' }} />

      <div style={{
        padding: '16px 20px',
        opacity: animating ? 0 : 1,
        transform: animating ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all 0.4s ease',
      }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          {/* Photo */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            border: `2px solid ${party.color}`,
            overflow: 'hidden', flexShrink: 0,
            background: `${party.color}22`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 900, color: party.color,
          }}>
            <LeaderPhoto party={party} size={52} />
          </div>
          <div>
            <div style={{ color: party.color, fontWeight: 900, fontSize: 18 }}>{party.label}</div>
            <div style={{ color: '#64748B', fontSize: 11 }}>{party.leader}</div>
          </div>
          {hasMajority && (
            <div style={{
              marginLeft: 'auto', background: party.color,
              color: '#fff', fontSize: 10, fontWeight: 800,
              padding: '3px 10px', borderRadius: 20,
              animation: 'pulse 1.5s infinite',
            }}>🏆 பெரும்பான்மை!</div>
          )}
        </div>

        {/* Big number */}
        <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
          <div style={{ color: '#64748B', fontSize: 11, marginBottom: 4 }}>மொத்த இடங்கள்</div>
          <AnimNum value={total} color={party.color} size={72} />
        </div>

        {/* Won + Leading row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: '#1a1a1a', borderRadius: 10, padding: '10px', textAlign: 'center', border: '1px solid #222' }}>
            <div style={{ color: '#64748B', fontSize: 10, marginBottom: 4 }}>வென்றது ✅</div>
            <AnimNum value={data.won} color="#22C55E" size={28} />
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: 10, padding: '10px', textAlign: 'center', border: '1px solid #222' }}>
            <div style={{ color: '#64748B', fontSize: 10, marginBottom: 4 }}>முன்னிலை 📈</div>
            <AnimNum value={data.leadingg || 0} color="#F59E0B" size={28} />
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 12 }}>
          {PARTIES.map((p, i) => (
            <div key={i} style={{
              width: i === idx ? 20 : 6, height: 6,
              borderRadius: 3,
              background: i === idx ? party.color : '#333',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function LeaderPhoto({ party, size }) {
  const [failed, setFailed] = useState(false)
  if (failed) return <span style={{ fontSize: size * 0.28, fontWeight: 900, color: party.color }}>{party.initials}</span>
  return (
    <img src={party.photo} alt={party.leader}
      style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
      onError={() => setFailed(true)} />
  )
}

// Total winning side panel
function TotalPanel({ tally }) {
  const sorted = [...PARTIES].sort((a, b) => {
    const getT = id => { const p = tally.find(t => t.party === id); return p ? p.won + (p.leadingg || 0) : 0 }
    return getT(b.id) - getT(a.id)
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sorted.map((party, i) => {
        const data = tally.find(t => t.party === party.id) || { won: 0, leadingg: 0 }
        const total = data.won + (data.leadingg || 0)
        const pct = (total / TOTAL) * 100
        const hasMajority = total >= MAJORITY

        return (
          <div key={party.id} style={{
            background: '#111',
            border: `1px solid ${hasMajority ? party.color : '#1E293B'}`,
            borderRadius: 12,
            padding: '10px 14px',
            boxShadow: hasMajority ? `0 0 15px ${party.color}33` : 'none',
            transition: 'all 0.5s',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {i === 0 && total > 0 && <span style={{ fontSize: 12 }}>🥇</span>}
                <span style={{ color: party.color, fontWeight: 800, fontSize: 13 }}>{party.label}</span>
              </div>
              <AnimNum value={total} color={party.color} size={22} />
            </div>
            {/* Progress bar */}
            <div style={{ background: '#1E293B', borderRadius: 999, height: 5, overflow: 'hidden' }}>
              <div style={{
                background: party.color,
                width: `${Math.min(pct, 100)}%`,
                height: '100%',
                borderRadius: 999,
                transition: 'width 1s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontSize: 9, color: '#475569' }}>
                ✅ {data.won} &nbsp; 📈 {data.leadingg || 0}
              </span>
              <span style={{ fontSize: 9, color: party.color }}>{pct.toFixed(1)}%</span>
            </div>
          </div>
        )
      })}

      {/* Majority marker */}
      <div style={{
        background: '#0A0A0A',
        border: '1px solid #F59E0B33',
        borderRadius: 10,
        padding: '8px 12px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 10, color: '#64748B' }}>பெரும்பான்மை தேவை</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#F59E0B' }}>118</div>
        <div style={{ fontSize: 9, color: '#475569' }}>234 தொகுதிகளில்</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [tally, setTally] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [time, setTime] = useState(new Date())
  const [winner, setWinner] = useState(null)
  const [showWinner, setShowWinner] = useState(false)
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    fetchTally(); fetchConstituencies()
    const t1 = supabase.channel('t1').on('postgres_changes', { event: '*', schema: 'public', table: 'overall_tally' }, fetchTally).subscribe()
    const t2 = supabase.channel('t2').on('postgres_changes', { event: '*', schema: 'public', table: 'constituencies' }, fetchConstituencies).subscribe()
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
    if (data) setConstituencies(data)
  }

  const totalDeclared = tally.reduce((s, t) => s + t.won + (t.leadingg || 0), 0)
  const winnerParty = PARTIES.find(p => p.id === winner)

  const bg = isDark ? '#080C18' : '#F1F5F9'
  const text = isDark ? '#fff' : '#0F172A'
  const sub = isDark ? '#64748B' : '#475569'

  return (
    <div style={{ background: bg, minHeight: '100vh', color: text, fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>

      {/* WINNER POPUP */}
      {showWinner && winnerParty && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeIn 0.5s' }}>
          <div style={{ textAlign: 'center', border: `3px solid ${winnerParty.color}`, borderRadius: 20, padding: '40px 60px', background: `${winnerParty.color}11`, boxShadow: `0 0 80px ${winnerParty.color}44` }}>
            <div style={{ fontSize: 64 }}>🏆</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: winnerParty.color }}>{winnerParty.label}</div>
            <div style={{ color: '#fff', fontSize: 18 }}>பெரும்பான்மை பெற்றது!</div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{ background: 'linear-gradient(90deg, #DC2626, #7f1d1d)', padding: '7px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ background: '#fff', color: '#DC2626', fontWeight: 900, fontSize: 10, padding: '2px 8px', borderRadius: 3, animation: 'blink 1.5s infinite' }}>● LIVE</span>
          <span style={{ fontWeight: 700, fontSize: 12, color: '#fff' }}>தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#fff', fontSize: 11 }}>{time.toLocaleTimeString('en-IN')} | May 4</span>
          <button onClick={() => setIsDark(!isDark)} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: 'none', borderRadius: 20, padding: '3px 10px', fontSize: 11, cursor: 'pointer' }}>
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      <Ticker tally={tally} />

      {/* HEADER */}
      <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${isDark ? '#1E293B' : '#E2E8F0'}` }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, background: 'linear-gradient(90deg, #F59E0B, #DC2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>நாடி | NAADI</div>
          <div style={{ fontSize: 10, color: sub }}>@naadipulse • தரவு மட்டுமே பேசுகிறது</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: sub }}>முடிவு வந்தவை</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: '#F59E0B' }}>{totalDeclared}<span style={{ fontSize: 11, color: sub }}>/234</span></div>
        </div>
      </div>

      {/* MAIN LAYOUT — Flash card LEFT + Total panel RIGHT */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '12px 16px' }}>
        <FlashCard tally={tally} />
        <TotalPanel tally={tally} />
      </div>

      {/* MAJORITY PROGRESS BAR */}
      <div style={{ padding: '0 16px 12px' }}>
        {PARTIES.slice(0, 3).map(party => {
          const data = tally.find(t => t.party === party.id) || { won: 0, leadingg: 0 }
          const total = data.won + (data.leadingg || 0)
          return (
            <div key={party.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ color: party.color, fontWeight: 700, fontSize: 11, width: 60, flexShrink: 0 }}>{party.label}</span>
              <div style={{ flex: 1, background: isDark ? '#1E293B' : '#E2E8F0', borderRadius: 999, height: 16, overflow: 'hidden', position: 'relative' }}>
                <div style={{
                  background: party.color,
                  width: `${Math.min((total / MAJORITY) * 100, 100)}%`,
                  height: '100%', borderRadius: 999,
                  transition: 'width 1s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 6,
                }}>
                  {total > 10 && <span style={{ fontSize: 9, color: '#fff', fontWeight: 700 }}>{total}</span>}
                </div>
                {/* 118 marker */}
                <div style={{ position: 'absolute', top: 0, left: `${(118 / MAJORITY) * 100}%`, width: 2, height: '100%', background: '#F59E0B', transform: 'translateX(-50%)' }} />
              </div>
              <span style={{ color: party.color, fontSize: 11, fontWeight: 700, width: 24, textAlign: 'right' }}>{total}</span>
            </div>
          )
        })}
        <div style={{ textAlign: 'center', fontSize: 10, color: '#F59E0B', marginTop: 2 }}>🎯 118 பெரும்பான்மை</div>
      </div>

      {/* CONSTITUENCY CARDS */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: sub, marginBottom: 8 }}>📍 முக்கிய தொகுதிகள்</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
          {constituencies.map(c => {
            const lp = PARTIES.find(p => p.id === c.leading_party) || PARTIES[3]
            return (
              <div key={c.id} style={{ background: isDark ? '#111' : '#fff', border: `1px solid ${c.status === 'declared' ? lp.color : isDark ? '#1E293B' : '#E2E8F0'}`, borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{c.name_tamil}</div>
                <div style={{ fontSize: 10, color: sub, marginBottom: 6 }}>{c.name}</div>
                {c.leading_party !== 'pending' ? (
                  <>
                    <span style={{ background: lp.color + '22', border: `1px solid ${lp.color}`, color: lp.color, fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 20 }}>
                      {c.status === 'declared' ? '✅ ' : '📈 '}{lp.label}
                    </span>
                    <div style={{ fontSize: 10, color: sub, marginTop: 4 }}>
                      முன்னிலை: <span style={{ color: '#F59E0B', fontWeight: 700 }}>+{c.lead_margin}</span>
                    </div>
                  </>
                ) : <div style={{ fontSize: 10, color: sub }}>⏳ தொடங்கவில்லை</div>}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes fadeIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
      `}</style>
    </div>
  )
}
