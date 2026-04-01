import { describe, it, expect } from 'vitest'
import {
  calculateFlowLevels,
  validateConnection,
  sanitizeEdges,
  validateFlow,
} from './flowValidator'

// ── Helpers ──────────────────────────────────────────────────────────────────
function node(id, level, extra = {}) {
  return { id, type: 'custom', position: { x: 0, y: 0 }, data: { label: id, level, ...extra } }
}
function edge(source, target, extra = {}) {
  return { id: `e-${source}-${target}`, source, target, data: {}, ...extra }
}

// ── calculateFlowLevels ───────────────────────────────────────────────────────
describe('calculateFlowLevels', () => {
  it('retorna array vazio quando nodes é null', () => {
    expect(calculateFlowLevels(null, [])).toEqual([])
  })

  it('nó sem pai vira raiz (nível 1)', () => {
    const result = calculateFlowLevels([node('A', 0)], [])
    expect(result.find(n => n.id === 'A').data.level).toBe(1)
  })

  it('segundo nó sem pai vai para maxLevels', () => {
    const result = calculateFlowLevels([node('A', 0), node('B', 0)], [], 3)
    expect(result.find(n => n.id === 'A').data.level).toBe(1)
    expect(result.find(n => n.id === 'B').data.level).toBe(3)
  })

  it('calcula níveis corretamente a partir das conexões', () => {
    const nodes = [node('A', 0), node('B', 0), node('C', 0)]
    const edges = [edge('A', 'B'), edge('B', 'C')]
    const result = calculateFlowLevels(nodes, edges, 3)
    expect(result.find(n => n.id === 'A').data.level).toBe(1)
    expect(result.find(n => n.id === 'B').data.level).toBe(2)
    expect(result.find(n => n.id === 'C').data.level).toBe(3)
  })

  it('nível não ultrapassa maxLevels em cadeias longas', () => {
    const nodes = [node('A', 0), node('B', 0), node('C', 0), node('D', 0)]
    const edges = [edge('A', 'B'), edge('B', 'C'), edge('C', 'D')]
    const result = calculateFlowLevels(nodes, edges, 3)
    expect(result.find(n => n.id === 'D').data.level).toBe(3)
  })

  it('ignora edges com nós inexistentes', () => {
    const nodes = [node('A', 0)]
    const edges = [edge('A', 'INEXISTENTE')]
    const result = calculateFlowLevels(nodes, edges, 3)
    expect(result.find(n => n.id === 'A').data.level).toBe(1)
  })
})

// ── validateConnection ────────────────────────────────────────────────────────
describe('validateConnection', () => {
  it('retorna inválido quando nó de origem não existe', () => {
    const result = validateConnection({ source: 'X', target: 'A' }, [node('A', 2)], [], 3)
    expect(result.valid).toBe(false)
  })

  it('retorna inválido quando destino tem nível igual à origem', () => {
    const nodes = [node('A', 1), node('B', 1)]
    const result = validateConnection({ source: 'A', target: 'B' }, nodes, [], 3)
    expect(result.valid).toBe(false)
  })

  it('retorna inválido quando origem está no nível final', () => {
    const nodes = [node('A', 3), node('B', 4)]
    const result = validateConnection({ source: 'A', target: 'B' }, nodes, [], 3)
    expect(result.valid).toBe(false)
  })

  it('retorna inválido quando excede maxConnections', () => {
    const nodes = [node('A', 1, { maxConnections: 1 }), node('B', 2), node('C', 2)]
    const edges = [edge('A', 'B')]
    const result = validateConnection({ source: 'A', target: 'C' }, nodes, edges, 3)
    expect(result.valid).toBe(false)
  })

  it('retorna inválido quando criaria ciclo', () => {
    const nodes = [node('A', 1), node('B', 2)]
    const edges = [edge('A', 'B')]
    const result = validateConnection({ source: 'B', target: 'A' }, nodes, edges, 3)
    expect(result.valid).toBe(false)
  })

  it('retorna válido para conexão correta', () => {
    const nodes = [node('A', 1), node('B', 2)]
    const result = validateConnection({ source: 'A', target: 'B' }, nodes, [], 3)
    expect(result.valid).toBe(true)
  })
})

// ── sanitizeEdges ─────────────────────────────────────────────────────────────
describe('sanitizeEdges', () => {
  it('remove edge com nó de origem inexistente', () => {
    const nodes = [node('B', 2)]
    const edges = [edge('INEXISTENTE', 'B')]
    expect(sanitizeEdges(nodes, edges)).toHaveLength(0)
  })

  it('remove edge com nó de destino inexistente', () => {
    const nodes = [node('A', 1)]
    const edges = [edge('A', 'INEXISTENTE')]
    expect(sanitizeEdges(nodes, edges)).toHaveLength(0)
  })

  it('remove edges duplicadas', () => {
    const nodes = [node('A', 1), node('B', 2)]
    const edges = [edge('A', 'B'), edge('A', 'B')]
    expect(sanitizeEdges(nodes, edges)).toHaveLength(1)
  })

  it('remove edge com direção inválida (destino nível <= origem)', () => {
    const nodes = [node('A', 2), node('B', 1)]
    const edges = [edge('A', 'B')]
    expect(sanitizeEdges(nodes, edges)).toHaveLength(0)
  })

  it('remove edge quando origem está no nível final', () => {
    const nodes = [node('A', 3), node('B', 4)]
    const edges = [edge('A', 'B')]
    expect(sanitizeEdges(nodes, edges, 3)).toHaveLength(0)
  })

  it('mantém edges válidas', () => {
    const nodes = [node('A', 1), node('B', 2)]
    const edges = [edge('A', 'B')]
    expect(sanitizeEdges(nodes, edges)).toHaveLength(1)
  })
})

// ── validateFlow ──────────────────────────────────────────────────────────────
describe('validateFlow', () => {
  it('retorna válido para fluxo vazio', () => {
    expect(validateFlow([], [], 3).valid).toBe(true)
  })

  it('retorna inválido quando não há nó de nível 1', () => {
    const result = validateFlow([node('A', 2)], [], 3)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('retorna inválido quando nó de nível > 1 não tem entrada', () => {
    const nodes = [node('A', 1), node('B', 2)]
    const result = validateFlow(nodes, [], 3)
    expect(result.valid).toBe(false)
  })

  it('retorna válido para fluxo completo correto', () => {
    const nodes = [node('A', 1), node('B', 2)]
    const edges = [edge('A', 'B')]
    expect(validateFlow(nodes, edges, 3).valid).toBe(true)
  })
})
