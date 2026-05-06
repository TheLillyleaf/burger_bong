import { useState, useEffect } from 'react'
import BongTicket from '../components/bong_ticket'
import ThemeToggle from '../components/theme_toggle'
import { use_theme } from '../use_theme'

const API_BASE = import.meta.env.VITE_API_URL ?? ''
const POLL_INTERVAL_MS = 3000

export default function BongPage() {
  const { theme, toggle_theme } = use_theme()
  const [orders, set_orders] = useState([])
  const [error, set_error] = useState(null)

  useEffect(() => {
    async function fetch_orders() {
      try {
        const res = await fetch(`${API_BASE}/api/orders`)
        if (!res.ok) throw new Error('Fetch failed')
        set_orders(await res.json())
        set_error(null)
      } catch {
        set_error('Kan inte nå servern')
      }
    }

    fetch_orders()
    const interval = setInterval(fetch_orders, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  async function handle_done(id) {
    try {
      await fetch(`${API_BASE}/api/orders/${id}/done`, { method: 'PATCH' })
      set_orders((prev) => prev.filter((o) => o.id !== id))
    } catch {
      alert('Kunde inte markera order som klar.')
    }
  }

  return (
    <div className="bong-page">
      <header className="bong-page__header">
        <span className="bong-page__title">Burger Bong — Kök</span>
        {orders.length > 0 && (
          <span className="bong-page__count">
            {orders.length} {orders.length === 1 ? 'order' : 'ordrar'}
          </span>
        )}
        {error && <span className="bong-page__error">{error}</span>}
        <ThemeToggle theme={theme} on_toggle={toggle_theme} />
      </header>

      <div className="bong-page__body">
        {orders.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__emoji">🍔</span>
            <p className="empty-state__title">Ingen hungrig just nu</p>
            <p className="empty-state__subtitle">
              Ordrar dyker upp här när gästerna beställer
            </p>
          </div>
        ) : (
          <div className="ticket-grid">
            {orders.map((order) => (
              <BongTicket key={order.id} order={order} on_done={handle_done} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
