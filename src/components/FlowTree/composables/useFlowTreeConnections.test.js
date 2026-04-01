import { describe, it, expect, vi, afterEach } from 'vitest'
import { createApp, nextTick, ref } from 'vue'
import { useFlowTreeConnections } from './useFlowTreeConnections'

function withSetup(fn) {
  let result
  const app = createApp({
    setup() {
      result = fn()
      return () => null
    },
  })
  app.mount(document.createElement('div'))
  return [result, app]
}

function node(id, level, extra = {}) {
  return {
    id,
    type: 'custom',
    position: { x: 0, y: 0 },
    data: { label: id, level, templateId: null, maxConnections: null, ...extra },
  }
}

function edge(source, target, optionId = null) {
  return { id: `e-${source}-${target}`, source, target, animated: true, data: { optionId } }
}

const TEMPLATES = [
  { id: 1, label: 'Raiz', options: [{ id: 101, label: 'Opção A' }, { id: 102, label: 'Opção B' }] },
  { id: 2, label: 'Filho', options: [{ id: 201, label: 'Opção C' }] },
]

let currentApp
describe('useFlowTreeConnections', () => {
  afterEach(() => {
    currentApp?.unmount()
    vi.clearAllTimers()
  })

  function setup(fn) {
    const [ctx, app] = withSetup(fn)
    currentApp = app
    return ctx
  }

  describe('pendingConnection', () => {
    it('inicia como null', () => {
      const { pendingConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      expect(pendingConnection.value).toBeNull()
    })
  })

  describe('pendingOptions', () => {
    it('retorna array vazio quando não há pendingConnection', () => {
      const { pendingOptions } = setup(() => useFlowTreeConnections({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      expect(pendingOptions.value).toEqual([])
    })

    it('retorna array vazio quando nó source não existe', () => {
      const { pendingOptions, pendingConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      pendingConnection.value = { source: 'INEXISTENTE', target: 'B' }
      expect(pendingOptions.value).toEqual([])
    })

    it('retorna array vazio quando source não tem template', () => {
      const { nodes, pendingOptions, pendingConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      nodes.value = [node('A', 1, { templateId: null })]
      pendingConnection.value = { source: 'A', target: 'B' }
      expect(pendingOptions.value).toEqual([])
    })

    it('retorna array vazio quando template não tem opções', () => {
      const { nodes, pendingOptions, pendingConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [{ id: 99, label: 'SemOpcoes', options: [] }],
      }))
      nodes.value = [node('A', 1, { templateId: 99 })]
      pendingConnection.value = { source: 'A', target: 'B' }
      expect(pendingOptions.value).toEqual([])
    })

    it('retorna todas as opções quando nenhuma foi usada', () => {
      const { nodes, pendingOptions, pendingConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      nodes.value = [node('A', 1, { templateId: 1 })]
      pendingConnection.value = { source: 'A', target: 'B' }
      expect(pendingOptions.value).toHaveLength(2)
      expect(pendingOptions.value.map(o => o.id)).toContain(101)
      expect(pendingOptions.value.map(o => o.id)).toContain(102)
    })

    it('exclui opções já usadas em edges existentes', () => {
      const { nodes, edges, pendingOptions, pendingConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      nodes.value = [node('A', 1, { templateId: 1 }), node('B', 2), node('C', 2)]
      edges.value = [edge('A', 'B', 101)]
      pendingConnection.value = { source: 'A', target: 'C' }
      expect(pendingOptions.value.find(o => o.id === 101)).toBeUndefined()
      expect(pendingOptions.value.find(o => o.id === 102)).toBeDefined()
    })
  })

  describe('addEdgeFromConnection', () => {
    it('adiciona edge com optionId null quando não há opção', () => {
      const { nodes, edges, addEdgeFromConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1)]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      addEdgeFromConnection({ source: 'A', target: 'B' }, null)
      expect(edges.value).toHaveLength(1)
      expect(edges.value[0].source).toBe('A')
      expect(edges.value[0].target).toBe('B')
      expect(edges.value[0].data.optionId).toBeNull()
    })

    it('adiciona edge com optionId e label da opção', () => {
      const { nodes, edges, addEdgeFromConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1, { templateId: 1 })]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      addEdgeFromConnection({ source: 'A', target: 'B' }, 101)
      expect(edges.value).toHaveLength(1)
      expect(edges.value[0].data.optionId).toBe(101)
      expect(edges.value[0].label).toBe('Opção A')
    })

    it('não usa label quando opção não é encontrada', () => {
      const { nodes, edges, addEdgeFromConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1, { templateId: 1 })]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      addEdgeFromConnection({ source: 'A', target: 'B' }, 999)
      expect(edges.value[0].label).toBeUndefined()
    })

    it('recalcula níveis após adicionar edge', () => {
      const { nodes, edges, addEdgeFromConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1), node('B', 2)]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      addEdgeFromConnection({ source: 'A', target: 'B' }, null)
      expect(nodes.value[1].data.level).toBe(2)
    })
  })

  describe('removeEdge', () => {
    it('remove a edge pelo id', () => {
      const { nodes, edges, removeEdge } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1), node('B', 2)]),
        edges: ref([edge('A', 'B')]),
        maxLevels: 3,
        templates: [],
      }))
      removeEdge('e-A-B')
      expect(edges.value).toHaveLength(0)
    })

    it('remove apenas a edge especificada', () => {
      const { nodes, edges, removeEdge } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1), node('B', 2), node('C', 2)]),
        edges: ref([edge('A', 'B'), edge('B', 'C')]),
        maxLevels: 3,
        templates: [],
      }))
      removeEdge('e-A-B')
      expect(edges.value.find(e => e.id === 'e-A-B')).toBeUndefined()
      expect(edges.value.find(e => e.id === 'e-B-C')).toBeDefined()
    })

    it('recalcula níveis após remover edge', () => {
      const { nodes, edges, removeEdge } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1), node('B', 2)]),
        edges: ref([edge('A', 'B')]),
        maxLevels: 3,
        templates: [],
      }))
      removeEdge('e-A-B')
      expect(nodes.value[1].data.level).toBe(3)
    })
  })

  describe('onConnect', () => {
    it('ignora conexão duplicada', () => {
      const { nodes, edges, onConnect } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1), node('B', 2)]),
        edges: ref([edge('A', 'B')]),
        maxLevels: 3,
        templates: [],
      }))
      onConnect({ source: 'A', target: 'B' })
      expect(edges.value).toHaveLength(1)
    })

    it('adiciona edge diretamente quando source não tem template com opções', () => {
      const { nodes, edges, onConnect } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1), node('B', 2)]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      onConnect({ source: 'A', target: 'B' })
      expect(edges.value).toHaveLength(1)
      expect(edges.value[0].source).toBe('A')
    })

    it('ajusta nível do destino quando menor ou igual ao da origem', () => {
      const { nodes, onConnect } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1), node('B', 1)]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      onConnect({ source: 'A', target: 'B' })
      expect(nodes.value.find(n => n.id === 'B').data.level).toBe(2)
    })

    it('bloqueia conexão que ultrapassaria maxLevels', () => {
      const { nodes, edges, onConnect } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 3), node('B', 3)]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      onConnect({ source: 'A', target: 'B' })
      expect(edges.value).toHaveLength(0)
    })

    it('define pendingConnection quando template tem opções disponíveis', () => {
      const { nodes, edges, pendingConnection, onConnect } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1, { templateId: 1 }), node('B', 2)]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      onConnect({ source: 'A', target: 'B' })
      expect(pendingConnection.value).toEqual({ source: 'A', target: 'B' })
      expect(edges.value).toHaveLength(0)
    })

    it('não define pendingConnection quando todas as opções estão usadas', () => {
      const { nodes, edges, pendingConnection, onConnect } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1, { templateId: 1 }), node('B', 2), node('C', 2)]),
        edges: ref([edge('A', 'B', 101), edge('A', 'C', 102)]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      onConnect({ source: 'A', target: 'C' })
      expect(pendingConnection.value).toBeNull()
      expect(edges.value).toHaveLength(2)
    })

    it('adiciona edge diretamente quando source tem template mas sem opções', () => {
      const { nodes, edges, pendingConnection, onConnect } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1, { templateId: 99 }), node('B', 2)]),
        edges: ref([]),
        maxLevels: 3,
        templates: [{ id: 99, label: 'SemOpcoes', options: [] }],
      }))
      onConnect({ source: 'A', target: 'B' })
      expect(pendingConnection.value).toBeNull()
      expect(edges.value).toHaveLength(1)
    })
  })

  describe('confirmConnection', () => {
    it('adiciona edge e limpa pendingConnection', () => {
      const { nodes, edges, pendingConnection, confirmConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([node('A', 1, { templateId: 1 }), node('B', 2)]),
        edges: ref([]),
        maxLevels: 3,
        templates: TEMPLATES,
      }))
      pendingConnection.value = { source: 'A', target: 'B' }
      confirmConnection(101)
      expect(edges.value).toHaveLength(1)
      expect(edges.value[0].data.optionId).toBe(101)
      expect(pendingConnection.value).toBeNull()
    })

    it('não faz nada quando não há pendingConnection', () => {
      const { edges, confirmConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      confirmConnection(1)
      expect(edges.value).toHaveLength(0)
    })
  })

  describe('cancelConnection', () => {
    it('limpa pendingConnection', () => {
      const { pendingConnection, cancelConnection } = setup(() => useFlowTreeConnections({
        nodes: ref([]),
        edges: ref([]),
        maxLevels: 3,
        templates: [],
      }))
      pendingConnection.value = { source: 'A', target: 'B' }
      cancelConnection()
      expect(pendingConnection.value).toBeNull()
    })
  })
})
