import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import { useSettings, useTally, PARTY_DEFAULTS, MAJORITY } from './shared.jsx'

// VIP_CONSTITUENCIES now from settings
const DEFAULT_VIP = [
  { id: 4,   name: 'கொளத்தூர்',    english: 'Kolathur' },
  { id: 54,  name: 'எடப்பாடி',     english: 'Edappadi' },
  { id: 9,   name: 'சேப்பாக்கம்',  english: 'Chepauk' },
  { id: 105, name: 'விக்கிரவாண்டி', english: 'Vikravandi' },
  { id: 15,  name: 'மயிலாப்பூர்',  english: 'Mylapore' },
  { id: 85,  name: 'கோவை தெற்கு',  english: 'Coimbatore South' },
  { id: 11,  name: 'அண்ணா நகர்',   english: 'Anna Nagar' },
  { id: 1,   name: 'திருவொற்றியூர்', english: 'Tiruvottiyur' },
]

function Photo({ photoUrl, fallback, color, size = 36 }) {
  const [err, setErr] = useState(false)
  if (err || !photoUrl) return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color + '22', border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.28, fontWeight: 900, color, flexShrink: 0 }}>
      {fallback}
    </div>
  )
  return <img src={photoUrl} alt="" onError={() => setErr(true)} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `2px solid ${color}`, flexShrink: 0 }} />
}

