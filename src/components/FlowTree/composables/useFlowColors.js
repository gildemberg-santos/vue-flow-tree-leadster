import { ref, computed } from 'vue'
import { buildDefaultColors } from '../config/colorPalette'

const STORAGE_KEY = 'vft-colors'

function loadColors(maxLevels) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const defaults = buildDefaultColors(maxLevels)
    if (!stored) return defaults
    const parsed = JSON.parse(stored)
    // Preenche níveis que não estavam salvos com as cores padrão
    return { ...defaults, ...parsed }
  } catch {
    return buildDefaultColors(maxLevels)
  }
}

export function useFlowColors(maxLevels = 3) {
  const colors = ref(loadColors(maxLevels))

  const cssVars = computed(() => {
    const vars = {}
    for (let level = 1; level <= maxLevels; level++) {
      vars[`--level-${level}-bg`] = colors.value[level]?.bg
      vars[`--level-${level}-border`] = colors.value[level]?.border
      vars[`--level-${level}-text`] = colors.value[level]?.text
    }
    return vars
  })

  function saveColors() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors.value))
  }

  function resetColors() {
    colors.value = buildDefaultColors(maxLevels)
  }

  return { colors, cssVars, saveColors, resetColors }
}
