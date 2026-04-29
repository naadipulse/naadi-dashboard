import React, { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const MAJORITY = 118
const TOTAL = 234

const PARTY_CONFIG = {
  'DMK+': { color: '#DC2626', bg: '#1a0505', label: 'திமுக+' },
  'AIADMK+': { color: '#16A34A', bg: '#051a09', label: 'அதிமுக+' },
  'TVK': { color: '#D97706', bg: '#1a1005', label: 'தவெக' },
  'Others': { color: '#6B7280', bg: '#111827', label: 'மற்றவை' },
}

export default function Dashboard() {
  const [tally, setTally] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Fetch initial data
    fetchTally()
    fetchConstituencies()

    // Real-time subscription for tally
    const tallySubscription = supabase
      .channel('overall_tally_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'overall_tally' },
        () => fetchTally()
      )
      .subscribe()

    // Real-time subscription for constituencies
    const constSubscription = supabase
      .channel('constituency_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'constituencies' },
        () => fetchConstituencies()
      )
      .subscribe()

    // Clock
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      tallySubscription.unsubscribe()
      constSubscription.unsubscribe()
      clearInterval(timer)
    }
  }, [])

  const fetchTally = async () => {
    const { data } = await supabase.from('overall_tally').select('*')
    if (data) setTally(data)
  }

  const fetchConstituencies = async () => {
    const { data } = await supabase
      .from('constituencies')
      .select('*')
      .order('updated_at', { ascending: false })
    if (data) setConstituencies(data)
  }

  const getTotal = (party) => {
    const p = tally.find(t => t.party === party)
    return p ? (p.won + p.leading) : 0
  }

  const leading = Object.keys(PARTY_CONFIG).reduce((prev, curr) =>
    getTotal(curr) > getTotal(prev) ? curr : prev
  , 'DMK+')

  const totalDeclared = tally.reduce((sum, t) => sum + t.won + t.leading, 0)

  return (
    <div style={{
      background: '#0A0F1E',
      minHeight: '100vh',
      color: 'white',
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* TOP BAR */}
      <div style={{
        background: 'linear-gradient(90deg, #DC2626, #991B1B)',
        padding: '8px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'white', color: '#DC2626',
            fontWeight: '900', fontSize: '13px',
            padding: '3px 10px', borderRadius: '3px',
            animation: 'pulse 1.5s infinite',
          }}>● LIVE</div>
          <span style={{ fontWeight: '700', fontSize: '15px' }}>
            தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை
          </span>
        </div>
        <span style={{ fontSize: '14px', fontWeight: '600' }}>
          {currentTime.toLocaleTimeString('en-IN')} | May 4, 2026
        </span>
      </div>

      {/* HEADER */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '2px solid #1E293B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontSize: '26px', fontWeight: '900',
            background: 'linear-gradient(90deg, #F59E0B, #DC2626)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>நாடி | NAADI</div>
          <div style={{ fontSize: '11px', color: '#64748B' }}>
            @naadipulse • தரவு மட்டுமே பேசுகிறது
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            முடிவு: {totalDeclared}/234 | பெரும்பான்மை: 118
          </div>
          <div style={{ fontSize: '12px', color: '#22C55E', marginTop: '2px' }}>
            ● நேரடி ஒளிபரப்பு
          </div>
        </div>
      </div>

      {/* PARTY CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        padding: '16px 20px',
      }}>
        {Object.entries(PARTY_CONFIG).map(([party, config]) => {
          const data = tally.find(t => t.party === party) || { won: 0, leading: 0 }
          const total = data.won + data.leading
          const hasMajority = total >= MAJORITY

          return (
            <div key={party} style={{
              background: hasMajority
                ? `linear-gradient(135deg, ${config.color}22, ${config.bg})`
                : config.bg,
              border: `2px solid ${hasMajority ? config.color : '#1E293B'}`,
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: hasMajority ? `0 0 25px ${config.color}44` : 'none',
              transition: 'all 0.5s',
            }}>
              {hasMajority && (
                <div style={{
                  position: 'absolute', top: '-10px',
                  left: '50%', transform: 'translateX(-50%)',
                  background: config.color, color: 'white',
                  fontSize: '11px', fontWeight: '700',
                  padding: '2px 10px', borderRadius: '20px',
                  whiteSpace: 'nowrap',
                }}>🏆 பெரும்பான்மை!</div>
              )}

              <div style={{
                fontSize: '16px', fontWeight: '900',
                color: config.color, marginBottom: '4px',
              }}>{config.label}</div>

              <div style={{
                fontSize: '54px', fontWeight: '900',
                color: config.color, lineHeight: '1',
                margin: '8px 0',
                textShadow: `0 0 20px ${config.color}55`,
              }}>{total}</div>

              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '6px', marginTop: '8px',
              }}>
                <div style={{
                  background: '#0A0F1E', borderRadius: '8px',
                  padding: '6px', border: '1px solid #1E293B',
                }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>வென்றது</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#22C55E' }}>
                    {data.won}
                  </div>
                </div>
                <div style={{
                  background: '#0A0F1E', borderRadius: '8px',
                  padding: '6px', border: '1px solid #1E293B',
                }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>முன்னிலை</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: '#F59E0B' }}>
                    {data.leading}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MAJORITY BAR */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: '12px', padding: '14px',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>
              {PARTY_CONFIG[leading]?.label} முன்னிலை — பெரும்பான்மை நோக்கி
            </span>
            <span style={{ fontSize: '13px', color: '#F59E0B', fontWeight: '700' }}>
              {getTotal(leading)} / 118
            </span>
          </div>
          <div style={{
            background: '#1E293B', borderRadius: '999px',
            height: '18px', overflow: 'hidden',
          }}>
            <div style={{
              background: `linear-gradient(90deg, ${PARTY_CONFIG[leading]?.color}, ${PARTY_CONFIG[leading]?.color}99)`,
              width: `${Math.min((getTotal(leading) / MAJORITY) * 100, 100)}%`,
              height: '100%', borderRadius: '999px',
              transition: 'width 1s ease',
            }} />
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            marginTop: '4px', fontSize: '11px', color: '#475569',
          }}>
            <span>0</span>
            <span style={{ color: '#F59E0B' }}>🎯 118</span>
            <span>234</span>
          </div>
        </div>
      </div>

      {/* CONSTITUENCY CARDS */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          fontSize: '14px', fontWeight: '700',
          color: '#94A3B8', marginBottom: '10px',
        }}>📍 முக்கிய தொகுதிகள்</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '10px',
        }}>
          {constituencies.map((c) => {
            const leadingParty = PARTY_CONFIG[c.leading_party] || PARTY_CONFIG['Others']
            return (
              <div key={c.id} style={{
                background: '#111827',
                border: `1px solid ${c.status === 'declared' ? leadingParty.color : '#1E293B'}`,
                borderRadius: '10px',
                padding: '12px',
              }}>
                <div style={{
                  fontSize: '13px', fontWeight: '700',
                  color: 'white', marginBottom: '4px',
                }}>{c.name_tamil}</div>
                <div style={{
                  fontSize: '11px', color: '#64748B',
                  marginBottom: '8px',
                }}>{c.name}</div>

                {c.leading_party !== 'pending' ? (
                  <>
                    <div style={{
                      display: 'inline-block',
                      background: leadingParty.color + '22',
                      border: `1px solid ${leadingParty.color}`,
                      color: leadingParty.color,
                      fontSize: '12px', fontWeight: '700',
                      padding: '2px 8px', borderRadius: '20px',
                      marginBottom: '6px',
                    }}>
                      {c.status === 'declared' ? '✅ ' : '📈 '}
                      {leadingParty.label} {c.status === 'declared' ? 'வென்றது' : 'முன்னிலை'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                      Lead: <span style={{ color: '#F59E0B', fontWeight: '700' }}>
                        +{c.lead_margin}
                      </span> votes
                    </div>
                    <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>
                      Round {c.rounds_completed}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '12px', color: '#475569' }}>
                    ⏳ எண்ணிக்கை தொடங்கவில்லை
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}
