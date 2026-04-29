import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

const MAJORITY = 118
const TOTAL = 234

const PARTY_CONFIG = {
  'DMK+': {
    color: '#DC2626',
    bg: '#1a0505',
    label: 'திமுக+',
    leader: 'மு.க.ஸ்டாலின்',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/MK_Stalin_official_portrait.jpg/220px-MK_Stalin_official_portrait.jpg'
  },
  'AIADMK+': {
    color: '#16A34A',
    bg: '#051a09',
    label: 'அதிமுக+',
    leader: 'எடப்பாடி பழனிசாமி',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Edappadi_K._Palaniswami_official_portrait.jpg/220px-Edappadi_K._Palaniswami_official_portrait.jpg'
  },
  'TVK': {
    color: '#D97706',
    bg: '#1a1005',
    label: 'தவெக',
    leader: 'விஜய்',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Thalapathy_Vijay_at_Bigil_audio_launch.jpg/220px-Thalapathy_Vijay_at_Bigil_audio_launch.jpg'
  },
  'Others': {
    color: '#6B7280',
    bg: '#111827',
    label: 'மற்றவை',
    leader: 'சீமான் & பிறர்',
    photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Seeman_in_2019.jpg/220px-Seeman_in_2019.jpg'
  },
}

// Animated number component
function AnimatedNumber({ value, color }) {
  const [display, setDisplay] = useState(0)
  const prevRef = useRef(0)

  useEffect(() => {
    const start = prevRef.current
    const end = value
    if (start === end) return

    const duration = 800
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(start + (end - start) * eased)
      setDisplay(current)

      if (progress < 1) requestAnimationFrame(animate)
      else prevRef.current = end
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span style={{ color, transition: 'color 0.3s' }}>{display}</span>
  )
}

// Ticker component
function Ticker({ tally }) {
  const messages = [
    `🔴 திமுக+ தொகுதிகள்: ${(tally.find(t => t.party === 'DMK+')?.won || 0) + (tally.find(t => t.party === 'DMK+')?.leadingg || 0)}`,
    `🟢 அதிமுக+ தொகுதிகள்: ${(tally.find(t => t.party === 'AIADMK+')?.won || 0) + (tally.find(t => t.party === 'AIADMK+')?.leadingg || 0)}`,
    `🟡 தவெக தொகுதிகள்: ${(tally.find(t => t.party === 'TVK')?.won || 0) + (tally.find(t => t.party === 'TVK')?.leadingg || 0)}`,
    `🏆 பெரும்பான்மை தேவை: 118 இடங்கள்`,
    `📊 மொத்த தொகுதிகள்: 234 | நாடி | @naadipulse`,
    `⏰ May 4, 2026 | தமிழ்நாடு சட்டமன்றத் தேர்தல் முடிவுகள்`,
  ]

  return (
    <div style={{
      background: '#1a0a0a',
      borderTop: '2px solid #DC2626',
      borderBottom: '2px solid #DC2626',
      overflow: 'hidden',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        background: '#DC2626',
        color: 'white',
        fontWeight: '900',
        fontSize: '13px',
        padding: '0 14px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}>🔴 BREAKING</div>
      <div style={{
        overflow: 'hidden',
        flex: 1,
        height: '100%',
        position: 'relative',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          animation: 'ticker 25s linear infinite',
          whiteSpace: 'nowrap',
          color: '#FCD34D',
          fontSize: '14px',
          fontWeight: '600',
          gap: '60px',
        }}>
          {[...messages, ...messages].map((msg, i) => (
            <span key={i}>{msg}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [tally, setTally] = useState([])
  const [constituencies, setConstituencies] = useState([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [winner, setWinner] = useState(null)
  const [showWinner, setShowWinner] = useState(false)

  useEffect(() => {
    fetchTally()
    fetchConstituencies()

    const tallySubscription = supabase
      .channel('overall_tally_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'overall_tally' },
        () => fetchTally()
      )
      .subscribe()

    const constSubscription = supabase
      .channel('constituency_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'constituencies' },
        () => fetchConstituencies()
      )
      .subscribe()

    const pollInterval = setInterval(() => {
      fetchTally()
      fetchConstituencies()
    }, 5000)

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)

    return () => {
      tallySubscription.unsubscribe()
      constSubscription.unsubscribe()
      clearInterval(pollInterval)
      clearInterval(timer)
    }
  }, [])

  const fetchTally = async () => {
    const { data } = await supabase.from('overall_tally').select('*')
    if (data) {
      setTally(data)
      // Check for winner
      const winnerParty = data.find(t => (t.won + (t.leadingg || 0)) >= MAJORITY)
      if (winnerParty && !winner) {
        setWinner(winnerParty.party)
        setShowWinner(true)
        setTimeout(() => setShowWinner(false), 5000)
      }
    }
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
    return p ? (p.won + (p.leadingg || 0)) : 0
  }

  const getWon = (party) => tally.find(t => t.party === party)?.won || 0
  const getLeading = (party) => tally.find(t => t.party === party)?.leadingg || 0

  const leadingParty = Object.keys(PARTY_CONFIG).reduce((prev, curr) =>
    getTotal(curr) > getTotal(prev) ? curr : prev, 'DMK+')

  const totalDeclared = tally.reduce((sum, t) => sum + t.won + (t.leadingg || 0), 0)

  return (
    <div style={{
      background: '#080C18',
      minHeight: '100vh',
      color: 'white',
      fontFamily: "'Segoe UI', sans-serif",
      overflow: 'hidden',
    }}>

      {/* WINNER POPUP */}
      {showWinner && winner && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.5s ease',
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${PARTY_CONFIG[winner]?.color}33, #111827)`,
            border: `3px solid ${PARTY_CONFIG[winner]?.color}`,
            borderRadius: '20px',
            padding: '40px 60px',
            textAlign: 'center',
            boxShadow: `0 0 60px ${PARTY_CONFIG[winner]?.color}66`,
          }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>🏆</div>
            <div style={{
              fontSize: '32px',
              fontWeight: '900',
              color: PARTY_CONFIG[winner]?.color,
              marginBottom: '8px',
            }}>{PARTY_CONFIG[winner]?.label}</div>
            <div style={{ fontSize: '20px', color: 'white' }}>
              பெரும்பான்மை பெற்றது!
            </div>
            <div style={{
              fontSize: '48px',
              fontWeight: '900',
              color: '#F59E0B',
              marginTop: '12px',
            }}>{getTotal(winner)} இடங்கள்</div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <div style={{
        background: 'linear-gradient(90deg, #DC2626, #7f1d1d)',
        padding: '8px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'white',
            color: '#DC2626',
            fontWeight: '900',
            fontSize: '12px',
            padding: '3px 10px',
            borderRadius: '3px',
            animation: 'blink 1.5s infinite',
          }}>● LIVE</div>
          <span style={{ fontWeight: '700', fontSize: '14px' }}>
            தமிழ்நாடு சட்டமன்றத் தேர்தல் 2026 — வாக்கு எண்ணிக்கை
          </span>
        </div>
        <span style={{ fontSize: '13px', fontWeight: '600' }}>
          {currentTime.toLocaleTimeString('en-IN')} | May 4, 2026
        </span>
      </div>

      {/* TICKER */}
      <Ticker tally={tally} />

      {/* HEADER */}
      <div style={{
        padding: '10px 20px',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(180deg, #0d1424, #080C18)',
      }}>
        <div>
          <div style={{
            fontSize: '24px',
            fontWeight: '900',
            background: 'linear-gradient(90deg, #F59E0B, #DC2626)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>நாடி | NAADI</div>
          <div style={{ fontSize: '10px', color: '#64748B' }}>
            @naadipulse • தரவு மட்டுமே பேசுகிறது
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: '#64748B' }}>முடிவு வந்த தொகுதிகள்</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#F59E0B' }}>
            {totalDeclared}
            <span style={{ fontSize: '14px', color: '#64748B' }}>/234</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#64748B' }}>பெரும்பான்மை</div>
          <div style={{ fontSize: '28px', fontWeight: '900', color: '#F59E0B' }}>118</div>
        </div>
      </div>

      {/* PARTY CARDS */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        padding: '12px 16px',
      }}>
        {Object.entries(PARTY_CONFIG).map(([party, config]) => {
          const total = getTotal(party)
          const won = getWon(party)
          const leading = getLeading(party)
          const hasMajority = total >= MAJORITY

          return (
            <div key={party} style={{
              background: hasMajority
                ? `linear-gradient(135deg, ${config.color}33, ${config.bg})`
                : config.bg,
              border: `2px solid ${hasMajority ? config.color : '#1E293B'}`,
              borderRadius: '12px',
              padding: '12px',
              textAlign: 'center',
              position: 'relative',
              boxShadow: hasMajority ? `0 0 30px ${config.color}55` : 'none',
              transition: 'all 0.5s',
            }}>
              {hasMajority && (
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: config.color,
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '900',
                  padding: '2px 10px',
                  borderRadius: '20px',
                  whiteSpace: 'nowrap',
                  animation: 'pulse 1.5s infinite',
                }}>🏆 பெரும்பான்மை!</div>
              )}

              {/* Leader Photo */}
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                border: `3px solid ${config.color}`,
                overflow: 'hidden',
                margin: '0 auto 8px',
                boxShadow: `0 0 12px ${config.color}44`,
              }}>
                <img
                  src={config.photo}
                  alt={config.leader}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;background:${config.color}33;display:flex;align-items:center;justify-content:center;font-size:20px">👤</div>`
                  }}
                />
              </div>

              <div style={{
                fontSize: '14px',
                fontWeight: '900',
                color: config.color,
                marginBottom: '2px',
              }}>{config.label}</div>
              <div style={{
                fontSize: '10px',
                color: '#64748B',
                marginBottom: '8px',
              }}>{config.leader}</div>

              {/* BIG ANIMATED NUMBER */}
              <div style={{
                fontSize: '48px',
                fontWeight: '900',
                lineHeight: '1',
                marginBottom: '10px',
                textShadow: `0 0 20px ${config.color}66`,
              }}>
                <AnimatedNumber value={total} color={config.color} />
              </div>

              {/* WON + LEADING */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
              }}>
                <div style={{
                  background: '#0A0F1E',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  padding: '6px 4px',
                }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>வென்றது</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#22C55E',
                  }}>
                    <AnimatedNumber value={won} color="#22C55E" />
                  </div>
                </div>
                <div style={{
                  background: '#0A0F1E',
                  border: '1px solid #1E293B',
                  borderRadius: '8px',
                  padding: '6px 4px',
                }}>
                  <div style={{ fontSize: '10px', color: '#64748B' }}>முன்னிலை</div>
                  <div style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    color: '#F59E0B',
                  }}>
                    <AnimatedNumber value={leading} color="#F59E0B" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* MAJORITY BAR */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          background: '#111827',
          border: '1px solid #1E293B',
          borderRadius: '12px',
          padding: '12px 16px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
          }}>
            <span style={{ fontSize: '13px', color: '#94A3B8' }}>
              {PARTY_CONFIG[leadingParty]?.label} — பெரும்பான்மை நோக்கி
            </span>
            <span style={{
              fontSize: '13px',
              color: '#F59E0B',
              fontWeight: '700',
            }}>
              {getTotal(leadingParty)} / 118
            </span>
          </div>
          <div style={{
            background: '#1E293B',
            borderRadius: '999px',
            height: '22px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            <div style={{
              background: `linear-gradient(90deg, ${PARTY_CONFIG[leadingParty]?.color}, ${PARTY_CONFIG[leadingParty]?.color}88)`,
              width: `${Math.min((getTotal(leadingParty) / MAJORITY) * 100, 100)}%`,
              height: '100%',
              borderRadius: '999px',
              transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: '8px',
            }}>
              {getTotal(leadingParty) > 15 && (
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'white' }}>
                  {Math.round((getTotal(leadingParty) / MAJORITY) * 100)}%
                </span>
              )}
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '4px',
          }}>
            <span style={{ fontSize: '10px', color: '#475569' }}>0</span>
            <span style={{ fontSize: '11px', color: '#F59E0B', fontWeight: '700' }}>
              🎯 118 பெரும்பான்மை
            </span>
            <span style={{ fontSize: '10px', color: '#475569' }}>234</span>
          </div>
        </div>
      </div>

      {/* CONSTITUENCY CARDS */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: '700',
          color: '#94A3B8',
          marginBottom: '8px',
        }}>📍 முக்கிய தொகுதிகள்</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '8px',
        }}>
          {constituencies.map((c) => {
            const lp = PARTY_CONFIG[c.leading_party] || PARTY_CONFIG['Others']
            return (
              <div key={c.id} style={{
                background: '#111827',
                border: `1px solid ${c.status === 'declared' ? lp.color : '#1E293B'}`,
                borderRadius: '10px',
                padding: '10px',
                transition: 'all 0.3s',
              }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'white',
                  marginBottom: '2px',
                }}>{c.name_tamil}</div>
                <div style={{
                  fontSize: '10px',
                  color: '#64748B',
                  marginBottom: '6px',
                }}>{c.name}</div>

                {c.leading_party !== 'pending' ? (
                  <>
                    <div style={{
                      display: 'inline-block',
                      background: lp.color + '22',
                      border: `1px solid ${lp.color}`,
                      color: lp.color,
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      marginBottom: '4px',
                    }}>
                      {c.status === 'declared' ? '✅ ' : '📈 '}
                      {lp.label}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                      முன்னிலை: <span style={{ color: '#F59E0B', fontWeight: '700' }}>
                        +{c.lead_margin}
                      </span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#475569' }}>
                      சுற்று {c.rounds_completed}
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    ⏳ தொடங்கவில்லை
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes pulse {
          0%, 100% { transform: translateX(-50%) scale(1); }
          50% { transform: translateX(-50%) scale(1.05); }
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
