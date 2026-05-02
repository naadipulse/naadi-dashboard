import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import { useSettings, PARTY_DEFAULTS, getComponentFonts } from './shared.jsx'

export default function LeftPanel() {
  const settings = useSettings()
  const [candidates, setCandidates] = useState([])
  const [allConstituencies, setAllConstituencies] = useState([])
  const [vipIdx, setVipIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    fetchCandidates()
    fetchConstituencies()
    const sub = supabase.channel('cands_' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'candidates' }, fetchCandidates)
      .subscribe()
    return () => sub.unsubscribe()
  }, [])

  useEffect(() => {
    const iv = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setVipIdx(i => i + 2)
        setFade(true)
      }, 400)
    }, 5000)
    return () => clearInterval(iv)
  }, [])

  const fetchCandidates = async () => {
    const { data } = await supabase.from('candidates').select('*').eq('is_vip', true)
    if (data) setCandidates(data)
  }

  const fetchConstituencies = async () => {
    const { data } = await supabase.from('constituencies').select('id, name, name_tamil, district')
    if (data) setAllConstituencies(data)
  }

  const { fs, fm, fsm, ff } = getComponentFonts(settings, 'left')

  // Get VIP IDs from settings ONLY — no defaults
  const vipIds = settings.vip_constituencies
    ? settings.vip_constituencies.split(',').map(Number).filter(Boolean)
    : []

  const vipList = vipIds
    .map(id => allConstituencies.find(c => c.id === id))
    .filter(Boolean)

  // No VIP set yet
  if (vipList.length === 0) {
    return (
      <div style={{ fontFamily: ff, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#fff', borderRadius: 14, gap: 12 }}>
        <div style={{ fontSize: 36 }}>⭐</div>
        <div style={{ fontSize: fm, fontWeight: 700, color: '#94A3B8', textAlign: 'center' }}>VIP தொகுதிகள்</div>
        <div style={{ fontSize: fsm, color: '#CBD5E1', textAlign: 'center', padding: '0 20px' }}>
          Admin → VIP தொகுதிகள் tab-ல் add பண்ணுங்க
        </div>
      </div>
    )
  }

  // Get current 2 VIP constituencies safely
  const totalPairs = Math.ceil(vipList.length / 2)
  const pairIdx = Math.floor(vipIdx / 2) % totalPairs
  const vip1 = vipList[pairIdx * 2]
  const vip2 = vipList[pairIdx * 2 + 1] || null

  const getCandidates = (constId) =>
    candidates.filter(c => c.constituency_id === constId).sort((a, b) => b.votes - a.votes)

  const VipCard = ({ vip }) => {
    const vipCandidates = getCandidates(vip.id)
    return (
      <div style={{
        background: '#fff', border: '1px solid #E5E7EB',
        borderRadius: 12, overflow: 'hidden',
        flex: 1, // dynamic height!
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column',
        minHeight: 0,
      }}>
        {/* Header */}
        <div style={{ background: '#1E293B', padding: '8px 14px', flexShrink: 0 }}>
          <div style={{ fontSize: fm + 2, fontWeight: 900, color: '#fff' }}>
            {vip.name_tamil || vip.name}
          </div>
          <div style={{ fontSize: fsm - 1, color: '#94A3B8' }}>{vip.name} • {vip.district}</div>
        </div>

        {/* Candidates */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {vipCandidates.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', fontSize: fsm }}>
              ⏳ வாக்கு எண்ணிக்கை தொடங்கவில்லை
            </div>
          ) : (
            vipCandidates.slice(0, 4).map((cand, i) => {
              const cfg = PARTY_DEFAULTS[cand.party] || PARTY_DEFAULTS['Others']
              const maxVotes = vipCandidates[0]?.votes || 1
              const pct = (cand.votes / maxVotes) * 100
              return (
                <div key={i} style={{
                  padding: '6px 14px',
                  borderBottom: '1px solid #F3F4F6',
                  background: i === 0 ? cfg.light : '#fff',
                  flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Rank */}
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%',
                      background: i === 0 ? cfg.color : '#E5E7EB',
                      color: i === 0 ? '#fff' : '#6B7280',
                      fontSize: fsm - 1, fontWeight: 800,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>{i + 1}</div>

                    {/* Party circle */}
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: cfg.color, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 8, color: '#fff', fontWeight: 800, flexShrink: 0,
                    }}>{cfg.short}</div>

                    {/* Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: fsm + 1, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cand.candidate_name_tamil || cand.candidate_name}
                      </div>
                      <div style={{ fontSize: fsm - 2, color: cfg.color, fontWeight: 600 }}>{cfg.label}</div>
                    </div>

                    {/* Votes */}
                    <div style={{ fontSize: fm + 2, fontWeight: 900, color: i === 0 ? cfg.color : '#374151', flexShrink: 0 }}>
                      {cand.votes > 0 ? cand.votes.toLocaleString('en-IN') : '—'}
                    </div>
                  </div>

                  {cand.votes > 0 && (
                    <div style={{ background: '#E5E7EB', borderRadius: 999, height: 3, marginTop: 5, marginLeft: 58 }}>
                      <div style={{ background: cfg.color, width: `${pct}%`, height: '100%', borderRadius: 999, transition: 'width 1s ease' }} />
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: ff, display: 'flex', flexDirection: 'column', gap: 8, height: '100%', overflow: 'hidden' }}>

      {/* VIP label */}
      <div style={{
        fontSize: fm - 2, fontWeight: 800, color: '#fff',
        padding: '5px 10px', background: '#1E293B',
        borderRadius: 8, textAlign: 'center', flexShrink: 0,
      }}>
        ⭐ VIP தொகுதிகள் — {pairIdx * 2 + 1}-{Math.min(pairIdx * 2 + 2, vipList.length)} / {vipList.length}
      </div>

      {/* 2 VIP cards — flex equal height */}
      <div style={{
        flex: 1, overflow: 'hidden',
        opacity: fade ? 1 : 0,
        transform: fade ? 'translateY(0)' : 'translateY(6px)',
        transition: 'all 0.4s ease',
        display: 'flex', flexDirection: 'column',
        gap: 8,
      }}>
        <VipCard vip={vip1} />
        {vip2 && <VipCard vip={vip2} />}
      </div>

      {/* Pagination dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexShrink: 0, paddingBottom: 4 }}>
        {Array.from({ length: totalPairs }).map((_, i) => (
          <div key={i} style={{
            width: pairIdx === i ? 16 : 6, height: 6, borderRadius: 3,
            background: pairIdx === i ? '#DC2626' : '#D1D5DB',
            transition: 'all 0.4s', cursor: 'pointer',
          }} onClick={() => setVipIdx(i * 2)} />
        ))}
      </div>
    </div>
  )
}
