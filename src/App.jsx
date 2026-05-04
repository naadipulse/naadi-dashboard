import React, { useState, useEffect } from 'react'
import TopBar from './TopBar.jsx'
import LeftPanel from './LeftPanel.jsx'
import CenterViews from './CenterViews.jsx'
import BottomBar from './BottomBar.jsx'
import Admin from './Admin.jsx'
import RightPanel from './RightPanel.jsx'
import { useSettings, useTally, AnimNum, PARTY_DEFAULTS } from './shared.jsx'

function FullDashboard() {
  const settings = useSettings()
  const { gT, totalDeclared } = useTally()
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
        <div style={{ flexShrink: 0 }}>
          <TopBar />
        </div>

        {/* Naadi Header */}
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
            {Object.entries(PARTY_DEFAULTS).sort((a, b) => gT(b[0]) - gT(a[0])).map(([p, cfg]) => (
              <div key={p} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {cfg.logo && (
                  <img src={cfg.logo} alt="" style={{ height: 28, width: 'auto', marginBottom: 2 }} />
                )}
                <div style={{ fontSize: 13, color: cfg.color, fontWeight: 700 }}>{cfg.short}</div>
                <AnimNum val={gT(p)} color={cfg.color} size={30} font={ff} />
              </div>
            ))}
            <div style={{ width: 1, height: 36, background: '#E5E7EB' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#6B7280' }}>முடிவு</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#F59E0B' }}>
                {totalDeclared}<span style={{ fontSize: 14, color: '#9CA3AF' }}>/234</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: '#6B7280' }}>பெரும்பான்மை</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#DC2626' }}>118</div>
            </div>
          </div>
        </div>

        {/* Main 3-col content */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '420px 860px 1fr',
          gap: 15,
          padding: '10px 50px 10px 20px',
          minHeight: 0, overflow: 'hidden',
        }}>
          <LeftPanel />
          <CenterViews />
          <RightPanel />
        </div>

        {/* Bottom Bar */}
        <div style={{ height: 120, flexShrink: 0, padding: '0 60px 10px' }}>
          <BottomBar />
        </div>

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

export default function App() {
  // Normalize path by removing trailing slash for robust matching
  const path = window.location.pathname.replace(/\/$/, '') || '/'

  if (path === '/top') return <div style={{ background: 'transparent' }}><TopBar /></div>
  if (path === '/left') return <div style={{ background: 'transparent', height: '100vh' }}><LeftPanel /></div>
  if (path === '/center') return <div style={{ background: 'transparent', height: '100vh', padding: 8 }}><CenterViews /></div>
  if (path === '/bottom') return <div style={{ background: 'transparent', height: 120 }}><BottomBar /></div>
  if (path === '/admin') return <Admin />
  return <FullDashboard />
}
