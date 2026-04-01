/**
 * Paleta base de cores por nível.
 * Se maxLevels > paleta, as cores ciclam.
 */
export const LEVEL_PALETTE = [
  { bg: '#001240', border: '#0070F0', text: '#80b8ff' }, // Azul
  { bg: '#0e0828', border: '#7b5fff', text: '#c0a8ff' }, // Roxo
  { bg: '#002010', border: '#25d366', text: '#70e890' }, // Verde
  { bg: '#2a1200', border: '#f07820', text: '#ffb878' }, // Laranja
  { bg: '#1a0020', border: '#c040f0', text: '#e090ff' }, // Magenta
  { bg: '#001e1e', border: '#00d4b0', text: '#70f0e0' }, // Teal
  { bg: '#1a1000', border: '#e0c020', text: '#fff0a0' }, // Amarelo
  { bg: '#200010', border: '#f04080', text: '#ffb0c8' }, // Rosa
  { bg: '#0a1a00', border: '#80c820', text: '#c8f060' }, // Lima
  { bg: '#10001a', border: '#a060f0', text: '#d8b0ff' }, // Violeta
]

/**
 * Gera o mapa de cores padrão para N níveis.
 * @param {number} maxLevels
 * @returns {Record<number, { bg: string, border: string, text: string }>}
 */
export function buildDefaultColors(maxLevels) {
  const result = {}
  for (let i = 1; i <= maxLevels; i++) {
    result[i] = { ...LEVEL_PALETTE[(i - 1) % LEVEL_PALETTE.length] }
  }
  return result
}

export const DEFAULT_COLORS = buildDefaultColors(3)
