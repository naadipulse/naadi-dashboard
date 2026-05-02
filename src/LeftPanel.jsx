import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient.js'
import { useSettings, PARTY_DEFAULTS } from './shared.jsx'

const DEFAULT_VIP_IDS = [4, 54, 9, 105, 15, 85, 11, 1]

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

  const fm = parseInt(settings.font_medium) || 22
  const fsm = parseInt(settings.font_small) || 13
  const ff = settings.font_family || 'Segoe UI'

  const vipIds = settings.vip_constituencies
    ? settings.vip_constituencies.split(',').map(Number).filter(Boolean)
    : DEFAULT_VIP_IDS

  const vipList = vipIds.map(id => allConstituencies.find(c => c.id === id)).filter(Boolean)

  const vip1 = vipList[vipIdx % Math.max(vipList.length, 1)]
  const vip2 = vipList[(vipIdx + 1) % Math.max(vipList.length, 1)]

  const getCandidates = (constId) =>
    candidates.filter(c => c.constituency_id === constId).sort((a, b) => b.votes - a.votes)

  return (
    <div style={{
      fontFamily: ff,
      display: 'flex', flexDirection: 'column',
      gap: 8, height: '100%', overflow: 'hidden',
    }}>
      {/* VIP label */}
      <div style={{
        fontSize: fm - 2, fontWeight: 800, color: '#fff',
        padding: '5px 10px', background: '#1E293B',
        borderRadius: 8, textAlign: 'center', flexShrink: 0,
      }}>
        ⭐ VIP தொகுதிகள்
      </div>

      {/* 2 VIP constituencies */}
      <div style={{
        flex: 1, overflow: 'hidden',
        opacity: fade ? 1 : 0,
        transform: fade ? 'translateY(0)' : 'translateY(6px)',
        transition: 'all 0.4s ease',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {[vip1, vip2].filter(Boolean).map((vip, vi) => {
          const vipCandidates = getCandidates(vip.id)
          return (
            <div key={vi} style={{
              background: '#fff', border: '1px solid #E5E7EB',
              borderRadius: 12, overflow: 'hidden', flex: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}>
              {/* Header */}
              <div style={{ background: '#1E293B', padding: '8px 14px' }}>
                <div style={{ fontSize: fm + 2, fontWeight: 900, color: '#fff' }}>
                  {vip.name_tamil || vip.name}
                </div>
                <div style={{ fontSize: fsm - 1, color: '#94A3B8' }}>{vip.name} • {vip.district}</div>
              </div>

              {/* Candidates */}
              {vipCandidates.length === 0 ? (
                <div style={{ padding: '16px 14px', color: '#9CA3AF', fontSize: fsm, textAlign: 'center' }}>
                  ⏳ வாக்கு எண்ணிக்கை தொடங்கவில்லை
                </div>
              ) : (
                vipCandidates.slice(0, 4).map((cand, i) => {
                  const cfg = PARTY_DEFAULTS[cand.party] || PARTY_DEFAULTS['Others']
                  const maxVotes = vipCandidates[0]?.votes || 1
                  const pct = (cand.votes / maxVotes) * 100
                  return (
                    <div key={i} style={{
                      padding: '8px 14px',
                      borderBottom: i < vipCandidates.length - 1 ? '1px solid #F3F4F6' : 'none',
                      background: i === 0 ? cfg.light : '#fff',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* Rank */}
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: i === 0 ? cfg.color : '#E5E7EB',
                          color: i === 0 ? '#fff' : '#6B7280',
                          fontSize: fsm - 1, fontWeight: 800,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>{i + 1}</div>

                        {/* Party circle */}
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%',
                          background: cfg.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 9, color: '#fff', fontWeight: 800, flexShrink: 0,
                        }}>{cfg.short}</div>

                        {/* Name + party */}
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

                      {/* Vote bar */}
                      {cand.votes > 0 && (
                        <div style={{ background: '#E5E7EB', borderRadius: 999, height: 4, overflow: 'hidden', marginTop: 6, marginLeft: 62 }}>
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

      {/* Pagination dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexShrink: 0, paddingBottom: 4 }}>
        {Array.from({ length: Math.ceil(vipList.length / 2) }).map((_, i) => (
          <div key={i} style={{
            width: Math.floor(vipIdx / 2) === i ? 16 : 6,
            height: 6, borderRadius: 3,
            background: Math.floor(vipIdx / 2) === i ? '#DC2626' : '#D1D5DB',
            transition: 'all 0.4s',
          }} />
        ))}
      </div>
    </div>
  )
}
