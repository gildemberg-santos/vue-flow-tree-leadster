import { describe, it, expect } from 'vitest'
import { LEVEL_PALETTE, buildDefaultColors, DEFAULT_COLORS } from './colorPalette'

describe('colorPalette.js', () => {
  describe('LEVEL_PALETTE', () => {
    it('tem exatamente 10 entradas', () => {
      expect(LEVEL_PALETTE.length).toBe(10)
    })

    it('cada entrada possui propriedades bg, border e text', () => {
      LEVEL_PALETTE.forEach((entry) => {
        expect(entry).toHaveProperty('bg')
        expect(entry).toHaveProperty('border')
        expect(entry).toHaveProperty('text')
      })
    })

    it('cada entrada possui valores hexadecimais válidos', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/
      LEVEL_PALETTE.forEach((entry) => {
        expect(entry.bg).toMatch(hexRegex)
        expect(entry.border).toMatch(hexRegex)
        expect(entry.text).toMatch(hexRegex)
      })
    })
  })

  describe('buildDefaultColors', () => {
    it('retorna um objeto vazio quando maxLevels é 0', () => {
      const colors = buildDefaultColors(0)
      expect(colors).toEqual({})
    })

    it('retorna um objeto vazio quando maxLevels é negativo', () => {
      const colors = buildDefaultColors(-1)
      expect(colors).toEqual({})
    })

    it('gera cores para 1 nível', () => {
      const colors = buildDefaultColors(1)
      expect(colors).toHaveProperty('1')
      expect(Object.keys(colors)).toHaveLength(1)
    })

    it('gera cores para múltiplos níveis', () => {
      const colors = buildDefaultColors(5)
      expect(Object.keys(colors)).toHaveLength(5)
      expect(colors).toHaveProperty('1')
      expect(colors).toHaveProperty('2')
      expect(colors).toHaveProperty('3')
      expect(colors).toHaveProperty('4')
      expect(colors).toHaveProperty('5')
    })

    it('nível 1 usa índice 0 da paleta', () => {
      const colors = buildDefaultColors(3)
      expect(colors[1]).toEqual(LEVEL_PALETTE[0])
    })

    it('nível 2 usa índice 1 da paleta', () => {
      const colors = buildDefaultColors(3)
      expect(colors[2]).toEqual(LEVEL_PALETTE[1])
    })

    it('nível 3 usa índice 2 da paleta', () => {
      const colors = buildDefaultColors(3)
      expect(colors[3]).toEqual(LEVEL_PALETTE[2])
    })

    it('cicla quando maxLevels excede tamanho da paleta', () => {
      const colors = buildDefaultColors(11)
      expect(colors[11]).toEqual(LEVEL_PALETTE[0])
    })

    it('cicla corretamente para níveis maiores', () => {
      const colors = buildDefaultColors(20)
      expect(colors[11]).toEqual(LEVEL_PALETTE[0])
      expect(colors[12]).toEqual(LEVEL_PALETTE[1])
    })

    it('retorna cópias independentes da paleta', () => {
      const colors = buildDefaultColors(3)
      colors[1].bg = '#modified'
      expect(LEVEL_PALETTE[0].bg).not.toBe('#modified')
    })

    it('cada nível retornado é um objeto independente', () => {
      const colors = buildDefaultColors(3)
      colors[1].bg = '#changed'
      colors[2].bg = '#alsochanged'
      expect(colors[1].bg).toBe('#changed')
      expect(colors[2].bg).toBe('#alsochanged')
      expect(colors[3].bg).not.toBe('#changed')
    })
  })

  describe('DEFAULT_COLORS', () => {
    it('tem exatamente 3 níveis', () => {
      expect(Object.keys(DEFAULT_COLORS)).toHaveLength(3)
    })

    it('contém as propriedades bg, border e text em cada nível', () => {
      Object.values(DEFAULT_COLORS).forEach((color) => {
        expect(color).toHaveProperty('bg')
        expect(color).toHaveProperty('border')
        expect(color).toHaveProperty('text')
      })
    })

    it('é igual ao resultado de buildDefaultColors(3)', () => {
      expect(DEFAULT_COLORS).toEqual(buildDefaultColors(3))
    })
  })
})
