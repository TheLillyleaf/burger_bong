import { useState, useEffect } from 'react'

export function use_theme() {
  const [theme, set_theme] = useState(
    () => (typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null) ?? 'dark'
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggle_theme() {
    set_theme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggle_theme }
}