export default function LeftPanel() {
  const settings = useSettings()
  const { gT, gW, gL } = useTally()
  const [candidates, setCandidates] = useState([])
  const vipConstituencies = settings.vip_constituencies
    ? settings.vip_constituencies.split(",").map(Number).filter(Boolean).map(id => allConstituencies.find(c => c.id === id)).filter(Boolean)
    : DEFAULT_VIP
  const [vipIdx, setVipIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    fetchCandidates()
    const sub = supabase.channel('candidates_' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, fetchCandidates)
      .subscribe()
    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setVipIdx(i => (i + 2) % VIP_CONSTITUENCIES.length)
        setFade(true)
      }, 400)
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  const fetchCandidates = async () => {
    const { data } = await supabase.from('candidates').select('*').eq('is_vip', true)
    if (data) setCandidates(data)
  }

  const fs = parseInt(settings.font_large)
  const fm = parseInt(settings.font_medium)
  const fsm = parseInt(settings.font_small)
  const ff = settings.font_family

  const sorted = Object.keys(PARTY_DEFAULTS).sort((a, b) => gT(b) - gT(a))
  const top3 = sorted.slice(0, 3)

  // Current 2 VIP constituencies
  const vip1 = VIP_CONSTITUENCIES[vipIdx % VIP_CONSTITUENCIES.length]
  const vip2 = VIP_CONSTITUENCIES[(vipIdx + 1) % VIP_CONSTITUENCIES.length]

  const getCandidates = (constId) => {
    return candidates
      .filter(c => c.constituency_id === constId)
      .sort((a, b) => b.votes - a.votes)
  }

  return (
    <div style={{ fontFamily: ff, display: 'flex', flexDirection: 'column', gap: 8, height: '100%', overflow: 'hidden' }}>

      {/* Top 3 party cards */}
      {top3.map((p, rank) => {
        const cfg = PARTY_DEFAULTS[p]
        const tot = gT(p), won = gW(p), lead = gL(p)
        const hasMaj = tot >= MAJORITY
        const pct = Math.min((tot / MAJORITY) * 100, 100)
        const photoUrl = settings[cfg.photoKey]

        return (
          <div key={p} style={{
            background: hasMaj ? cfg.light : '#fff',
            border: `2px solid ${hasMaj ? cfg.color : '#E5E7EB'}`,
            borderRadius: 12, padding: '8px 12px',
            boxShadow: hasMaj ? `0 0 16px ${cfg.color}44` : '0 2px 6px rgba(0,0,0,0.07)',
            transition: 'all 0.5s',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cfg.color }} />
            {rank === 0 && tot > 0 && (
              <div style={{ position: 'absolute', top: 6, right: 8, fontSize: fsm - 2, color: '#F59E0B', fontWeight: 800 }}>🥇 முன்னிலை</div>
            )}
            {hasMaj && (
              <div style={{ textAlign: 'center', background: cfg.color, color: '#fff', fontSize: fsm - 2, fontWeight: 800, borderRadius: 4, padding: '1px 0', marginBottom: 6, animation: 'pulse 1.5s infinite' }}>
                🏆 பெரும்பான்மை!
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, marginTop: 4 }}>
              <Photo photoUrl={photoUrl} fallback={cfg.short.slice(0, 2)} color={cfg.color} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ color: cfg.color, fontWeight: 900, fontSize: fm }}>{cfg.label}</div>
                <div style={{ color: '#6B7280', fontSize: fsm - 2 }}>{cfg.leader}</div>
              </div>
              <div style={{ fontSize: fs - 4, fontWeight: 900, color: cfg.color }}>{tot}</div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
              <div style={{ flex: 1, textAlign: 'center', background: '#F0FDF4', borderRadius: 6, padding: '3px 0' }}>
                <div style={{ fontSize: fsm - 3, color: '#6B7280' }}>வென்றது</div>
                <div style={{ fontSize: fm + 2, fontWeight: 800, color: '#16A34A' }}>{won}</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', background: '#FEF3C7', borderRadius: 6, padding: '3px 0' }}>
                <div style={{ fontSize: fsm - 3, color: '#6B7280' }}>முன்னிலை</div>
                <div style={{ fontSize: fm + 2, fontWeight: 800, color: '#D97706' }}>{lead}</div>
              </div>
            </div>
            <div style={{ background: '#E5E7EB', borderRadius: 999, height: 5, overflow: 'hidden' }}>
              <div style={{ background: cfg.color, width: `${pct}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease' }} />
            </div>
          </div>
        )
      })}

      {/* VIP Constituencies */}
      <div style={{
        flex: 1, overflow: 'hidden',
        opacity: fade ? 1 : 0,
        transform: fade ? 'translateY(0)' : 'translateY(6px)',
        transition: 'all 0.4s ease',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        {[vip1, vip2].map((vip, vi) => {
          const vipCandidates = getCandidates(vip.id)
          return (
            <div key={vi} style={{
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 10,
              overflow: 'hidden',
              flex: 1,
              boxShadow: '0 2px 6px rgba(0,0,0,0.07)',
            }}>
              {/* Constituency header */}
              <div style={{ background: '#1E293B', padding: '6px 12px' }}>
                <div style={{ fontSize: fm, fontWeight: 900, color: '#fff' }}>{vip.name}</div>
                <div style={{ fontSize: fsm - 2, color: '#94A3B8' }}>{vip.english}</div>
              </div>

              {/* Candidates */}
              {vipCandidates.length === 0 ? (
                <div style={{ padding: '10px 12px', color: '#9CA3AF', fontSize: fsm - 1 }}>
                  ⏳ வாக்கு எண்ணிக்கை தொடங்கவில்லை
                </div>
              ) : (
                vipCandidates.slice(0, 4).map((cand, i) => {
                  const cfg = PARTY_DEFAULTS[cand.party] || PARTY_DEFAULTS['Others']
                  const maxVotes = vipCandidates[0]?.votes || 1
                  const pct = ((cand.votes / maxVotes) * 100)
                  return (
                    <div key={i} style={{
                      padding: '6px 12px',
                      borderBottom: i < vipCandidates.length - 1 ? '1px solid #F3F4F6' : 'none',
                      background: i === 0 ? cfg.light : '#fff',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                        {/* Rank */}
                        <div style={{
                          width: 20, height: 20, borderRadius: '50%',
                          background: i === 0 ? cfg.color : '#E5E7EB',
                          color: i === 0 ? '#fff' : '#6B7280',
                          fontSize: fsm - 2, fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>{i + 1}</div>

                        {/* Party symbol */}
                        <div style={{
                          width: 28, height: 28, borderRadius: '50%',
                          background: cfg.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 8, color: '#fff', fontWeight: 800, flexShrink: 0,
                        }}>{cfg.short}</div>

                        {/* Name */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: fsm, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {cand.candidate_name_tamil || cand.candidate_name}
                          </div>
                          <div style={{ fontSize: fsm - 2, color: cfg.color, fontWeight: 600 }}>{cfg.label}</div>
                        </div>

                        {/* Votes */}
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: fm, fontWeight: 900, color: i === 0 ? cfg.color : '#374151' }}>
                            {cand.votes > 0 ? cand.votes.toLocaleString('en-IN') : '—'}
                          </div>
                        </div>
                      </div>
                      {/* Vote bar */}
                      {cand.votes > 0 && (
                        <div style={{ background: '#E5E7EB', borderRadius: 999, height: 3, overflow: 'hidden', marginLeft: 56 }}>
                          <div style={{ background: cfg.color, width: `${pct}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease' }} />
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.6}}
      `}</style>
    </div>
  )
}
