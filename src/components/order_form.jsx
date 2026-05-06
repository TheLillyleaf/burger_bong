export default function OrderForm({ value, on_change }) {
  return (
    <div>
      <p className="order-page__section-label">Ditt namn</p>
      <input
        className="name-input"
        type="text"
        value={value}
        onChange={(e) => on_change(e.target.value)}
        placeholder="Skriv ditt namn..."
        maxLength={50}
        autoComplete="off"
      />
    </div>
  )
}
