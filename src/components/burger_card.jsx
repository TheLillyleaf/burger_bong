export default function BurgerCard({ burger, selected, on_select }) {
  return (
    <button
      className={`burger-card${selected ? ' burger-card--selected' : ''}`}
      style={{
        borderColor: burger.color,
        backgroundColor: selected ? `${burger.color}22` : undefined,
      }}
      onClick={() => on_select(burger.id)}
      type="button"
    >
      <div
        className="burger-card__accent-bar"
        style={{ backgroundColor: burger.color }}
      />
      <h3
        className="burger-card__name"
        style={{ color: selected ? burger.color : undefined }}
      >
        {burger.name}
      </h3>
      <span className="burger-card__tagline">{burger.tagline}</span>
      <ul className="burger-card__ingredients">
        {burger.ingredients.map((item) => (
          <li key={item} className="burger-card__ingredient">
            {item}
          </li>
        ))}
      </ul>
    </button>
  )
}
