import React from 'react'
import Dashboard from './Dashboard'
import Admin from './Admin'

export default function App() {
  const isAdmin = window.location.pathname === '/admin'
  return isAdmin ? <Admin /> : <Dashboard />
}
