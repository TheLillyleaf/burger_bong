export default function ThemeToggle({ theme, on_toggle }) {
  return (
    <button
      className="theme-toggle"
      onClick={on_toggle}
      aria-label="Byt tema"
      title={theme === 'dark' ? 'Byt till ljust tema' : 'Byt till mörkt tema'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
