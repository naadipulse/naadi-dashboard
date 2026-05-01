import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient'

export const MAJORITY = 118
export const TOTAL = 234

export const DEFAULT_SETTINGS = {
  font_large: '52',
  font_medium: '22',
  font_small: '13',
  font_family: 'Segoe UI',
  photo_dmk: 'https://i.ibb.co/fGKGZ6PK/stalin.jpg',
  photo_aiadmk: 'https://i.ibb.co/Xrt4nYLB/edappadi.jpg',
  photo_tvk: 'https://i.ibb.co/CpGmHqFQ/vijay.jpg',
  photo_others: 'https://i.ibb.co/NnpMmcHn/seeman.jpg',
}

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    fetchSettings()
    const sub = supabase.channel('settings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, fetchSettings)
      .subscribe()
    return () => sub.unsubscribe()
  }, [])

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*')
    if (data) {
      const s = { ...DEFAULT_SETTINGS }
      data.forEach(row => { s[row.key] = row.value })
      setSettings(s)
    }
  }

  return settings
}

export function useTally() {
  const [tally, setTally] = useState([])

  useEffect(() => {
    fetch()
    const sub = supabase.channel('tally_ch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'overall_tally' }, fetch)
      .subscribe()
    const poll = setInterval(fetch, 5000)
    return () => { sub.unsubscribe(); clearInterval(poll) }
  }, [])

  const fetch = async () => {
    const { data } = await supabase.from('overall_tally').select('*')
    if (data) setTally(data)
  }

  const gT = p => { const d = tally.find(t => t.party === p); return d ? d.won + (d.leadingg || 0) : 0 }
  const gW = p => tally.find(t => t.party === p)?.won || 0
  const gL = p => tally.find(t => t.party === p)?.leadingg || 0
  const totalDeclared = tally.reduce((s, t) => s + t.won + (t.leadingg || 0), 0)

  return { tally, gT, gW, gL, totalDeclared }
}

export function useConstituencies() {
  const [constituencies, setConstituencies] = useState([])

  useEffect(() => {
    fetch()
    const sub = supabase.channel('const_ch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'constituencies' }, fetch)
      .subscribe()
    const poll = setInterval(fetch, 5000)
    return () => { sub.unsubscribe(); clearInterval(poll) }
  }, [])

  const fetch = async () => {
    const { data } = await supabase.from('constituencies').select('*').order('updated_at', { ascending: false })
    if (data) setConstituencies(data)
  }

  return constituencies
}

export function AnimNum({ val, color, size = 48, font }) {
  const [n, setN] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const s = prev.current, e = val
    if (s === e) return
    const t0 = Date.now()
    const run = () => {
      const p = Math.min((Date.now() - t0) / 800, 1)
      setN(Math.round(s + (e - s) * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(run)
      else prev.current = e
    }
    requestAnimationFrame(run)
  }, [val])
  return <span style={{ color, fontSize: size, fontWeight: 900, lineHeight: 1, fontFamily: font || 'inherit' }}>{n}</span>
}

export function Photo({ photoUrl, fallback, color, size = 56 }) {
  const [err, setErr] = useState(false)
  if (err || !photoUrl) return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color + '22', border: `3px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.28, fontWeight: 900, color, flexShrink: 0 }}>
      {fallback}
    </div>
  )
  return <img src={photoUrl} alt="" onError={() => setErr(true)} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top', border: `3px solid ${color}`, flexShrink: 0 }} />
}

export const PARTY_DEFAULTS = {
  'DMK+':    { color: '#DC2626', light: '#FEE2E2', label: 'திமுக+',  short: 'DMK',  leader: 'மு.க.ஸ்டாலின்', photoKey: 'photo_dmk' },
  'AIADMK+': { color: '#16A34A', light: '#DCFCE7', label: 'அதிமுக+', short: 'ADMK', leader: 'எடப்பாடி',       photoKey: 'photo_aiadmk' },
  'TVK':     { color: '#D97706', light: '#FEF3C7', label: 'தவெக',    short: 'TVK',  leader: 'விஜய்',           photoKey: 'photo_tvk' },
  'Others':  { color: '#7C3AED', light: '#EDE9FE', label: 'மற்றவை',  short: 'OTH',  leader: 'சீமான்',          photoKey: 'photo_others' },
}
