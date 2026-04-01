import { describe, it, expect } from 'vitest'
import { DARK, LIGHT } from './themeTokens'

describe('themeTokens.js', () => {
  const requiredTokens = [
    '--t-bg',
    '--t-panel-bg',
    '--t-section-bg',
    '--t-input-bg',
    '--t-panel-border',
    '--t-input-border',
    '--t-text-primary',
    '--t-text-secondary',
    '--t-text-muted',
    '--t-grid-color',
    '--t-badge-bg',
    '--t-badge-border',
    '--t-badge-text',
    '--t-overlay',
  ]

  describe('DARK', () => {
    it('possui todas as variáveis CSS requeridas', () => {
      requiredTokens.forEach((token) => {
        expect(DARK).toHaveProperty(token)
      })
    })

    it('cada token possui valor hexadecimal válido', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/
      Object.entries(DARK).forEach(([key, value]) => {
        expect(value).toMatch(hexRegex)
      })
    })

    it('--t-bg é preto (#000000)', () => {
      expect(DARK['--t-bg']).toBe('#000000')
    })

    it('--t-text-primary é uma cor clara', () => {
      expect(DARK['--t-text-primary']).toBe('#e8eeff')
    })

    it('--t-text-secondary é uma cor mais escura que primary', () => {
      expect(DARK['--t-text-secondary']).toBe('#7888aa')
    })

    it('--t-text-muted é mais escura que secondary', () => {
      expect(DARK['--t-text-muted']).toBe('#424e6a')
    })

    it('--t-overlay tem canal alpha', () => {
      expect(DARK['--t-overlay']).toBe('#000000b3')
    })
  })

  describe('LIGHT', () => {
    it('possui todas as variáveis CSS requeridas', () => {
      requiredTokens.forEach((token) => {
        expect(LIGHT).toHaveProperty(token)
      })
    })

    it('cada token possui valor hexadecimal válido', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/
      Object.entries(LIGHT).forEach(([key, value]) => {
        expect(value).toMatch(hexRegex)
      })
    })

    it('--t-bg é claro (#eef5ff)', () => {
      expect(LIGHT['--t-bg']).toBe('#eef5ff')
    })

    it('--t-text-primary é uma cor escura', () => {
      expect(LIGHT['--t-text-primary']).toBe('#101828')
    })

    it('--t-text-secondary é mais clara que primary', () => {
      expect(LIGHT['--t-text-secondary']).toBe('#485870')
    })

    it('--t-text-muted é mais clara que secondary', () => {
      expect(LIGHT['--t-text-muted']).toBe('#7080a0')
    })

    it('--t-overlay tem canal alpha', () => {
      expect(LIGHT['--t-overlay']).toBe('#0000004d')
    })
  })

  describe('comparação entre temas', () => {
    it('DARK e LIGHT possuem as mesmas chaves', () => {
      expect(Object.keys(DARK).sort()).toEqual(Object.keys(LIGHT).sort())
    })

    it('DARK --t-bg é mais escuro que LIGHT --t-bg', () => {
      const darkBg = DARK['--t-bg']
      const lightBg = LIGHT['--t-bg']
      expect(darkBg).not.toBe(lightBg)
    })

    it('DARK --t-text-primary é claro (invertido do LIGHT)', () => {
      expect(DARK['--t-text-primary']).not.toBe(LIGHT['--t-text-primary'])
    })

    it('LIGHT usa backgrounds claros, DARK usa backgrounds escuros', () => {
      expect(LIGHT['--t-bg']).toBe('#eef5ff')
      expect(DARK['--t-bg']).toBe('#000000')
    })
  })
})
