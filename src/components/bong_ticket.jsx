import { menu } from '../data/menu'

function time_since(date_string) {
  // D1 returns DATETIME as 'YYYY-MM-DD HH:MM:SS' without timezone — treat as UTC
  const utc = date_string.replace(' ', 'T') + 'Z'
  const minutes = Math.floor((Date.now() - new Date(utc).getTime()) / 60000)
  if (minutes < 1) return 'Just nu'
  return `${minutes} min sedan`
}

export default function BongTicket({ order, on_done }) {
  const burger_data = menu.find((b) => b.id === order.burger)
  const accent_color = burger_data?.color ?? '#f0c040'

  return (
    <div className="bong-ticket" style={{ borderTopColor: accent_color }}>
      <span className="bong-ticket__order-number">Order #{order.id}</span>
      <span className="bong-ticket__name">{order.name}</span>
      <span className="bong-ticket__burger">{burger_data?.name ?? order.burger}</span>
      <span className="bong-ticket__time">{time_since(order.created_at)}</span>
      <button className="bong-ticket__done-btn" onClick={() => on_done(order.id)}>
        Klar ✓
      </button>
    </div>
  )
}
