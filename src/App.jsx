import React, { useState, useEffect } from 'react'
import TopBar from './TopBar.jsx'
import LeftPanel from './LeftPanel.jsx'
import CenterViews from './CenterViews.jsx'
import BottomBar from './BottomBar.jsx'
import Admin from './Admin.jsx'
import RightPanel from './RightPanel.jsx'
import { useSettings, useTally, AnimNum, Photo, PARTY_DEFAULTS, INDIVIDUAL_PARTIES, MAJORITY } from './shared.jsx'

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

        {/* Top Bar */}
        {mode === 'alliance' && (
          <div style={{ flexShrink: 0 }}>
          <TopBar />
        </div>
        )}

        {/* Naadi Header */}
        {mode === 'alliance' && (
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '8px 60px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            borderBottom: '2px solid #E5E7EB', flexShrink: 0,
          }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, background: 'linear-gradient(90deg,#F59E0B,#DC2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                நாடி | NAADI
              </div>
              <div style={{ fontSize: 13, color: '#9CA3AF' }}>@naadipulse • தரவு மட்டுமே பேசுகிறது</div>
            </div>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
              {Object.entries(partiesCfg).filter(([p]) => mode === 'individual' || p !== 'Others').sort((a, b) => gT(b[0]) - gT(a[0])).slice(0, mode === 'individual' ? 6 : 3).map(([p, cfg]) => (
                <div key={p} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {(settings[cfg.logoKey] || cfg.logo) && (
                    <img src={settings[cfg.logoKey] || cfg.logo} alt="" style={{ height: 48, width: 'auto', marginBottom: 2 }} />
                  )}
                  <div style={{ fontSize: 13, color: cfg.color, fontWeight: 700 }}>{cfg.short}</div>
                  <AnimNum val={gT(p)} color={cfg.color} size={30} font={ff} />
                </div>
              ))}
              <div style={{ width: 1, height: 36, background: '#E5E7EB' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#6B7280' }}>முடிவு</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#F59E0B' }}>
                  {totalInMode}<span style={{ fontSize: 14, color: '#9CA3AF' }}>/234</span>
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, color: '#6B7280' }}>பெரும்பான்மை</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#DC2626' }}>118</div>
              </div>
            </div>
          </div>
        )}

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
  const constituencies = useConstituencies()
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
        padding: '120px 60px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontSize: 72,
          fontWeight: 950,
          color: '#0F172A',
          marginBottom: 60,
          textAlign: 'center',
          textShadow: '0 2px 8px rgba(255,255,255,0.75)',
        }}>
          தமிழக தேர்தல் களம்: 234 தொகுதிகள்
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(13, 1fr)',
          gap: 15,
          padding: 40,
          background: 'rgba(255,255,255,0.5)',
          borderRadius: 30,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        }}>
          {Array.from({ length: 234 }).map((_, idx) => {
            const cNumber = idx + 1
            const c = constituencies.find(item => 
              item.constituency_number === cNumber || item.id === cNumber
            ) || {}
            const lp = PARTY_DEFAULTS[c.leading_party] || INDIVIDUAL_PARTIES[c.leading_party] || { color: '#CBD5E1' }
            const isWon = c.status === 'declared'

            return (
              <div
                key={idx}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  background: lp.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: lp.color === '#CBD5E1' ? '#64748B' : '#fff',
                  fontSize: 14,
                  fontWeight: 900,
                  boxShadow: isWon ? `0 0 15px ${lp.color}` : 'none',
                  border: isWon ? '3px solid #fff' : '2px solid rgba(255,255,255,0.4)',
                  transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: isWon ? 'scale(1.15)' : 'scale(1)',
                }}
              >
                {cNumber}
              </div>
            )
          })}
        </div>

        <div style={{
          marginTop: 80,
          display: 'flex',
          gap: 40,
          padding: '30px 60px',
          background: 'rgba(255,255,255,0.9)',
          borderRadius: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        }}>
          {Object.entries(PARTY_DEFAULTS).map(([p, cfg]) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: cfg.color }} />
              <div style={{ fontSize: 32, fontWeight: 900, color: '#1E293B' }}>{cfg.short}</div>
            </div>
          ))}
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
  return <FullDashboard mode="alliance" />
}
