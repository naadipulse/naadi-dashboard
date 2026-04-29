import React, { useState } from 'react'
import { supabase } from './supabaseClient'

const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_PASSWORD || 'naadi2026'

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [inputText, setInputText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')
  const [mode, setMode] = useState('llm') // 'llm' or 'manual'

  // Manual update state
  const [manualData, setManualData] = useState({
    'DMK+': { won: 0, leading: 0 },
    'AIADMK+': { won: 0, leading: 0 },
    'TVK': { won: 0, leading: 0 },
    'Others': { won: 0, leading: 0 },
  })

  const login = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
    } else {
      setMessage('❌ Wrong password!')
    }
  }

  const processWithLLM = async () => {
    if (!inputText.trim()) return
    setIsProcessing(true)
    setMessage('🤖 Claude parsing data...')

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Parse this Tamil Nadu election data and return ONLY a JSON object.
No explanation, no markdown, just JSON.

Input: "${inputText}"

Return format:
{
  "overall": {
    "DMK+": { "won": 0, "leading": 0 },
    "AIADMK+": { "won": 0, "leading": 0 },
    "TVK": { "won": 0, "leading": 0 },
    "Others": { "won": 0, "leading": 0 }
  },
  "constituencies": [
    {
      "name": "constituency name in english",
      "name_tamil": "தொகுதி பெயர் தமிழில்",
      "leading_party": "DMK+ or AIADMK+ or TVK or Others",
      "lead_margin": 0,
      "status": "counting or declared",
      "rounds_completed": 0
    }
  ]
}

If constituency data not provided, return empty constituencies array.
Parse any format: "DMK winning 45 seats", "திமுக 45 இடங்கள்", etc.`
          }]
        })
      })

      const data = await response.json()
      const text = data.content[0].text
      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

      // Update overall tally
      if (parsed.overall) {
        for (const [party, values] of Object.entries(parsed.overall)) {
          await supabase
            .from('overall_tally')
            .update({ won: values.won, leading: values.leading, updated_at: new Date() })
            .eq('party', party)
        }
      }

      // Update constituencies
      if (parsed.constituencies && parsed.constituencies.length > 0) {
        for (const c of parsed.constituencies) {
          const { data: existing } = await supabase
            .from('constituencies')
            .select('id')
            .ilike('name', c.name)
            .single()

          if (existing) {
            await supabase
              .from('constituencies')
              .update({
                leading_party: c.leading_party,
                lead_margin: c.lead_margin,
                status: c.status,
                rounds_completed: c.rounds_completed,
                updated_at: new Date()
              })
              .eq('id', existing.id)
          }
        }
      }

      setMessage('✅ Dashboard updated successfully!')
      setInputText('')
    } catch (error) {
      setMessage('❌ Error: ' + error.message)
    }
    setIsProcessing(false)
  }

  const saveManual = async () => {
    setIsProcessing(true)
    setMessage('💾 Saving...')
    try {
      for (const [party, values] of Object.entries(manualData)) {
        await supabase
          .from('overall_tally')
          .update({ won: values.won, leading: values.leading, updated_at: new Date() })
          .eq('party', party)
      }
      setMessage('✅ Saved successfully!')
    } catch (error) {
      setMessage('❌ Error: ' + error.message)
    }
    setIsProcessing(false)
  }

  if (!isAuthenticated) {
    return (
      <div style={{
        background: '#0A0F1E', minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        <div style={{
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: '16px', padding: '32px', width: '300px',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: '24px', fontWeight: '900', color: '#F59E0B',
            marginBottom: '8px',
          }}>நாடி Admin</div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '24px' }}>
            Election Dashboard Control Panel
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && login()}
            style={{
              background: '#1E293B', border: '1px solid #334155',
              borderRadius: '8px', color: 'white', padding: '10px 16px',
              fontSize: '16px', width: '100%', marginBottom: '12px',
            }}
          />
          <button onClick={login} style={{
            background: '#DC2626', color: 'white', border: 'none',
            borderRadius: '8px', padding: '12px', width: '100%',
            fontSize: '16px', fontWeight: '700', cursor: 'pointer',
          }}>Login</button>
          {message && (
            <div style={{ color: '#EF4444', fontSize: '13px', marginTop: '8px' }}>
              {message}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: '#0A0F1E', minHeight: '100vh',
      color: 'white', fontFamily: "'Segoe UI', sans-serif",
      padding: '20px',
    }}>
      <div style={{
        fontSize: '22px', fontWeight: '900', color: '#F59E0B',
        marginBottom: '4px',
      }}>நாடி Admin Panel</div>
      <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '20px' }}>
        Election Dashboard Control
      </div>

      {/* Mode Toggle */}
      <div style={{
        display: 'flex', gap: '8px', marginBottom: '20px',
      }}>
        <button
          onClick={() => setMode('llm')}
          style={{
            background: mode === 'llm' ? '#DC2626' : '#1E293B',
            color: 'white', border: 'none', borderRadius: '8px',
            padding: '10px 20px', cursor: 'pointer', fontWeight: '700',
          }}>
          🤖 LLM Mode
        </button>
        <button
          onClick={() => setMode('manual')}
          style={{
            background: mode === 'manual' ? '#DC2626' : '#1E293B',
            color: 'white', border: 'none', borderRadius: '8px',
            padding: '10px 20px', cursor: 'pointer', fontWeight: '700',
          }}>
          ✏️ Manual Mode
        </button>
      </div>

      {mode === 'llm' ? (
        /* LLM MODE */
        <div style={{
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: '12px', padding: '20px',
        }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#F59E0B', marginBottom: '8px' }}>
            🤖 LLM Auto-Parse
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
            எந்த format-லயும் paste பண்ணுங்க:
            "DMK 45 won 12 leading" or
            "திமுக 45 வென்றது 12 முன்னிலை"
          </div>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="ECI website-ல் இருந்து copy paste பண்ணுங்க..."
            style={{
              background: '#1E293B', border: '1px solid #334155',
              borderRadius: '8px', color: 'white', padding: '12px',
              fontSize: '14px', width: '100%', minHeight: '120px',
              resize: 'vertical',
            }}
          />
          <button
            onClick={processWithLLM}
            disabled={isProcessing}
            style={{
              background: isProcessing ? '#374151' : '#DC2626',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '12px 24px', marginTop: '12px',
              fontSize: '15px', fontWeight: '700', cursor: 'pointer',
              width: '100%',
            }}>
            {isProcessing ? '⏳ Processing...' : '🚀 Parse & Update Dashboard'}
          </button>
        </div>
      ) : (
        /* MANUAL MODE */
        <div style={{
          background: '#111827', border: '1px solid #1E293B',
          borderRadius: '12px', padding: '20px',
        }}>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#F59E0B', marginBottom: '16px' }}>
            ✏️ Manual Update
          </div>
          {Object.entries(manualData).map(([party, values]) => (
            <div key={party} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px', marginBottom: '12px', alignItems: 'center',
            }}>
              <div style={{
                fontWeight: '700', fontSize: '16px',
                color: party === 'DMK+' ? '#DC2626' :
                       party === 'AIADMK+' ? '#16A34A' :
                       party === 'TVK' ? '#D97706' : '#6B7280',
              }}>
                {party === 'DMK+' ? 'திமுக+' :
                 party === 'AIADMK+' ? 'அதிமுக+' :
                 party === 'TVK' ? 'தவெக' : 'மற்றவை'}
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
                  வென்றது ✅
                </div>
                <input
                  type="number" min="0"
                  value={values.won}
                  onChange={e => setManualData({
                    ...manualData,
                    [party]: { ...values, won: parseInt(e.target.value) || 0 }
                  })}
                  style={{
                    background: '#1E293B', border: '1px solid #334155',
                    borderRadius: '8px', color: 'white',
                    padding: '8px', fontSize: '18px', fontWeight: '700',
                    width: '100%', textAlign: 'center',
                  }}
                />
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
                  முன்னிலை 📈
                </div>
                <input
                  type="number" min="0"
                  value={values.leading}
                  onChange={e => setManualData({
                    ...manualData,
                    [party]: { ...values, leading: parseInt(e.target.value) || 0 }
                  })}
                  style={{
                    background: '#1E293B', border: '1px solid #334155',
                    borderRadius: '8px', color: 'white',
                    padding: '8px', fontSize: '18px', fontWeight: '700',
                    width: '100%', textAlign: 'center',
                  }}
                />
              </div>
            </div>
          ))}
          <button
            onClick={saveManual}
            disabled={isProcessing}
            style={{
              background: isProcessing ? '#374151' : '#16A34A',
              color: 'white', border: 'none', borderRadius: '8px',
              padding: '14px', width: '100%',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              marginTop: '8px',
            }}>
            {isProcessing ? '⏳ Saving...' : '✅ Save & Update Dashboard'}
          </button>
        </div>
      )}

      {message && (
        <div style={{
          marginTop: '16px', padding: '12px 16px',
          background: message.includes('✅') ? '#16A34A22' : '#DC262622',
          border: `1px solid ${message.includes('✅') ? '#16A34A' : '#DC2626'}`,
          borderRadius: '8px', fontSize: '14px', fontWeight: '600',
          color: message.includes('✅') ? '#22C55E' : '#EF4444',
        }}>
          {message}
        </div>
      )}
    </div>
  )
}
