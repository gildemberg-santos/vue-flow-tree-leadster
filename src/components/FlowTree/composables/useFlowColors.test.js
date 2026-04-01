import { describe, it, expect, beforeEach } from 'vitest'
import { LEVEL_PALETTE, buildDefaultColors, DEFAULT_COLORS } from '../config/colorPalette'
import { useFlowColors } from './useFlowColors'

beforeEach(() => {
  localStorage.clear()
})

// ── LEVEL_PALETTE ─────────────────────────────────────────────────────────────
describe('LEVEL_PALETTE', () => {
  it('tem ao menos 10 entradas', () => {
    expect(LEVEL_PALETTE.length).toBeGreaterThanOrEqual(10)
  })

  it('cada entrada tem bg, border e text', () => {
    LEVEL_PALETTE.forEach((entry) => {
      expect(entry).toHaveProperty('bg')
      expect(entry).toHaveProperty('border')
      expect(entry).toHaveProperty('text')
    })
  })
})

// ── buildDefaultColors ────────────────────────────────────────────────────────
describe('buildDefaultColors', () => {
  it('gera chaves de 1 até maxLevels', () => {
    const colors = buildDefaultColors(3)
    expect(Object.keys(colors).map(Number)).toEqual([1, 2, 3])
  })

  it('nível 1 corresponde ao índice 0 da paleta', () => {
    const colors = buildDefaultColors(3)
    expect(colors[1]).toEqual(LEVEL_PALETTE[0])
  })

  it('cicla a paleta quando maxLevels > tamanho da paleta', () => {
    const overflow = LEVEL_PALETTE.length + 1
    const colors = buildDefaultColors(overflow)
    expect(colors[overflow]).toEqual(LEVEL_PALETTE[0])
  })

  it('retorna cópias independentes (não referências da paleta)', () => {
    const colors = buildDefaultColors(1)
    colors[1].bg = '#ffffff'
    expect(LEVEL_PALETTE[0].bg).not.toBe('#ffffff')
  })
})

// ── DEFAULT_COLORS ────────────────────────────────────────────────────────────
describe('DEFAULT_COLORS', () => {
  it('tem exatamente 3 níveis', () => {
    expect(Object.keys(DEFAULT_COLORS)).toHaveLength(3)
  })
})

// ── useFlowColors ─────────────────────────────────────────────────────────────
describe('useFlowColors', () => {
  describe('estado inicial', () => {
    it('retorna cores padrão quando localStorage está vazio', () => {
      const { colors } = useFlowColors(3)
      expect(colors.value).toEqual(buildDefaultColors(3))
    })

    it('carrega cores salvas do localStorage', () => {
      const saved = { 1: { bg: '#ff0000', border: '#00ff00', text: '#0000ff' } }
      localStorage.setItem('vft-colors', JSON.stringify(saved))
      const { colors } = useFlowColors(3)
      expect(colors.value[1]).toEqual(saved[1])
    })

    it('preenche níveis ausentes no localStorage com os padrões', () => {
      const partial = { 1: { bg: '#ff0000', border: '#00ff00', text: '#0000ff' } }
      localStorage.setItem('vft-colors', JSON.stringify(partial))
      const { colors } = useFlowColors(3)
      expect(colors.value[2]).toEqual(buildDefaultColors(3)[2])
      expect(colors.value[3]).toEqual(buildDefaultColors(3)[3])
    })

    it('usa cores padrão quando localStorage tem JSON inválido', () => {
      localStorage.setItem('vft-colors', 'invalido{{{')
      const { colors } = useFlowColors(3)
      expect(colors.value).toEqual(buildDefaultColors(3))
    })
  })

  describe('cssVars', () => {
    it('gera variáveis CSS para cada nível', () => {
      const { cssVars } = useFlowColors(3)
      expect(cssVars.value).toHaveProperty('--level-1-bg')
      expect(cssVars.value).toHaveProperty('--level-1-border')
      expect(cssVars.value).toHaveProperty('--level-1-text')
      expect(cssVars.value).toHaveProperty('--level-2-bg')
      expect(cssVars.value).toHaveProperty('--level-3-bg')
    })

    it('não gera variáveis além de maxLevels', () => {
      const { cssVars } = useFlowColors(2)
      expect(cssVars.value).not.toHaveProperty('--level-3-bg')
    })

    it('valores das variáveis correspondem às cores ativas', () => {
      const { colors, cssVars } = useFlowColors(3)
      expect(cssVars.value['--level-1-bg']).toBe(colors.value[1].bg)
      expect(cssVars.value['--level-2-border']).toBe(colors.value[2].border)
    })
  })

  describe('saveColors', () => {
    it('persiste as cores no localStorage', () => {
      const { colors, saveColors } = useFlowColors(3)
      colors.value[1].bg = '#123456'
      saveColors()
      const stored = JSON.parse(localStorage.getItem('vft-colors'))
      expect(stored[1].bg).toBe('#123456')
    })
  })

  describe('resetColors', () => {
    it('restaura as cores para o padrão', () => {
      const { colors, resetColors } = useFlowColors(3)
      colors.value[1].bg = '#999999'
      resetColors()
      expect(colors.value[1].bg).toBe(buildDefaultColors(3)[1].bg)
    })

    it('não altera o localStorage ao resetar', () => {
      const { resetColors } = useFlowColors(3)
      resetColors()
      expect(localStorage.getItem('vft-colors')).toBeNull()
    })
  })
})
