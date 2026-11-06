import { ref, watch } from 'vue'

const THEME_KEY = 'kanban-theme'
const current = ref('light')

function applyToDom(theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

export function initTheme() {
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'dark' || saved === 'light') {
    current.value = saved
  } else if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    current.value = 'dark'
  }
  applyToDom(current.value)
}

export function useTheme() {
  function toggle() {
    current.value = current.value === 'light' ? 'dark' : 'light'
  }

  watch(current, (value) => {
    applyToDom(value)
    localStorage.setItem(THEME_KEY, value)
  })

  return { theme: current, toggle }
}