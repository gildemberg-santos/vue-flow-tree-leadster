/**
 * Tokens de design para os temas dark e light.
 *
 * Paleta base:
 *   Black:          #000000
 *   Dark:           #191926
 *   Primary Blue:   #0070F0
 *   Secondary Blue: #00C0F0
 *   White:          #ffffff
 */

export const DARK = {
  // Fundos
  '--t-bg': '#000000',
  '--t-panel-bg': '#0e0e1c',
  '--t-section-bg': '#080812',
  '--t-input-bg': '#13131f',

  // Bordas derivadas do Primary Blue escurecido
  '--t-panel-border': '#0d1e3a',
  '--t-input-border': '#162844',

  // Texto
  '--t-text-primary': '#e8eeff',
  '--t-text-secondary': '#7888aa',
  '--t-text-muted': '#424e6a',

  // Grade e badges
  '--t-grid-color': '#0a1628',
  '--t-badge-bg': '#0a1628',
  '--t-badge-border': '#162844',
  '--t-badge-text': '#4090c8',

  // Overlay com alpha em hex 8 dígitos (70% preto)
  '--t-overlay': '#000000b3',
}

export const LIGHT = {
  // Fundos
  '--t-bg': '#eef5ff',
  '--t-panel-bg': '#ffffff',
  '--t-section-bg': '#f5f9ff',
  '--t-input-bg': '#f0f6ff',

  // Bordas derivadas do Primary Blue clareado
  '--t-panel-border': '#cce2fc',
  '--t-input-border': '#b0d0f8',

  // Texto
  '--t-text-primary': '#101828',
  '--t-text-secondary': '#485870',
  '--t-text-muted': '#7080a0',

  // Grade e badges
  '--t-grid-color': '#d8ecfe',
  '--t-badge-bg': '#e8f2ff',
  '--t-badge-border': '#b0d0f8',
  '--t-badge-text': '#0058c8',

  // Overlay com alpha em hex 8 dígitos (30% preto)
  '--t-overlay': '#0000004d',
}
