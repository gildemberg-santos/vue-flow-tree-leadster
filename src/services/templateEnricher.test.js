import { describe, it, expect } from 'vitest'
import { enrichNodes, enrichEdges } from './templateEnricher'

const mockTemplates = [
  {
    id: 1,
    label: 'Diretoria',
    options: [
      { id: 101, label: 'Produto & Tecnologia' },
      { id: 102, label: 'Operações' },
      { id: 103, label: 'Negócio & Processos' },
    ],
  },
  {
    id: 2,
    label: 'Gerência',
    options: [
      { id: 201, label: 'Desenvolvimento' },
      { id: 202, label: 'QA' },
    ],
  },
  {
    id: 3,
    label: 'SemOptions',
    options: [],
  },
]

describe('templateEnricher.js', () => {
  describe('enrichNodes', () => {
    it('retorna array vazio quando input é vazio', () => {
      expect(enrichNodes([], mockTemplates)).toEqual([])
    })

    it('retorna nós inalterados quando não há templates', () => {
      const nodes = [{ id: '1', data: { label: 'Teste' } }]
      expect(enrichNodes(nodes, [])).toEqual(nodes)
    })

    it('enriquece nó com templateId e maxConnections quando tem templateId', () => {
      const nodes = [{ id: '1', data: { templateId: 1, label: 'Diretoria' } }]
      const result = enrichNodes(nodes, mockTemplates)
      expect(result[0].data.templateId).toBe(1)
      expect(result[0].data.maxConnections).toBe(3)
    })

    it('enriquece nó por fallback usando label quando não tem templateId', () => {
      const nodes = [{ id: '1', data: { label: 'Gerência' } }]
      const result = enrichNodes(nodes, mockTemplates)
      expect(result[0].data.templateId).toBe(2)
      expect(result[0].data.maxConnections).toBe(2)
    })

    it('não modifica nó quando template não é encontrado', () => {
      const nodes = [{ id: '1', data: { label: 'Inexistente' } }]
      const result = enrichNodes(nodes, mockTemplates)
      expect(result[0]).toEqual(nodes[0])
    })

    it('preserva outras propriedades do nó', () => {
      const nodes = [
        {
          id: '1',
          data: { templateId: 1 },
          position: { x: 100, y: 200 },
          type: 'custom',
        },
      ]
      const result = enrichNodes(nodes, mockTemplates)
      expect(result[0].position).toEqual({ x: 100, y: 200 })
      expect(result[0].type).toBe('custom')
    })

    it('preserva outras propriedades de data', () => {
      const nodes = [{ id: '1', data: { templateId: 1, customProp: 'value' } }]
      const result = enrichNodes(nodes, mockTemplates)
      expect(result[0].data.customProp).toBe('value')
    })

    it('processa múltiplos nós', () => {
      const nodes = [
        { id: '1', data: { templateId: 1 } },
        { id: '2', data: { templateId: 2 } },
        { id: '3', data: { label: 'Diretoria' } },
      ]
      const result = enrichNodes(nodes, mockTemplates)
      expect(result[0].data.maxConnections).toBe(3)
      expect(result[1].data.maxConnections).toBe(2)
      expect(result[2].data.maxConnections).toBe(3)
    })

    it('template com options vazias retorna maxConnections 0', () => {
      const nodes = [{ id: '1', data: { templateId: 3 } }]
      const result = enrichNodes(nodes, mockTemplates)
      expect(result[0].data.maxConnections).toBe(0)
    })

    it('templateId tem prioridade sobre label', () => {
      const nodes = [{ id: '1', data: { templateId: 1, label: 'Gerência' } }]
      const result = enrichNodes(nodes, mockTemplates)
      expect(result[0].data.templateId).toBe(1)
      expect(result[0].data.maxConnections).toBe(3)
    })
  })

  describe('enrichEdges', () => {
    it('retorna array vazio quando input é vazio', () => {
      expect(enrichEdges([], [], mockTemplates)).toEqual([])
    })

    it('retorna arestas inalteradas quando não há nós', () => {
      const edges = [{ id: 'e1', source: 'n1', target: 'n2' }]
      expect(enrichEdges(edges, [], mockTemplates)).toEqual(edges)
    })

    it('retorna aresta inalterada quando não tem optionId', () => {
      const nodes = [{ id: 'n1', data: { templateId: 1 } }]
      const edges = [{ id: 'e1', source: 'n1', target: 'n2' }]
      expect(enrichEdges(edges, nodes, mockTemplates)).toEqual(edges)
    })

    it('enriquece aresta com label da opção correspondente', () => {
      const nodes = [{ id: 'n1', data: { templateId: 1 } }]
      const edges = [{ id: 'e1', source: 'n1', target: 'n2', data: { optionId: 101 } }]
      const result = enrichEdges(edges, nodes, mockTemplates)
      expect(result[0].label).toBe('Produto & Tecnologia')
    })

    it('enriquece aresta usando fallback do nó source', () => {
      const nodes = [{ id: 'n1', data: { templateId: 2 } }]
      const edges = [{ id: 'e1', source: 'n1', target: 'n2', data: { optionId: 201 } }]
      const result = enrichEdges(edges, nodes, mockTemplates)
      expect(result[0].label).toBe('Desenvolvimento')
    })

    it('não modifica aresta quando template não é encontrado', () => {
      const nodes = [{ id: 'n1', data: { label: 'Inexistente' } }]
      const edges = [{ id: 'e1', source: 'n1', target: 'n2', data: { optionId: 999 } }]
      const result = enrichEdges(edges, nodes, mockTemplates)
      expect(result[0].label).toBeUndefined()
    })

    it('não modifica aresta quando opção não é encontrada', () => {
      const nodes = [{ id: 'n1', data: { templateId: 1 } }]
      const edges = [{ id: 'e1', source: 'n1', target: 'n2', data: { optionId: 999 } }]
      const result = enrichEdges(edges, nodes, mockTemplates)
      expect(result[0].label).toBeUndefined()
    })

    it('preserva outras propriedades da aresta', () => {
      const nodes = [{ id: 'n1', data: { templateId: 1 } }]
      const edges = [
        {
          id: 'e1',
          source: 'n1',
          target: 'n2',
          data: { optionId: 101 },
          type: 'custom',
          animated: true,
        },
      ]
      const result = enrichEdges(edges, nodes, mockTemplates)
      expect(result[0].type).toBe('custom')
      expect(result[0].animated).toBe(true)
    })

    it('processa múltiplas arestas', () => {
      const nodes = [{ id: 'n1', data: { templateId: 1 } }]
      const edges = [
        { id: 'e1', source: 'n1', target: 'n2', data: { optionId: 101 } },
        { id: 'e2', source: 'n1', target: 'n3', data: { optionId: 102 } },
        { id: 'e3', source: 'n1', target: 'n4', data: { optionId: 103 } },
      ]
      const result = enrichEdges(edges, nodes, mockTemplates)
      expect(result[0].label).toBe('Produto & Tecnologia')
      expect(result[1].label).toBe('Operações')
      expect(result[2].label).toBe('Negócio & Processos')
    })

    it('funciona com nodeMap construído a partir de nós', () => {
      const nodes = [
        { id: 'source1', data: { templateId: 1 } },
        { id: 'source2', data: { templateId: 2 } },
      ]
      const edges = [
        { id: 'e1', source: 'source1', target: 't1', data: { optionId: 101 } },
        { id: 'e2', source: 'source2', target: 't2', data: { optionId: 201 } },
      ]
      const result = enrichEdges(edges, nodes, mockTemplates)
      expect(result[0].label).toBe('Produto & Tecnologia')
      expect(result[1].label).toBe('Desenvolvimento')
    })

    it('não modifica aresta quando sourceNode não existe no nodeMap', () => {
      const nodes = [{ id: 'n1', data: { templateId: 1 } }]
      const edges = [{ id: 'e1', source: 'inexistente', target: 'n2', data: { optionId: 101 } }]
      const result = enrichEdges(edges, nodes, mockTemplates)
      expect(result[0].label).toBeUndefined()
    })
  })
})
