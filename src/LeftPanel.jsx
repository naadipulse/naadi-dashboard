import React from 'react'
import { useSettings, useTally, PARTY_DEFAULTS, getComponentFonts } from './shared.jsx'

export default function LeftPanel() {
  const settings = useSettings()
  const { gP } = useTally()

  const { fm, fsm, ff } = getComponentFonts(settings, 'left')

  const parties = ['TVK', 'AIADMK+', 'DMK+', 'Others']

  return (
    <div style={{ fontFamily: ff, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      <div style={{
        fontSize: fm, fontWeight: 800, color: '#fff',
        padding: '12px', background: '#1E293B',
        borderRadius: 10, textAlign: 'center', flexShrink: 0,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        📊 வாக்கு சதவீதம் (Vote %)
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {parties.map(p => {
          const cfg = PARTY_DEFAULTS[p]
          const pct = gP(p)
          return (
            <div key={p} style={{
              background: '#fff', borderRadius: 14, padding: '18px 20px',
              borderLeft: `8px solid ${cfg.color}`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: fsm, color: '#64748B', fontWeight: 600, marginBottom: 2 }}>{cfg.short}</div>
                  <div style={{ fontSize: fm + 2, fontWeight: 900, color: cfg.color }}>{cfg.label}</div>
                </div>
                <div style={{ fontSize: fm + 10, fontWeight: 950, color: '#111827', fontVariantNumeric: 'tabular-nums' }}>
                  {pct}<span style={{ fontSize: fm, marginLeft: 2, color: '#64748B' }}>%</span>
                </div>
              </div>

              <div style={{ height: 12, background: '#F1F5F9', borderRadius: 6, overflow: 'hidden', border: '1px solid #E2E8F0' }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: `linear-gradient(90deg, ${cfg.color}, ${cfg.color}CC)`,
                  borderRadius: 6, transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
