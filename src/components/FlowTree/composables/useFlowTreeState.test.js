import { describe, it, expect } from 'vitest'
import { buildMaxPerLevel, DEFAULT_NODES, DEFAULT_EDGES } from './useFlowTreeState'

describe('useFlowTreeState', () => {
  describe('buildMaxPerLevel', () => {
    it('retorna mapa vazio para maxLevels 0', () => {
      expect(buildMaxPerLevel(0)).toEqual({})
    })

    it('retorna mapa com nível 1 quando maxLevels é 1', () => {
      expect(buildMaxPerLevel(1)).toEqual({ 1: 1 })
    })

    it('retorna mapa correto para maxLevels 2', () => {
      expect(buildMaxPerLevel(2)).toEqual({ 1: 1, 2: 3 })
    })

    it('retorna mapa correto para maxLevels 3', () => {
      expect(buildMaxPerLevel(3)).toEqual({ 1: 1, 2: 3, 3: 9 })
    })

    it('retorna mapa correto para maxLevels 4', () => {
      expect(buildMaxPerLevel(4)).toEqual({ 1: 1, 2: 3, 3: 9, 4: 27 })
    })

    it('calcula valores usando potências de 3', () => {
      const result = buildMaxPerLevel(5)
      expect(result[1]).toBe(Math.pow(3, 0))
      expect(result[2]).toBe(Math.pow(3, 1))
      expect(result[3]).toBe(Math.pow(3, 2))
      expect(result[4]).toBe(Math.pow(3, 3))
      expect(result[5]).toBe(Math.pow(3, 4))
    })

    it('retorna mapa vazio para valores negativos', () => {
      expect(buildMaxPerLevel(-1)).toEqual({})
    })
  })

  describe('DEFAULT_NODES', () => {
    it('é um array vazio', () => {
      expect(DEFAULT_NODES).toEqual([])
    })

    it('é um array', () => {
      expect(Array.isArray(DEFAULT_NODES)).toBe(true)
    })
  })

  describe('DEFAULT_EDGES', () => {
    it('é um array vazio', () => {
      expect(DEFAULT_EDGES).toEqual([])
    })

    it('é um array', () => {
      expect(Array.isArray(DEFAULT_EDGES)).toBe(true)
    })
  })
})
