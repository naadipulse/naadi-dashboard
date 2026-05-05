import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabaseClient.js'

export const MAJORITY = 118
export const TOTAL = 234

export const DEFAULT_SETTINGS = {
  font_large: '52', font_medium: '22', font_small: '13',
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
    const sub = supabase.channel('settings_' + Math.random())
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
    fetchTally()
    const sub = supabase.channel('tally_' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'overall_tally' }, fetchTally)
      .subscribe()
    const poll = setInterval(fetchTally, 5000)
    return () => { sub.unsubscribe(); clearInterval(poll) }
  }, [])
  const fetchTally = async () => {
    const { data } = await supabase.from('overall_tally').select('*')
    if (data) setTally(data)
  }
  const gT = p => { const d = tally.find(t => t.party === p); return d ? d.won + (d.leadingg || 0) : 0 }
  const gW = p => tally.find(t => t.party === p)?.won || 0
  const gL = p => tally.find(t => t.party === p)?.leadingg || 0
  const gP = p => Number(tally.find(t => t.party === p)?.vote_share || 0)
  const totalDeclared = tally.reduce((s, t) => s + t.won + (t.leadingg || 0), 0)
  return { tally, gT, gW, gL, gP, totalDeclared }
}

export function useConstituencies() {
  const [constituencies, setConstituencies] = useState([])
  useEffect(() => {
    fetchConst()
    const sub = supabase.channel('const_' + Math.random())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'constituencies' }, fetchConst)
      .subscribe()
    const poll = setInterval(fetchConst, 5000)
    return () => { sub.unsubscribe(); clearInterval(poll) }
  }, [])
  const fetchConst = async () => {
    const { data } = await supabase.from('constituencies').select('*').order('updated_at', { ascending: false })
    if (data) setConstituencies(data)
  }
  return constituencies
}

export function AnimNum({ val, color, size = 48, font }) {
  const [n, setN] = useState(val)
  const prev = useRef(val)
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

export function Photo({ photoUrl, fallback, color, size = 56, style = {} }) {
  const [err, setErr] = useState(false)
  if (err || !photoUrl) return (
    <div style={{ width: size, height: size, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: (typeof size === 'number' ? size : 56) * 0.28, fontWeight: 900, color, flexShrink: 0, ...style }}>
      {fallback}
    </div>
  )
  return <img src={photoUrl} alt="" onError={() => setErr(true)} style={{ width: size, height: size, objectFit: 'cover', objectPosition: 'top', flexShrink: 0, ...style }} />
}

export const PARTY_DEFAULTS = {
  'DMK+':    { color: '#DC2626', light: '#FEE2E2', label: 'திமுக+',  short: 'DMK',  leader: 'மு.க.ஸ்டாலின்', photoKey: 'photo_dmk', logoKey: 'logo_dmk', logo: 'https://khivotiprmornlvmrhaw.supabase.co/storage/v1/object/public/logo/DMK.png' },
  'AIADMK+': { color: '#16A34A', light: '#DCFCE7', label: 'அதிமுக+', short: 'ADMK', leader: 'எடப்பாடி',       photoKey: 'photo_aiadmk', logoKey: 'logo_aiadmk', logo: 'https://khivotiprmornlvmrhaw.supabase.co/storage/v1/object/public/logo/ADMK.png' },
  'TVK':     { color: '#D97706', light: '#FEF3C7', label: 'தவெக',    short: 'TVK',  leader: 'விஜய்',           photoKey: 'photo_tvk', logoKey: 'logo_tvk', logo: 'https://khivotiprmornlvmrhaw.supabase.co/storage/v1/object/public/logo/TVK.png' },
  'Others':  { color: '#7C3AED', light: '#EDE9FE', label: 'நாதக',  short: 'NTK',  leader: 'சீமான்',          photoKey: 'photo_others', logoKey: 'logo_others', logo: 'https://khivotiprmornlvmrhaw.supabase.co/storage/v1/object/public/logo/NTK.png' },
}

export const INDIVIDUAL_PARTIES = {
  'TVK':     { color: '#D97706', label: 'தவெக',    short: 'TVK' },
  'DMK':     { color: '#DC2626', label: 'திமுக',   short: 'DMK' },
  'ADMK':    { color: '#16A34A', label: 'அதிமுக',  short: 'ADMK' },
  'INC':     { color: '#3B82F6', label: 'காங்கிரஸ்', short: 'INC' },
  'PMK':     { color: '#FACC15', label: 'பாமக',   short: 'PMK' },
  'IUML':    { color: '#059669', label: 'முஸ்லிம் லீக்', short: 'IUML' },
  'CPI':     { color: '#B91C1C', label: 'சிபிஐ',   short: 'CPI' },
  'VCK':     { color: '#4F46E5', label: 'விசிக',   short: 'VCK' },
  'CPI(M)':  { color: '#EF4444', label: 'சிபிஎம்',  short: 'CPM' },
  'BJP':     { color: '#EA580C', label: 'பாஜக',   short: 'BJP' },
  'DMDK':    { color: '#9D174D', label: 'தேமுதிக', short: 'DMDK' },
  'AMMK':    { color: '#BE185D', label: 'அம்மக',   short: 'AMMK' },
}

// Per-component font helper — falls back to global settings
export function getComponentFonts(settings, prefix) {
  return {
    fs:  parseInt(settings[`${prefix}_font_large`])  || parseInt(settings.font_large)  || 52,
    fm:  parseInt(settings[`${prefix}_font_medium`]) || parseInt(settings.font_medium) || 22,
    fsm: parseInt(settings[`${prefix}_font_small`])  || parseInt(settings.font_small)  || 13,
    ff:  settings.font_family || 'Segoe UI',
  }
}
