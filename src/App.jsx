import React from 'react'
import TopBar from './TopBar'
import LeftPanel from './LeftPanel'
import CenterViews from './CenterViews'
import BottomBar from './BottomBar'
import Admin from './Admin'
import { useSettings, useTally, AnimNum, PARTY_DEFAULTS, MAJORITY } from './shared.jsx'

// Top of FullDashboard return:
<div style={{ 
  transform: `scale(${window.innerWidth / 1920})`,
  transformOrigin: 'top left',
  width: 1920,
  height: 1080,
}}>

// Full dashboard combining all panels
function FullDashboard() {
  const settings = useSettings()
  const { gT, totalDeclared } = useTally()
  const ff = settings.font_family

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F1F5F9', fontFamily: ff, overflow: 'hidden' }}>
      {/* Top */}
      <div style={{ flexShrink: 0 }}>
        <TopBar />
      </div>

      {/* Naadi header */}
      <div style={{ background: '#fff', padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.08)', borderBottom: '2px solid #E5E7EB', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, background: 'linear-gradient(90deg,#F59E0B,#DC2626)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>நாடி | NAADI</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>@naadipulse • தரவு மட்டுமே பேசுகிறது</div>
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
            <div style={{ fontSize: 22, fontWeight: 900, color: '#F59E0B' }}>{totalDeclared}<span style={{ fontSize: 12, color: '#9CA3AF' }}>/234</span></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6B7280' }}>பெரும்பான்மை</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#DC2626' }}>118</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', gap: 10, padding: '8px 12px', minHeight: 0 }}>
        <LeftPanel />
        <CenterViews />
      </div>

      {/* Bottom */}
      <div style={{ height: 90, flexShrink: 0 }}>
        <BottomBar />
      </div>
    </div>
  )
}

export default function App() {
  const path = window.location.pathname

  // Individual panels with transparent bg for OBS
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
