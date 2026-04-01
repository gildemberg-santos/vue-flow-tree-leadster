import { ref, computed } from 'vue'
import { DARK, LIGHT } from '../config/themeTokens'

const STORAGE_KEY = 'vft-theme'

export function useFlowTheme() {
  const theme = ref(localStorage.getItem(STORAGE_KEY) || 'dark')

  const isDark = computed(() => theme.value === 'dark')

  const themeVars = computed(() => (isDark.value ? DARK : LIGHT))

  function toggleTheme() {
    theme.value = isDark.value ? 'light' : 'dark'
    localStorage.setItem(STORAGE_KEY, theme.value)
  }

  return { theme, isDark, themeVars, toggleTheme }
}
