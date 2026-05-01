import React, { useState, useEffect } from 'react'
import TopBar from './TopBar.jsx'
import LeftPanel from './LeftPanel.jsx'
import CenterViews from './CenterViews.jsx'
import BottomBar from './BottomBar.jsx'
import Admin from './Admin.jsx'
import { useSettings, useTally, AnimNum, PARTY_DEFAULTS } from './shared.jsx'

function FullDashboard() {
  const settings = useSettings()
  const { gT, totalDeclared } = useTally()
  const ff = settings.font_family
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const updateScale = () => {
      const s = Math.min(
        window.innerWidth / 1920,
        window.innerHeight / 1080
      )
      setScale(s)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#000',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    }}>
      <div style={{
        width: 1920,
        height: 1080,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        display: 'flex',
        flexDirection: 'column',
        background: '#F1F5F9',
        fontFamily: ff,
        overflow: 'hidden',
        flexShrink: 0,
      }}>

        {/* Top Bar */}
        <div style={{ flexShrink: 0 }}>
          <TopBar />
        </div>

        {/* Naadi Header */}
        <div style={{
          background: '#fff',
          padding: '6px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          borderBottom: '2px solid #E5E7EB',
          flexShrink: 0,
        }}>
          <div>
            <div style={{
              fontSize: 22, fontWeight: 900,
              background: 'linear-gradient(90deg,#F59E0B,#DC2626)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>நாடி | NAADI</div>
            <div style={{ fontSize: 11, color: '#9CA3AF' }}>
              @naadipulse • தரவு மட்டுமே பேசுகிறது
            </div>
          </div>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {Object.entries(PARTY_DEFAULTS).map(([p, cfg]) => (
              <div key={p} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: cfg.color, fontWeight: 700 }}>{cfg.short}</div>
                <AnimNum val={gT(p)} color={cfg.color} size={26} font={ff} />
              </div>
            ))}
            <div style={{ width: 1, height: 30, background: '#E5E7EB' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#6B7280' }}>முடிவு</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B' }}>
                {totalDeclared}
                <span style={{ fontSize: 12, color: '#9CA3AF' }}>/234</span>
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: '#6B7280' }}>பெரும்பான்மை</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#DC2626' }}>118</div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '260px 1fr',
          gap: 10,
          padding: '8px 12px',
          minHeight: 0,
          overflow: 'hidden',
        }}>
          <LeftPanel />
          <CenterViews />
        </div>

        {/* Bottom Bar */}
        <div style={{ height: 90, flexShrink: 0 }}>
          <BottomBar />
        </div>

      </div>
    </div>
  )
}

export default function App() {
  const path = window.location.pathname

  if (path === '/top') return (
    <div style={{ background: 'transparent' }}>
      <TopBar />
    </div>
  )

  if (path === '/left') return (
    <div style={{ background: 'transparent', height: '100vh' }}>
      <LeftPanel />
    </div>
  )

  if (path === '/center') return (
    <div style={{ background: 'transparent', height: '100vh', padding: 8 }}>
      <CenterViews />
    </div>
  )

  if (path === '/bottom') return (
    <div style={{ background: 'transparent', height: 90 }}>
      <BottomBar />
    </div>
  )

  if (path === '/admin') return <Admin />

  return <FullDashboard />
}
