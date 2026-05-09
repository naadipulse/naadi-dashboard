import React, { useState, useEffect } from 'react'
import TopBar from './TopBar.jsx'
import LeftPanel from './LeftPanel.jsx'
import CenterViews from './CenterViews.jsx'
import BottomBar from './BottomBar.jsx'
import Admin from './Admin.jsx'
import RightPanel from './RightPanel.jsx'
import { useSettings, useTally, useConstituencies, AnimNum, Photo, PARTY_DEFAULTS, INDIVIDUAL_PARTIES, MAJORITY } from './shared.jsx'

function FullDashboard({ mode = 'alliance' }) {
  const settings = useSettings()
  const { tally, gT } = useTally()
  const partiesCfg = mode === 'individual' ? INDIVIDUAL_PARTIES : PARTY_DEFAULTS

  // Calculate total declared based on parties in the current mode to avoid double-counting
  const totalInMode = tally
    .filter(t => Object.keys(partiesCfg).includes(t.party))
    .reduce((acc, t) => acc + (t.won || 0) + (t.leadingg || 0), 0)

  const ff = settings.font_family || 'Segoe UI'
  const fm = parseInt(settings.font_medium) || 22
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const sw = window.innerWidth / 1920
      const sh = window.innerHeight / 1080
      setScale(Math.min(sw, sh))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      overflow: 'hidden', position: 'relative',
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url('https://i.ibb.co/LDQsbQRN/thalamai.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(241,245,249,0.87)' }} />

      {/* Main 1920x1080 canvas — centered */}
      <div style={{
        position: 'relative', zIndex: 2,
        width: 1920, height: 1080,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        display: 'flex', flexDirection: 'column',
        fontFamily: ff, overflow: 'hidden', flexShrink: 0,
      }}>

        {/* Main 3-col content */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '420px 860px 1fr',
          gap: 15,
          padding: '10px 50px 10px 20px',
          minHeight: 0, overflow: 'hidden',
        }}>
          <LeftPanel mode={mode} />
          <CenterViews mode={mode} />
          <RightPanel mode={mode} />
        </div>

        {/* Alliance Breakdown Summary Row */}
        {mode === 'alliance' && (
          <div style={{ 
            display: 'flex', gap: 15, padding: '0 50px 10px 20px', 
            flexShrink: 0, justifyContent: 'space-between' 
          }}>
            {[
              { key: 'TVK', display: 'TVK+', color: PARTY_DEFAULTS['TVK'].color, members: ['TVK', 'INC'] },
              { key: 'DMK+', display: 'DMK+', color: PARTY_DEFAULTS['DMK+'].color, members: ['DMK', 'DMDK', 'IUML', 'CPI', 'VCK', 'CPI(M)'] },
              { key: 'AIADMK+', display: 'ADMK+', color: PARTY_DEFAULTS['AIADMK+'].color, members: ['ADMK', 'PMK', 'BJP', 'AMMK'] },
            ].map(alliance => (
              <div key={alliance.key} style={{
                flex: 1, background: 'rgba(255,255,255,0.95)', borderRadius: 12,
                padding: '10px 15px', display: 'flex', alignItems: 'center', gap: 15,
                borderLeft: `12px solid ${alliance.color}`, boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: 24, fontWeight: 950, color: alliance.color, minWidth: 80 }}>{alliance.display}</div>
                <div style={{ flex: 1, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {alliance.members.map(p => {
                    const cfg = INDIVIDUAL_PARTIES[p]; if (!cfg) return null;
                    const count = gT(p)
                    return (
                      <div key={p} style={{ 
                        background: cfg.color, padding: '4px 10px', borderRadius: 8, 
                        color: '#fff', display: 'flex', alignItems: 'center', gap: 8,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)', border: '1px solid rgba(255,255,255,0.2)'
                      }}>
                        <span style={{ fontSize: 14, fontWeight: 800, opacity: 0.9 }}>{cfg.short}</span>
                        <span style={{ fontSize: 20, fontWeight: 950 }}>
                          <AnimNum val={count} color="#fff" size={20} font={ff} />
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Bar */}
        {mode === 'alliance' && (
          <div style={{ height: 120, flexShrink: 0, padding: '0 60px 10px' }}>
            <BottomBar mode={mode} />
          </div>
        )}

        {/* Subscribe Ticker */}
        <div style={{
          height: 28, background: '#1E293B',
          display: 'flex', overflow: 'hidden', flexShrink: 0,
        }}>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              height: '100%',
              animation: 'ticker 20s linear infinite',
              whiteSpace: 'nowrap',
              gap: 60,
              color: '#FCD34D',
              fontSize: 13,
              fontWeight: 600,
            }}>
              {[
                '🔴 நாடி LIVE எண்ணிக்கை பார்க்கவும் 📺',
                ' நாடி YouTube Subscribe செய்யவும் | தினம் அப்டேட்',
                '❤️ நாடி விஷயம் பிடித்திருந்தால் பகிரவும் — மற்றவர்களுக்கு',
                '🔔 நாடி Notification ஆன் செய்யவும் — வாக்கு அப்டேட்',
                '🔴 நாடி LIVE எண்ணிக்கை பார்க்கவும் 📺',
                '💬 நாடி YouTube Subscribe செய்யவும் | தினம் அப்டேட்',
                '❤️ நாடி விஷயம் பிடித்திருந்தால் பகிரவும் — மற்றவர்களுக்கு',
                '🔔 நாடி Notification ஆன் செய்யவும் — வாக்கு அப்டேட்',
              ].map((m, i) => <span key={i}>{m}</span>)}
            </div>
          </div>

          <style>{`
            @keyframes ticker {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            /* Hide scrollbars globally for broadcast */
            * {
              scrollbar-width: none !important;
              -ms-overflow-style: none !important;
            }
            *::-webkit-scrollbar {
              display: none !important;
            }
          `}</style>
        </div>

      </div>
    </div>
  )
}

function PartyWisePage() {
  const settings = useSettings()
  const { gP, gT } = useTally()
  const ff = settings.font_family || 'Segoe UI'
  const [scale, setScale] = useState(1)
  const [animationTick, setAnimationTick] = useState(0)

  const parties = Object.keys(INDIVIDUAL_PARTIES)
    .sort((a, b) => gP(b) - gP(a) || gT(b) - gT(a))
    .slice(0, 12)

  useEffect(() => {
    const update = () => {
      const sw = window.innerWidth / 1080
      const sh = window.innerHeight / 1920
      setScale(Math.min(sw, sh))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setAnimationTick(prev => prev + 1), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      overflow: 'hidden', position: 'relative',
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url('https://i.ibb.co/LDQsbQRN/thalamai.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(241,245,249,0.87)' }} />

      <div style={{
        position: 'relative', zIndex: 2,
        width: 1080, height: 1920,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        fontFamily: ff,
        overflow: 'hidden',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}>
        <div style={{
          height: 192,
        }} />
        <div style={{
          height: 1536,
          display: 'grid',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '120px repeat(6, 1fr)',
          columnGap: 24,
          rowGap: 18,
          padding: '0 90px',
          boxSizing: 'border-box',
        }}>
          <div style={{
            gridColumn: '1 / -1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
            fontSize: 64,
            fontWeight: 950,
            lineHeight: 1,
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(255,255,255,0.75)',
          }}>
            கட்சி வாரி வாக்கு சதவீதம்
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: 'repeat(6, 1fr)',
            gap: 24,
            minHeight: 0,
            gridRow: '2 / -1',
          }}>
          {parties.map((p, index) => {
                const cfg = INDIVIDUAL_PARTIES[p]
                const pct = gP(p)
                const photoUrl = settings[cfg.photoKey]
                const isRightColumn = index % 2 === 1

                return (
                  <div
                    key={p}
                    style={{
                      background: cfg.color,
                      borderRadius: 14,
                      padding: isRightColumn ? '0 0 14px 18px' : '0 18px 14px 0',
                      display: 'grid',
                      gridTemplateColumns: isRightColumn ? 'minmax(0, 1fr) 118px' : '118px minmax(0, 1fr)',
                      gridTemplateRows: '1fr auto',
                      alignItems: 'center',
                      columnGap: 14,
                      color: '#fff',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 8px 18px rgba(15,23,42,0.18)',
                    }}
                  >
                    <Photo
                      photoUrl={photoUrl}
                      fallback={cfg.short}
                      color="#fff"
                      size={150}
                      style={{
                        gridColumn: isRightColumn ? 2 : 1,
                        gridRow: '1 / -1',
                        height: '100%',
                        width: 118,
                        zIndex: 1,
                        objectFit: 'cover',
                      }}
                    />
                    <div style={{
                      gridColumn: isRightColumn ? 1 : 2,
                      zIndex: 1,
                      minWidth: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: isRightColumn ? 'flex-start' : 'flex-end',
                    }}>
                      <div style={{
                        fontSize: 50,
                        fontWeight: 950,
                        lineHeight: 1.05,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textAlign: isRightColumn ? 'left' : 'right',
                        maxWidth: '100%',
                      }}>
                        {p}
                      </div>
                    </div>
                    <div
                      key={`${p}-${pct}-${animationTick}`}
                      style={{
                        gridColumn: isRightColumn ? 1 : 2,
                        zIndex: 1,
                        justifySelf: isRightColumn ? 'start' : 'end',
                        textAlign: isRightColumn ? 'left' : 'right',
                        animation: 'numFlip 0.8s ease-out',
                        display: 'inline-block',
                        backfaceVisibility: 'hidden',
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <span style={{
                        color: '#fff',
                        fontSize: 52,
                        fontWeight: 950,
                        lineHeight: 1,
                        fontFamily: ff,
                      }}>
                        {pct.toFixed(2)}
                      </span>
                      <span style={{
                        color: 'rgba(255,255,255,0.82)',
                        fontSize: 28,
                        fontWeight: 900,
                        marginLeft: 3,
                        fontFamily: ff,
                      }}>
                        %
                      </span>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
        <div style={{ height: 192 }} />
        <style>{`
          @keyframes numFlip {
            0% { transform: rotateX(-180deg); opacity: 0; }
            100% { transform: rotateX(0deg); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}

function AlliancePage({ showWhatIf = false }) {
  const settings = useSettings()
  const { gW } = useTally()
  const ff = settings.font_family || 'Segoe UI'
  const [scale, setScale] = useState(1)
  const [animationTick, setAnimationTick] = useState(0)
  const alliances = [
    {
      key: 'TVK',
      display: 'TVK+',
      color: PARTY_DEFAULTS.TVK.color,
      members: ['TVK', 'INC'],
      whatIfMembers: showWhatIf ? ['CPI', 'CPI(M)', 'VCK'] : [],
      whatIfTotal: showWhatIf ? 119 : null,
    },
    {
      key: 'DMK+',
      display: 'DMK+',
      color: PARTY_DEFAULTS['DMK+'].color,
      members: ['DMK', 'DMDK', 'IUML', 'CPI', 'VCK', 'CPI(M)'],
      fadedMembers: showWhatIf ? ['CPI', 'CPI(M)', 'VCK'] : [],
    },
    { key: 'AIADMK+', display: 'ADMK+', color: PARTY_DEFAULTS['AIADMK+'].color, members: ['ADMK', 'PMK', 'BJP', 'AMMK'] },
  ]

  useEffect(() => {
    const update = () => {
      const sw = window.innerWidth / 1080
      const sh = window.innerHeight / 1920
      setScale(Math.min(sw, sh))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setAnimationTick(prev => prev + 1), 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      overflow: 'hidden', position: 'relative',
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url('https://i.ibb.co/LDQsbQRN/thalamai.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(241,245,249,0.87)' }} />

      <div style={{
        position: 'relative', zIndex: 2,
        width: 1080, height: 1920,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        fontFamily: ff,
        overflow: 'hidden',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}>
        <div style={{ height: 96 }} />
        <div style={{
          height: 1632,
          display: 'grid',
          gridTemplateRows: '140px 1fr',
          gap: 26,
          padding: '0 80px',
          boxSizing: 'border-box',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0F172A',
            fontWeight: 950,
            lineHeight: 1,
            textAlign: 'center',
            textShadow: '0 2px 8px rgba(255,255,255,0.75)',
          }}>
            <div style={{ fontSize: 62 }}>Tamil Nadu</div>
            <div style={{ fontSize: 52, marginTop: 10 }}>
              {showWhatIf ? 'What If Alliance Scenario*' : 'Post Election Alliance'}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 6,
            minHeight: 0,
          }}>
            {alliances.map(({ key, display, color, members, whatIfMembers = [], whatIfTotal, fadedMembers = [] }) => (
              <div
                key={key}
                style={{
                  background: 'rgba(255,255,255,0.94)',
                  borderRadius: 18,
                  display: 'grid',
                  gridTemplateRows: '112px 1fr 112px',
                  minHeight: 0,
                  overflow: 'hidden',
                  boxShadow: '0 10px 26px rgba(15,23,42,0.16)',
                  border: `5px solid ${color}`,
                }}
              >
                <div style={{
                  background: color,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  fontSize: 50,
                  fontWeight: 950,
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  padding: '0 8px',
                }}>
                  {(() => {
                    const mainCfg = PARTY_DEFAULTS[key]
                    const logoSrc = mainCfg ? (settings[mainCfg.logoKey] || mainCfg.logo) : null
                    return logoSrc ? (
                      <img src={logoSrc} alt="" style={{ height: 72, width: 'auto', objectFit: 'contain' }} />
                    ) : null
                  })()}
                  {display}
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                  padding: '20px 14px',
                  minHeight: 0,
                  overflow: 'hidden',
                }}>
                  {[...members]
                    .filter(m => !showWhatIf || !fadedMembers.includes(m))
                    .sort((a, b) => gW(b) - gW(a))
                    .map((party) => {
                      const cfg = INDIVIDUAL_PARTIES[party]
                      if (!cfg) return null
                      const photoUrl = settings[cfg.photoKey]
                      const won = gW(party)
                      return (
                        <div
                          key={party}
                          style={{
                            background: cfg.color,
                            borderRadius: 12,
                            minHeight: 98,
                            display: 'grid',
                            gridTemplateColumns: showWhatIf ? '50px minmax(0, 1fr)' : '50px minmax(0, 1fr) 66px',
                            alignItems: 'center',
                            gap: 14,
                            padding: '0 18px 0 0',
                            color: '#fff',
                            overflow: 'hidden',
                            boxShadow: '0 5px 12px rgba(15,23,42,0.12)',
                          }}
                        >
                          <Photo
                            photoUrl={photoUrl}
                            fallback={cfg.short}
                            color="#fff"
                            size={98}
                            style={{ height: '100%', width: 58, objectFit: 'cover', objectPosition: 'top' }}
                          />
                          <div style={{
                            minWidth: 0,
                            fontSize: showWhatIf ? 40 : 30,
                            fontWeight: 950,
                            lineHeight: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {party}
                          </div>
                          {!showWhatIf && (
                            <div
                              key={`${party}-${won}-${animationTick}`}
                              style={{ textAlign: 'right', animation: 'numFlip 0.8s ease-out' }}
                            >
                              <AnimNum val={won} color="#fff" size={38} font={ff} />
                            </div>
                          )}
                        </div>
                      )
                    })
                  }

                  {showWhatIf && (fadedMembers.length > 0 || whatIfMembers.length > 0) && (
                    <>
                      <div style={{
                        textAlign: 'center',
                        fontSize: 24,
                        fontWeight: 950,
                        color,
                        opacity: 0.65,
                      }}>
                        WHAT IF
                      </div>

                      {(fadedMembers.length > 0 ? [...fadedMembers] : [...whatIfMembers])
                        .sort((a, b) => gW(b) - gW(a))
                        .map((party) => {
                          const cfg = INDIVIDUAL_PARTIES[party]
                          if (!cfg) return null
                          const photoUrl = settings[cfg.photoKey]
                          const won = gW(party)
                          return (
                            <div
                              key={`whatif-${party}`}
                              style={{
                                background: cfg.color,
                                borderRadius: 12,
                                minHeight: 98,
                                display: 'grid',
                                gridTemplateColumns: '50px minmax(0, 1fr)',
                                alignItems: 'center',
                                gap: 14,
                                padding: '0 18px 0 0',
                                color: '#fff',
                                overflow: 'hidden',
                                opacity: 1,
                                boxShadow: '0 5px 12px rgba(15,23,42,0.12)',
                              }}
                            >
                              <Photo
                                photoUrl={photoUrl}
                                fallback={cfg.short}
                                color="#fff"
                                size={98}
                                style={{ height: '100%', width: 50, objectFit: 'cover', objectPosition: 'top' }}
                              />
                              <div style={{
                                minWidth: 0,
                                fontSize: 40,
                                fontWeight: 950,
                                lineHeight: 1,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}>
                                {party}
                              </div>
                            </div>
                          )
                        })
                      }
                    </>
                  )}

                  {showWhatIf && key === 'TVK' && (
                    <div style={{
                      color: '#0F172A',
                      borderTop: `4px solid ${color}`,
                      paddingTop: 10,
                      marginTop: 4,
                      fontSize: 28,
                      fontWeight: 950,
                      lineHeight: 1.18,
                      textAlign: 'center',
                    }}>
                      Left parties shift - TVK+ majority
                    </div>
                  )}
                </div>

                <div
                  key={`${key}-${members.map(gW).join('-')}-${animationTick}`}
                  style={{
                    background: color,
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'numFlip 0.8s ease-out',
                  }}
                >
                  {showWhatIf && (whatIfTotal || fadedMembers.length > 0) ? (
                    <>
                      <div style={{ fontSize: 17, fontWeight: 950, lineHeight: 1, marginBottom: 2 }}>WHAT IF</div>
                      <AnimNum
                        val={whatIfTotal || members.reduce((sum, p) => fadedMembers.includes(p) ? sum : sum + gW(p), 0)}
                        color="#fff"
                        size={72}
                        font={ff}
                      />
                    </>
                  ) : (
                    <AnimNum val={members.reduce((sum, p) => sum + gW(p), 0)} color="#fff" size={72} font={ff} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 192 }} />
        <style>{`
          @keyframes numFlip {
            0% { transform: rotateX(-180deg); opacity: 0; }
            100% { transform: rotateX(0deg); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  )
}


function DotMapPage() {
  const settings = useSettings()
  const { tally } = useTally()
  const ff = settings.font_family || 'Segoe UI'
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const sw = window.innerWidth / 1080
      const sh = window.innerHeight / 1920
      setScale(Math.min(sw, sh))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const get = p => { const d = tally.find(t => t.party === p); return d ? d.won + (d.leadingg || 0) : 0 }

  const DOT_ALLIANCES = [
    { key: 'TVK+',  color: PARTY_DEFAULTS['TVK'].color,      members: ['TVK', 'INC', 'CPI', 'CPI(M)', 'VCK'], adjust: { TVK: -1 }, partyKey: 'TVK' },
    { key: 'DMK+',  color: PARTY_DEFAULTS['DMK+'].color,     members: ['DMK', 'DMDK', 'IUML'],                        partyKey: 'DMK+' },
    { key: 'ADMK+', color: PARTY_DEFAULTS['AIADMK+'].color,  members: ['ADMK', 'PMK', 'BJP', 'AMMK'],                partyKey: 'AIADMK+' },
  ]

  const COLORS = { pending: '#D1D5DB' }
  const RESIGN_COLOR = '#9CA3AF'

  const seatColors = []
  let resignDotIndex = -1
  DOT_ALLIANCES.forEach(({ color, members, adjust = {} }) => {
    const getA = p => get(p) + (adjust[p] || 0)
    const sorted = [...members].sort((a, b) => getA(b) - getA(a))
    sorted.forEach(p => {
      const adjusted = getA(p)
      for (let i = 0; i < adjusted; i++) seatColors.push(color)
    })
  })
  while (seatColors.length < 234) seatColors.push(COLORS['pending'])

  const W = 1200, H = 700
  const CX = W / 2, CY = 605
  const DOT_R = 13

  const ROWS = [
    { r: 144, count: 17 },
    { r: 192, count: 24 },
    { r: 240, count: 31 },
    { r: 288, count: 38 },
    { r: 342, count: 44 },
    { r: 396, count: 50 },
    { r: 450, count: 30 },
  ]

  const rawDots = []
  ROWS.forEach(({ r, count }) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.PI - (i / (count - 1)) * Math.PI
      rawDots.push({ x: CX + r * Math.cos(angle), y: CY - r * Math.sin(angle), angle, r })
    }
  })
  const dots = [...rawDots].sort((a, b) => b.angle - a.angle).map((d, i) => ({
    ...d, color: seatColors[i] || COLORS['pending'],
  }))

  const maxR = Math.max(...dots.map(d => d.r))
  // Bottom-left corner → grey (resign)
  resignDotIndex = dots.reduce((best, d, i) => d.r === maxR && d.x < dots[best].x ? i : best, dots.findIndex(d => d.r === maxR))
  dots[resignDotIndex] = { ...dots[resignDotIndex], color: RESIGN_COLOR }
  // Bottom-right corner → green
  const greenDotIndex = dots.reduce((best, d, i) => d.r === maxR && d.x > dots[best].x ? i : best, dots.findIndex(d => d.r === maxR))
  dots[greenDotIndex] = { ...dots[greenDotIndex], color: '#22C55E' }

  return (
    <div style={{
      width: '100vw', height: '100vh',
      overflow: 'hidden', position: 'relative',
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url('https://i.ibb.co/LDQsbQRN/thalamai.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(241,245,249,0.87)' }} />

      <div style={{
        position: 'relative', zIndex: 2,
        width: 1080, height: 1920,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        fontFamily: ff,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        padding: '80px 60px',
        boxSizing: 'border-box',
        border: '1px solid rgba(0,0,0,0.18)',
      }}>

        {/* Title */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 64, fontWeight: 950, color: '#0F172A', lineHeight: 1.1 }}>
            🏛️ சட்டமன்றம் — 234 இடங்கள்
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, color: '#6B7280', marginTop: 10 }}>
            கூட்டணி வாரியாக
          </div>
        </div>

        {/* SVG Parliament */}
        <div style={{ width: '100%', flexShrink: 0 }}>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
            <line x1={CX} y1={46} x2={CX} y2={H}
              stroke="#374151" strokeWidth={3} strokeDasharray="8,4" opacity={0.5} />
            {dots.map((d, i) => (
              <circle key={i} cx={d.x} cy={d.y} r={DOT_R} fill={d.color}
                style={{ transition: `fill 0.4s ease ${i * 0.001}s` }} />
            ))}
            {resignDotIndex >= 0 && dots[resignDotIndex] && (() => {
              const rd = dots[resignDotIndex]
              const bx = rd.x - 80, by = rd.y + DOT_R + 10
              return (
                <g>
                  <circle cx={rd.x} cy={rd.y} r={DOT_R + 3} fill="none" stroke="#6B7280" strokeWidth={2} strokeDasharray="4,3" />
                  <line x1={rd.x} y1={rd.y + DOT_R + 3} x2={rd.x} y2={by + 2} stroke="#6B7280" strokeWidth={1.5} />
                  <rect x={bx} y={by} width={230} height={38} rx={8} fill="rgba(255,255,255,0.92)" stroke="#9CA3AF" strokeWidth={1} />
                  <text x={bx + 12} y={by + 24} fontSize={18} fill="#374151" fontWeight="700">* Vijay to resign</text>
                </g>
              )
            })()}
            <rect x={CX - 62} y={5} width={124} height={50} rx={12} fill="#F59E0B" />
            <text x={CX} y={42} textAnchor="middle" fontSize={34} fill="#fff" fontWeight="bold">118</text>
          </svg>
        </div>

        {/* Alliance rows */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 24, flexShrink: 0 }}>
          {DOT_ALLIANCES.map(({ key, color, members, adjust = {}, partyKey }) => {
            const getA = p => get(p) + (adjust[p] || 0)
            const allianceTotal = members.reduce((s, p) => s + getA(p), 0)
            const hasMaj = allianceTotal >= 118
            const leaderCfg = PARTY_DEFAULTS[partyKey]
            const leaderPhoto = leaderCfg ? (settings[leaderCfg.photoKey] || null) : null
            return (
              <div key={key} style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 18,
                borderRight: `14px solid ${color}`,
                padding: '0 24px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                overflow: 'hidden',
                boxShadow: hasMaj ? `0 0 28px ${color}55` : '0 4px 14px rgba(0,0,0,0.08)',
              }}>
                {/* Leader photo */}
                <Photo
                  photoUrl={leaderPhoto}
                  fallback={key}
                  color={color}
                  size={120}
                  style={{ height: '100%', width: 100, objectFit: 'cover', objectPosition: 'top', flexShrink: 0, alignSelf: 'stretch' }}
                />
                {/* Alliance name + total */}
                <div style={{ minWidth: 110, flexShrink: 0, textAlign: 'center', padding: '18px 0' }}>
                  <div style={{ fontSize: 30, fontWeight: 950, color, lineHeight: 1 }}>{key}</div>
                  <div style={{ fontSize: 52, fontWeight: 950, color, lineHeight: 1.1 }}>{allianceTotal}</div>
                </div>
                {/* Member party boxes */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', flex: 1, padding: '18px 0' }}>
                  {[...members].sort((a, b) => getA(b) - getA(a)).map(p => {
                    const cfg = INDIVIDUAL_PARTIES[p]
                    if (!cfg) return null
                    const tot = getA(p)
                    return (
                      <div key={p} style={{
                        textAlign: 'center',
                        background: cfg.light,
                        border: `2px solid ${cfg.color}`,
                        borderRadius: 10, padding: '8px 18px', minWidth: 90,
                      }}>
                        <div style={{ fontSize: 26, color: cfg.color, fontWeight: 700 }}>{cfg.short}</div>
                        <div style={{ fontSize: 52, fontWeight: 950, color: cfg.color, lineHeight: 1 }}>{tot}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footnote */}
        <div style={{
          width: '100%',
          fontSize: 24,
          color: '#6B7280',
          fontWeight: 600,
          lineHeight: 1.5,
          paddingTop: 8,
          borderTop: '1px solid rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}>
          * TVK total is 107 — Vijay won 2 seats, expected to resign from one constituency
        </div>

      </div>
    </div>
  )
}

const TN_DEPARTMENTS = [
  { ta: 'ஆதி திராவிடர் (ம) பழங்குடியினர் நலத் துறை',                        en: 'Adi Dravidar & Tribal Welfare' },
  { ta: 'வேளாண்மை - உழவர் நலத் துறை',                                        en: 'Agriculture & Farmers Welfare' },
  { ta: 'கால்நடை பராமரிப்பு, பால்வளம், மீன்வளம் மற்றும் மீனவர் நலத்துறை',  en: 'Animal Husbandry, Dairy, Fisheries & Fishermen Welfare' },
  { ta: 'பிற்படுத்தப்பட்டோர், மிகப்பிற்படுத்தப்பட்டோர் மற்றும் சிறுபான்மையினர் நலத்துறை', en: 'BC, MBC & Minorities Welfare' },
  { ta: 'வணிகவரி மற்றும் பதிவுத்துறை',                                       en: 'Commercial Taxes and Registration' },
  { ta: 'கூட்டுறவு, உணவு (ம) நுகர்வோர் பாதுகாப்பு துறை',                    en: 'Co-operation, Food & Consumer Protection' },
  { ta: 'எரிசக்தி',                                                           en: 'Energy' },
  { ta: 'சுற்றுச்சூழல், காலநிலை மாற்றம் மற்றும் வனத்துறை',                  en: 'Environment, Climate Change and Forests' },
  { ta: 'நிதித் துறை',                                                        en: 'Finance' },
  { ta: 'கைத்தறி, கைத்திறன், துணிநூல் (ம) கதர்த்துறை',                      en: 'Handlooms, Handicrafts, Textiles and Khadi' },
  { ta: 'மருத்துவம் - மக்கள் நல்வாழ்வுத் துறை',                              en: 'Health and Family Welfare' },
  { ta: 'உயர்கல்வி துறை',                                                    en: 'Higher Education' },
  { ta: 'நெடுஞ்சாலைகள் மற்றும் சிறு துறைமுகங்கள் துறை',                     en: 'Highways and Minor Ports' },
  { ta: 'உள், மதுவிலக்கு (ம) ஆயத்தீர்வை துறை',                              en: 'Home, Prohibition and Excise' },
  { ta: 'வீட்டு வசதி மற்றும் நகர்ப்புற வளர்ச்சித் துறை',                    en: 'Housing and Urban Development' },
  { ta: 'மனித வள மேலாண்மைத் துறை',                                           en: 'Human Resources Management' },
  { ta: 'தொழில், முதலீட்டு ஊக்குவிப்பு மற்றும் வர்த்தகத் துறை',             en: 'Industries, Investment Promotion & Commerce' },
  { ta: 'தகவல் தொழில்நுட்பவியல் மற்றும் டிஜிட்டல் சேவைகள் துறை',            en: 'Information Technology and Digital Services' },
  { ta: 'தொழிலாளர் நலன் மற்றும் திறன் மேம்பாட்டுத் துறை',                   en: 'Labour Welfare and Skill Development' },
  { ta: 'சட்டத்துறை',                                                         en: 'Law' },
  { ta: 'சட்டமன்ற பேரவைச் செயலகம் துறை',                                    en: 'Legislative Assembly Secretariat' },
  { ta: 'குறு, சிறு மற்றும் நடுத்தரத் தொழில் நிறுவனங்கள் துறை',             en: 'Micro, Small and Medium Enterprises' },
  { ta: 'முதல்வரின் முகவரி துறை',                                             en: "Chief Minister's Office" },
  { ta: 'நகராட்சி நிர்வாகம் (ம) குடிநீர் வழங்கல் துறை',                     en: 'Municipal Administration and Water Supply' },
  { ta: 'இயற்கை வளங்கள் துறை',                                               en: 'Natural Resources' },
  { ta: 'திட்டம், வளர்ச்சி மற்றும் சிறப்பு முயற்சிகள் துறை',                en: 'Planning, Development & Special Initiatives' },
  { ta: 'பொதுத் துறை',                                                        en: 'General (Services) Department' },
  { ta: 'பொது (தேர்தல்கள்) துறை',                                             en: 'General (Elections) Department' },
  { ta: 'பொதுப்பணி துறை',                                                     en: 'Public Works' },
  { ta: 'வருவாய் மற்றும் பேரிடர் மேலாண்மைத் துறை',                           en: 'Revenue and Disaster Management' },
  { ta: 'ஊரக வளர்ச்சி மற்றும் ஊராட்சித் துறை',                               en: 'Rural Development and Panchayat Raj' },
  { ta: 'பள்ளிக் கல்வி துறை',                                                 en: 'School Education' },
  { ta: 'சமூக சீர்திருத்த துறை',                                              en: 'Social Reformation' },
  { ta: 'சமூகநலம் மற்றும் மகளிர் உரிமைத்துறை',                               en: 'Social Welfare and Women\'s Rights' },
  { ta: 'சிறப்புத் திட்டச் செயலாக்கத் துறை',                                  en: 'Special Schemes Implementation' },
  { ta: 'தமிழ் வளர்ச்சி மற்றும் செய்தித்துறை',                               en: 'Tamil Development and Information' },
  { ta: 'சுற்றுலா, பண்பாடு மற்றும் சமய அறநிலையத் துறை',                     en: 'Tourism, Culture and Religious Endowments' },
  { ta: 'போக்குவரத்து துறை',                                                  en: 'Transport' },
  { ta: 'நீர்வளத்துறை',                                                       en: 'Water Resources' },
  { ta: 'மாற்றுத் திறனாளிகள் நலத் துறை',                                     en: 'Welfare of Differently Abled Persons' },
  { ta: 'இளைஞர் நலன் (ம) விளையாட்டு மேம்பாட்டுத்துறை',                      en: 'Youth Welfare and Sports Development' },
]

function MinisterPage() {
  const settings = useSettings()
  const ff = settings.font_family || 'Segoe UI'
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const sw = window.innerWidth / 1920
      const sh = window.innerHeight / 1080
      setScale(Math.min(sw, sh))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div style={{
      width: '100vw', height: '100vh',
      overflow: 'hidden', position: 'relative',
      background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `url('https://i.ibb.co/LDQsbQRN/thalamai.jpg')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'rgba(241,245,249,0.9)' }} />

      <div style={{
        position: 'relative', zIndex: 2,
        width: 1920, height: 1080,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        fontFamily: ff,
        overflow: 'hidden',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        border: '1px solid rgba(0,0,0,0.18)',
      }}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #DC2626, #D97706)',
          padding: '18px 60px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 42, fontWeight: 950, color: '#fff', lineHeight: 1.1 }}>தமிழ்நாடு அமைச்சரவை</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>Tamil Nadu Cabinet 2026</div>
          </div>
          <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
            {TN_DEPARTMENTS.length} துறைகள் — Departments
          </div>
        </div>

        {/* Department grid */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8,
          padding: '10px 16px 10px',
          overflowY: 'hidden',
          boxSizing: 'border-box',
        }}>
          {TN_DEPARTMENTS.map((dept, i) => {
            const ministerName = settings[`minister_${i}_name`] || ''
            const ministerParty = settings[`minister_${i}_party`] || ''
            const partyCfg = ministerParty ? (INDIVIDUAL_PARTIES[ministerParty] || PARTY_DEFAULTS[ministerParty]) : null
            const photoUrl = settings[`minister_${i}_photo`] || ''

            return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.95)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                overflow: 'hidden',
                borderLeft: `8px solid ${partyCfg ? partyCfg.color : '#E5E7EB'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              }}>
                <Photo
                  photoUrl={photoUrl}
                  fallback={String(i + 1)}
                  color={partyCfg ? partyCfg.color : '#9CA3AF'}
                  size={72}
                  style={{ width: 52, height: '100%', minHeight: 62, objectFit: 'cover', objectPosition: 'top', flexShrink: 0 }}
                />
                <div style={{ minWidth: 0, padding: '6px 6px 6px 0' }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>{dept.ta}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280', lineHeight: 1.2, marginTop: 1 }}>{dept.en}</div>
                  {ministerName ? (
                    <div style={{ fontSize: 12, fontWeight: 700, color: partyCfg ? partyCfg.color : '#374151', marginTop: 3 }}>
                      {ministerName}{ministerParty ? ` · ${ministerParty}` : ''}
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: '#D1D5DB', marginTop: 1 }}>Minister TBA</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 0 14px',
          textAlign: 'center',
          flexShrink: 0,
          borderTop: '1px solid rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: 22, color: '#94A3B8', fontWeight: 600 }}>@naadipulse • LIVE UPDATES</div>
        </div>

      </div>
    </div>
  )
}

export default function App() {
  // Normalize path by removing trailing slash for robust matching
  const path = window.location.pathname.replace(/\/$/, '') || '/'

  if (path === '/top') return <div style={{ background: 'transparent' }}><TopBar /></div>
  if (path === '/left') return <div style={{ background: 'transparent', height: '100vh' }}><LeftPanel /></div>
  if (path === '/center') return <div style={{ background: 'transparent', height: '100vh', padding: 8 }}><CenterViews /></div>
  if (path === '/bottom') return <div style={{ background: 'transparent', height: 120 }}><BottomBar /></div>
  if (path === '/admin') return <Admin />
  if (path === '/winners') return <FullDashboard mode="individual" />
  if (path === '/partywise') return <PartyWisePage />
  if (path === '/alliance') return <AlliancePage />
  if (path === '/whatif') return <AlliancePage showWhatIf />
  if (path === '/dot') return <DotMapPage />
  if (path === '/minister') return <MinisterPage />
  return <FullDashboard mode="alliance" />
}
